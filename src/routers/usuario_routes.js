import { Router } from 'express';
import {
    registrarUsuario,
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
} from "../controllers/usuario_controller.js";

import { verificarAutenticacion, permitirRoles } from "../middlewares/autenticacion.js";

const router = Router();

// 🔹 Rutas públicas
router.post("/registro", registrarUsuario);
router.post("/login", loginUsuario);

// 🔹 Recuperación de contraseña
router.post("/recuperar-password", recuperarPassword);
router.get("/recuperar-password/:token", comprobarTokenPassword);
router.post("/nuevo-password/:token", nuevoPassword);

// 🔹 Rutas protegidas (solo usuarios)
router.get("/perfil", verificarAutenticacion, permitirRoles(["usuario"]), perfilUsuario);
router.put("/actualizar", verificarAutenticacion, permitirRoles(["usuario"]), actualizarUsuario);
router.put("/actualizar-password", verificarAutenticacion, permitirRoles(["usuario"]), actualizarPassword);

// 🔹 Favoritos
router.post("/agregar-favorito/:idDisfraz", verificarAutenticacion, permitirRoles(["usuario"]), agregarFavorito);
router.delete("/eliminar-favorito/:idDisfraz", verificarAutenticacion, permitirRoles(["usuario"]), eliminarFavorito);
router.get("/favoritos", verificarAutenticacion, permitirRoles(["usuario"]), listarFavoritos);

export default router;
