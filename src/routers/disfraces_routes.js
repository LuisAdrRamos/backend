import { Router } from 'express';
import {
    registrarDisfraz,
    listarDisfraces,
    detalleDisfraces,
    actualizarDisfraz,
    eliminarDisfraces
} from "../controllers/disfraces_controller.js";

import { verificarAutenticacion, permitirRoles } from "../middlewares/autenticacion.js";

const router = Router();
const puedeGestionarDisfraces = [verificarAutenticacion, permitirRoles(["admin", "moderador"])];

router.post("/registro", ...puedeGestionarDisfraces, registrarDisfraz);
router.get("/listar", listarDisfraces);
router.get("/detalle/:id", detalleDisfraces);
router.put("/actualizar/:id", ...puedeGestionarDisfraces, actualizarDisfraz);
router.delete("/eliminar/:id", ...puedeGestionarDisfraces, eliminarDisfraces);

export default router;
