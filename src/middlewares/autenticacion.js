import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';
import Admin from '../models/Admin.js';

// Solo verifica que haya alguien autenticado (sin importar el rol)
const verificarAutenticacion = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ msg: "❌ Debes proporcionar un token" });
    }

    const { authorization } = req.headers;

    try {
        const decodedToken = jwt.verify(authorization.split(' ')[1], process.env.JWT_SECRET);
        const { id, rol } = decodedToken;

        if (rol === "usuario") {
            req.usuarioBDD = await Usuario.findByPk(id, {
                attributes: { exclude: ['password'] }
            });
            if (!req.usuarioBDD) return res.status(404).json({ msg: "❌ Usuario no encontrado" });

        } else if (rol === "admin" || rol === "moderador") {
            req.adminBDD = await Admin.findByPk(id, {
                attributes: { exclude: ['password'] }
            });
            if (!req.adminBDD) return res.status(404).json({ msg: "❌ Administrador no encontrado" });

        } else {
            return res.status(403).json({ msg: "❌ Rol no autorizado" });
        }

        req.rol = rol;
        next();
    } catch (error) {
        return res.status(401).json({ msg: "❌ Token inválido o expirado" });
    }
};

// Permitir acceso a uno o más roles (ej: ["admin", "moderador"])
const permitirRoles = (rolesPermitidos = []) => {
    return (req, res, next) => {
        if (!req.rol || !rolesPermitidos.includes(req.rol)) {
            return res.status(403).json({ msg: "❌ Acceso denegado. No tienes permisos suficientes" });
        }
        next();
    };
};


export {
    verificarAutenticacion,
    permitirRoles
};