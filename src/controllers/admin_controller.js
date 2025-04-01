import Admin from "../models/Admin.js";
import generarJWT from "../helpers/crearJWT.js";
import { sendMailToRecoveryPassword } from "../config/nodemailer.js";

// 🔹 Login
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ msg: "❌ Debes proporcionar un email y una contraseña" });

    const adminBDD = await Admin.findOne({ where: { email } });
    if (!adminBDD)
        return res.status(404).json({ msg: "❌ Usuario no registrado" });

    const verificarPassword = await adminBDD.matchPassword(password);
    if (!verificarPassword)
        return res.status(400).json({ msg: "❌ Contraseña incorrecta" });

    const token = generarJWT(adminBDD.id, adminBDD.rol);

    const { nombre, apellido, direccion, telefono, id, rol } = adminBDD;
    res.status(200).json({
        token,
        nombre,
        apellido,
        direccion,
        telefono,
        _id: id,
        email,
        rol
    });
};

// 🔹 Listar moderadores
const listarAdmins = async (req, res) => {
    try {
        const moderadores = await Admin.findAll({
            where: { rol: "moderador" },
            attributes: { exclude: ["password", "token", "createdAt", "updatedAt"] }
        });
        res.status(200).json(moderadores);
    } catch (error) {
        res.status(500).json({ msg: "❌ Error al obtener la lista de moderadores", error });
    }
};

// 🔹 Ver perfil
const perfil = (req, res) => {
    if (!req.adminBDD) {
        return res.status(404).json({ msg: "❌ Admin no encontrado" });
    }
    res.status(200).json(req.adminBDD);
};

// 🔹 Actualizar perfil
const actualizarPerfil = async (req, res) => {
    const { id } = req.params;

    try {
        const adminBDD = await Admin.findByPk(id);
        if (!adminBDD)
            return res.status(404).json({ msg: "❌ Administrador no encontrado" });

        await adminBDD.update({
            nombre: req.body.nombre || adminBDD.nombre,
            apellido: req.body.apellido || adminBDD.apellido,
            direccion: req.body.direccion || adminBDD.direccion,
            telefono: req.body.telefono || adminBDD.telefono,
            email: req.body.email || adminBDD.email
        });

        res.status(200).json({ msg: "✅ Perfil actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ msg: "❌ Error al actualizar perfil", error });
    }
};

// 🔹 Cambiar contraseña
const actualizarPassword = async (req, res) => {
    try {
        if (!req.adminBDD)
            return res.status(401).json({ msg: "❌ Acceso no autorizado" });

        const adminBDD = await Admin.findByPk(req.adminBDD.id);
        if (!adminBDD)
            return res.status(404).json({ msg: "❌ Administrador no encontrado" });

        const verificarPassword = await adminBDD.matchPassword(req.body.passwordactual);
        if (!verificarPassword)
            return res.status(400).json({ msg: "❌ Contraseña actual incorrecta" });

        adminBDD.password = req.body.passwordnuevo;
        await adminBDD.save();

        res.status(200).json({ msg: "✅ Contraseña actualizada correctamente" });
    } catch (error) {
        res.status(500).json({ msg: "❌ Error en el servidor", error });
    }
};

// 🔹 Recuperar contraseña
const recuperarPassword = async (req, res) => {
    const { email } = req.body;
    if (!email)
        return res.status(400).json({ msg: "❌ Debes proporcionar un correo electrónico" });

    const adminBDD = await Admin.findOne({ where: { email } });
    if (!adminBDD)
        return res.status(404).json({ msg: "❌ Administrador no encontrado" });

    const token = Math.random().toString(36).slice(2);
    adminBDD.token = token;
    await adminBDD.save();

    await sendMailToRecoveryPassword(email, token);

    res.status(200).json({ msg: "✅ Revisa tu correo para restablecer la contraseña" });
};

// 🔹 Verificar token de recuperación
const comprobarTokenPasword = async (req, res) => {
    const { token } = req.params;
    if (!token)
        return res.status(400).json({ msg: "❌ Token inválido" });

    const adminBDD = await Admin.findOne({ where: { token } });
    if (!adminBDD)
        return res.status(404).json({ msg: "❌ Token no válido o expirado" });

    res.status(200).json({ msg: "✅ Token confirmado, puedes cambiar la contraseña" });
};

// 🔹 Cambiar contraseña con token
const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password, confirmpassword } = req.body;

    if (!password || !confirmpassword)
        return res.status(400).json({ msg: "❌ Debes llenar todos los campos" });

    if (password !== confirmpassword)
        return res.status(400).json({ msg: "❌ Las contraseñas no coinciden" });

    const adminBDD = await Admin.findOne({ where: { token } });
    if (!adminBDD)
        return res.status(404).json({ msg: "❌ Token inválido" });

    adminBDD.token = null;
    adminBDD.password = password;
    await adminBDD.save();

    res.status(200).json({ msg: "✅ Contraseña actualizada con éxito, ya puedes iniciar sesión" });
};

// 🔹 Crear moderador (solo admin general)
const crearModerador = async (req, res) => {
    if (!req.adminBDD || req.adminBDD.rol !== "admin") {
        return res.status(403).json({ msg: "❌ Solo el administrador general puede crear moderadores" });
    }

    const { nombre, apellido, direccion, telefono, email, password, rol } = req.body;

    if (!nombre || !apellido || !direccion || !telefono || !email || !password || !rol) {
        return res.status(400).json({ msg: "❌ Todos los campos son obligatorios" });
    }

    const existe = await Admin.findOne({ where: { email } });
    if (existe) {
        return res.status(400).json({ msg: "❌ El email ya está registrado" });
    }

    try {
        const nuevoModerador = await Admin.create({
            nombre,
            apellido,
            direccion,
            telefono,
            email,
            password,
            rol
        });

        res.status(200).json({ msg: "✅ Moderador creado con éxito", moderador: nuevoModerador });
    } catch (error) {
        res.status(500).json({ msg: "❌ Error al crear moderador", error });
    }
};

// 🔹 Eliminar moderador
const eliminarModerador = async (req, res) => {
    if (!req.adminBDD || req.adminBDD.rol !== "admin") {
        return res.status(403).json({ msg: "❌ Solo el administrador general puede eliminar moderadores." });
    }

    const { id } = req.params;

    const adminBDD = await Admin.findByPk(id);
    if (!adminBDD || adminBDD.rol !== "moderador") {
        return res.status(404).json({ msg: "❌ Moderador no encontrado" });
    }

    await adminBDD.destroy();
    res.status(200).json({ msg: "✅ Moderador eliminado con éxito." });
};

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