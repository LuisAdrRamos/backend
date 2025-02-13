// IMPORTAR EL MODELO
import Usuario from "../models/Usuario.js"
import Disfraz from "../models/Disfraces.js";
// IMPORTAR EL MÉTODO sendMailToPaciente
import { sendMailToUsuario, sendMailToRecoveryPassword } from "../config/nodemailer.js";

import mongoose from "mongoose"
import generarJWT from "../helpers/crearJWT.js"


// Método para registrar un usuario
const registrarUsuario = async (req, res) => {
    const { email, password } = req.body;
    if (Object.values(req.body).includes("")) {
        return res.status(400).json({ msg: "❌ Lo sentimos, debes llenar todos los campos" });
    }

    const verificarEmailBDD = await Usuario.findOne({ email });     // Obtener el usuario en base al email
    if (verificarEmailBDD) {     // Verificar si el usuario ya se encuentra registrado
        return res.status(400).json({ msg: "❌ Lo sentimos, el email ya se encuentra registrado" });
    }


    const nuevoUsuario = new Usuario(req.body);     // Crear una instancia del Usuario
    nuevoUsuario.password = await nuevoUsuario.encrypPassword(password);     // Encriptar el password

    const token = generarJWT(nuevoUsuario._id, "usuario");  // Crear el token 

    // Enviar el correo electrónico
    await sendMailToUsuario(email, token);

    // Guardar en la base de datos
    await nuevoUsuario.save();

    // Presentar resultados
    res.status(200).json({ msg: "✅ Revisa tu correo electrónico para confirmar tu cuenta" });
};


// Método para confirmar el token del usuario
const confirmarUsuario = async (req, res) => {
    if (!req.params.token) {
        return res.status(400).json({ msg: "❌ No se puede validar la cuenta" });
    }

    const usuarioBDD = await Usuario.findOne({ token: req.params.token });

    if (!usuarioBDD) {
        return res.status(404).json({ msg: "El usuario ya ha sido confirmado o el token no es válido" });
    }

    usuarioBDD.token = null;
    usuarioBDD.confirmEmail = true;
    await usuarioBDD.save();

    res.status(200).json({ msg: "✅ Cuenta confirmada, ahora puedes iniciar sesión" });
};


// 🔹 Método para el login del usuario
const loginUsuario = async (req, res) => {
    const { email, password } = req.body;

    if (Object.values(req.body).includes(""))
        return res.status(404).json({ msg: "❌ Lo sentimos, debes llenar todos los campos" });

    const usuarioBDD = await Usuario.findOne({ email });
    if (!usuarioBDD)
        return res.status(404).json({ msg: "❌ Lo sentimos, el usuario no se encuentra registrado" });

    const verificarPassword = await usuarioBDD.matchPassword(password);
    if (!verificarPassword)
        return res.status(404).json({ msg: "❌ Lo sentimos, el password no es el correcto" });

    console.log("✅ Usuario autenticado:", usuarioBDD._id);

    const token = generarJWT(usuarioBDD._id, "usuario");

    const { nombre, apellido, email: emailP, celular, _id } = usuarioBDD;
    res.status(200).json({
        token,
        nombre,
        apellido,
        emailP,
        celular,
        rol: "usuario",
        _id
    });
};


// Función para limpiar datos del usuario
const limpiarDatos = (usuarioBDD) => {
    delete usuarioBDD.password;
    delete usuarioBDD.createdAt;
    delete usuarioBDD.updatedAt;
    delete usuarioBDD.__v;
    return usuarioBDD;
};


// Método para ver el perfil del usuario
const perfilUsuario = async (req, res) => {
    try {
        if (!req.usuarioBDD || !req.usuarioBDD._id) {
            return res.status(401).json({ msg: "❌ Usuario no autenticado" });
        }

        const usuarioLimpio = limpiarDatos(req.usuarioBDD);
        res.status(200).json({ ...usuarioLimpio, rol: "usuario" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "❌ Error interno del servidor" });
    }
};


// Método para actualizar un usuario
const actualizarUsuario = async (req, res) => {
    const { id } = req.params;

    // verificar que no haya campos vacíos
    if (Object.values(req.body).includes("")) {
        return res.status(400).json({ msg: "❌ lo sentimos, debes llenar todos los campos" });
    }

    // validar que el id sea válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ msg: `❌ lo sentimos, no existe el usuario ${id}` });
    }

    try {
        const usuario = await Usuario.findById(id);
        if (!usuario) {
            return res.status(404).json({ msg: "❌ usuario no encontrado" });
        }

        // actualizar los valores solo si fueron enviados en la solicitud
        usuario.nombre = req.body.nombre || usuario.nombre;
        usuario.apellido = req.body.apellido || usuario.apellido;
        usuario.email = req.body.email || usuario.email;
        usuario.telefono = req.body.telefono || usuario.telefono;
        usuario.direccion = req.body.direccion || usuario.direccion;

        await usuario.save();

        res.status(200).json({ msg: "✅ actualización exitosa del usuario", usuario });
    } catch (error) {
        console.error("❌ error al actualizar el usuario:", error);
        res.status(500).json({ msg: "❌ error al actualizar el usuario", error });
    }
};


// 🔹 Método para actualizar la contraseña del usuario autenticado
const actualizarPassword = async (req, res) => {
    try {
        if (!req.usuarioBDD) {
            return res.status(401).json({ msg: "❌ Acceso no autorizado, usuario no autenticado" });
        }

        const usuarioBDD = await Usuario.findById(req.usuarioBDD._id);
        if (!usuarioBDD) {
            return res.status(404).json({ msg: "❌ Lo sentimos, no existe el usuario" });
        }

        const verificarPassword = await usuarioBDD.matchPassword(req.body.passwordactual);
        if (!verificarPassword) {
            return res.status(400).json({ msg: "❌ El password actual es incorrecto" });
        }

        usuarioBDD.password = await usuarioBDD.encrypPassword(req.body.passwordnuevo);
        await usuarioBDD.save();

        res.status(200).json({ msg: "✅ Password actualizado correctamente" });
    } catch (error) {
        console.error("❌ Error al actualizar el password:", error);
        res.status(500).json({ msg: "❌ Error en el servidor" });
    }
};


// 🔹 Método para enviar un correo de recuperación de contraseña
const recuperarPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: "❌ Debes proporcionar un correo electrónico" });

    const usuarioBDD = await Usuario.findOne({ email });
    if (!usuarioBDD) return res.status(404).json({ msg: "❌ Usuario no encontrado" });

    const token = generarJWT(usuarioBDD._id, "usuario");
    usuarioBDD.token = token;

    await sendMailToRecoveryPassword(email, token);
    await usuarioBDD.save();

    res.status(200).json({ msg: "✅ Revisa tu correo para restablecer la contraseña" });
};


// 🔹 Método para comprobar si el token de recuperación es válido
const comprobarTokenPassword = async (req, res) => {
    const { token } = req.params;
    if (!token) return res.status(400).json({ msg: "❌ Token inválido" });

    const usuarioBDD = await Usuario.findOne({ token });
    if (!usuarioBDD) return res.status(404).json({ msg: "❌ Token no válido o expirado" });

    res.status(200).json({ msg: "✅ Token confirmado, puedes cambiar la contraseña" });
};


// 🔹 Método para cambiar la contraseña del usuario usando el token
const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password, confirmpassword } = req.body;

    if (!password || !confirmpassword)
        return res.status(400).json({ msg: "❌ Debes llenar todos los campos" });

    if (password !== confirmpassword)
        return res.status(400).json({ msg: "❌ Las contraseñas no coinciden" });

    const usuarioBDD = await Usuario.findOne({ token });
    console.log("🔍 Usuario encontrado:", usuarioBDD);
    if (!usuarioBDD) return res.status(404).json({ msg: "❌ Token inválido" });

    usuarioBDD.token = null;
    usuarioBDD.password = await usuarioBDD.encrypPassword(password);
    console.log("🔑 Nueva contraseña encriptada:", usuarioBDD.password);

    await usuarioBDD.save();
    const usuarioVerificado = await Usuario.findById(usuarioBDD._id);
    console.log("✅ Contraseña actualizada en la BD:", usuarioVerificado.password);

    res.status(200).json({ msg: "✅ Contraseña actualizada con éxito, ya puedes iniciar sesión" });
};


// Método para agregar un disfraz a los favoritos del usuario
const agregarFavorito = async (req, res) => {
    const { idDisfraz } = req.params;
    const { usuarioBDD } = req;

    try {
        if (!mongoose.Types.ObjectId.isValid(idDisfraz)) {
            return res.status(400).json({ msg: "❌ ID de disfraz inválido" });
        }

        const disfraz = await Disfraz.findById(idDisfraz);
        if (!disfraz) {
            return res.status(404).json({ msg: "❌ Disfraz no encontrado" });
        }

        if (!usuarioBDD.disfracesFavoritos.includes(idDisfraz)) {
            usuarioBDD.disfracesFavoritos.push(idDisfraz);
            await usuarioBDD.save();
        }

        usuarioBDD.disfracesFavoritos.addToSet(idDisfraz);
        await usuarioBDD.save();

        res.status(200).json({ msg: "✅ Disfraz agregado a favoritos", favoritos: usuarioBDD.disfracesFavoritos });
        console.log("📝 Favoritos actualizados:", usuarioBDD.disfracesFavoritos);

    } catch (error) {
        console.error("❌ Error al agregar favorito:", error);
        res.status(500).json({ msg: "❌ Error al agregar favorito", error: error.message });
    }
};


// Método para eliminar un disfraz de los favoritos del usuario
const eliminarFavorito = async (req, res) => {
    const { idDisfraz } = req.params;
    const { usuarioBDD } = req;

    try {
        if (!mongoose.Types.ObjectId.isValid(idDisfraz)) {
            return res.status(400).json({ msg: "❌ ID de disfraz inválido" });
        }

        if (usuarioBDD.disfracesFavoritos.includes(idDisfraz)) {
            usuarioBDD.disfracesFavoritos.pull(idDisfraz);
            await usuarioBDD.save();
        }

        res.status(200).json({ msg: "✅ Disfraz eliminado de favoritos", favoritos: usuarioBDD.disfracesFavoritos });
    } catch (error) {
        console.error("❌ Error al eliminar favorito:", error);
        res.status(500).json({ msg: "❌ Error al eliminar favorito" });
    }
};


// Método para listar los disfraces favoritos del usuario
const listarFavoritos = async (req, res) => {
    try {
        if (!req.usuarioBDD) {
            return res.status(401).json({ msg: "❌ Usuario no autenticado" });
        }

        const usuario = await Usuario.findById(req.usuarioBDD._id).populate("disfracesFavoritos").exec();
        res.status(200).json({ favoritos: usuario.disfracesFavoritos });

    } catch (error) {
        console.error("❌ Error al obtener favoritos:", error);
        res.status(500).json({ msg: "❌ Error al obtener favoritos" });
    }
};


export {
    registrarUsuario,
    confirmarUsuario,

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
}
