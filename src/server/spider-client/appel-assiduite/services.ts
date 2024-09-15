import { absencesRetardsJustifications, assiduiteEleveItem, IAppelItem, IAppelNoneFormatedItem, IAppelsFilterPayload, IAssiduiteNoneFormatedItem, IEleveClasse, IJustifierAssiduitePayload, IPontageEleve, sms } from "./interfaces";
import Logger from "../../helpers/logger";
import functions from "./functions"
import functionsVba from "../../spider-whserver/functions-vba"
import { merge2ArraysOfObjects } from "../../helpers/function";
import { paramEtabObjet } from "../../databases/accessDB";

var _ = require('lodash');


/**
 *Enregistrement 'un eleve qui vient manger
 */

const pointageEleveCantine = (data: any): Promise<IPontageEleve[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const { idEleve } = data

            await functions.insererPointageEleveCantine(data)

            const elevePointe = await functions.getElevePointeALaCantine(idEleve)
            resolve(elevePointe)
        } catch (error) {

            reject(error);

        }

    });
};


// const getAppels = (): Promise<IAppelItem[]> => {
const getAppels = (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {

            const appels = await functions.getAllAppels()
            if (!appels.length) resolve({ appels: [], classes: [] })

            let classeIds: number[] = []

            appels.map((appelItem) => {
                if (!classeIds.includes(appelItem.idClasse)) {
                    classeIds.push(appelItem.idClasse)
                }
            })

            const classes = await functionsVba.fetchClasses(classeIds)
            // console.log("🚀 ~ file: services.ts ~ line 50 ~ returnnewPromise ~ classes", classes)

            const result = appels.map((appelItem: any, i: number) => {
                const classesItem = classes.find((classeItem) =>
                    classeItem.idClasse === appelItem.idClasse
                )

                return {
                    ...appelItem,
                    dateAppel: new Date(appelItem.dateAppel).toLocaleDateString(),
                    libelleClasseLong: classesItem.libelleClasseLong,
                    libelleClasseCourt: classesItem.libelleClasseCourt
                }
            })

            resolve({ appels: result, classes })

        } catch (error) {
            console.log("🚀 ~ file: services.ts:69 ~ returnnewPromise ~ error:", error)
            reject(error);
        }

    });
};


const getAssiduiteEleves = (): Promise<assiduiteEleveItem[]> => {
    return new Promise(async (resolve, reject) => {
        try {

            let studentIds: number[] = []
            let classeIds: number[] = []
            const assiduite: any = await functions.getAssiduite()
            if (!assiduite.length) resolve([])

            assiduite.map((assiduiteItem: any) => {
                if (!classeIds.includes(assiduiteItem.idClasse)) {
                    classeIds.push(assiduiteItem.idClasse)
                }
                if (!studentIds.includes(assiduiteItem.idEleve)) {
                    studentIds.push(assiduiteItem.idEleve)
                }
            })
            const eleves = await functionsVba.fetchStudents(studentIds)
            const classes = await functionsVba.fetchClasses(classeIds)

            const result = assiduite.map((assiduiteItem: any) => {
                const classesItem = classes.find((classeItem) =>
                    classeItem.idClasse === assiduiteItem.idClasse
                )
                const findEleve = eleves.find((eleveItem) => eleveItem.idEleve === assiduiteItem.idEleve)

                return {
                    ...assiduiteItem,
                    dateAppel: new Date(assiduiteItem.dateAppel).toLocaleDateString(),
                    libelleClasseLong: classesItem.libelleClasseLong,
                    libelleClasseCourt: classesItem.libelleClasseCourt,
                    nomEleve: findEleve?.nomEleve || "",
                    prenomEleve: findEleve?.prenomEleve || "",
                    sexe: findEleve?.sexe || "",
                    matricule: findEleve?.matricule || "",
                }
            })
            // console.log("🚀 ~ file: services.ts ~ line 90 ~ returnnewPromise ~ result", JSON.stringify(result.slice(0, 20)))

            resolve(result)
        } catch (error) {
            console.log("🚀 ~ file: services.ts ~ line 140 ~ returnnewPromise ~ error", error)
            reject(error);
        }

    });
};

const getDatesAppels = (): Promise<string[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const datesAppels = await functions.getDatesAppels()
            resolve(datesAppels)
        } catch (error) {
            reject(error);
        }
    });
};

const getPlagesHorairesAppels = (): Promise<string[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const plagesHoraires = await functions.getPlagesHorairesAppels()
            resolve(plagesHoraires)
        } catch (error) {
            reject(error);
        }

    });
};

const getMatieresAppels = (): Promise<string[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const matieres = await functions.getMatieresAppels()
            resolve(matieres)
        } catch (error) {
            console.log("🚀 ~ file: services.ts ~ line 154 ~ returnnewPromise ~ error", error)
            reject(error);
        }

    });
};

const getProfesseursAppels = (): Promise<string[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const professeurs = await functions.getProfesseursAppels()
            resolve(professeurs)
        } catch (error) {
            console.log("🚀 ~ file: services.ts ~ line 154 ~ returnnewPromise ~ error", error)
            reject(error);
        }

    });
};

const getParamsEtab = (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab", "AnScol2", "BPEtab", "DRENComplet",
                "DRENouDDEN", "DREN", "Fondateur", "NomChefEtab", "NomCompletEtab", "NomEtabAbr", "TélChefEtab",
                "TélCorrespondant", "TelEtab", "decoupSemestres"]);;
            resolve(paramObj)
        } catch (error) {
            console.log("🚀 ~ file: services.ts ~ line 210 ~ returnnewPromise ~ error", error)
            reject(error);
        }

    });
};

const getClasses = (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const classes = await functionsVba.fetchClasses()
            resolve(classes)
        } catch (error) {
            console.log("🚀 ~ file: services.ts ~ line 199 ~ returnnewPromise ~ error", error)
            reject(error);
        }

    });
};

const getEleves = (data: number[]): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const eleves = await functionsVba.fetchStudents(data)
            resolve(eleves)
        } catch (error) {
            console.log("🚀 ~ file: services.ts ~ line 212 ~ returnnewPromise ~ error", error)
            reject(error);
        }

    });
};

/**
 * Obtenir les assiduité des eleves d'une ou plusieurs classe
 * @param data 
 * @returns 
 */
const getClasseElevesAssiduite = (data: { classeIds: number[], dateDebut: string, dateFin: string }): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const { classeIds, dateDebut, dateFin } = data;
            const eleves = await functions.getClasseElevesAssiduite(classeIds, dateDebut, dateFin)
            resolve(eleves)
        } catch (error) {
            reject(error);
        }

    });
};

/**
 * Justifié l'absence ou le retard d'un eleve
 * @param data 
 * @returns 
 */
const justifierAbsenceRetard = (data: IJustifierAssiduitePayload): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            await functions.justifierAbsenceRetard(data);
            resolve(true);
        } catch (error) {
            reject(error);
        }

    });
};

/**
 * Obtenir la liste des dix élèves les plus absents
 * @param data 
 * @returns 
 */
const getElevesLesPlusAbsents = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const elevesLesPlusAbsentsAvecNombreAbsence = await functions.getElevesLesPlusAbsents()
            if (!elevesLesPlusAbsentsAvecNombreAbsence.length) resolve([])
            const eleveIds = elevesLesPlusAbsentsAvecNombreAbsence.map((item: any) => item.idEleve)
            const elevesVba = await functions.getEleveWithClasse(eleveIds) as IEleveClasse[];
            const mergedArray = merge2ArraysOfObjects(elevesLesPlusAbsentsAvecNombreAbsence, elevesVba, "idEleve");
            resolve(mergedArray)
        } catch (error) {
            reject(error);
        }

    });
};

/**
 * Obtenir la liste des dix classes avec le plus d'absences et rétards
 * @param data 
 * @returns 
 */
const getClasseAvecLePlusDeAbsents = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const classes = await functions.getClasseAvecLePlusDeAbsents()
            const classeIds = classes.map((item: any) => item.idClasse)
            const classesVba = await functions.getClasseWithIdClasse(classeIds);
            const mergedArray = merge2ArraysOfObjects(classes, classesVba, "idClasse");
            resolve(mergedArray)
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Obtenir les 10 matières avec le plus d'absents
 * @param data 
 * @returns 
 */

const getMatieresAvecLePlusDeAbsents = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const matiereAvecLePlusDeAbsents = await functions.getMatieresAvecLePlusDeAbsents()
            resolve(matiereAvecLePlusDeAbsents)
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Obtenir le nombre de rétards, d'absences et justification par jour et en tout
 * @param data 
 * @returns 
 */

const getNombreRetardsAbsencesJustifications = (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const nombreRetardsAbsencesJustifications = await functions.getNombreRetardsAbsencesJustifications()
            resolve(nombreRetardsAbsencesJustifications)
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Obtenir le nombre de sms envoyé ou non par jour et en tout
 * @param data 
 * @returns 
 */

const getNombreSmsEnvoyeOuNon = (): Promise<sms> => {
    return new Promise(async (resolve, reject) => {
        try {
            const smsEnvoyesOuNon = await functions.getNombreSmsEnvoyeOuNon()
            resolve(smsEnvoyesOuNon)
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Obtenir la liste des professeurs affectés à une classe
 */
const getProfAffecteClasse = (): Promise<sms> => {
    return new Promise(async (resolve, reject) => {
        try {
            const professeurs: any = await functions.getProfAffecteClasse()
            resolve(professeurs)
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Obtenir l'état des appels'
 * @param classeIds 
 * @returns 
 */
function getDayOfWeek(date:any) {
    const daysOfWeek = ['DI', 'LU', 'MA', 'ME', 'JE', 'VE', 'SA'];
    return daysOfWeek[date.getUTCDay()];
}
const getEtatAppel = (dateAppel: string, idClasse: number) => {
    return new Promise(async (resolve, reject) => {
        try {
            let date = new Date(dateAppel); // Aujourd'*****
            let day = getDayOfWeek(date);
            const planning = await functions.fetchPlannig(idClasse);
            console.log("🚀 ~ file: services.ts:370 ~ returnnewPromise ~ planning", planning)
            const planningDuJour = planning.filter(x => x.libelleHoraire.slice(0, 2) === day)
            const absence:any = await functions.getNombreAbsenceParPlage(dateAppel, idClasse)
            const retard:any = await functions.getNombreRetardByPlage(dateAppel, idClasse)
            const mergedArrayAbsent = merge2ArraysOfObjects(planningDuJour, absence, "idSeance")
            const mergedArray = merge2ArraysOfObjects(mergedArrayAbsent, retard, "idSeance")
            resolve(mergedArray)
        } catch (error) {
            reject(error);
        }
    });
}

const GetPlanningClasse = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const planningClasse = await functions.GetPlanningClasse()
            resolve(planningClasse)
        } catch (error) {
            console.log("🚀 ~ file: services.ts ~ line 154 ~ returnnewPromise ~ error", error)
            reject(error);
        }
    });
};



export default {
    pointageEleveCantine,
    getAppels,
    getAssiduiteEleves,
    getDatesAppels,
    getPlagesHorairesAppels,
    getMatieresAppels,
    getProfesseursAppels,
    getParamsEtab,
    getClasses,
    getEleves,
    getClasseElevesAssiduite,
    justifierAbsenceRetard,
    getMatieresAvecLePlusDeAbsents,
    getElevesLesPlusAbsents,
    getNombreSmsEnvoyeOuNon,
    getNombreRetardsAbsencesJustifications,
    getClasseAvecLePlusDeAbsents,
    getProfAffecteClasse,
    getEtatAppel,
    GetPlanningClasse,
    
}

