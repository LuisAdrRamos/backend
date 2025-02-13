//Importar mongoose
import mongoose from 'mongoose'

// Pertimitir que solo los campos definidos en el Schema sean almacenados
// enn la BDD
mongoose.set('strictQuery', true)

// Crear una función llamada connection()
const connection = async () => {
    try {
        // Establecer al conexión con la BDD
        const { connection } = await mongoose.connect(process.env.MONGODB_URI)

        // Presentar la conexión en consola 
        console.log(`✅ Base de datos conectada en ${connection.host} - ${connection.port}`)

    } catch (error) {
        // Capturar Error en la conexión
        console.log("❌ Error en la conexión a la base de datos:", error);
    }
}

//Exportar la función
export default connection