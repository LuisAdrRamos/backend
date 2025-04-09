// controllers/etiquetas_controller.js
import Etiqueta from "../models/etiquetas.js";

const crearEtiqueta = async (req, res) => {
    try {
        const etiqueta = await Etiqueta.create(req.body);
        res.status(201).json({ msg: "✅ Etiqueta creada exitosamente", etiqueta });
    } catch (error) {
        res.status(500).json({ msg: "❌ Error al crear etiqueta", error });
    }
};

const obtenerEtiquetas = async (_req, res) => {
    try {
        const etiquetas = await Etiqueta.findAll();
        res.status(200).json(etiquetas);
    } catch (error) {
        res.status(500).json({ msg: "❌ Error al obtener etiquetas", error });
    }
};

const actualizarEtiqueta = async (req, res) => {
    const { id } = req.params;
    try {
        const etiqueta = await Etiqueta.findByPk(id);
        if (!etiqueta) return res.status(404).json({ msg: "❌ Etiqueta no encontrada" });

        await etiqueta.update(req.body);
        res.status(200).json({ msg: "✅ Etiqueta actualizada", etiqueta });
    } catch (error) {
        res.status(500).json({ msg: "❌ Error al actualizar etiqueta", error });
    }
};

const eliminarEtiqueta = async (req, res) => {
    const { id } = req.params;
    try {
        const etiqueta = await Etiqueta.findByPk(id);
        if (!etiqueta) return res.status(404).json({ msg: "❌ Etiqueta no encontrada" });

        await etiqueta.destroy();
        res.status(200).json({ msg: "✅ Etiqueta eliminada exitosamente" });
    } catch (error) {
        res.status(500).json({ msg: "❌ Error al eliminar etiqueta", error });
    }
};

export {
    crearEtiqueta,
    obtenerEtiquetas,
    actualizarEtiqueta,
    eliminarEtiqueta
};
