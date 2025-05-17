import app from "./server.js";
import connection, { sequelize } from "./database.js";
import { crearAdminPorDefecto } from "./config/seedAdmin.js";

// ✅ Importar asociaciones (debe ir antes del .sync y antes de usar los modelos)
import './models/associations.js';  

const port = process.env.PORT || 3000;

const iniciarServidor = async () => {
  try {
    // 1. Conexión a la base de datos
    await connection();
    console.log("✅ Conectado a la base de datos");

    // 2. Sincronizar modelos con la base de datos (ahora con relaciones cargadas)
    await sequelize.sync();
    console.log("🛠 Tablas sincronizadas con Sequelize");

    // 3. Crear admin por defecto (si no existe)
    try {
      await crearAdminPorDefecto();
    } catch (errorSeed) {
      console.error("❌ Error al crear el administrador por defecto:", errorSeed);
    }

    // 4. Iniciar servidor
    app.listen(port, () => {
      console.log(`✅ Servidor corriendo en https://backend-mywf.onrender.com`);
    });
  } catch (errorDB) {
    console.error("❌ Error general al iniciar la aplicación (Sequelize/Conexión):", errorDB);
  }
};

iniciarServidor();