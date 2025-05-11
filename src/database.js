import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config(); // 🔹 ¡Carga las variables de entorno antes de todo!

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: "mariadb",
        logging: false,
        dialectOptions: {
            connectTimeout: 60000 // 🔹 Ajusta el tiempo de conexión
        }
    }
);

const connection = async () => {
    try {
        await sequelize.authenticate();
        console.log(`✅ Conectado a la base de datos: ${process.env.DB_NAME} en ${process.env.DB_HOST}`);
        
    } catch (error) {
        console.error("❌ Error de conexión MySQL/MariaDB:", error);
        process.exit(1); // 🔹 Finaliza el proceso si la conexión falla
    }
};

export { sequelize };
export default connection;
