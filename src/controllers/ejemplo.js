import bcrypt from "bcryptjs";

const passwordPlano = "usuario"; // Contraseña sin encriptar

bcrypt.hash(passwordPlano, 10, (err, hash) => {
    if (err) {
        console.error("Error al generar hash:", err);
    } else {
        console.log("Hash generado:", hash);
    }
});
