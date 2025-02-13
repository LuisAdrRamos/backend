// Importar Router de Express
import { Router } from 'express';

// Importar los métodos del controlador
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
    eliminarModerador
} from "../controllers/admin_controller.js";

import {verificarAutenticacion, verificarAdminGeneral} from '../middlewares/autenticacion.js';

const router = Router();

// 🔹 Rutas públicas (accesibles sin autenticación)
router.post("/login", login);  
router.post("/recuperar-password", recuperarPassword);  
router.get("/recuperar-password/:token", comprobarTokenPasword);  
router.post("/nuevo-password/:token", nuevoPassword);

// 🔹 Rutas protegidas (requieren autenticación de cualquier admin o moderador)
router.get("/perfil", verificarAutenticacion, perfil);  
router.put("/actualizar/:id", verificarAutenticacion, actualizarPerfil);
router.put("/actualizar-password", verificarAutenticacion, actualizarPassword);

// Solo el admin general puede gestionar moderadores
router.post("/crear-moderador", verificarAutenticacion, verificarAdminGeneral, crearModerador);
router.delete("/eliminar-moderador/:id", verificarAutenticacion, verificarAdminGeneral, eliminarModerador);
router.get("/listar-moderadores", verificarAutenticacion, verificarAdminGeneral, listarAdmins);

// Exportar las rutas
export default router;