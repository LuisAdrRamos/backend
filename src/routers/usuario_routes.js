import { verificarAutenticacion } from "../middlewares/autenticacion.js";
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

const router = Router();

// 🔹 Rutas públicas
router.post("/registro", registrarUsuario);
router.post("/login", loginUsuario);

// 🔹 Rutas para recuperación de contraseña y confirmación de correo
router.post("/recuperar-password", recuperarPassword);
router.get("/recuperar-password/:token", comprobarTokenPassword);
router.post("/nuevo-password/:token", nuevoPassword);

// 🔹 Rutas protegidas (requieren autenticación)
router.get("/perfil", verificarAutenticacion, perfilUsuario);
router.put("/actualizar", verificarAutenticacion, actualizarUsuario);
router.put("/actualizar-password", verificarAutenticacion, actualizarPassword);

// 🔹 Rutas para manejar los favoritos
router.post("/agregar-favorito/:idDisfraz", verificarAutenticacion, agregarFavorito);
router.delete("/eliminar-favorito/:idDisfraz", verificarAutenticacion, eliminarFavorito);
router.get("/favoritos", verificarAutenticacion, listarFavoritos);

export default router;
