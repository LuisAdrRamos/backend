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
                    as: "festividad",
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
        res.status(500).json({ msg: "❌ Error al listar los disfraces", error });
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
                    as: "festividad",
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
        res.status(500).json({ msg: "❌ Error al buscar el disfraz", error });
    }
};

// 🔹 Registrar nuevo disfraz
const registrarDisfraz = async (req, res) => {
    try {
        const { nombre, descripcion, festividadId, etiquetas, imagenes } = req.body;

        if (!nombre || !descripcion || !festividadId || !Array.isArray(etiquetas)) {
            return res.status(400).json({ msg: "❌ Todos los campos son necesarios, incluyendo etiquetas[]" });
        }

        if (etiquetas.length > 5) {
            return res.status(400).json({ msg: "❌ No se pueden asignar más de 5 etiquetas" });
        }

        if (!imagenes || !Array.isArray(imagenes) || imagenes.length === 0 || imagenes.length > 3) {
            return res.status(400).json({ msg: "❌ Se requieren de 1 a 3 imágenes" });
        }

        const yaExiste = await Disfraz.findOne({ where: { nombre } });
        if (yaExiste) {
            return res.status(400).json({ msg: "❌ Ya existe un disfraz con ese nombre" });
        }

        const nuevoDisfraz = await Disfraz.create({
            nombre,
            descripcion,
            imagenes,
            FestividadId: festividadId
        });

        // Relacionar con etiquetas
        if (etiquetas && etiquetas.length > 0) {
            await nuevoDisfraz.setEtiquetas(etiquetas);
        }

        res.status(201).json({ msg: "✅ Disfraz registrado", disfraz: nuevoDisfraz });
    } catch (error) {
        console.error("❌ Error al registrar disfraz:", error);
        res.status(500).json({ msg: "❌ Error interno del servidor", error });
    }
};

// 🔹 Actualizar disfraz
const actualizarDisfraz = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, festividadId, etiquetas, imagenes } = req.body;

    try {
        const disfraz = await Disfraz.findByPk(id);
        if (!disfraz) return res.status(404).json({ msg: "❌ Disfraz no encontrado" });

        disfraz.nombre = nombre || disfraz.nombre;
        disfraz.descripcion = descripcion || disfraz.descripcion;
        disfraz.FestividadId = festividadId || disfraz.FestividadId;
        disfraz.imagenes = imagenes || disfraz.imagenes;

        await disfraz.save();

        if (etiquetas && Array.isArray(etiquetas)) {
            if (etiquetas.length > 5) {
                return res.status(400).json({ msg: "❌ No se pueden asignar más de 5 etiquetas" });
            }
            await disfraz.setEtiquetas(etiquetas);
        }

        res.status(200).json({ msg: "✅ Disfraz actualizado correctamente", disfraz });
    } catch (error) {
        console.error("❌ Error al actualizar disfraz:", error);
        res.status(500).json({ msg: "❌ Error al actualizar disfraz", error });
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
        res.status(500).json({ msg: "❌ Error al eliminar disfraz", error });
    }
};

export {
    listarDisfraces,
    detalleDisfraces,
    registrarDisfraz,
    actualizarDisfraz,
    eliminarDisfraces
};
