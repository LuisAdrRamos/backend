// Importar Router de Express
import { Router } from 'express';
import {
    login,
    listarAdmins,
    perfil,
    actualizarPerfil,
    actualizarPassword,

    recuperarPassword,
    comprobarTokenPasword,
    nuevoPassword,

    crearModerador,
    detalleModerador,
    actualizarModerador,
    eliminarModerador
} from "../controllers/admin_controller.js";

import { verificarAutenticacion, permitirRoles } from '../middlewares/autenticacion.js';

const router = Router();

// 🔹 Rutas públicas
router.post("/login", login);  
router.post("/recuperar-password", recuperarPassword);  
router.get("/recuperar-password/:token", comprobarTokenPasword);  
router.post("/nuevo-password/:token", nuevoPassword);

// 🔹 Accesibles para admin o moderador
router.get("/perfil", verificarAutenticacion, permitirRoles(["admin", "moderador"]), perfil);  
router.put("/actualizar/:id", verificarAutenticacion, permitirRoles(["admin", "moderador"]), actualizarPerfil);
router.put("/actualizar-password", verificarAutenticacion, permitirRoles(["admin", "moderador"]), actualizarPassword);

// 🔹 Exclusivo del admin general
router.post("/crear-moderador", verificarAutenticacion, permitirRoles(["admin"]), crearModerador);
router.get("/detalle-moderador/:id", verificarAutenticacion, permitirRoles(["admin"]), detalleModerador);
router.put("/actualizar-moderador/:id", verificarAutenticacion, permitirRoles(["admin"]), actualizarModerador);
router.delete("/eliminar-moderador/:id", verificarAutenticacion, permitirRoles(["admin"]), eliminarModerador);
router.get("/listar-moderadores", verificarAutenticacion, permitirRoles(["admin"]), listarAdmins);

export default router;
