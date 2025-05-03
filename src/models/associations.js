import Usuario from "./Usuario.js";
import Disfraz from "./Disfraces.js";
import Festividad from "./festividad.js";
import Favorito from "./favoritos.js";
import Etiqueta from "./etiquetas.js";
import DisfrazEtiqueta from "./DisfrazEtiqueta.js";
import DisfrazFestividad from "./DisfrazFestividad.js"; 

// Relación N:M entre Disfraz y Festividad
Disfraz.belongsToMany(Festividad, {
    through: DisfrazFestividad,
    as: 'festividades',
    foreignKey: 'DisfrazId',
    otherKey: 'FestividadId'
});

Festividad.belongsToMany(Disfraz, {
    through: DisfrazFestividad,
    as: 'disfraces',
    foreignKey: 'FestividadId',
    otherKey: 'DisfrazId'
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
