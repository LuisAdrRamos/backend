import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';
import Admin from '../models/Admin.js';

const verificarAutenticacion = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ msg: "❌ Debes proporcionar un token" });
    }

    const { authorization } = req.headers;

    try {
        const decodedToken = jwt.verify(authorization.split(' ')[1], process.env.JWT_SECRET);
        const { id, rol } = decodedToken;

        if (rol === "usuario") {
            req.usuarioBDD = await Usuario.findById(id).select("-password"); // 🔹 Eliminado `.lean()`
            if (!req.usuarioBDD) {
                return res.status(404).json({ msg: "❌ Usuario no encontrado" });
            } else {
                console.log("✅ Usuario autenticado en DB:", req.usuarioBDD);
                console.log("🔍 Headers:", req.headers);
                console.log("🔍 Token recibido:", req.headers.authorization);
            }
        } else if (rol === "admin" || rol === "moderador") {
            req.adminBDD = await Admin.findById(id).select("-password"); // 🔹 Eliminado `.lean()`
            if (!req.adminBDD) {
                return res.status(404).json({ msg: "❌ Administrador no encontrado" });
            }
        } else {
            return res.status(403).json({ msg: "❌ Rol no autorizado" });
        }

        next();
    } catch (error) {
        return res.status(401).json({ msg: "❌ Token inválido" });
    }
};

// 🔹 Rutas exclusivas para el administrador general (solo `admin`)
const verificarAdminGeneral = (req, res, next) => {
    if (!req.adminBDD || req.adminBDD.rol !== "admin") {
        return res.status(403).json({ msg: "❌ Acceso denegado. Solo el administrador general tiene permiso." });
    }
    next();
};

export { verificarAutenticacion, verificarAdminGeneral };