import Usuario from "./Usuario.js";
import Disfraz from "./Disfraces.js";
import Festividad from "./festividad.js";
import Favorito from "./favoritos.js";
import Etiqueta from "./etiquetas.js";
import DisfrazEtiqueta from "./DisfrazEtiqueta.js";

// Relación 1:N entre Disfraz y Festividad
Disfraz.belongsTo(Festividad, {
    foreignKey: 'FestividadId',
    as: 'festividad',
    onDelete: 'SET NULL'
});

Festividad.hasMany(Disfraz, {
    foreignKey: 'FestividadId',
    as: 'disfraces'
});

// Relación N:M entre Disfraz y Etiqueta
Disfraz.belongsToMany(Etiqueta, {
    through: DisfrazEtiqueta,
    as: 'etiquetas',
    foreignKey: 'DisfrazId',
    otherKey: 'EtiquetaId'
});

Etiqueta.belongsToMany(Disfraz, {
    through: DisfrazEtiqueta,
    as: 'disfraces',
    foreignKey: 'EtiquetaId',
    otherKey: 'DisfrazId'
});

// Relación N:M entre Usuario y Disfraz (favoritos)
Usuario.belongsToMany(Disfraz, { through: Favorito, as: "favoritos" });
Disfraz.belongsToMany(Usuario, { through: Favorito, as: "usuariosFavoritos" });

export { Usuario, Disfraz, Festividad, Etiqueta };
