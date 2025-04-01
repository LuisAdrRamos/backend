import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config(); // 👈 ¡Esto es obligatorio!

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_TYPE,
        logging: false
    }
);

const connection = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Conectado a MySQL");
        
    } catch (error) {
        console.error("❌ Error de conexión MySQL:", error);
    }
}

export { sequelize };
export default connection;