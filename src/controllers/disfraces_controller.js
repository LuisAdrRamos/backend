import Disfraz from "../models/Disfraces.js";
import Festividad from "../models/festividad.js";
import Etiqueta from "../models/etiquetas.js";

// 🔹 Listar todos los disfraces
const listarDisfraces = async (req, res) => {
    try {
        const disfraces = await Disfraz.findAll({
            include: [
                {
                    model: Festividad,
                    as: "festividades",  // Cambiado de "festividad" a "festividades" (plural)
                    attributes: ["id", "nombre", "mes", "dia"]
                },
                {
                    model: Etiqueta,
                    as: "etiquetas",
                    attributes: ["id", "nombre"]
                }
            ],
            order: [["createdAt", "DESC"]]
        });
        res.status(200).json(disfraces);
    } catch (error) {
        console.error("❌ Error al listar disfraces:", error);
        res.status(500).json({ msg: "❌ Error al listar los disfraces", error: error.message });
    }
};

// 🔹 Detalle de un disfraz
const detalleDisfraces = async (req, res) => {
    const { id } = req.params;
    try {
        const disfraz = await Disfraz.findByPk(id, {
            include: [
                {
                    model: Festividad,
                    as: "festividades",  // Cambiado de "festividad" a "festividades" (plural)
                    attributes: ["id", "nombre", "mes", "dia"]
                },
                {
                    model: Etiqueta,
                    as: "etiquetas",
                    attributes: ["id", "nombre"]
                }
            ]
        });

        if (!disfraz) return res.status(404).json({ msg: "❌ Disfraz no encontrado" });
        res.status(200).json(disfraz);
    } catch (error) {
        console.error("❌ Error al buscar el disfraz:", error);
        res.status(500).json({ msg: "❌ Error al buscar el disfraz", error: error.message });
    }
};

// 🔹 Registrar nuevo disfraz
const registrarDisfraz = async (req, res) => {
    try {
        const { nombre, descripcion, festividades, etiquetas, imagenes } = req.body;  // Cambiado de festividadId a festividades (array)

        // Validaciones básicas
        if (!nombre?.trim() || !descripcion?.trim() || !Array.isArray(festividades) || !Array.isArray(etiquetas) || !Array.isArray(imagenes)) {
            return res.status(400).json({ msg: "❌ Todos los campos son necesarios" });
        }

        // Validar longitud descripción
        if (descripcion.length > 250) {
            return res.status(400).json({ msg: "❌ La descripción no puede exceder los 250 caracteres" });
        }

        // Validar festividades
        if (festividades.length === 0 || festividades.length > 5) {
            return res.status(400).json({ msg: "❌ Se requiere al menos 1 festividad y máximo 5" });
        }

        // Validar etiquetas
        if (etiquetas.length > 6) {
            return res.status(400).json({ msg: "❌ Máximo 6 etiquetas permitidas" });
        }

        // Validar imágenes
        if (imagenes.length === 0 || imagenes.length > 3) {
            return res.status(400).json({ msg: "❌ Se requieren de 1 a 3 imágenes" });
        }

        // Verificar nombre único
        const yaExiste = await Disfraz.findOne({ where: { nombre } });
        if (yaExiste) {
            return res.status(400).json({ msg: "❌ Ya existe un disfraz con ese nombre" });
        }

        // Crear el disfraz
        const nuevoDisfraz = await Disfraz.create({
            nombre: nombre.trim(),
            descripcion: descripcion.trim(),
            imagenes
        });

        // Establecer relaciones
        await nuevoDisfraz.addFestividades(festividades);
        await nuevoDisfraz.addEtiquetas(etiquetas);

        // Obtener el disfraz con relaciones para la respuesta
        const disfrazCompleto = await Disfraz.findByPk(nuevoDisfraz.id, {
            include: [
                { model: Festividad, as: 'festividades' },
                { model: Etiqueta, as: 'etiquetas' }
            ]
        });

        res.status(201).json({ 
            msg: "✅ Disfraz registrado", 
            disfraz: disfrazCompleto 
        });

    } catch (error) {
        console.error("❌ Error al registrar disfraz:", error);
        res.status(500).json({ 
            msg: "❌ Error interno del servidor",
            error: error.message 
        });
    }
};

// 🔹 Actualizar disfraz
const actualizarDisfraz = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, festividades, etiquetas, imagenes } = req.body;  // Cambiado de festividadId a festividades

    try {
        // Validaciones básicas
        if (!nombre?.trim() && !descripcion?.trim() && !festividades && !etiquetas && !imagenes) {
            return res.status(400).json({ msg: "❌ Debe proporcionar al menos un campo para actualizar" });
        }

        // Buscar disfraz
        const disfraz = await Disfraz.findByPk(id);
        if (!disfraz) return res.status(404).json({ msg: "❌ Disfraz no encontrado" });

        // Validar longitud descripción
        if (descripcion && descripcion.length > 250) {
            return res.status(400).json({ msg: "❌ La descripción no puede exceder los 250 caracteres" });
        }

        // Validar festividades
        if (festividades && (festividades.length === 0 || festividades.length > 5)) {
            return res.status(400).json({ msg: "❌ Se requiere al menos 1 festividad y máximo 5" });
        }

        // Validar etiquetas
        if (etiquetas && etiquetas.length > 6) {
            return res.status(400).json({ msg: "❌ Máximo 6 etiquetas permitidas" });
        }

        // Validar imágenes
        if (imagenes && (imagenes.length === 0 || imagenes.length > 3)) {
            return res.status(400).json({ msg: "❌ Se requieren de 1 a 3 imágenes" });
        }

        // Actualizar campos
        if (nombre) disfraz.nombre = nombre.trim();
        if (descripcion) disfraz.descripcion = descripcion.trim();
        if (imagenes) disfraz.imagenes = imagenes;

        await disfraz.save();

        // Actualizar relaciones
        if (festividades) await disfraz.setFestividades(festividades);
        if (etiquetas) await disfraz.setEtiquetas(etiquetas);

        // Obtener disfraz actualizado
        const disfrazActualizado = await Disfraz.findByPk(id, {
            include: [
                { model: Festividad, as: 'festividades' },
                { model: Etiqueta, as: 'etiquetas' }
            ]
        });

        res.status(200).json({ 
            msg: "✅ Disfraz actualizado correctamente", 
            disfraz: disfrazActualizado 
        });
    } catch (error) {
        console.error("❌ Error al actualizar disfraz:", error);
        res.status(500).json({ 
            msg: "❌ Error al actualizar disfraz",
            error: error.message 
        });
    }
};

// 🔹 Eliminar disfraz
const eliminarDisfraces = async (req, res) => {
    const { id } = req.params;
    try {
        const disfraz = await Disfraz.findByPk(id);
        if (!disfraz) return res.status(404).json({ msg: "❌ Disfraz no encontrado" });

        await disfraz.destroy();
        res.status(200).json({ msg: "✅ Disfraz eliminado exitosamente" });
    } catch (error) {
        console.error("❌ Error al eliminar disfraz:", error);
        res.status(500).json({ msg: "❌ Error al eliminar disfraz", error: error.message });
    }
};

export {
    listarDisfraces,
    detalleDisfraces,
    registrarDisfraz,
    actualizarDisfraz,
    eliminarDisfraces
};