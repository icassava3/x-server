import functions from "./functions";

/**
 * Obtenir tous les data de l'etablissement pour le web client
 */
const getEtabFullData = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const classes = await functions.getClassesList();
            const eleves = await functions.getStudentsList();
            const personnels = await functions.getPersonnelsList();
            const ordreEnseignements = await functions.getOrdreEnseignement();
            const echeanciers =  await functions.echeanciers();
            const versements =  await functions.echeanciers();
            resolve({classes,eleves, personnels,ordreEnseignements,echeanciers, versements})
        } catch (error) {
            reject(error);
        }
    });
};


export default {
    getEtabFullData,
}

