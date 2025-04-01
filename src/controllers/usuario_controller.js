import Usuario from "../models/Usuario.js";
import generarJWT from "../helpers/crearJWT.js";
import { sendMailToRecoveryPassword } from "../config/nodemailer.js";
import Disfraz from "../models/Disfraces.js";

// Registro de usuario (sin confirmación por correo)
const registrarUsuario = async (req, res) => {
    const { email, password } = req.body;
    if (Object.values(req.body).includes("")) {
        return res.status(400).json({ msg: "❌ Debes llenar todos los campos" });
    }

    try {
        const existeUsuario = await Usuario.findOne({ where: { email } });
        if (existeUsuario) {
            return res.status(400).json({ msg: "❌ El email ya se encuentra registrado" });
        }

        const nuevoUsuario = await Usuario.create(req.body);
        res.status(201).json({ msg: "✅ Usuario registrado correctamente", usuario: nuevoUsuario });
    } catch (error) {
        console.error("❌ Error al registrar el usuario:", error);
        res.status(500).json({ msg: "❌ Error en el servidor", error });
    }
};

// Login
const loginUsuario = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ msg: "❌ Debes llenar todos los campos" });

    try {
        const usuarioBDD = await Usuario.findOne({ where: { email } });
        if (!usuarioBDD)
            return res.status(404).json({ msg: "❌ Usuario no registrado" });

        const esValido = await usuarioBDD.matchPassword(password);
        if (!esValido)
            return res.status(401).json({ msg: "❌ Contraseña incorrecta" });

        const token = generarJWT(usuarioBDD.id, "usuario");

        const { nombre, apellido, celular, id: _id } = usuarioBDD;
        res.status(200).json({ token, nombre, apellido, email, celular, rol: "usuario", _id });

    } catch (error) {
        console.error("❌ Error en login:", error);
        res.status(500).json({ msg: "❌ Error en el servidor", error });
    }
};

// Perfil del usuario autenticado
const perfilUsuario = async (req, res) => {
    try {
        const { usuarioBDD } = req;
        if (!usuarioBDD) {
            return res.status(401).json({ msg: "❌ Usuario no autenticado" });
        }

        res.status(200).json({ ...usuarioBDD.dataValues, rol: "usuario" });
    } catch (error) {
        res.status(500).json({ msg: "❌ Error al obtener el perfil" });
    }
};

// Actualizar usuario
const actualizarUsuario = async (req, res) => {
    const { id } = req.usuarioBDD;
    const campos = req.body;

    if (Object.values(campos).includes("")) {
        return res.status(400).json({ msg: "❌ Todos los campos son obligatorios" });
    }

    try {
        const usuario = await Usuario.findByPk(id);
        if (!usuario) return res.status(404).json({ msg: "❌ Usuario no encontrado" });

        await usuario.update(campos);

        res.status(200).json({ msg: "✅ Usuario actualizado", usuario });
    } catch (error) {
        res.status(500).json({ msg: "❌ Error al actualizar el usuario", error });
    }
};

// Cambiar contraseña
const actualizarPassword = async (req, res) => {
    try {
        const { usuarioBDD } = req;
        const { passwordactual, passwordnuevo } = req.body;

        const usuario = await Usuario.findByPk(usuarioBDD.id);
        if (!usuario) return res.status(404).json({ msg: "❌ Usuario no encontrado" });

        const coincide = await usuario.matchPassword(passwordactual);
        if (!coincide)
            return res.status(400).json({ msg: "❌ La contraseña actual no es válida" });

        usuario.password = passwordnuevo;
        await usuario.save();

        res.status(200).json({ msg: "✅ Contraseña actualizada correctamente" });
    } catch (error) {
        res.status(500).json({ msg: "❌ Error al actualizar contraseña", error });
    }
};

// Recuperar contraseña
const recuperarPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: "❌ Debes proporcionar un correo electrónico" });

    try {
        const usuarioBDD = await Usuario.findOne({ where: { email } });
        if (!usuarioBDD) return res.status(404).json({ msg: "❌ Usuario no encontrado" });

        const token = generarJWT(usuarioBDD.id, "usuario");
        usuarioBDD.token = token;
        await usuarioBDD.save();

        await sendMailToRecoveryPassword(email, token);

        res.status(200).json({ msg: "✅ Revisa tu correo para restablecer la contraseña" });
    } catch (error) {
        res.status(500).json({ msg: "❌ Error al enviar correo de recuperación", error });
    }
};

// Comprobar token de recuperación de contraseña
const comprobarTokenPassword = async (req, res) => {
    const { token } = req.params;
    if (!token) return res.status(400).json({ msg: "❌ Token inválido" });

    try {
        const usuarioBDD = await Usuario.findOne({ where: { token } });
        if (!usuarioBDD) return res.status(404).json({ msg: "❌ Token no válido o expirado" });

        res.status(200).json({ msg: "✅ Token confirmado, puedes cambiar la contraseña" });
    } catch (error) {
        res.status(500).json({ msg: "❌ Error al validar el token", error });
    }
};


// Cambiar contraseña con token
const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password, confirmpassword } = req.body;

    if (!password || !confirmpassword) {
        return res.status(400).json({ msg: "❌ Debes llenar todos los campos" });
    }

    if (password !== confirmpassword) {
        return res.status(400).json({ msg: "❌ Las contraseñas no coinciden" });
    }

    try {
        const usuarioBDD = await Usuario.findOne({ where: { token } });
        if (!usuarioBDD) return res.status(404).json({ msg: "❌ Token inválido" });

        usuarioBDD.token = null;
        usuarioBDD.password = password;
        await usuarioBDD.save();

        res.status(200).json({ msg: "✅ Contraseña actualizada con éxito, ya puedes iniciar sesión" });
    } catch (error) {
        res.status(500).json({ msg: "❌ Error al actualizar contraseña", error });
    }
};


// Agregar a favoritos
const agregarFavorito = async (req, res) => {
    const { idDisfraz } = req.params;
    const usuario = req.usuarioBDD;

    try {
        const disfraz = await Disfraz.findByPk(idDisfraz);
        if (!disfraz) {
            return res.status(404).json({ msg: "❌ Disfraz no encontrado" });
        }

        // Agrega el disfraz a los favoritos del usuario
        await usuario.addFavorito(disfraz);

        // Incrementar contador
        disfraz.favoritos += 1;
        await disfraz.save();

        res.status(200).json({ msg: "✅ Disfraz añadido a favoritos" });
    } catch (error) {
        console.error("❌ Error al agregar favorito:", error);
        res.status(500).json({ msg: "❌ Error al agregar favorito", error });
    }
};

// Eliminar de favoritos
const eliminarFavorito = async (req, res) => {
    const { idDisfraz } = req.params;
    const usuario = req.usuarioBDD;

    try {
        const disfraz = await Disfraz.findByPk(idDisfraz);
        if (!disfraz) {
            return res.status(404).json({ msg: "❌ Disfraz no encontrado" });
        }

        await usuario.removeFavorito(disfraz);

        // Reducir contador sin que quede negativo
        disfraz.favoritos = Math.max(0, disfraz.favoritos - 1);
        await disfraz.save();

        res.status(200).json({ msg: "✅ Disfraz eliminado de favoritos" });
    } catch (error) {
        console.error("❌ Error al eliminar favorito:", error);
        res.status(500).json({ msg: "❌ Error al eliminar favorito", error });
    }
};

// Listar favoritos
const listarFavoritos = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.usuarioBDD.id, {
            include: {
                model: Disfraz,
                as: "favoritos",
                through: { attributes: [] } // no mostrar la tabla intermedia
            }
        });

        res.status(200).json({ favoritos: usuario.favoritos });
    } catch (error) {
        console.error("❌ Error al listar favoritos:", error);
        res.status(500).json({ msg: "❌ Error al obtener favoritos", error });
    }
};

// Exportar métodos
export {
    registrarUsuario,
    loginUsuario,
    perfilUsuario,
    actualizarUsuario,
    actualizarPassword,

    recuperarPassword,
    comprobarTokenPassword,
    nuevoPassword,
    
    agregarFavorito,
    eliminarFavorito,
    listarFavoritos
};
