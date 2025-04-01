import Festividad from "../models/festividad.js";

// 🔹 Crear festividad
const crearFestividad = async (req, res) => {
    try {
        const festividad = await Festividad.create(req.body);
        res.status(201).json({ msg: "✅ Festividad creada exitosamente", festividad });
    } catch (error) {
        res.status(500).json({ msg: "❌ Error al crear festividad", error });
    }
};

// 🔹 Obtener todas las festividades
const obtenerFestividades = async (req, res) => {
    try {
        const festividades = await Festividad.findAll({ order: [["mes", "ASC"], ["dia", "ASC"]] });
        res.status(200).json(festividades);
    } catch (error) {
        res.status(500).json({ msg: "❌ Error al obtener festividades", error });
    }
};

// 🔹 Agrupar festividades por mes
const listarFestividadesPorMes = async (req, res) => {
    try {
        const festividades = await Festividad.findAll();
        const agrupadas = festividades.reduce((acc, item) => {
            acc[item.mes] = acc[item.mes] || [];
            acc[item.mes].push(item);
            return acc;
        }, {});
        res.status(200).json(agrupadas);
    } catch (error) {
        res.status(500).json({ msg: "❌ Error al agrupar festividades", error });
    }
};

// 🔹 Actualizar festividad
const actualizarFestividad = async (req, res) => {
    const { id } = req.params;
    try {
        const festividad = await Festividad.findByPk(id);
        if (!festividad) return res.status(404).json({ msg: "❌ Festividad no encontrada" });

        await festividad.update(req.body);
        res.status(200).json({ msg: "✅ Festividad actualizada", festividad });
    } catch (error) {
        res.status(500).json({ msg: "❌ Error al actualizar festividad", error });
    }
};

// 🔹 Eliminar festividad
const eliminarFestividad = async (req, res) => {
    const { id } = req.params;
    try {
        const festividad = await Festividad.findByPk(id);
        if (!festividad) return res.status(404).json({ msg: "❌ Festividad no encontrada" });

        await festividad.destroy();
        res.status(200).json({ msg: "✅ Festividad eliminada exitosamente" });
    } catch (error) {
        res.status(500).json({ msg: "❌ Error al eliminar festividad", error });
    }
};

export {
    crearFestividad,
    obtenerFestividades,
    listarFestividadesPorMes,
    actualizarFestividad,
    eliminarFestividad
};
