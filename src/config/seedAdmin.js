import Admin from "../models/Admin.js";

export const crearAdminPorDefecto = async () => {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    

    try {
        const admin = await Admin.findOne({ where: { email: adminEmail } });

        if (!admin) {
            await Admin.create({
                nombre: "Steven",
                apellido: "Ortega",
                direccion: "Yaruqui-parque centro",
                telefono: "0992874034",
                email: adminEmail,
                password: adminPassword,
                rol: "admin"
            });

            console.log("✅ Admin general creado por defecto.");
        } else {
            console.log("✅ Admin general ya existe, no se creó nuevamente.");
        }
    } catch (error) {
        throw new Error(`Error en crearAdminPorDefecto: ${error.message}`);
    }
};
