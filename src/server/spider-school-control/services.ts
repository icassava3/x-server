import { ISchoolControlActivitiesConfig } from '../../client/store/interfaces';
import { paramEtabObjet } from '../databases/accessDB';
import redisFunctions from '../databases/redis/functions';
import { cacheControleFraisScolaire } from '../databases/redis/redis-cache';
import { fetchPublicRoute } from '../helpers/apiClient';
import { GLOBAL_API_BASE_URL } from '../helpers/constants';
import { getTodayDateTime, isoDateToDateTime, merge2ArraysOfObjects, trouverPlageHoraire } from '../helpers/function';
import Logger from "../helpers/logger";
import { fetchSendBoxSms, fetchSendBoxSmsNotSent, updateSendBoxMessagesSmsData } from '../spider-messagerie/functions';
import { ISendBoxMessages } from '../spider-messagerie/interfaces';
import { envoiSmsProvider } from '../spider-messagerie/services';
import { ACTIVITE_CONTROLE_CANTINE_ID, ACTIVITE_CONTROLE_FRAIS_SCOLAIRE_ID, ACTIVITE_CONTROLE_TRANSPORT_ID, ACTIVITE_POINTAGE_APPRENANT_ID, ACTIVITE_POINTAGE_CANTINE_ID, ACTIVITE_POINTAGE_CAR_ID, ACTIVITE_POINTAGE_PERSONNEL_ID, VBA_GROUPE_RUBRIQUE_CANTINE_ID, VBA_GROUPE_RUBRIQUE_TRANSPORT_ID } from './constants';
import functions from "./functions";
import { IActivite, IControleDecisionAccepte, IControleFraisScolairePayload, IControleItem, IEleveClasse, IHistoriquePointagePayload, IItemStudentDataFraisScolaire, IPointage, IPointagePayload, ISchoolControlActivitiesUsers, ISchoolControlActivityStatusUpdate, ISmsAccount } from "./interfaces";
const uuid = require("uuid");

var _ = require('lodash');

/**
 * Effectue le pointage d'une personne (aprenant ou élève)
 * @param {IPointagePayload} data - Les données de pointage personne
 * @returns {Promise<IPointage | IEleveClasse>} - Une promesse résolue avec les résultat du pointage.
 */
const effectuerPointage = (data: IPointagePayload): Promise<IPointage | IEleveClasse> => {
    return new Promise(async (resolve, reject) => {
        try {

            const { idPersonne, idActivite, codeEtab, anneeScolaire } = data;
            // Récupérer les paramètres de l'établissement depuis Redis
            const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);
            // Vérifier si le code de l'établissement ou l'année scolaire correspondent
            if (codeEtab !== codeetab || anneeScolaire !== anscol1) {
                return reject({ name: "QR-CODE_ERROR", message: "Ce QR-code ne correspond pas à la base chargée" });
            }

            let pointageConfig = await functions.getSchoolControlActivitiesConfig(idActivite);
            // Vérifier si la configuration de pointage existe
            if (!pointageConfig.length) {
                return reject({ name: "PARAM_NOT_CONFIGURED", message: "Aucun paramètre ajouté pour cette activité" });
            }

            switch (idActivite) {
                case ACTIVITE_POINTAGE_PERSONNEL_ID:
                case ACTIVITE_POINTAGE_APPRENANT_ID:
                    const personneData: any = idActivite === ACTIVITE_POINTAGE_APPRENANT_ID
                        ? await functions.getEleveWithClasse([idPersonne])
                        : await functions.getPersonnelWithFonction([idPersonne]);
                    if (!personneData || !personneData.length) return reject({ name: "PERSONNE_NOT_FOUND", message: "Aucune donnée trouvé pour cette personne" })
                    // Traitement spécifique pour l'activité "ASC"
                    const pointageId = await functions.insererPointage(data);
                    let personnePointage = await functions.getPointageData(pointageId);
                    return resolve({ ...personneData[0], ...personnePointage });
                    break;

                case ACTIVITE_POINTAGE_CANTINE_ID:
                case ACTIVITE_POINTAGE_CAR_ID:
                    // Rechercher l'élève d'abord dans le cache de Redis
                    // const studentFullData = await cacheControleFraisScolaire.get(`${idPersonne}`) as IItemStudentDataFraisScolaire[];
                    const studentFullData = await redisFunctions.hGetJsonData("controlefraisScolaire", `${idPersonne}`) as IItemStudentDataFraisScolaire[];
                    if (!studentFullData || !studentFullData.length) return reject({ name: "STUDENT_NOT_FOUND", message: "Aucune donnée trouvé pour cet élève" })
                    const { idEleve, genre, nomEleve, prenomEleve, matriculeEleve, libelleClasseCourt, libelleClasseLong } = studentFullData[0];

                    const searchEleve: IEleveClasse = { idEleve, nomEleve, prenomEleve, matriculeEleve, libelleClasseCourt, libelleClasseLong, genre }

                    //  await functions.getEleveWithClasse([idPersonne]);
                    // // Vérifier si l'élève a été trouvé
                    // if (searchEleve.length !== 1) {
                    //     return reject({
                    //         name: "STUDENT_NOT_FOUND",
                    //         message: "Élève non trouvé dans la base"
                    //     });
                    // }
                    // Obtenir la configuration de pointage pour l'établissement

                    // Obtenir l'heure actuelle pour le pointage
                    // const date = new Date();
                    // const heurePointage = `${date.getHours()}:${date.getMinutes()}`;
                    const date = new Date();
                    const hours = date.getHours().toString().padStart(2, '0');
                    const minutes = date.getMinutes().toString().padStart(2, '0');
                    const heurePointage = `${hours}:${minutes}`;

                    // Trouver la plage horaire correspondante pour l'heure actuelle

                    const plageCorrespondante = trouverPlageHoraire(heurePointage, pointageConfig[0]?.config?.params);

                    if (plageCorrespondante) {
                        // Rechercher le pointage de l'élève pour cette activité et plage horaire
                        let elevePointage = await functions.getEleveActivitePointage(idPersonne, idActivite, plageCorrespondante?.idPlage);

                        let studentData: any;
                        if (!elevePointage.length) {
                            // Si le pointage n'existe pas, insérer le pointage de l'élève
                            data.idPlage = plageCorrespondante?.idPlage;
                            data.sensAcces = null;
                            await functions.insererPointage(data);
                            elevePointage = await functions.getEleveActivitePointage(idPersonne, idActivite, plageCorrespondante?.idPlage);
                            studentData = { ...searchEleve, ...elevePointage[0] };
                            return resolve(studentData);
                        } else {
                            // Si le pointage existe déjà, rejeter la promesse avec un message d'erreur
                            studentData = { ...searchEleve, ...elevePointage[0] };
                            return reject({ data: studentData, message: "Pointage déjà effectué" });
                        }
                        break;
                    } else {
                        // Si aucune plage horaire correspondante n'est trouvée, rejeter la promesse avec un message d'erreur
                        return reject({ name: "PLAGE_NOT_FOUND", message: "Impossible d'effectuer un pointage hors des plages horaires définies pour l'activité." });
                    }
            }
        } catch (error) {
            // En cas d'erreur, rejeter la promesse avec l'erreur
            reject(error);
        }
    });
};


/**
 * Obtenir l'historique de tous les pointages d'une activité
 * @param data 
 * @returns 
 */
export const historiquePointage = (data: IHistoriquePointagePayload): Promise<IPointage[] | IEleveClasse[]> => {
    return new Promise(async (resolve, reject) => {
        try {

            /*
            //fetch hstorique data from redis
            const historiqueCacheRes= await redisClient.get(historiquePointageActivite);
            if(historiqueCacheRes){

            }else{
                 const historiques = await functions.getHistoriquePointageActivite(data);
                 await redisClient.set(species, JSON.stringify(historiques));
            }
            */


            //key redis pour pointage pointage:activite:2:10-02-23
            // 


            const historiques = await functions.getHistoriquePointageActivite(data);
            if (!historiques.length) return resolve([]);
            let eleves = []
            const elevesIds = historiques
                .filter(item => item.idActivite !== "ASC05")
                .map(item => item.idPersonne);

            if (elevesIds.length) {
                eleves = await functions.getEleveWithClasse(elevesIds) as IEleveClasse[];
            }

            // let personnels = []
            // const personnelIds = historiques
            //     .filter(item => item.idActivite === 5)
            //     .map(item => item.idPersonne);

            // if (personnelIds.length) {
            //     personnels = await functions.getPersonnelWithFonction(personnelIds) as IPersonnelFonction[];
            // }
            const mergedArray = merge2ArraysOfObjects(historiques, eleves, "idPersonne");
            resolve(mergedArray);
        } catch (error) {
            Logger.error("Error while login user");
            reject(error);
        }
    });
};


/**
 * effectuer le controle des frais scolaire pour un eleve
 * @param data 
 * @returns 
 */
export const controleFraisScolaire = (data: IControleFraisScolairePayload): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const { idPersonne, idActivite, codeEtab, anneeScolaire, operateur } = data;
            // const studentFullData = await cacheControleFraisScolaire.get(`${idPersonne}`) as IItemStudentDataFraisScolaire[];
            const studentFullData = await redisFunctions.hGetJsonData("controlefraisScolaire", `${idPersonne}`) as IItemStudentDataFraisScolaire[];

            //si aucune donné trouvé, baaaah retourne aucune donnée trouvé pour ce enfant
            if (!studentFullData || !studentFullData.length) return reject({ name: "STUDENT_NOT_FOUND", message: "Aucune donnée trouvé pour cet élève" })
            const { idEleve, genre, nomEleve, prenomEleve, matriculeEleve, libelleClasseCourt, libelleClasseLong } = studentFullData[0];

            let controleData: IItemStudentDataFraisScolaire[] = [];

            //effectuer suivant l'activite demandé (cantine, car ou frais scolaire obligatoire)
            switch (idActivite) {
                case ACTIVITE_CONTROLE_FRAIS_SCOLAIRE_ID://Contrôle des frais scolaires

                    // controleData = studentFullData.filter(item => (new Date(item.datelimite) < new Date()) && !item.optionnel && item.resteAPayer > 0)
                    controleData = studentFullData.filter(item => (new Date(item.datelimite) < new Date()) && !item.optionnel && item.resteAPayer !== 0)
                    console.log("🚀 ~ file: services.ts:195 ~ returnnewPromise ~ controleData:", controleData)

                    // if (!echeancierPasseNonPaye.length) { // l'eleve est a jour des frais scolaires
                    //     //verifier eleve a jour et inserer controle 
                    //     const resteAPayer = 0;
                    //     const aJour = resteAPayer === 0;
                    //     const accepte = aJour;
                    //     const idControle = await functions.insererControle({ ...data, aJour, accepte: accepte })
                    //     return resolve({
                    //         idEleve,
                    //         genre,
                    //         nomEleve,
                    //         prenomEleve,
                    //         matriculeEleve,
                    //         libelleClasseCourt,
                    //         libelleClasseLong,
                    //         idControle,
                    //         aJour,
                    //         accepte,
                    //         resteAPayer,
                    //     })
                    // }
                    break;
                case ACTIVITE_CONTROLE_CANTINE_ID://Contrôle d'accès à la cantine
                    //verifier que l'eleve a souscrit a la cantine en s'assurant qu'il a au moins une echeance
                    const echeancierCantine = studentFullData.filter(item => item.idGroupeOptionnel === VBA_GROUPE_RUBRIQUE_CANTINE_ID)
                    if (!echeancierCantine.length) return reject({ name: "STUDENT_NOT_SUBSCRIBE", message: "Cet élève n'a pas souscrit à la cantine" })

                    controleData = echeancierCantine.filter(item => (new Date(item.datelimite) < new Date()))

                    // if (!echeancierCantinePasseNonPaye.length) { // l'eleve est a jour des frais scolaires
                    //     //verifier eleve a jour et inserer controle 
                    //     const resteAPayer = 0;
                    //     const aJour = resteAPayer === 0;
                    //     const accepte = aJour;
                    //     const idControle = await functions.insererControle({ ...data, aJour, accepte: accepte })
                    //     return resolve({
                    //         idEleve,
                    //         genre,
                    //         nomEleve,
                    //         prenomEleve,
                    //         matriculeEleve,
                    //         libelleClasseCourt,
                    //         libelleClasseLong,
                    //         idControle,
                    //         aJour,
                    //         accepte,
                    //         resteAPayer,
                    //     })
                    // }

                    break;
                case ACTIVITE_CONTROLE_TRANSPORT_ID://Contrôle d'accès transport

                    //verifier que l'eleve a souscrit au car en s'assurant qu'il a au moins une echeance
                    const echeancierCar = studentFullData.filter(item => item.idGroupeOptionnel === VBA_GROUPE_RUBRIQUE_TRANSPORT_ID)
                    if (!echeancierCar.length) return reject({ name: "STUDENT_NOT_SUBSCRIBE", message: "Cet élève n'a pas souscrit au car" })

                    controleData = echeancierCar.filter(item => (new Date(item.datelimite) < new Date()))

                    //  controleData = studentFullData.filter(item => (new Date(item.datelimite) < new Date()) && item.idGroupeOptionnel === VBA_GROUPE_RUBRIQUE_TRANSPORT_ID)
                    break;
                default:
                    break;
            }



            //verifier eleve a jour et inserer et recuprer  controle 
            const resteAPayer = controleData.reduce((accumulator, item) => accumulator + item.resteAPayer, 0);
            console.log("🚀 ~ file: services.ts:265 ~ returnnewPromise ~ resteAPayer:", resteAPayer)
            const aJour = (resteAPayer === 0 || resteAPayer < 0 ) ? 1 : 0;
            const accepte = aJour;
            const idControle = await functions.insererControle({ ...data, aJour, accepte: accepte })
            const controle = await functions.listeControles(idControle);

            //recuperer le contact des parents des eleves
            const parents = await functions.fetchParents([idPersonne]);
            // if (parents.length === 0) return reject({ name: "NO_PARENT_PHONE_FOUND", message: "Aucun numéro téléphone trouvé pour les élevès sélectionnés" })
            // Prendre le tuteur
            const tuteurs = parents?.filter(item => item?.filiation === "tuteur");
            // if (tuteurs.length === 0) return reject({ name: "NO_TUTOR_PHONE_FOUND", message: "Aucun numéro téléphone trouvé pour les élevès sélectionnés" })

            const controleRubrique = controleData?.filter(item => item.resteAPayer > 0)?.map(item => ({
                idRubrique: item.idRubrique,
                libelleRubrique: item.libelleRubrique,
                netAPayer: item.netAPayer,
                dejaPaye: item.dejaPaye,
                resteAPayer: item.resteAPayer,
                datelimite: item.datelimite,
                description: item.description
            })
            )

            // const controleRubrique = controleData.reduce((result, item) => {
            //     const existingItem = result.find((x) => x.idRubrique === item.idRubrique);
            //     if (existingItem) {
            //         existingItem.netAPayer += item.netAPayer;
            //         existingItem.dejaPaye += item.dejaPaye;
            //         existingItem.resteAPayer += item.resteAPayer;
            //     } else {
            //         result.push({
            //             idRubrique: item.idRubrique,
            //             libelleRubrique: item.libelleRubrique,
            //             netAPayer: item.netAPayer,
            //             dejaPaye: item.dejaPaye,
            //             resteAPayer: item.resteAPayer
            //         });
            //     }
            //     return result;
            // }, []);


            const studentControleData = {
                idPersonne: idEleve,
                genre,
                nomEleve,
                prenomEleve,
                matriculeEleve,
                libelleClasseCourt,
                libelleClasseLong,
                telephoneTuteur: tuteurs[0]?.numeroCellulaire,
                idControle,
                createdatetime: controle[0].createdatetime,
                operateur: controle[0].operateur,
                idActivite,
                aJour,
                accepte,
                resteAPayer :resteAPayer < 0 ? 0 : resteAPayer ,
                rubrique: controleRubrique
            }
            console.log("🚀 ~ file: services.ts:324 ~ returnnewPromise ~ studentControleData:", studentControleData)

            resolve(studentControleData)
        } catch (error) {
            Logger.error("Error while login user");
            reject(error);
        }
    });
};

/**
 * 
 * @returns 
 */
// export const redisInitSchoolControl_181023 = (studentIds: number[] | null = null): Promise<any> => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             Logger.info("start initializing school control data in redis ")
//             //initialiser data controle frais scolaire si pas deja initialisé
//             const data = await functions.controleEcheanciers(studentIds)
//             await Promise.all(data.map(async (eleve) => {
//                 const studentData = data.filter(item => item.idEleve === eleve.idEleve)
//                 await cacheControleFraisScolaire.set(eleve.idEleve.toString(), studentData)
//             }))
//             Logger.info("initializing school control data in redis successfull ")

//             resolve(true)
//         } catch (error) {
//             Logger.error("initializing school control data in redis failed ")
//             reject(error);
//         }
//     });
// };



export const redisInitSchoolControl = (studentIds: number[] | null = null): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            Logger.info("start initializing school control data in redis ")
            //initialiser data controle frais scolaire si pas deja initialisé

            const data = await functions.controleEcheanciers(studentIds)

            await Promise.all(data.map(async (eleve) => {
                const studentData = data.filter(item => item.idEleve === eleve.idEleve)
                await redisFunctions.hSetJsonData("controlefraisScolaire", `${eleve.idEleve}`, studentData)
                // await cacheControleFraisScolaire.set(eleve.idEleve.toString(), studentData)
            }))
            Logger.info("initializing school control data in redis successfull ")

            resolve(true)
        } catch (error) {
            Logger.error("initializing school control data in redis failed ")
            reject(error);
        }
    });
};


/**
 * Obtenir la liste des actvités
 * @returns 
 */
export const listeactivites = (data): Promise<IActivite[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const activites = await functions.getListeActivites(data);
            resolve(activites);
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Obtenir la liste d'une activité
 * @returns 
 */
export const getSchoolControlActivitiesConfig = (codeEtab: string, anneeScolaire: string, idActivite: string): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const schoolControlConfig = await functions.getSchoolControlActivitiesConfig(idActivite);
            resolve(schoolControlConfig);
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Obtenir la liste de toutes les activités configurées
 * @returns 
 */
const getAllSchoolControlActivitiesConfig = (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            // Recuperer les configurations de school control dans Redis
            const schoolControlConfig = await redisFunctions.getGlobalVariable("schoolControlConfig") as ISchoolControlActivitiesConfig[];
            resolve(schoolControlConfig);
        } catch (error) {
            reject(error);
        }
    });
};


/**
 * Met à jour la configuration d'une activité de contrôle scolaire pour une donnée fournie.
 * @param {ISchoolControlActivitiesConfig} data - Les données de configuration de l'activité.
 * @returns {Promise<any>} - Une promesse résolue avec la configuration mise à jour de l'activité.
 */
export const updateSchoolControlActivityConfig = (data: ISchoolControlActivitiesConfig): Promise<ISchoolControlActivitiesConfig[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            // Appel de la fonction pour mettre à jour la configuration de l'activité
            await functions.updateSchoolControlActivitiesConfig(data);
            // Récupération de la configuration de l'activité mise à jour
            const schoolControlConfig = await functions.getSchoolControlActivitiesConfig(data.idActivite);
            // Résolution de la promesse avec la configuration mise à jour
            resolve(schoolControlConfig);
        } catch (error) {
            // En cas d'erreur, rejeter la promesse et enregistrer une erreur dans les logs
            Logger.error("Error while updating school control activity configuration");
            reject(error);
        }
    });
};


/**
 * Obtenir les credentials d'activaion school control
 * @returns
 */
const getCredentials = (anneeScolaire: string, codeEtab: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            //await checkWarehouseActivatedAndAuthorizedHddSerialNumber();
            const schoolControlService = await redisFunctions.getGlobalVariable("schoolControlService") as any;
            // const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);
            const schoolControlServiceConfig = schoolControlService.config.find(item => item.anneeScolaire === anneeScolaire && item.codeEtab === codeEtab);
            if (!schoolControlServiceConfig) return reject({ name: "SCHOOL_CONTROL_NOT_ACTIVATED", message: "Le service school control n'est pas activé" })
            const { hddSerialNumber, spiderKey } = schoolControlServiceConfig;
            resolve({ spiderKey, hddSerialNumber });
        } catch (error) {
            console.log("🚀 ~ file: services.ts ~ line 155 ~ returnnewPromise ~ error", error)
            reject(error);
        }
    });
};

/**
 * Active ou désactive une activité de contrôle scolaire en fonction des données fournies.
 * @param {ISchoolControlActivityStatusUpdate} donne - Les données pour activer ou désactiver l'activité.
 * @returns {Promise<any>} - Une promesse résolue avec les données mises à jour.
 */
const toggleSchoolControlActivityStatus = (donne: ISchoolControlActivityStatusUpdate): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            // Appel de la fonction pour activer ou désactiver l'activité de contrôle scolaire
            await functions.toggleSchoolControlActivityStatus(donne);
            // Récupération de toutes les configurations des activités de contrôle scolaire
            const data = await functions.getAllSchoolControlActivitiesConfig();
            // Récupération de la liste de toutes les activités
            const listeActivites = await functions.getListeActivites();
            // Fusion des données
            const mergeData = merge2ArraysOfObjects(data, listeActivites, "idActivite");
            // Enregistrement des données fusionnées dans Redis
            await redisFunctions.addGlobalVariable("schoolControlConfig", mergeData);
            // Résolution de la promesse avec les données mises à jour
            resolve(mergeData);
        } catch (error) {
            // Rejet de la promesse en cas d'erreur
            reject(error);
        }
    });
};


/**
 *  Cette fonction permet d'insérer ou de mettre à jour des utilisateurs dans la configuration des activités scolaires de l'établissement.
 * @returns 
 */
const updateUserActivitiesInSchoolControlConfig = (data: ISchoolControlActivitiesUsers): Promise<ISchoolControlActivitiesConfig[]> => {
    // Destructuration des données d'entrée
    const { codeEtab, anneeScolaire, idActivities, user } = data;
    return new Promise(async (resolve, reject) => {
        try {
            // On récupère la liste de toutes les activités depuis Redis
            const allSchoolControlActivities = await redisFunctions.getGlobalVariable("schoolControlConfig") as ISchoolControlActivitiesConfig[];
            // Vérifier si des activités sont configurées
            if (!allSchoolControlActivities.length) {
                return reject({ name: "ACTIVITIES_NOT_FOUND", message: "Aucune activité n'a été configurée." });
            }
            // Parcourir chaque activité configurée
            for (const activity of allSchoolControlActivities) {
                // Rechercher l'index de l'utilisateur dans la liste des utilisateurs de l'activité
                const userIndex = activity.config.users?.findIndex((item) => item?.userId === user?.userId);

                // Vérifier si l'utilisateur a déjà été ajouté à l'activité
                if (userIndex > -1) {
                    // Si oui, vérifier si l'activité en cours n'est pas contenue dans la liste des activités attribuées à l'utilisateur (payload)
                    if (!idActivities.includes(activity.idActivite)) {
                        // Si oui, retirer l'utilisateur de la liste des utilisateurs
                        const updatedUsers = [
                            ...activity.config.users.slice(0, userIndex),
                            ...activity.config.users.slice(userIndex + 1)
                        ];
                        const updatedActivity = { ...activity, config: { ...activity.config, users: updatedUsers } };
                        await functions.updateSchoolControlActivitiesConfig(updatedActivity);
                    } // Sinon, ne rien faire car l'utilisateur est déjà ajouté à l'activité
                } else {
                    // Si l'utilisateur n'a pas encore été ajouté à l'activité
                    // Vérifier si l'activité en cours est contenue dans la liste des activités attribuées à l'utilisateur(payload)
                    if (idActivities.includes(activity.idActivite)) {
                        // Si oui, ajouter l'utilisateur à la liste des utilisateurs
                        const updatedActivity = { ...activity };
                        updatedActivity.config.users.push(user);
                        await functions.updateSchoolControlActivitiesConfig(updatedActivity);
                    }
                }
            }
            // Récupérer toutes les configurations des activités scolaires
            const schoolControlConfigData = await functions.getAllSchoolControlActivitiesConfig();
            // Récupérer la liste de toutes les activités
            const listeActivites = await functions.getListeActivites();
            // Fusionner les deux tableaux précédents en fonction de l'identifiant de l'activité (idActivite)
            const mergeData = merge2ArraysOfObjects(schoolControlConfigData, listeActivites, "idActivite");
            // Enregistrer les données fusionnées dans Redis
            await redisFunctions.addGlobalVariable("schoolControlConfig", mergeData);
            // Résoudre la promesse avec les données fusionnées
            resolve(mergeData);
        } catch (error) {
            console.log("🚀 ~ file: services.ts:230 ~ returnnewPromise ~ error:", error);
            // Rejeter la promesse en cas d'erreur
            reject(error);
        }
    });
};


/**
 * Cette fonction permet de basculer l'état (activer ou désactiver) des utilisateurs dans les activités de contrôle scolaire.
 * @returns 
 */
const toggleSchoolControlActivitiesUserStatus = (data: ISchoolControlActivitiesUsers): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            // Destructuration des données d'entrée
            const { user, status } = data;
            // Récupération de la liste de toutes les activités depuis Redis
            const allSchoolControlActivities = await redisFunctions.getGlobalVariable("schoolControlConfig") as ISchoolControlActivitiesConfig[];
            // Vérifier si des activités sont configurées
            if (!allSchoolControlActivities?.length) {
                return reject({ name: "ACTIVITIES_NOT_FOUND", message: "Aucune activité n'a été configurée." });
            }
            // Parcourir chaque activité configurée
            for (const items of allSchoolControlActivities) {
                // Chercher l'index de l'utilisateur dans la liste des utilisateurs de l'activité
                const findIndex = items.config.users?.findIndex((item) => item?.userId === user?.userId);
                // Si l'utilisateur est trouvé
                if (findIndex > -1) {
                    // Mettre à jour l'état de l'utilisateur
                    const usersData = [...items.config.users.slice(0, findIndex), { ...user, status: status }, ...items.config.users.slice(findIndex + 1)];
                    const updatedConfigData = { ...items, config: { ...items.config, users: usersData } };
                    // Appeler la fonction pour mettre à jour la configuration de l'activité
                    await functions.updateSchoolControlActivitiesConfig(updatedConfigData);
                }
            }
            // Récupérer toutes les configurations des activités de contrôle scolaire
            const schoolControlConfigData = await functions.getAllSchoolControlActivitiesConfig();
            // Récupérer la liste de toutes les activités
            const listeActivites = await functions.getListeActivites();
            // Fusionner les deux tableaux précédents en fonction de l'identifiant de l'activité (idActivite)
            const mergeData = merge2ArraysOfObjects(schoolControlConfigData, listeActivites, "idActivite");
            // Enregistrer les données fusionnées dans Redis
            await redisFunctions.addGlobalVariable("schoolControlConfig", mergeData);
            // Résoudre la promesse avec les données fusionnées
            resolve(mergeData);
        } catch (error) {
            // Rejeter la promesse en cas d'erreur
            reject(error);
        }
    });
};


/**
 * Cette fonction insère ou met à jour les paramètres des activités de contrôle scolaire.
 * @returns 
 */
const updateSchoolControlActivitiesParams = (data: ISchoolControlActivitiesConfig): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            let newData: ISchoolControlActivitiesConfig;
            // On essaie de récupérer la configuration de l'activité
            const schoolControlConfig = await functions.getSchoolControlActivitiesConfig(data.idActivite);
            // Si elle n'existe pas, on l'insère
            if (!schoolControlConfig.length) {
                newData = { ...data, config: { params: data.config.params, users: [] } };
                await functions.insererSchoolControlActivitiesConfig(newData);
            } else {
                // Si elle existe, on met à jour les paramètres tout en conservant les utilisateurs existants
                newData = { ...schoolControlConfig[0], config: { params: data.config.params, users: [...schoolControlConfig[0].config.users] } };
                await functions.updateSchoolControlActivitiesConfig(newData);
            }

            // On récupère toutes les configurations des activités de contrôle scolaire
            const schoolControlConfigData = await functions.getAllSchoolControlActivitiesConfig();
            // On récupère également la liste de toutes les activités
            const listeActivites = await functions.getListeActivites();
            // On fusionne les deux tableaux précédents en fonction de idActivite
            const mergeData = merge2ArraysOfObjects(schoolControlConfigData, listeActivites, "idActivite");
            // Enregistrement des données fusionnées dans Redis
            await redisFunctions.addGlobalVariable("schoolControlConfig", mergeData);
            // Résoudre la promesse avec les données fusionnées
            resolve(mergeData);
        } catch (error) {
            console.log("🚀 ~ file: services.ts:230 ~ returnnewPromise ~ error:", error);
            // Rejeter la promesse en cas d'erreur
            reject(error);
        }
    });
};

/**
 *  Obtenir la liste des controles effectues
 * @returns 
 */
export const listeControles = (idControle:number = null): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const controles = await functions.listeControles(idControle);
            if (!controles.length) return resolve([]);
            const idEleves: number[] = [];
            controles.map(item => !idEleves.includes(item.idPersonne) && idEleves.push(item.idPersonne))
            const eleves = await functions.getEleveWithClasse(idEleves);

            const controleWithData = controles.map(item => {
                const personneData = eleves.find(item2 => item2.idPersonne === item.idPersonne)
                return { ...item, ...personneData }
            })
            resolve(controleWithData);
        } catch (error) {
            console.log("🚀 ~ file: services.ts:628 ~ returnnewPromise ~ error:", error)
            reject(error);
        }
    });
};

/**
 *  Récuperer tous les sms de school control de la boite d'envoi
 * @returns 
 */
const fetchSchoolControlSendBoxSms = (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const controles = await listeControles();
            const sendBoxSms = await functions.fetchSchoolControlSendBoxSms() as ISendBoxMessages[];
            const idEleves: number[] = [];
            controles.map(item => !idEleves.includes(item.idPersonne) && idEleves.push(item.idPersonne))
            const parents = await functions.fetchParents(idEleves);
            const mergedStudentsAndSms = merge2ArraysOfObjects(sendBoxSms, controles, "idPersonne");
            const mergedStudentsAndParents = merge2ArraysOfObjects(mergedStudentsAndSms, parents, "idPersonne");
            resolve(mergedStudentsAndParents);
        } catch (error) {
            console.log("🚀 ~ file: services.ts:690 ~ returnnewPromise ~ error:", error)
            reject(error);
        }
    });
};

/**
 * Obtenir la liste des pointages effectué
 * @returns 
 */
export const listePointages = (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            //obtenir la liste de tous les pointages effectué et separer les pointages personnel des eleves
            const pointages = await functions.listePointages();
            if (!pointages.length) return resolve([]);
            const idEleves: number[] = [];
            const idPersonnels: number[] = [];
            pointages.map(item => {
                if (!idEleves.includes(item.idPersonne) && [ACTIVITE_POINTAGE_APPRENANT_ID, ACTIVITE_POINTAGE_CANTINE_ID, ACTIVITE_POINTAGE_CAR_ID].includes(item.idActivite)) {
                    idEleves.push(item.idPersonne)
                }
                if (!idPersonnels.includes(item.idPersonne) && item.idActivite === ACTIVITE_POINTAGE_PERSONNEL_ID) {
                    idPersonnels.push(item.idPersonne)
                }
            })


            const eleves = idEleves.length ? await functions.getEleveWithClasse(idEleves) : [];
            const personnels = idPersonnels.length ? await functions.getPersonnelWithFonction(idPersonnels) : [];
            const pointagesWithPersonneData = pointages.map(item => {
                const personneData = item.idActivite === ACTIVITE_POINTAGE_PERSONNEL_ID ? personnels.find(item2 => item2.idPersonnel === item.idPersonne) : eleves.find(item2 => item2.idPersonne === item.idPersonne)
                return { ...item, ...personneData }
            })
            resolve(pointagesWithPersonneData);
        } catch (error) {
            console.log("🚀 ~ file: services.ts:628 ~ returnnewPromise ~ error:", error)
            reject(error);
        }
    });
};

/**
 * obtenir le compte sms d'un etablissement pour un fournisseur donné
 */
const getSmsAccount = (codeEtab: string, providerId: number) => {
    return new Promise(async (resolve, reject) => {
        try {
            const smsUrl = `${GLOBAL_API_BASE_URL}/sms/etabsmsaccounts`
            const axiosRes: any = await fetchPublicRoute(smsUrl, { codeEtab, providerId })
            const etabSmsAccounts = axiosRes.data as ISmsAccount;
            resolve(etabSmsAccounts)
        } catch (error) {
            reject(error);
        }
    });
};

/**
 *  mettre a jour decison apres controle, marquer l'eleve comme accepté 
 * @param idControle 
 * @returns 
 */
export const controleDecision = (idControle: number, decision: number): Promise<number> => {
    return new Promise(async (resolve, reject) => {
        try {
            // decision: 1 --> accepté ; 0 --> refusé
            // On execute que si la décision du contrôle est accepté
            decision === 1 && await functions.updateControleDecison(idControle, decision);
            resolve(idControle);
        } catch (error) {
            console.log("🚀 ~ file: services.ts:735 ~ returnnewPromise ~ error:", error)
            reject(error);
        }
    });
};

export const sendSchoolControlSms = (decision: number, idPersonne: number, telephoneTuteur: string, nomPrenomEleve: string, resteAPayer: number, idActivite: string, idControle: number): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab", "default_sms_provider"]);
            // const { idPersonne, providerId, telephoneTuteur, smsKey } = data
            const sessionId = uuid.v4();
            const todayDateTime = getTodayDateTime();
            const smsDestinataireKey = "schoolControlParentsEleves"
            // Activités pour lesquelles on envoie des sms pour le moment
            const activiteAutorise = ["ASC005"]
            if (!activiteAutorise.includes(idActivite)) return reject({ name: "ACTIVITY_NOT_ALLOWED", message: "Cette activité n'utilise pas les sms." })
            if (!telephoneTuteur) return reject({ name: "PHONE_NOT_DEFINED", message: "Aucun numéro de télephone defini." })
            // Nous récupérons le compte SMS qui a été choisi pour l'envoi de SMS à School Control, 
            // ainsi que la confirmation de l'option d'envoyer des SMS après chaque contrôle sur ce même compte.
            // Après ça on récupère le providerId en local
            const smsAccountsInLocal = await functions.getSchoolControlSmsAccount() as ISmsAccount[]
            if (smsAccountsInLocal.length === 0) return reject({ name: "NO_SMS_ACCOUNT_FOUND", message: "Vous n'avez pas de compte sms" });
            const providerId = smsAccountsInLocal[0].providerId

            //pour le provider defini, verifier qu'il existe des comptes sms associé en ligne
            const allSmsAccount = await getSmsAccount(codeetab, providerId) as ISmsAccount[]
            if (allSmsAccount.length === 0) return reject({ name: "NO_SMS_ACCOUNT_FOUND", message: "Vous n'avez pas de compte sms" });
            // On vérifie que ce qui est en ligne correspond à ce qui est en local
            const smsAccount = allSmsAccount.find(item => item.providerId === providerId);
            if (!smsAccount) return reject({ name: "NO_SMS_ACCOUNT_FOUND", message: "Aucun compte sms trouvé pour ce provider" });

            // Concevoir les messages
            const deniedOrAccepted: { [x: number]: string } = {
                0: `refusé`,
                1: `exceptionnellement toléré`
            }
            // Accès au portail exceptionnellement toléré pour  NDJABO JOEL ELMANUEL KOUASSI. Somme due:50000 F .
            const messageContent = `Accès au portail ${deniedOrAccepted[decision]} pour ${nomPrenomEleve}.Somme due: ${resteAPayer}`

            const sms = [
                anscol1,
                codeetab,
                sessionId,
                idPersonne,
                smsDestinataireKey,
                telephoneTuteur,
                messageContent,
                todayDateTime
            ]
            // On enregistre d'abord le sms dans la boite d'envoi
            await functions.insertSendBoxSms(sms);
            //recuperer les sms non envoyé dans la boite d'envoi pour une ou plusieurs sessions
            const sendBoxSms = await fetchSendBoxSmsNotSent([sessionId]);
            console.log("🚀 ~ file: services.ts:819 ~ returnnewPromise ~ sendBoxSms:", sendBoxSms)
            //envoyer maintenant chaque sms vers les destinataires
            // const smsResult = await envoiSmsProvider(smsAccount, telephoneTuteur, messageContent);
            // console.log("🚀 ~ file: services.ts:821 ~ returnnewPromise ~ smsResult:", smsResult)
            // //marquer les sms comme etant envoyé ou non dans la bd
            // const sentAt = smsResult.sms_send_status ? isoDateToDateTime(Date.now()) : null;
            // const smsLocked = smsResult.sms_send_status ? 1 : 0;
            // console.log("🚀 ~ file: services.ts:825 ~ returnnewPromise ~ smsLocked:", smsLocked)
            // const smsSendResultArray = [
            //     anscol1,
            //     codeetab,
            //     sendBoxSms[0].smsId,
            //     sendBoxSms[0].sessionId,
            //     providerId,
            //     smsResult.sms_messageId,
            //     sendBoxSms[0].idPersonne,
            //     sendBoxSms[0].smsDestinataireKey,
            //     sendBoxSms[0].phone,
            //     sendBoxSms[0].smsContent,
            //     smsLocked,
            //     sentAt,
            //     isoDateToDateTime(sendBoxSms[0].createdAt)
            // ];
            // console.log("🚀 ~ file: services.ts:842 ~ returnnewPromise ~ smsSendResultArray:", smsSendResultArray)
            // await updateSendBoxMessagesSmsData(smsSendResultArray);
            await Promise.all(
                sendBoxSms.map(async smsItem => {
                    const smsResult = await envoiSmsProvider(smsAccount, smsItem.phone, smsItem.smsContent);
                    //marquer les sms comme etant envoyé
                    const sentAt = smsResult.sms_send_status ? isoDateToDateTime(Date.now()) : null;
                    const smsLocked = smsResult.sms_send_status ? 1 : 0;
                    return [
                        smsItem.anneeScolaire,
                        smsItem.codeEtab,
                        smsItem.smsId,
                        smsItem.sessionId,
                        providerId,
                        smsResult.sms_messageId,
                        smsItem.idPersonne,
                        smsItem.smsDestinataireKey,
                        smsItem.phone,
                        smsItem.smsContent,
                        smsLocked,
                        sentAt,
                        isoDateToDateTime(smsItem.createdAt)
                    ];
                })
            ).then(async smsSendResultArray => {
                console.log("🚀 ~ file: services.ts:999 ~ returnnewPromise ~ smsSendResultArray:", smsSendResultArray)
                await updateSendBoxMessagesSmsData(smsSendResultArray);
            });
            const sendBoxSmsFinal = await functions.fetchSchoolControlSendBoxSms([sessionId]) as ISendBoxMessages[];
            const controles = await listeControles(idControle);
            const parents = await functions.fetchParents([controles[0].idPersonne]);
            const mergedStudentsAndSms = merge2ArraysOfObjects(sendBoxSmsFinal, controles, "idPersonne");
            const mergedStudentsAndParents = merge2ArraysOfObjects(mergedStudentsAndSms, parents, "idPersonne");
            console.log("🚀 ~ file: services.ts:876 ~ returnnewPromise ~ mergedStudentsAndParents:", mergedStudentsAndParents)
            resolve(mergedStudentsAndParents[0]);
        } catch (error) {
            console.log("🚀 ~ file: services.ts:818 ~ returnnewPromise ~ error:", error)
            reject(error);
        }
    });
};



const getPersonnlAdministrative = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const personnelAdmins = await functions.getPersonnlAdministrative()
            resolve(personnelAdmins)
        } catch (error) {
            reject(error);
        }
    });
};

export default {
    effectuerPointage,
    historiquePointage,
    listeactivites,
    controleFraisScolaire,
    redisInitSchoolControl,
    getSchoolControlActivitiesConfig,
    updateSchoolControlActivityConfig,
    getCredentials,
    toggleSchoolControlActivityStatus,
    updateUserActivitiesInSchoolControlConfig,
    updateSchoolControlActivitiesParams,
    toggleSchoolControlActivitiesUserStatus,
    getAllSchoolControlActivitiesConfig,
    listeControles,
    listePointages,
    controleDecision,
    getPersonnlAdministrative,
    sendSchoolControlSms,
    fetchSchoolControlSendBoxSms
}