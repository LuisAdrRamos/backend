import { sequelize } from "../database.js";
import '../models/Admin.js'; // importa todos tus modelos

const resetDatabase = async () => {
    try {
        await sequelize.sync({ force: true }); // Limpia y recrea todo
        console.log("✅ Base de datos reseteada correctamente.");
    } catch (error) {
        console.error("❌ Error reseteando la base de datos:", error);
    } finally {
        await sequelize.close();
    }
};

resetDatabase();
