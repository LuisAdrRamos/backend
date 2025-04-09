// routes/etiqueta_routes.js
import { Router } from "express";
import {
    crearEtiqueta,
    obtenerEtiquetas,
    actualizarEtiqueta,
    eliminarEtiqueta
} from "../controllers/etiquetas_controller.js";

import { verificarAutenticacion, permitirRoles } from "../middlewares/autenticacion.js";

const router = Router();

router.post("/crear", verificarAutenticacion, permitirRoles(["admin", "moderador"]), crearEtiqueta);
router.get("/listar", obtenerEtiquetas);
router.put("/actualizar/:id", verificarAutenticacion, permitirRoles(["admin", "moderador"]), actualizarEtiqueta);
router.delete("/eliminar/:id", verificarAutenticacion, permitirRoles(["admin", "moderador"]), eliminarEtiqueta);

export default router;
