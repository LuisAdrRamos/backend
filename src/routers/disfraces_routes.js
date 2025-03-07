import { Router } from 'express';
import upload from "../config/multer.js"; // Configuración de multer para subir imágenes
const router = Router();

import {
    registrarDisfraz,
    listarDisfraces,
    detalleDisfraces,
    actualizarDisfraz,
    eliminarDisfraces,

} from "../controllers/disfraces_controller.js";

import { verificarAutenticacion } from "../middlewares/autenticacion.js";

// Ruta para registrar un periférico
router.post("/registro", verificarAutenticacion, upload.single("imagen"), registrarDisfraz);

// Ruta para listar todos periféricos
router.get("/listar", listarDisfraces);

// Ruta para ver el detalle de un periférico
router.get("/detalle/:id", detalleDisfraces);

// Ruta para actualizar un periférico (ahora con multer)
router.put("/actualizar/:id", verificarAutenticacion, upload.single("imagen"), actualizarDisfraz);

// Ruta para eliminar un periférico
router.delete("/eliminar/:id", verificarAutenticacion, eliminarDisfraces);

export default router;