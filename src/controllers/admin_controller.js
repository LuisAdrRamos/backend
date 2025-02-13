// Importar el modelo 
import { sendMailToUsuario, sendMailToRecoveryPassword } from "../config/nodemailer.js";
import generarJWT from "../helpers/crearJWT.js";
import Admin from "../models/Admin.js";
import mongoose from "mongoose";

// 🔹 Método para el login del administrador o moderador
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) 
        return res.status(400).json({ msg: "❌ Debes proporcionar un email y una contraseña" });

    const adminBDD = await Admin.findOne({ email }).select("-status -__v -token -updatedAt -createdAt");

    if (!adminBDD) 
        return res.status(404).json({ msg: "❌ Usuario no registrado" });

    const verificarPassword = await adminBDD.matchPassword(password);
    if (!verificarPassword) 
        return res.status(400).json({ msg: "❌ Contraseña incorrecta" });

    const token = generarJWT(adminBDD._id, adminBDD.rol);

    const { nombre, apellido, direccion, telefono, _id, rol } = adminBDD;

    res.status(200).json({
        token,
        nombre,
        apellido,
        direccion,
        telefono,
        _id,
        email: adminBDD.email,
        rol
    });
};

// 🔹 Método para listar moderadores registrados
const listarAdmins = async (req, res) => {
    try {
        const moderadores = await Admin.find({ rol: "moderador" })
            .select("-password -token -__v -createdAt -updatedAt");
        res.status(200).json(moderadores);
    } catch (error) {
        res.status(500).json({ msg: "❌ Error al obtener la lista de moderadores", error });
    }
};

// 🔹 Método para mostrar el perfil del administrador
const perfil = (req, res) => {
    if (!req.adminBDD) {
        return res.status(404).json({ msg: "❌ Admin no encontrado" });
    }
    res.status(200).json(req.adminBDD);
};

// 🔹 Método para actualizar el perfil
const actualizarPerfil = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) 
        return res.status(400).json({ msg: "❌ ID inválido" });

    const adminBDD = await Admin.findById(id);
    if (!adminBDD) 
        return res.status(404).json({ msg: "❌ Administrador no encontrado" });

    adminBDD.nombre = req.body.nombre || adminBDD.nombre;
    adminBDD.apellido = req.body.apellido || adminBDD.apellido;
    adminBDD.direccion = req.body.direccion || adminBDD.direccion;
    adminBDD.telefono = req.body.telefono || adminBDD.telefono;
    adminBDD.email = req.body.email || adminBDD.email;

    await adminBDD.save();
    res.status(200).json({ msg: "✅ Perfil actualizado correctamente" });
};

// 🔹 Método para actualizar la contraseña
const actualizarPassword = async (req, res) => { 
    try {
        if (!req.adminBDD) {
            return res.status(401).json({ msg: "❌ Acceso no autorizado" });
        }

        const adminBDD = await Admin.findById(req.adminBDD._id);
        if (!adminBDD) {
            return res.status(404).json({ msg: "❌ Administrador no encontrado" });
        }

        const verificarPassword = await adminBDD.matchPassword(req.body.passwordactual);
        if (!verificarPassword) {
            return res.status(400).json({ msg: "❌ Contraseña actual incorrecta" });
        }

        adminBDD.password = await adminBDD.encrypPassword(req.body.passwordnuevo);
        await adminBDD.save();

        res.status(200).json({ msg: "✅ Contraseña actualizada correctamente" });
    } catch (error) {
        res.status(500).json({ msg: "❌ Error en el servidor", error });
    }
};

// 🔹 Método para recuperar el password
const recuperarPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: "❌ Debes proporcionar un correo electrónico" });

    const adminBDD = await Admin.findOne({ email });
    if (!adminBDD) return res.status(404).json({ msg: "❌ Administrador no encontrado" });

    const token = adminBDD.crearToken();
    adminBDD.token = token;
    await sendMailToRecoveryPassword(email, token);
    await adminBDD.save();

    res.status(200).json({ msg: "✅ Revisa tu correo para restablecer la contraseña" });
};

// 🔹 Método para comprobar el token de recuperación de contraseña
const comprobarTokenPasword = async (req, res) => {
    const { token } = req.params;
    if (!token) return res.status(400).json({ msg: "❌ Token inválido" });

    const adminBDD = await Admin.findOne({ token });
    if (!adminBDD) return res.status(404).json({ msg: "❌ Token no válido o expirado" });

    res.status(200).json({ msg: "✅ Token confirmado, puedes cambiar la contraseña" });
};

// 🔹 Método para cambiar la contraseña usando el token
const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password, confirmpassword } = req.body;

    if (!password || !confirmpassword) 
        return res.status(400).json({ msg: "❌ Debes llenar todos los campos" });

    if (password !== confirmpassword) 
        return res.status(400).json({ msg: "❌ Las contraseñas no coinciden" });

    const adminBDD = await Admin.findOne({ token });
    console.log("🔍 Usuario encontrado:", adminBDD);
    if (!adminBDD) return res.status(404).json({ msg: "❌ Token inválido" });

    adminBDD.token = null;
    adminBDD.password = await adminBDD.encrypPassword(password);
    console.log("🔑 Nueva contraseña encriptada:", adminBDD.password);
    await adminBDD.save();

    res.status(200).json({ msg: "✅ Contraseña actualizada con éxito, ya puedes iniciar sesión" });
};

// 🔹 Método para crear un moderador (solo para admin general)
const crearModerador = async (req, res) => {
    if (!req.adminBDD || req.adminBDD.rol !== "admin") {
        return res.status(403).json({ msg: "❌ Acceso denegado. Solo el administrador general puede crear moderadores" });
    }

    const { nombre, apellido, direccion, telefono, email, password, rol } = req.body;
    if (!nombre || !apellido || !direccion || !telefono || !email || !password || !rol) {
        return res.status(400).json({ msg: "❌ Todos los campos son obligatorios" });
    }

    const emailExistente = await Admin.findOne({ email });
    if (emailExistente) {
        return res.status(400).json({ msg: "✅ El email ya existe en la base de datos" });
    }

    try {
        const nuevoModerador = new Admin({
            nombre,
            apellido,
            direccion,
            telefono,
            email,
            password: await new Admin().encrypPassword(password),
            rol
        });

        await nuevoModerador.save();
        res.status(200).json({ msg: "✅ Moderador creado con éxito", moderador: nuevoModerador });
    } catch (error) {
        res.status(500).json({ msg: "❌ Error al crear moderador", error });
    }
};

// 🔹 Método para eliminar un moderador (solo para admin general)
const eliminarModerador = async (req, res) => {
    if (!req.adminBDD || req.adminBDD.rol !== "admin") {
        return res.status(403).json({ msg: "❌ Acceso denegado. Solo el administrador general puede eliminar moderadores." });
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "❌ ID inválido." });
    }

    const moderador = await Admin.findById(id);
    if (!moderador || moderador.rol !== "moderador") {
        return res.status(404).json({ msg: "❌ Moderador no encontrado" });
    }

    await Admin.findByIdAndDelete(id);
    res.status(200).json({ msg: "✅ Moderador eliminado con éxito." });
};

// Exportar funciones
export {
    login,
    listarAdmins,

    perfil,
    actualizarPerfil,
    actualizarPassword,

    recuperarPassword,
    comprobarTokenPasword,
    nuevoPassword,
    
    crearModerador,
    eliminarModerador
};
