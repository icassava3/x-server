import { fetchFromMsAccess, paramEtabObjet } from "../databases/accessDB";
import redisFunctions from "../databases/redis/functions";
import { webclientlogin } from "../spider-client/spider-authentification-clent-web/services";
import servicesProfExpert from "../spider-prof-expert/services";
import servicesWarehouse from "../spider-whserver/services";
import { dataCnx } from './../databases/accessDB';
import { IUser } from './../spider-school-control/interfaces';
import functions from "./functions";

/**
 * Obtenir les parametres de l'etablissement
 * @returns 
 */
export const paramEtab = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab", "AnScol2", "BPEtab", "DRENComplet",
                "DRENouDDEN", "DREN", "Fondateur", "NomChefEtab", "NomCompletEtab", "NomEtabAbr", "TélChefEtab", "TélCorrespondant", "TelEtab", "TélFondateur", "modeCalc", "DecoupSemestres"]);;
            const { anscol1, codeetab } = paramObj;
            const etabData = {
                anneeScolaire: anscol1,
                codeEtab: codeetab,
                paramEtab: { ...paramObj, modeCalc: paramObj.modeCalc || 1 }
            }
            resolve(etabData);
        } catch (error) {
            reject(error);
        }
    });
};


/**
 * Authentification d'un super admin ou d'un spider agent
 * @param data 
 * @returns 
 */
export const authentification = (data: { userLogin: string, userPassword: string }): Promise<IUser> => {
    return new Promise(async (resolve, reject) => {
        try {

           const user = webclientlogin(data);
           resolve(user);
            /*
            const userLogin = data.userLogin.toLowerCase();
            const userPassword = data.userPassword;
            const spiderSuperAdmins = await redisFunctions.getSecureData("spiderSuperAdmins") as any;
            const spiderAgents = await redisFunctions.getSecureData("spiderAgents") as any;
            const spiderUsers = await redisFunctions.getSecureData("spiderUsers") as any;
            if (!spiderSuperAdmins && !spiderAgents && !spiderUsers) return reject({ name: "", message: "Veuillez demarrer spider" })

            //rechercher user parmi les super admins
            console.log("🚀 ~ file: services.ts:46 ~ returnnewPromise ~ spiderSuperAdmins:", spiderSuperAdmins)
            let user: IUser = spiderSuperAdmins.find(spiderUserItem => spiderUserItem.username.toLowerCase() === userLogin && spiderUserItem.password === userPassword)
            if (user) return resolve(user);

            //rechercher user parmi les spider agents
            console.log("🚀 ~ file: services.ts:52 ~ returnnewPromise ~ spiderAgents:", spiderAgents)
            user = spiderAgents.find(spiderAgtItem => spiderAgtItem.username.toLowerCase() === userLogin && spiderAgtItem.password === userPassword)
            if (user) return resolve(user);

            //rechercher user parmi les simple utilisateur
            console.log("🚀 ~ file: services.ts:58 ~ returnnewPromise ~ spiderUsers:", spiderUsers)
            user = spiderUsers.find(spiderUsItem => spiderUsItem.username.toLowerCase() === userLogin && spiderUsItem.password === userPassword)
            if (user) return resolve(user);
            reject({ name: "USER_NOT_FOUND", message: "Login ou mot de passe incorrect." });*/
        } catch (error) {
            console.log(":fusée: ~ file: services.ts:51 ~ returnnewPromise ~ error", error)
            reject(error);
        }
    });
};


/**
 * Verifier un utilisateur a le droit 
 * @param spdUser 
 * @param fonctionnalite 
 * @returns 
 */
export function checkUserHasRight(spdUser: string, fonctionnalite: string) {
    return new Promise(async (resolve, reject) => {
        try {
            const spiderSuperAdmins = await redisFunctions.getGlobalVariable("spiderSuperAdmins") as any;
            let user: IUser = spiderSuperAdmins.find(spiderUserItem => spiderUserItem.username === spdUser)
            if (user) return resolve(true);
            const spiderAgents = await redisFunctions.getGlobalVariable("spiderAgents") as any;
            user = spiderAgents.find(item => item.username === spdUser)
            if (user) return resolve(true);

            const sql = `SELECT user FROM UsysDroits WHERE [UsysDroits].[User]="${spdUser}" AND [UsysDroits].[nom_form_ou_proc]="${fonctionnalite}"`;
            const result: any = await fetchFromMsAccess(sql, dataCnx);
            if (result.length) {
                resolve(true);
            } else {
                reject(false);
            }
        } catch (error) {
            console.log("🚀 ~ file: functions.ts ~ line 43 ~ returnnewPromise ~ error", error)
            reject(error);
        }
    });
}



/**
 * renvoyer a nouveau les actions http qui ont echoué
 * @param logIds 
 * @returns 
 */
export const resendHttpFailedAction = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const logs: any = await functions.fetchHttpFailsLogs();
            if (logs.length === 0) {
                return reject({ name: "NO_FAILED_ACTION", message: "Aucun logs n’a été trouvé" });
            }
            let successLogsIds = []; //pour stocker les id des logs qui ont été correctement renvoyé
            await Promise.all(
                logs.map(async (log) => {
                    //pour chaque log, determiner l'action a effectuer et executer la fonction cinetpay correspondante
                    const payload = JSON.parse(log.payload);
                    const action = log.action;
                    const logId = log.id;
                    switch (action) {
                        case "ENVOYER_PARAM_ETAB":
                            await servicesWarehouse.envoyerParamEtab(payload, false);
                            successLogsIds = [...successLogsIds, logId];
                            break;
                        case "ENVOYER_ELEVE":
                            await servicesWarehouse.envoyerEleves(payload, false);
                            successLogsIds = [...successLogsIds, logId];
                            break;
                        case "SUPPRIMER_ELEVE":
                            await servicesWarehouse.supprimerEleves(payload, false);
                            successLogsIds = [...successLogsIds, logId];
                            break;
                        case "ENVOYER_VERSEMENT":
                            await servicesWarehouse.envoyerVersement(payload, false);
                            successLogsIds = [...successLogsIds, logId];
                            break;
                        case "SUPPRIMER_VERSEMENT":
                            await servicesWarehouse.supprimerVersement(payload, false);
                            successLogsIds = [...successLogsIds, logId];
                            break;
                        case "ENVOYER_CLASSE":
                            await servicesWarehouse.envoyerClasses(payload, false);
                            successLogsIds = [...successLogsIds, logId];
                            break;
                        case "SUPPRIMER_CLASSE":
                            await servicesWarehouse.supprimerClasses(payload, false);
                            successLogsIds = [...successLogsIds, logId];
                            break;
                        case "ENVOYER_CLASSE_MATIERE_PROF":
                            await servicesWarehouse.envoyerClassesMatiereProf(payload, false);
                            successLogsIds = [...successLogsIds, logId];
                            break;
                        case "ENVOYER_PERSONNEL":
                            await servicesWarehouse.sendPersonnel(payload, false);
                            successLogsIds = [...successLogsIds, logId];
                            break;
                        case "SUPPRIMER_PERSONNEL":
                            await servicesWarehouse.deletePersonnel(payload, false);
                            successLogsIds = [...successLogsIds, logId];
                            break;
                        case "ENVOYER_PLANNING":
                            await servicesWarehouse.sendPlanning(payload, false);
                            successLogsIds = [...successLogsIds, logId];
                            break;
                        case "ENVOYER_MATIERE":
                            await servicesWarehouse.sendMatieres(payload, false);
                            successLogsIds = [...successLogsIds, logId];
                            break;

                        case "ENVOYER_PROGRAMATION_EVALUATIONS":
                            await servicesWarehouse.sendEvalProg(payload, false);
                            successLogsIds = [...successLogsIds, logId];
                            break;
                        case "SUPPRIMER_PROGRAMATION_EVALUATIONS":
                            await servicesWarehouse.deleteEvalProg(payload, false);
                            successLogsIds = [...successLogsIds, logId];
                            break;

                        case "ENVOYER_NOTES_EVALUATIONS":
                            await servicesWarehouse.sendEvaluationNotes(payload, false);
                            successLogsIds = [...successLogsIds, logId];
                            break;
                        case "SUPPRIMER_NOTES_EVALUATIONS":
                            await servicesWarehouse.deleteEvalNotes(payload, false);
                            successLogsIds = [...successLogsIds, logId];
                            break;
                        case "ENVOYER_ECHEANCIER_INDIVIDUEL":
                            await servicesWarehouse.envoyerEcheancierIndividuel(payload, false);
                            successLogsIds = [...successLogsIds, logId];
                            break;
                        case "ENVOYER_VERSEMENT":
                            await servicesWarehouse.envoyerVersement(payload, false);
                            successLogsIds = [...successLogsIds, logId];
                            break;
                        case "SUPPRIMER_VERSEMENT":
                            await servicesWarehouse.supprimerVersement(payload, false);
                            successLogsIds = [...successLogsIds, logId];
                            break;
                        case "ENVOYER_MODELE_PLAGE_HORAIRE":
                            await servicesWarehouse.sendModelePlageHoraires(false);
                            successLogsIds = [...successLogsIds, logId];
                            break;
                        case "ENVOYER_APPEL_ASSIDUITE":
                            await servicesProfExpert.reenvoiAppelEnligne(payload, false);
                            successLogsIds = [...successLogsIds, logId];
                            break;
                        case "SYNCHRONISER_APPEL_ASSIDUITE":
                            await servicesProfExpert.marquerAppelAssiduiteSynchronise(payload, false);
                            successLogsIds = [...successLogsIds, logId];
                            break;
                        // case "JUSTIFIER_ASSIDUITE":
                        //     await servicesAppelAssiduite.justifieAssiduite(payload, false);
                        //     successLogsIds = [...successLogsIds, logId];
                        //     break;
                    }

                })
            );

            await functions.setHttpFailsLogsSuccess(successLogsIds);
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
};



export default {
    paramEtab,
    resendHttpFailedAction,
    authentification,
    checkUserHasRight
}