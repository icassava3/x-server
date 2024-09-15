import axios from 'axios';
import { fetchPrivateRoute, fetchPublicRoute } from "../helpers/apiClient";
import { FOCUS_ECOLE_BASE_URL, GLOBAL_API_BASE_URL } from "../helpers/constants";
import { convertDateToLocaleStringDate, getPeriodeData, getTodayDateTime, isoDateToDateTime, merge2ArraysOfObjects, regrouperEvaluationParEleve, voyelles } from '../helpers/function';
import functionsVba from "../spider-whserver/functions-vba";
import { paramEtabObjet } from './../databases/accessDB';
import { FOCUS_APP_ID, MESSAGE_LOCKED_STATUS, MESSAGE_UNLOCKED_STATUS, SMS_PROVIDER_EDIATTAH_ID, SMS_PROVIDER_SPIDER_ID, SMS_PROVIDER_SYMTEL_ID, initialMiniBull2ndeATableBody, initialMiniBullLiteratureTableBody, initialMiniBullScienceTableBody, initialMiniBullTableBody, initialMiniBullTleA1TableBody } from './constants';
import functions from './functions';
import { IEleveMoyenne, IFournisseur, IMessageFocusServer, IPayloadEnvoyerMessagesAssiduite, IPayloadEnvoyerNotificationResultatsScolaires, IPayloadEnvoyerSmsAssiduite, IPayloadEnvoyerSmsResultatScolaire, IPayloadInsererSmsBoiteEnvoi, IPayloadMessageGroupe, IPayloadMoyenne, IPayloadNewSmsAccount, IPayloadVbaSmsToSendBox, IPointAssiduitesEleves, ISendBoxMessages, ISmsAccount } from "./interfaces";

const uuid = require("uuid");
const https = require('https');
const _ = require('lodash');

const agent = new https.Agent({
    rejectUnauthorized: false,
    minVersion: 'TLSv1',
});

/**
 * Obtenir le credit sms restant pour un provider de l'etablissement
 * @returns 
 */
export const creditSms = (providerIdStr: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            // await checkWarehouseActivatedAndAuthorizedHddSerialNumber();
            const { codeetab } = await paramEtabObjet(["CodeEtab"]);

            //recuprer les compte sms de l'etablissement depuis globalApi
            const providerId: number = parseInt(providerIdStr);

            const etabAllSmsAccount = await getSmsAccount(codeetab, providerId) as ISmsAccount[]
            const smsAccount = etabAllSmsAccount.find(item => item.providerId === providerId);

            //demander le credit suivant le provider
            const { amount, price } = await getBalance(smsAccount);

            //obtenir le nombre de sms pour le montant ontenu
            const smsCount = Math.trunc(amount / price);

            resolve({
                amount,
                price,
                smsCount,
            });
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * creer ou mettre a jour un compte sms 
 * @returns 
 */
const createOrUpdateSmsAccount = (data: IPayloadNewSmsAccount) => {
    return new Promise(async (resolve, reject) => {
        try {
            // await checkWarehouseActivatedAndAuthorizedHddSerialNumber();
            const { codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);
            data.price = (["000216", "009917", "041603", "000000"].includes(codeetab)) ? 13 : 10;
            //creer ou maj le compte en ligne
            const apiPayload = { ...data, codeEtab: codeetab }
            const apiUrl = `${GLOBAL_API_BASE_URL}/sms/newsmsaccount`;
            console.log("🚀 ~ file: services.ts:52 ~ returnnewPromise ~ apiUrl:", apiUrl)
            const response: any = await fetchPrivateRoute(apiUrl, apiPayload)
            console.log("🚀 ~ file: services.ts:52+++++++++++++++++ ~ returnnewPromise ~ response:", response)

            // Si ce compte est utilisé pour l'envoi de SMS pour le contrôle scolaire,
            // mettez à zéro les champs sendSmsAfterControl des autres comptes SMS de l'établissement.
            if (data?.sendSmsAfterControl === 1) {
                await functions.disableSchoolControlOthersAccount();
            }
            // Si ce compte est utilisé pour l'envoi de SMS pour l'appel numérique,
            // mettez à zéro les champs sendSmsAppel des autres comptes SMS de l'établissement.
            if (data?.sendSmsAppel === 1) {
                await functions.disableSmsAppelOthersAccount();
            }

            //creer ou maj le compte en local
            const allSmsAccount = await functions.listeCompteSms();
            const smsAccountFound = allSmsAccount.find(item => item.providerId === data.providerId);
            if (smsAccountFound) {
                // Si dans le payload qui vient on a sendSmsAfterControl on le prend sinon prendre ce qui est dans la bd, pareil pour sendSmsAppel
                await functions.updateSmsAccount({
                    ...data,
                    sendSmsAfterControl: (data?.sendSmsAfterControl === 0 || data?.sendSmsAfterControl === 1) ? data.sendSmsAfterControl : smsAccountFound.sendSmsAfterControl,
                    sendSmsAppel: (data?.sendSmsAppel === 0 || data?.sendSmsAppel === 1) ? data.sendSmsAppel : smsAccountFound.sendSmsAppel
                });
            } else {
                await functions.createSmsAccount({ ...data, sendSmsAfterControl: data?.sendSmsAfterControl || 0, sendSmsAppel: data?.sendSmsAppel || 0 });
            }

            resolve(response.data)
        } catch (error) {
            console.log("🚀 ~ file: services.ts:63 ~ returnnewPromise ~ error:", error)
            reject(error);
        }
    });
};

/**
 * envoyer sms depuis vba
 */
const sendSmsVba = (providerId: number) => {
    return new Promise(async (resolve, reject) => {
        const sessionId = uuid.v4()
        try {
            const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);

            //recuperation etablissement compte sms 
            const allSmsAccount = await getSmsAccount(codeetab, providerId) as ISmsAccount[]
            const smsAccount = allSmsAccount.find(item => item.providerId === providerId);

            if (!smsAccount) return reject({ name: "NO_SMS_ACCOUNT", message: "Aucun compte sms trouvé associé à ce fournisseur" });

            //Marquer et recupper les messages en attente d'etre envoyé dans vba
            const vbaSendBoxSms = await functions.markAndFetchMessageToSend(sessionId, providerId);
            if (!vbaSendBoxSms.length) return reject({ name: "SENDBOX_EMPTY", message: "La boite d'envoi est vide" });

            const smsArray = [];//pour contenir la liste des sms suivant associé a chaque numero individuellement
            const sendBoxSmsType2 = [];//sms groupé (1 sms plusieur destinataire)
            const sendBoxSmsType1_3 = [];//sms individuel

            //separé les sms groupé des sms individuel
            vbaSendBoxSms.map(item => {
                if (item.typeSms === 2) sendBoxSmsType2.push(item)
                else sendBoxSmsType1_3.push(item)
            })

            //transformation sms groupé en sms individuel
            sendBoxSmsType2.map(item => {
                const phonesArray = item.numeroTelephone.split(';');
                phonesArray.map(phoneItem => smsArray.push({
                    numeroTelephone: phoneItem,
                    libelleMessage: item.libelleMessage,
                }));
            });

            //sms individuel
            sendBoxSmsType1_3.map(item => smsArray.push({
                numeroTelephone: item.numeroTelephone,
                libelleMessage: item.libelleMessage,
            }));

            //envoyer maintenant chaque sms vers les destinataires
            await Promise.all(
                smsArray.map(async smsItem => {
                    try {
                        await envoiSmsProvider(smsAccount, smsItem.numeroTelephone, smsItem.libelleMessage);
                    } catch (error) {
                        console.log("🚀 ~ file: services.ts:142 ~ returnnewPromise ~ error:", error)
                    }
                })
            )

            await functions.setMessageAsSent(sessionId, smsAccount.sender)
            resolve(sessionId)
        } catch (error) {
            console.log("🚀 ~ file: services.ts:167 ~ returnnewPromise ~ error:", error)
            await functions.unlockMessages(sessionId)
            reject(error);
        }
    });
};


/**
 * envoyer sms via depuis vba
 */
// const sendSmsVba = (io, providerId: number) => {
//     return new Promise(async (resolve, reject) => {
//         const sessionId = uuid.v4()
//         try {

//             //verification websms activé
//             const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);
//             const todayDateTime = getTodayDateTime();

//             // //verification etablissement compte sms 
//             const allSmsAccount = await getSmsAccount(codeetab, providerId) as ISmsAccount[];
//             const smsAccount = allSmsAccount.find(item => item.providerId === providerId);

//             //Marquer et recupper les messages en attente d'etre envoyé dans vba
//             const vbaSendBoxSms = await functions.markAndFetchMessageToSend(sessionId, providerId);
//             console.log("🚀 ~ file: services.ts:109 ~ returnnewPromise ~ vbaSendBoxSms:", vbaSendBoxSms)
//             if (!vbaSendBoxSms.length) return reject({ name: "SENDBOX_EMPTY", message: "La boite d'envoi est vide" });

//             const smsArray = [];
//             const sendBoxSmsType2 = [];//sms groupé
//             const sendBoxSmsType1_3 = [];//sms individuel

//             vbaSendBoxSms.map(item => {
//                 if (item.typeSms === 2) sendBoxSmsType2.push(item)
//                 else sendBoxSmsType1_3.push(item)
//             })

//             //contruire item sms pour chaque numero
//             sendBoxSmsType2.map(item => {
//                 const phonesArray = item.numeroTelephone.split(';');
//                 phonesArray.map(phoneItem => {
//                     smsArray.push([
//                         anscol1,
//                         codeetab,
//                         sessionId,
//                         item.idEleve,
//                         phoneItem,
//                         item.libelleMessage,
//                         todayDateTime
//                     ]);
//                 });
//             });
//             sendBoxSmsType1_3.map(item => {
//                 smsArray.push([
//                     anscol1,
//                     codeetab,
//                     sessionId,
//                     item.idEleve,
//                     item.numeroTelephone,
//                     item.libelleMessage,
//                     todayDateTime
//                 ]);
//             });

//             //inserrer les messages dans la boite d'envoi sqlite
//             await functions.insertSendBoxSms(smsArray);

//             //envoyer les sms
//             await envoyerSmsFromXServer(io, providerId, [sessionId]);

//             await functions.setMessageAsSent(sessionId, smsAccount.sender)
//             resolve(sessionId)
//         } catch (error) {
//             console.log("🚀 ~ file: services.ts:167 ~ returnnewPromise ~ error:", error)
//             await functions.unlockMessages(sessionId)
//             reject(error);
//         }
//     });
// };

/**
 * enregistrer les sms vba dans la boite d'envoi sqlite
 * @param smsData 
 * @returns 
 */
const vbaSmsToSendBox = (smsData: IPayloadVbaSmsToSendBox) => {
    return new Promise(async (resolve, reject) => {
        try {
            const smsArray = [];
            const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);
            const sessionId = uuid.v4();
            const todayDateTime = getTodayDateTime();
            //contruire item sms pour chaque numero (destinataire)
            smsData.phone.map(phoneItem => {
                smsArray.push([
                    anscol1,
                    codeetab,
                    sessionId,
                    0,//idEleve
                    phoneItem,
                    smsData.smsContent,
                    todayDateTime
                ]);
            });
            //enserrer en bd
            await functions.insertSendBoxSms(smsArray);
        } catch (error) {
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
 * liste des classes
 * @returns 
 */
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

/**
 * listes des eleves
 * @returns 
 */
const getEleves = (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const eleves = await functions.fetchStudents()
            resolve(eleves)
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * listes des evaluations et programmations des eleves
 * @returns 
 */
const fetchStudentsEvalNotes = (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const elevesNotes: any = await functions.fetchStudentsEvalNotes()
            resolve(elevesNotes)
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * listes des evaluations programmées des eleves
 * @returns 
 */
const fetchEvalProgs = (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const elevesProgs: any = await functions.fetchEvalProgs()
            resolve(elevesProgs)
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Liste du personnel
 * @returns 
 */
const getPersonnel = (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const eleves = await functions.fetchPersonnel()
            resolve(eleves)
        } catch (error) {
            reject(error);
        }
    });
};


/**
 * listes des niveaux
 * @returns 
 */
const getNiveaux = (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const eleves = await functions.fetchNiveaux();
            resolve(eleves)
        } catch (error) {
            console.log("🚀 ~ file: services.ts ~ line 212 ~ returnnewPromise ~ error", error)
            reject(error);
        }
    });
};

/**
 * inserrer les messages groupé dans la boite d'envoi et les envoyer directement en ligne si sendNow vaut true
 * @param data 
 * @returns 
 */
const insererMessageGroupeBoiteEnvoi = (data: IPayloadMessageGroupe, io): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const sessionId = uuid.v4();
            const { idEleves, messageTitle, messageContent, alertLevel, targetAppId, sendNow } = data;
            console.log("🚀 ~ file: services.ts:260 ~ returnnewPromise ~ idEleves:", idEleves)
            const { anscol1, codeetab } = await paramEtabObjet([
                "Anscol1",
                "CodeEtab"
            ]);
            //recupperer les contacts parent (pere, meres, tuteur) eleves
            const parents = await functions.fetchParents(idEleves);

            //construire et sauvegarder les messages dans la boite d'envoie
            const todayDateTime = getTodayDateTime();
            const messages = parents.map(item => ([
                anscol1,
                codeetab,
                sessionId,
                item.idEleve,
                targetAppId,
                item.numeroCellulaire,
                messageTitle,
                messageContent,
                alertLevel,
                todayDateTime
            ]));
            await functions.insertSendBoxMessage(messages);

            //envoyer les messages en lignes
            if (sendNow) await envoyerMessage(io, [sessionId]);

            resolve(true);
        } catch (error) {
            console.log("🚀 ~ file: services.ts:274 ~ returnnewPromise ~ error:", error)
            reject(error);
        }
    });
};




/**
 * envoyer les messages focus ecole existant dans la boite d'envoi 
 * @param data 
 * @returns 
 */
const envoyerMessage = (io, sessionIds: string[]): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);

            //recupperer les messages non envoyé dans la boite d'envoi pour une ou plusieurs sessions
            const sendBoxMessages = await functions.fetchSendBoxMessageNotSent(sessionIds);
            const messagesIds: number[] = [];//tous les idsMessages
            const focusMessages: ISendBoxMessages[] = [];//les messages a destination des parents d'eleves
            const profExpertMessage: ISendBoxMessages[] = [];//les messages a destination des professeurs

            sendBoxMessages.map(message => {
                messagesIds.push(message.messageId);
                if (message.targetAppId === FOCUS_APP_ID) {
                    focusMessages.push(message);
                } else {//prof expert
                    profExpertMessage.push(message);
                }
            });

            //verrouiller les messages 
            await functions.toggleLockUnlockMessage(messagesIds, MESSAGE_LOCKED_STATUS);

            try {
                //envoyer les message en lignes
                const url = `${FOCUS_ECOLE_BASE_URL}/send-message`;
                const res = await fetchPublicRoute(url, { messages: focusMessages, anneeScolaire: anscol1, codeEtab: codeetab }) as any;
                const messagesSent = res.data as IMessageFocusServer[];
                const messageSendArray = messagesSent.map(item => ([
                    item.anneeScolaire,
                    item.codeEtab,
                    item.messageId,
                    item.sessionId,
                    item.studentId,
                    FOCUS_APP_ID,//targetAppId
                    item.phone,
                    item.messageTitle,
                    item.messageContent,
                    item.alertLevel,
                    1,//message locked
                    item.fcmMessageId,
                    isoDateToDateTime(item.sentAt),
                    isoDateToDateTime(item.sendBoxCreatedAt)
                ]));

                //mettre a jour les donnes des messages dans la boite d'envoi 
                await functions.updateSendBoxMessagesData(messageSendArray);

                // const allSendBoxMessages:any = await functions.fetchSendBoxMessage();
                // console.log("🚀 ~ file: services.ts:493 ~ returnnewPromise ~ allSendBoxMessages:", allSendBoxMessages.length)

                //envoyes les messages qui vienne d'etre envoyes a parents a tous les clients (spider) par socket
                console.log("🚀 ~ file: services.ts:497 ~ returnnewPromise ~ messagesSent:", messagesSent.length)
                io.emit("messages_envoyes", messagesSent)
                resolve(true);

            } catch (error) {
                //envoi messages echoué, deverouiller les messages 
                await functions.toggleLockUnlockMessage(messagesIds, MESSAGE_UNLOCKED_STATUS);
                reject(error);
            }
        } catch (error) {
            console.log("🚀 ~ file: services.ts:322 ~ returnnewPromise ~ error:", error)
            reject(error);
        }
    });
};

/**
 * recupperer les messages de la boite d'envoie
 */
const messageBoiteEnvoie = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const sendBoxMessages = await functions.fetchSendBoxMessage();
            resolve(sendBoxMessages);
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * recuperer les sms qui sont dans la boite d'envoi
 * @returns 
 */
const messageSmsBoiteEnvoie = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const sendBoxSms = await functions.fetchSendBoxSms();
            resolve(sendBoxSms);
        } catch (error) {
            reject(error);
        }
    });
};


/**
 * Envoyer les message points assiduites des eleves pour la periode defini
 * @returns 
 */
const envoyerMessagesAssiduite = (data: IPayloadEnvoyerMessagesAssiduite, io) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);
            const { seance, idEleves, sendNow } = data;

            //recuperer la liste des eleves et leurs classes
            const eleves = await functions.getEleveWithClasse(data.idEleves);

            //les date debut et fin de la periode
            let { dateDebut, dateFin } = seance;

            //faire le points des assiduité poour chaque eleves sur la periode
            const assiduites = await functions.getElevePeriodeAssiduite(dateDebut, dateFin, data.idEleves);
            const pointAssiduitesEleves: IPointAssiduitesEleves[] = [];
            assiduites.map(itemAssiduite => {
                if (!pointAssiduitesEleves.find(item => item.idEleve === itemAssiduite.idEleve)) {
                    pointAssiduitesEleves.push({
                        idEleve: itemAssiduite.idEleve,
                        absence: 0,
                        retard: 0,
                        justifie: 0,
                        nonJustifie: 0
                    });
                }
                const index: number = pointAssiduitesEleves.findIndex(itemPoint => itemPoint.idEleve === itemAssiduite.idEleve);
                const pointEleve = pointAssiduitesEleves[index];
                if (itemAssiduite.status == 1) pointEleve.absence++;
                if (itemAssiduite.status == 2) pointEleve.retard++;
                if (itemAssiduite.justifie == 1) pointEleve.justifie++;
                if (itemAssiduite.justifie == 0) pointEleve.nonJustifie++;
                pointAssiduitesEleves[index] = pointEleve;
            });

            //recupperer les contacts parent (pere, meres, tuteur) eleves pour lesquel on atrouvé des assiduites
            const idElevesArray = pointAssiduitesEleves.map(item => item.idEleve);
            if (idElevesArray.length === 0) return resolve({ name: "POINT_ASSIDUITE", message: `Aucun élève n’a été en retard ou absent durant la période sélectionnée` });
            const parents = await functions.fetchParents(idElevesArray);

            //merge les points assiduites eleves, eleves data et parents eleves data
            const mergedPointEleves = merge2ArraysOfObjects(pointAssiduitesEleves, eleves, "idEleve");
            const mergedFullData = merge2ArraysOfObjects(parents, mergedPointEleves, "idEleve");

            //construire et sauvegarder les messages dans la boite d'envoie
            const sessionId = uuid.v4();
            const todayDateTime = getTodayDateTime();
            const messages = mergedFullData.map(item => {
                const messageContent = `Point des absences et retards de la periode du ${dateDebut} au ${dateFin} pour l'élève \r ${item.nomEleve} ${item.prenomEleve} \r Absences : ${item.absence} \r Retards : ${item.retard} \r Justifié : ${item.justifie} \r Non justifié : ${item.nonJustifie}`;
                return [
                    anscol1,
                    codeetab,
                    sessionId,
                    item.idEleve,
                    FOCUS_APP_ID,
                    item.numeroCellulaire,
                    "POINTS ABSENCES ET RETARDS",
                    messageContent,
                    "Warning",
                    todayDateTime
                ]
            });
            await functions.insertSendBoxMessage(messages);

            //envoyer les messages en lignes
            if (sendNow) await envoyerMessage(io, [sessionId]);

            resolve(true);
        } catch (error) {
            console.log("🚀 ~ file: services.ts:418 ~ returnnewPromise ~ error:", error)
            reject(error);
        }
    });
};

/**
 * Envoyer les message points assiduites des eleves pour la periode defini
 * @returns 
 */
const envoyerNotificationResultatsScolaires = (data: IPayloadEnvoyerNotificationResultatsScolaires, io) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { anscol1, codeetab, decoupsemestres } = await paramEtabObjet(["Anscol1", "CodeEtab", "decoupSemestres"]);
            const { etabElevesSelected, typesResultatsSelectedId, dateDebut, dateFin, sendNow, periodeSelectionne, footerMessage } = data;
            const periodeData = getPeriodeData(parseInt(decoupsemestres || "0"))
            const libellePeriode = periodeData.find(item => item.idPeriode === periodeSelectionne)?.libPeriode || "f"

            //construire et sauvegarder les messages dans la boite d'envoie
            const sessionId = uuid.v4();
            const todayDateTime = getTodayDateTime();
            const messages = etabElevesSelected.map(item => {
                const matiereSpecifique = typesResultatsSelectedId === "miniBull" ? getMatiereSpecByIdTypeCLasse(item.idTypeClasse) : null

                let messageContentData: { [x: string]: any } = {
                    unique: {
                        title: `NOTE EVALUATION UNIQUE`,
                        content: `Cher parent, nous vous informons que l'élève ${item.nomPrenomEleve} (${item.libelleClasseCourt}) ${item?.noteEval ? `a obtenu la note de ${item?.noteEval}/${20 * item?.coefEval}` : "s'est absenté(e)"} ${item.typeEval === "IE" ? `à l'` : `au`} ${item.typeEval} ${voyelles.includes(item?.libelleMatiereCourt?.charAt(0)!) ? "d'" : "de"} ${item?.libelleMatiereCourt} du ${convertDateToLocaleStringDate(item?.dateCompo)}\n${footerMessage}`,
                    },
                    unePeriode: {
                        title: `NOTES EVALUATIONS PERIODIQUE`,
                        content: `RESULTATS DES EVALUATIONS DU ${dateDebut} AU ${dateFin}\n${item.nomPrenomEleve} (${item.libelleClasseCourt})\n${item.evaluations?.map(item => `${item}\n`).join('')}${footerMessage}`,
                    },
                    moyRang: {
                        title: `RESULTATS TRIMESTRIELS`,
                        content: `RESULTAT ${libellePeriode!.toUpperCase()}\n${item.nomPrenomEleve}\nClasse: ${item.libelleClasseCourt}\nMoy: ${item.MOYG}\nRang: ${item.RangG}\n${footerMessage}`,
                    },
                    miniBull: {
                        title: `MINI BULLETIN`,
                        content: `MINI BULL ${libellePeriode!.toUpperCase()}\n${item.nomPrenomEleve}(${item.libelleClasseCourt})\n${matiereSpecifique ? matiereSpecifique.header[2] : 'N/A'}:${item[matiereSpecifique?.body[2]]}\n${matiereSpecifique ? matiereSpecifique.header[3] : 'N/A'}:${item[matiereSpecifique?.body[3]]}\n${matiereSpecifique ? matiereSpecifique.header[4] : 'N/A'}:${item[matiereSpecifique?.body[4]]}\n${matiereSpecifique ? matiereSpecifique.header[5] : 'N/A'}:${item[matiereSpecifique?.body[5]]}\nMOY: ${item.MOYG}\nRang: ${item.RangG}\n${footerMessage}`,
                    },
                    syntheseAnnuelle: {
                        title: `SYNTHESE ANNUELLE`,
                        content: `POINT ANNUEL\n${item.nomPrenomEleve}(${item.libelleClasseCourt})\nT1:${item?.MOYGRangG || "-"}\nT2:${item?.MOYG2RangG2 || "-"}\nT3:${item?.MOYG3RangG3 || "-"}\nMGA:${item?.MOYG4RangG4 || "-"}\nDFA:${item?.dfa}\n${footerMessage}`,
                    },
                    examenBlanc: {
                        title: `EXAMEN BLANC`,
                        content: `EXAMEN BLANC ${item?.nomExam}\n${item?.nomPrenomCandidat}\nPoints:${item?.pointCommun}\nDécision:${item?.decision}\n${footerMessage}`,
                    },
                    compositionPrimaire: {
                        title: `RESULTATS DE COMPOSITIONS`,
                        content: `RESULTAT DE LA ${item?.libelle}\n${item.nomPrenomEleve}(${item.libelleClasseCourt})\n${item?.compositions?.map((item: any) => `${item}\n`).join('')}Moy: ${item?.moyenne}\nRang: ${item?.rang}\n${footerMessage}`,
                    },
                }

                return [
                    anscol1,
                    codeetab,
                    sessionId,
                    item.idEleve,
                    FOCUS_APP_ID,
                    item.cellulaireTuteur,
                    messageContentData[typesResultatsSelectedId]?.title,
                    messageContentData[typesResultatsSelectedId]?.content,
                    "Info",
                    todayDateTime
                ]
            });
            await functions.insertSendBoxMessage(messages);

            //envoyer les messages en lignes
            if (sendNow) await envoyerMessage(io, [sessionId]);

            resolve(true);
        } catch (error) {
            console.log("🚀 ~ file: services.ts:418 ~ returnnewPromise ~ error:", error)
            reject(error);
        }
    });
};

const getMatiereSpecByIdTypeCLasse = (idTypeClasse: number) => {
    switch (idTypeClasse) {
        // classePremierCycle
        case 1:
        case 2:
        case 3:
        case 4:
            return initialMiniBullTableBody;
            break;
        case 7:
        case 10:
            return initialMiniBullLiteratureTableBody;
            break;
        case 6:
        case 12:
        case 9:
            return initialMiniBullScienceTableBody;
            break;
        case 5:
            return initialMiniBull2ndeATableBody;
            break;
        case 13:
            return initialMiniBullTleA1TableBody;
            break;

        default:
            return initialMiniBullTableBody;
            break;
    }
}



/**
 * Envoyer les messages des resultats scolaires
 * @returns 
 */
const envoyerSmsResultatScolaire = (data: IPayloadEnvoyerSmsResultatScolaire, io) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { anscol1, codeetab, decoupsemestres } = await paramEtabObjet(["Anscol1", "CodeEtab", "decoupSemestres"]);
            const { providerId, sendNow, smsDestinataireKey, etabElevesSelected, typesResultatsSelectedId, dateDebut, dateFin, periodeSelectionne, footerMessage } = data;
            const periodeData = getPeriodeData(parseInt(decoupsemestres || "0"))
            const libellePeriode = periodeData.find(item => item.idPeriode === periodeSelectionne)?.libPeriode || "f"

            //construire et sauvegarder les messages dans la boite d'envoie
            const sessionId = uuid.v4();
            const todayDateTime = getTodayDateTime();
            // console.log("🚀 ~ file: services.ts:627 ~ returnnewPromise ~ uniqueEvalsNotes:", uniqueEvalsNotes)
            const sms = etabElevesSelected.map(item => {
                const matiereSpecifique = typesResultatsSelectedId === "miniBull" ? getMatiereSpecByIdTypeCLasse(item.idTypeClasse) : null
                let messageContentData: { [x: string]: string } = {
                    unique: `Cher parent, nous vous informons que l'élève ${item.nomPrenomEleve} (${item.libelleClasseCourt}) ${item?.noteEval ? `a obtenu la note de ${item?.noteEval}/${20 * item.coefEval}` : "s'est absenté(e)"} ${item.typeEval === "IE" ? `à l'` : `au `}${item.typeEval} ${voyelles.includes(item?.libelleMatiereCourt?.charAt(0)!) ? "d'" : "de "}${item?.libelleMatiereCourt} du ${convertDateToLocaleStringDate(item?.dateCompo)}\n${footerMessage}`,
                    unePeriode: `RESULTATS DES EVALUATIONS DU ${dateDebut} AU ${dateFin}\n${item.nomPrenomEleve} (${item.libelleClasseCourt})\n${item.evaluations?.map(item => `${item}\n`).join('')}${footerMessage}`,
                    moyRang: `RESULTAT ${libellePeriode!.toUpperCase()}\n${item.nomPrenomEleve}\nClasse: ${item.libelleClasseCourt}\nMoy: ${item.MOYG}\nRang: ${item.RangG}\n${footerMessage}`,
                    miniBull: `MINI BULL ${libellePeriode!.toUpperCase()}\n${item.nomPrenomEleve}(${item.libelleClasseCourt})\n${matiereSpecifique ? matiereSpecifique.header[2] : 'N/A'}:${item[matiereSpecifique?.body[2]]}\n${matiereSpecifique ? matiereSpecifique.header[3] : 'N/A'}:${item[matiereSpecifique?.body[3]]}\n${matiereSpecifique ? matiereSpecifique.header[4] : 'N/A'}:${item[matiereSpecifique?.body[4]]}\n${matiereSpecifique ? matiereSpecifique.header[5] : 'N/A'}:${item[matiereSpecifique?.body[5]]}\nMOY: ${item.MOYG}\nRang: ${item.RangG}\n${footerMessage}`,
                    syntheseAnnuelle: `POINT ANNUEL\n${item.nomPrenomEleve}(${item.libelleClasseCourt})\nT1:${item?.MOYGRangG || "-"}\nT2:${item?.MOYG2RangG2 || "-"}\nT3:${item?.MOYG3RangG3 || "-"}\nMGA:${item?.MOYG4RangG4 || "-"}\nDFA:${item?.dfa}\n${footerMessage}`,
                    examenBlanc: `EXAMEN BLANC ${item?.nomExam}\n${item?.nomPrenomCandidat}\nPoints:${item?.pointCommun}\nDécision:${item?.decision}\n${footerMessage}`,
                    compositionPrimaire: `RESULTAT DE LA ${item?.libelle}\n${item.nomPrenomEleve}(${item.libelleClasseCourt})\n${item?.compositions?.map((item: any) => `${item}\n`).join('')}Moy: ${item?.moyenne}\nRang: ${item?.rang}\n${footerMessage}`,
                }
                return [
                    anscol1,
                    codeetab,
                    sessionId,
                    item.idEleve,
                    smsDestinataireKey,
                    item.cellulaireTuteur,
                    messageContentData[typesResultatsSelectedId],
                    todayDateTime
                ]
            });
            await functions.insertSendBoxSms(sms);

            //envoyer les messages en lignes
            if (sendNow) await envoyerSmsFromXServer(io, providerId, [sessionId]);

            resolve(true);
        } catch (error) {
            console.log("🚀 ~ file: services.ts:418 ~ returnnewPromise ~ error:", error)
            reject(error);
        }
    });
};

/**
 * Archiver des messages deja envoyé 
 */
const archiverMessages = (io, sessionIds: string[]) => {
    return new Promise(async (resolve, reject) => {
        try {

            //recupperer anneescolaire et codeEtab
            const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);

            //archver les messages en lignes
            const url = `${FOCUS_ECOLE_BASE_URL}/archiver-messages`;
            await fetchPublicRoute(url, { sessionIds, anneeScolaire: anscol1, codeEtab: codeetab }) as any;

            //archiver les messages en local
            await functions.archiverMessages(sessionIds);

            //recupperer et rammener les messages qui viennent d'etre archivé
            const messagesArchives = await functions.fetchSendBoxMessage(sessionIds)
            io.emit("messages_archives", messagesArchives)

            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
};


/**
 * Supprimer des messages present dans la boite d'envoi
 */
const supprimerMessages = (io, sessionIds: string[]) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("🚀 ~ file: services.ts:492 ~ supprimerMessages ~ sessionIds:", sessionIds)
            //supprimer les messages en local
            await functions.supprimerMessages(sessionIds);

            //recupperer et ramener les messages qui viennent d'etre supprimés
            const messagesDeleted = await functions.fetchSendBoxMessage(sessionIds)
            console.log("🚀 ~ file: services.ts:500 ~ returnnewPromise ~ messagesDeleted:", messagesDeleted)
            io.emit("messages_deleted", messagesDeleted)

            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
};


/**
 * inserrer des sms dans la boite d'envoi et les envoyer directement au destinateur si sendNow vaut true
 * @param data 
 * @returns 
 */
const insererSmsBoiteEnvoie = (data: IPayloadInsererSmsBoiteEnvoi, io): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("🚀 ~ file: services.ts:534 ~ insererSmsBoiteEnvoie ~ data:", data)
            const sessionId = uuid.v4();
            console.log("🚀 ~ file: services.ts:626 ~ returnnewPromise ~ sessionId:", sessionId)
            const { idPersonnes, providerId, smsContent, sendNow, smsDestinataireKey } = data;
            const { anscol1, codeetab } = await paramEtabObjet([
                "Anscol1",
                "CodeEtab"
            ]);

            const todayDateTime = getTodayDateTime();
            let sms: any[][]
            switch (smsDestinataireKey) {
                case "parentsEleves":
                    //recupperer le contact des tuteurs des eleves
                    const parents = await functions.fetchParents(idPersonnes);
                    console.log("🚀 ~ file: services.ts:713 ~ returnnewPromise ~ parents:", parents)
                    if (parents.length === 0) return reject({ name: "NO_PARENT_PHONE_FOUND", message: "Aucun numéro téléphone trouvé pour les élevès sélectionnés" })

                    const tuteurs = parents.filter(item => item.filiation === "tuteur");
                    if (tuteurs.length === 0) return reject({ name: "NO_TUTOR_PHONE_FOUND", message: "Aucun numéro téléphone trouvé pour les élevès sélectionnés" })

                    //construire et sauvegarder les sms dans la boite d'envoie
                    sms = tuteurs.map(item => ([
                        anscol1,
                        codeetab,
                        sessionId,
                        item.idEleve,
                        smsDestinataireKey,
                        item.numeroCellulaire,
                        smsContent,
                        todayDateTime
                    ]));
                    break;
                case "fournisseurs":
                    // Récuperer le contact des fournisseurs
                    const fournisseurs = await functions.getListeFournisseurs(idPersonnes);
                    if (fournisseurs.length === 0) return reject({ name: "NO_FOURNISSEURS_PHONE_FOUND", message: "Aucun numéro téléphone trouvé pour les fournisseurs sélectionnés" })
                    sms = fournisseurs.map(item => ([
                        anscol1,
                        codeetab,
                        sessionId,
                        item.idFournisseur,
                        smsDestinataireKey,
                        item.cellulaireFournisseur,
                        smsContent,
                        todayDateTime
                    ]));
                    break;
                case "membresPersonnels":
                    //recupperer le contact des membres du personnels
                    const personnels = await functions.fetchPersonnel(idPersonnes);
                    console.log("🚀 ~ file: services.ts:674 ~ returnnewPromise ~ personnels:", personnels)
                    if (personnels.length === 0) return reject({ name: "NO_PERSONNEL_PHONE_FOUND", message: "Aucun numéro téléphone trouvé pour les personnels sélectionnés" })
                    // Récuperer que ceux le contact est différent de 0
                    // const personnelsAyantUnNumero = personnels.filter(item => item.phone2 !== null);
                    if (personnels.length === 0) return reject({ name: "NO_PERSONNEL_PHONE_FOUND", message: "Aucun numéro téléphone trouvé pour les personnels sélectionnés" })
                    sms = personnels?.map(item => ([
                        anscol1,
                        codeetab,
                        sessionId,
                        item.idPersonnel,
                        smsDestinataireKey,
                        item.phone2,
                        smsContent,
                        todayDateTime
                    ]));
                    break;

                default:
                    break;
            }

            await functions.insertSendBoxSms(sms);

            //envoyer les sms au destinateurs (tuteurs eleves)
            // if (sendNow) await envoyerSms(io, providerId, [sessionId]);
            if (sendNow) await envoyerSmsFromXServer(io, providerId, [sessionId]);
            const allSendBoxSms = await functions.fetchSendBoxSms();
            const etabCreditSms = await creditSms(`${providerId}`)
            io.emit("sms_envoyes", allSendBoxSms);
            io.emit("etab_credit_sms", etabCreditSms);
            resolve(true);
        } catch (error) {
            console.log("🚀 ~ file: services.ts:274 ~ returnnewPromise ~ error:", error)
            reject(error);
        }
    });
};


/**
 * envoyer les sms existant dans la boite d'envoi 
 * @param data 
 * @returns 
 */
// const envoyerSms = (io, providerId: number, sessionIds: string[]): Promise<any> => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const { anscol1, codeetab, default_sms_provider } = await paramEtabObjet(["Anscol1", "CodeEtab", "default_sms_provider"]);
//             // const providerId = parseInt(default_sms_provider);

//             //pour le provider defini, verifier qu'il existe un compte sms associe en ligne
//             const allSmsAccount = await getSmsAccount(codeetab, providerId) as ISmsAccount[]
//             if (allSmsAccount.length === 0) return reject({ name: "NO_SMS_ACCOUNT_FOUND", message: "Vous n'avez pas de compte sms" });

//             const providerSmsAccount = allSmsAccount.find(item => item.providerId === providerId);

//             if (!providerSmsAccount) return reject({ name: "NO_SMS_ACCOUNT_FOUND", message: "Aucun compte sms trouvé pour ce provider" });
//             //recupperer les sms non envoyé dans la boite d'envoi pour une ou plusieurs sessions
//             const sendBoxSms = await functions.fetchSendBoxSmsNotSent(sessionIds);
//             const smsIds: number[] = [];//tous les idsMessages

//             //verrouiller les sms afin qu'il puissent pas etre envoyé par un autre client spider 
//             await functions.toggleLockUnlockSms(smsIds, MESSAGE_LOCKED_STATUS);

//             //zip des sms et envoi en ligne
//             const fields = [
//                 {
//                     label: 'anneeScolaire',
//                     value: 'anneeScolaire',
//                 },
//                 {
//                     label: 'codeEtab',
//                     value: 'codeEtab',
//                 },
//                 {
//                     label: 'smsId',
//                     value: 'smsId',
//                 },
//                 {
//                     label: 'sessionId',
//                     value: 'sessionId',
//                 },
//                 {
//                     label: 'studentId',
//                     value: 'studentId',
//                 },
//                 {
//                     label: 'phone',
//                     value: 'phone',
//                 },
//                 {
//                     label: 'smsContent',
//                     value: 'smsContent',
//                 },
//                 {
//                     label: 'sendBoxCreatedAt',
//                     value: (row, field) => moment(row[field.label]).format("YYYY-MM-DD HH:mm:ss") || field.default,
//                     default: 'NULL'
//                 }
//             ]
//             const sessionId = uuid.v4();
//             const url = `${WHSERVER_BASE_URL}/sendmessagesms`;
//             const zipName = `message_sms_${anscol1}_${codeetab}_${sessionId}.zip`
//             const fileName = `messagesms.csv`;

//             try {
//                 const res: any = await sendZippedInitializeData(fields, sendBoxSms, url, zipName, fileName, { ...providerSmsAccount, sessionId })
//                 const smsSent = res.data.data as IMessageSmsServer[];
//                 console.log("🚀 ~ file: services.ts:646 ~ returnnewPromise ~ smsSent:", smsSent)

//                 //marquer les sms comme etant envoyé
//                 const smsSendArray = smsSent.map(item => ([
//                     item.anneeScolaire,
//                     item.codeEtab,
//                     item.smsId,
//                     item.sessionId,
//                     item.providerId,
//                     item.transactionId,
//                     item.studentId,
//                     item.phone,
//                     item.smsContent,
//                     1,//message locked
//                     isoDateToDateTime(item.sentAt),
//                     isoDateToDateTime(item.sendBoxCreatedAt)
//                 ]));

//                 //mettre a jour les donnes des messages dans la boite d'envoi 
//                 await functions.updateSendBoxMessagesSmsData(smsSendArray);

//                 //envoyés les sms qui vienne d'etre envoyes au parents a tous les clients (spider) par socket
//                 io.emit("sms_envoyes", smsSent);
//                 resolve(true);
//             } catch (error) {
//                 //envoi sms echoué, deverouiller les sms 
//                 await functions.toggleLockUnlockMessage(smsIds, MESSAGE_UNLOCKED_STATUS);
//                 reject(error);
//             }
//         } catch (error) {
//             console.log("🚀 ~ file: services.ts:322 ~ returnnewPromise ~ error:", error)
//             reject(error);
//         }
//     });
// };


/**
 * envoyer les sms existant dans la boite d'envoi depuis xserver
 * @param data 
 * @returns 
 */
const envoyerSmsFromXServer = (io, providerId: number, sessionIds: string[] | null = null): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const { anscol1, codeetab, default_sms_provider } = await paramEtabObjet(["Anscol1", "CodeEtab", "default_sms_provider"]);
            // const providerId = parseInt(default_sms_provider);

            //pour le provider defini, verifier qu'il existe un compte sms associe en ligne
            const allSmsAccount = await getSmsAccount(codeetab, providerId) as ISmsAccount[]
            if (allSmsAccount.length === 0) return reject({ name: "NO_SMS_ACCOUNT_FOUND", message: "Vous n'avez pas de compte sms" });

            const smsAccount = allSmsAccount.find(item => item.providerId === providerId);

            if (!smsAccount) return reject({ name: "NO_SMS_ACCOUNT_FOUND", message: "Aucun compte sms trouvé pour ce provider" });
            //recupperer les sms non envoyé dans la boite d'envoi pour une ou plusieurs sessions
            const sendBoxSms = await functions.fetchSendBoxSmsNotSent(sessionIds);

            const smsIds: number[] = [];//tous les idsMessages

            //verrouiller les sms afin qu'il puissent pas etre envoyé par un autre client spider 
            await functions.toggleLockUnlockSms(smsIds, MESSAGE_LOCKED_STATUS);

            //envoyer maintenant chaque sms vers les destinataires
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
                await functions.updateSendBoxMessagesSmsData(smsSendResultArray);
            });

            const allSendBoxSms = await functions.fetchSendBoxSms();
            const etabCreditSms = await creditSms(`${providerId}`)
            io.emit("sms_envoyes", allSendBoxSms);
            io.emit("etab_credit_sms", etabCreditSms);
            resolve(true);

        } catch (error) {
            console.log("🚀 ~ file: services.ts:322 ~ returnnewPromise ~ error:", error)
            reject(error);
        }
    });
};




/**
 * Supprimer des sms present dans la boite d'envoi
 */
const supprimerSms = (io, sessionIds: string[]) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("🚀 ~ file: services.ts:492 ~ supprimerMessages ~ sessionIds:", sessionIds)
            //supprimer les sms en local
            await functions.supprimerSms(sessionIds);

            //recupperer et ramener les sms qui viennent d'etre supprimés
            const smsDeleted = await functions.fetchSendBoxSms(sessionIds);
            io.emit("sms_deleted", smsDeleted)
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
};


/**
 * Archiver des sms deja envoyé 
 */
const archiverSms = (io, sessionIds: string[]) => {
    return new Promise(async (resolve, reject) => {
        try {

            //recupperer anneescolaire et codeEtab
            const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);

            //archver les sms en lignes
            // const url = `${FOCUS_ECOLE_BASE_URL}/archiver-sms`;
            // await fetchPublicRoute(url, { sessionIds, anneeScolaire: anscol1, codeEtab: codeetab }) as any;

            //archiver les sms en local
            await functions.archiverSms(sessionIds);

            //recupperer et rammener les sms qui viennent d'etre archivé
            const smsArchives = await functions.fetchSendBoxSms(sessionIds)
            console.log("🚀 ~ file: services.ts:702 ~ returnnewPromise ~ smsArchives:", smsArchives)
            io.emit("sms_archives", smsArchives)

            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Envoyer par sms les points assiduites des eleves pour la periode defini
 * @returns 
 */
const envoyerSmsAssiduite = (data: IPayloadEnvoyerSmsAssiduite, io) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);
            const { seance, idEleves, sendNow, providerId, smsDestinataireKey } = data;
            //recuperer la liste des eleves et leurs classes
            const eleves = await functions.getEleveWithClasse(idEleves);

            //les date debut et fin de la periode
            let dateDebut = seance.dateDebut;
            let dateFin = seance.dateFin;

            //faire le points des assiduité poour chaque eleves sur la periode
            const assiduites = await functions.getElevePeriodeAssiduite(dateDebut, dateFin, idEleves);
            const pointAssiduitesEleves: IPointAssiduitesEleves[] = [];
            assiduites.map(itemAssiduite => {
                if (!pointAssiduitesEleves.find(item => item.idEleve === itemAssiduite.idEleve)) {
                    pointAssiduitesEleves.push({
                        idEleve: itemAssiduite.idEleve,
                        absence: 0,
                        retard: 0,
                        justifie: 0,
                        nonJustifie: 0
                    });
                }
                const index: number = pointAssiduitesEleves.findIndex(itemPoint => itemPoint.idEleve === itemAssiduite.idEleve);
                const pointEleve = pointAssiduitesEleves[index];
                if (itemAssiduite.status == 1) pointEleve.absence++;
                if (itemAssiduite.status == 2) pointEleve.retard++;
                if (itemAssiduite.justifie == 1) pointEleve.justifie++;
                if (itemAssiduite.justifie == 0) pointEleve.nonJustifie++;
                pointAssiduitesEleves[index] = pointEleve;
            });

            //recupperer les contacts parent (pere, meres, tuteur) eleves pour lesquel on a trouvé des assiduites (point assiduites effectué)
            console.log("🚀 ~ file: services.ts:762 ~ returnnewPromise ~ pointAssiduitesEleves:", pointAssiduitesEleves)
            const idElevesArray = pointAssiduitesEleves.map(item => item.idEleve);
            console.log("🚀 ~ file: services.ts:762 ~ returnnewPromise ~ idElevesArray:", idElevesArray)
            if (idElevesArray.length === 0) return resolve({ name: "POINT_ASSIDUITE", message: `Aucun élève n’a été en retard ou absent durant la période sélectionnée` });
            const parents = await functions.fetchParents(idElevesArray);

            //merge les points assiduites eleves, eleves data et parents eleves data
            const mergedPointEleves = merge2ArraysOfObjects(pointAssiduitesEleves, eleves, "idEleve");
            console.log("🚀 ~ file: services.ts:414 ~ returnnewPromise ~ mergedPointEleves:", mergedPointEleves.length)
            const mergedFullData = merge2ArraysOfObjects(parents, mergedPointEleves, "idEleve");
            console.log("🚀 ~ file: services.ts:415 ~ returnnewPromise ~ mergedFullData:", mergedFullData.length)

            //construire et sauvegarder les messages dans la boite d'envoie
            const sessionId = uuid.v4();
            const todayDateTime = getTodayDateTime();
            const messages = mergedFullData.map(item => {
                const messageContent = `Point des absences et retards de la periode du ${dateDebut} au ${dateFin} pour l'élève \r ${item.nomEleve} ${item.prenomEleve} \r Absences : ${item.absence} \r Retards : ${item.retard} \r Justifié : ${item.justifie} \r Non justifié : ${item.nonJustifie}`;
                return [
                    anscol1,
                    codeetab,
                    sessionId,
                    item.idEleve,
                    smsDestinataireKey,
                    item.numeroCellulaire,
                    messageContent,
                    todayDateTime
                ]
            });
            await functions.insertSendBoxSms(messages);

            //envoyer les sms aux parents
            if (sendNow) await envoyerSmsFromXServer(io, providerId, [sessionId]);
            // if (sendNow) await envoyerSms(io, providerId, [sessionId]);

            resolve(true);
        } catch (error) {
            console.log("🚀 ~ file: services.ts:418 ~ returnnewPromise ~ error:", error)
            reject(error);
        }
    });
};

/**
 * Obtenir la liste des comptes sms
 * @param sessionIds 
 * @returns 
 */
export const listeCompteSms = () => {
    return new Promise<IPayloadNewSmsAccount[]>(async (resolve, reject) => {
        try {
            const accounts = await functions.listeCompteSms();
            resolve(accounts);
        } catch (error) {
            reject(error);
        }
    });
};
/**
 * Obtenir la liste des providers sms
 * @param sessionIds 
 * @returns 
 */
const listeProviders = () => {
    return new Promise<IPayloadNewSmsAccount[]>(async (resolve, reject) => {
        try {
            const providers = await functions.listeProviders();
            resolve(providers);
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * changer le compte d'envoi sms
 * @returns 
 */
const changeDefaultSmsAccount = (providerId: number) => {
    return new Promise(async (resolve, reject) => {
        try {
            await functions.changeDefaultSmsAccount(providerId);
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Obtenir le credit (montant) sms d'un etablissement chez un fournisseur donné et prix unitaire sms
 * @param smsAccount 
 * @returns 
 */
const getBalance = (smsAccount) => {
    return new Promise<{ amount: number, price: number }>(async (resolve, reject) => {
        try {
            let url = "";
            let response;
            let price;
            let amount;

            switch (smsAccount.providerId) {
                case 1: //SYMTEL
                    //obtenir le montant en cfa
                    url = `https://www.symtel.biz/fr/index.php?mod=cgibin&page=4&user=${smsAccount.login}&code=${smsAccount.password}`;
                    response = await axios.get(url, { httpsAgent: agent });

                    const reg = /(?=<cptsms>).*(?=<\/cptsms>)/;
                    const match = reg.exec(response.data);
                    amount = parseInt(match[0].replace(/\D/g, ""));
                    price = smsAccount.price || 10;
                    resolve({ amount, price });
                    break;

                case 3://SPIDER WEB SMS
                case 6: //EDIATTAH
                    const urlSpider = `http://websms.spider-ci.com/api/api_balance.php?username=${smsAccount.login}&password=${smsAccount.password}`
                    response = await axios.get(urlSpider);

                    amount = parseFloat(response.data)
                    // price = smsAccount.price;
                    price = 0.023;
                    resolve({ amount, price });
                    break;
                default:
                    break;
            }
        } catch (error) {
            reject(error)
        }
    });
};


/**
 * envoi sms suivant le provider
 * @param smsAccount 
 * @param userPhone 
 * @param message 
 * @param eleveData 
 * @returns 
 */
export const envoiSmsProvider = (smsAccount: ISmsAccount, phone: string, message: string): Promise<{ sms_messageId: string, sms_send_status: number }> => {
    return new Promise<{ sms_messageId: string, sms_send_status: number }>(async (resolve, reject) => {
        try {
            const phoneWithCallingCode = phone.length <= 10 ? `225${phone}` : phone;
            const smsMaxCharCount = getSmsMaxCharCount(message); //70 ou 160 
            console.log("🚀 ~ file: services.ts:1258 ~ returnnewPromise<{sms_messageId:string,sms_send_status:number}> ~ smsMaxCharCount:", smsMaxCharCount)
            switch (smsAccount.providerId) {
                case SMS_PROVIDER_SYMTEL_ID:
                    const url1 = `https://www.symtel.biz/fr/index.php?mod=cgibin&page=2&title=${smsAccount.sender}&user=${smsAccount.login}&code=${smsAccount.password}&phone=${phoneWithCallingCode}&content=${message}`;
                    const res1 = await axios.get(url1, { httpsAgent: agent });
                    console.log("🚀 ~ file: services.ts:1044 ~ returnnewPromise ~ res1:", res1.data)
                    const regOk = /OK/;
                    const matchOk = regOk.exec(res1.data);
                    const reg = /[^{]+(?=[}])/;
                    const match = reg.exec(res1.data);
                    return resolve({
                        sms_messageId: match[0],
                        sms_send_status: matchOk[0] ? 1 : 0,
                    });
                    break;
                case SMS_PROVIDER_SPIDER_ID:
                case SMS_PROVIDER_EDIATTAH_ID:
                    const url3 = `https://websms.spider-ci.com/api/api_http.php?username=${smsAccount.login}&password=${smsAccount.password}&sender=${smsAccount.sender}&to=${phoneWithCallingCode}&text=${encodeURIComponent(message)}&type=${smsMaxCharCount == 70 ? "unicode" : "text"}`;
                    const res3 = await axios.get(url3);
                    console.log("🚀 ~ file: services.ts:1063 ~ returnnewPromise ~ res3:", res3.data)

                    // res3.data = "OK: fe164bf7-975e-11ed-8f9a-0cc47a018caf"
                    const resSplit = res3.data.split(' ');
                    const messageId = resSplit[1];
                    return resolve({
                        sms_messageId: messageId,
                        sms_send_status: messageId ? 1 : 0,
                    });
                    break;
                default:
                    break;
            }
        } catch (error) {
            reject({
                sms_messageId: null,
                sms_send_status: 0,
            });
        }
    });
};

/**
 * Obtenir la taille autorisée du sms
 * @param sms 
 * @returns 
 */
const getSmsMaxCharCount = (sms) => {
    const GSM7_REGEX =
        /[^A-Za-z0-9 \\r\\n@£$¥èéùìòÇØøÅå\u0394_\u03A6\u0393\u039B\u03A9\u03A0\u03A8\u03A3\u0398\u039EÆæßÉ!\""#$%&'()*+,\-./:;<=>?¡ÄÖÑÜ§¿äöñüà^{}\\\\\\[~\\]|\u20AC]/;
    return GSM7_REGEX.exec(sms) ? 70 : 160;
}

/**
 * Obtenir la liste des fournisseurs
 * @param sessionIds 
 * @returns 
 */
const listeFournisseurs = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const fournisseurs = await functions.getListeFournisseurs();
            resolve(fournisseurs);
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Ajouter ou modifier un fournisseur
 * @param data 
 * @returns 
 */
const addOrUpdateFournisseur = (data: IFournisseur) => {
    return new Promise(async (resolve, reject) => {
        try {
            await functions.addOrUpdateFournisseur(data);
            const fournisseurs = await functions.getListeFournisseurs();
            resolve(fournisseurs);
        } catch (error) {
            reject(error);
        }
    });
}
/**
 * Supprimer un fournisseur
 * @param id 
 * @returns 
 */
const deleteFournisseur = (idFournisseur: number) => {
    return new Promise(async (resolve, reject) => {
        try {
            await functions.deleteFournisseur(idFournisseur);
            const fournisseurs = await functions.getListeFournisseurs();
            resolve(fournisseurs);
        } catch (error) {
            reject(error);
        }
    });
}

const shortDecFinAn = (typeClasse: number, decision: string | null | undefined, sexe: number, serie: string | null): string => {
    let retval: string = "";
    switch (typeClasse) {
        case 6: // 2nde C
            if (!decision || decision === "D") retval = "Ad. en 1D";
            if (decision === "A") retval = "Ad. en 1A";
            if (decision === "C") retval = "Ad. en 1C";
            if (decision === "E") retval = "Ex.";
            if (decision === "R" || decision === "RC") retval = "Red. 2C";
            if (decision === "RA") retval = "Red. 2A";

            if (decision === "Tr" || decision === "TrC") retval = "Transf. 1C";
            if (decision === "TrA") retval = "Transf. 1A";
            if (decision === "TrD") retval = "Transf. 1D";

            if (decision === "TrR" || decision === "TrRC") retval = "Transf Red 2C";
            if (decision === "TrRA") retval = "Transf Red 2A";
            break;

        case 8: // 1ère C
            if (!decision || decision === "C") retval = "Ad. en TC";
            if (decision === "D") retval = "Ad. en TD";
            if (decision === "A") retval = "Ad. en TA";
            if (decision === "E") retval = "Ex.";
            if (decision === "R" || decision === "RC") retval = "Red. en 1C";
            if (decision === "RD") retval = "Red. en 1D";
            if (decision === "RA") retval = "Red. en 1A";

            if (decision === "Tr" || decision === "TrC") retval = "Transf. TC";
            if (decision === "TrA") retval = "Transf. TA";
            if (decision === "TrD") retval = "Transf. TD";

            if (decision === "TrR" || decision === "TrRC") retval = "Transf Red 1C";
            if (decision === "TrRA") retval = "Transf Red 1A";
            if (decision === "TrRD") retval = "Transf Red 1D";
            break;

        case 9: // 1ère D
            if (!decision || decision === "D") retval = "Ad. en TD";
            if (decision === "A") retval = "Ad. en TA";
            if (decision === "C") retval = "Ad. en TC";
            if (decision === "E") retval = "Ex.";
            if (decision === "R" || decision === "RD") retval = "Red. en 1D";
            if (decision === "RA") retval = "Red. en 1A";

            if (decision === "Tr" || decision === "TrD") retval = "Transf. TD";
            if (decision === "TrA") retval = "Transf. TA";

            if (decision === "TrR" || decision === "TrRD") retval = "Transf Red 1D";
            if (decision === "TrRA") retval = "Transf Red 1A";
            if (decision === "TrRD") retval = "Transf Red 1D";
            break;

        case 10: case 11: case 12: case 13: case 30: case 31: case 32: case 33: case 34: case 37: // Tles
            if (decision === "R" || !decision) retval = "RE";
            if (decision === "E") retval = "EE";

            if (decision && decision.match(/^TrR[A,C,D]$/)) retval = `Transf Red T${decision.slice(-1)}`;
            if (decision === "TrR") retval = `Transf Red T${serie}`;
            // You might need to implement DLookup functionality
            // if (decision === 'TrR') {
            //     // Utilisez la fonction DLookup ici
            //     // retval = 'Transf Red en T' + DLookup('série', 'TypesClasse', 'RefTypeClasse=' + TypeClasse);
            // }
            break;

        case 4: // 3èmes
            if (!decision || decision === "R") retval = "RNO";
            if (decision === "E") retval = "ENO";
            if (decision === "TrR") retval = "Transf. RNO";
            break;

        default: // Autres classes
            if (!decision) retval = "Admis";
            if (decision === "E") retval = "Exclu";
            if (decision === "R") retval = "Redouble";

            if (decision === "TrR") retval = "Transf. Red";
            break;
    }

    if (sexe === 2) {
        retval = retval.replace("admis", "admise");
        retval = retval.replace("exclu", "exclue");
    }

    return retval;
}

const totalPointsBEPC = (Type_Candidat: number, anneeScolaire: string) => {

    let retval: number = 0;
    let anScol: number = 0;
    // const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);
    // Obtenir l'année scolaire à partir du paramètre
    if (anScol === 0) {
        // const anScolStr: string = ParamEtab("AnScol1");
        anScol = parseInt(anneeScolaire.substring(5));
    }

    // Calculer les points BEPC en fonction de l'année scolaire
    if (anScol >= 2022) {
        switch (Type_Candidat) {
            case 1:
            case 3:
                retval = 360; // avec EPS
                break;
            case 2:
            case 4:
                retval = 340; // sans EPS
                break;
        }
    } else {
        switch (Type_Candidat) {
            case 1:
            case 3:
                retval = 220; // avec EPS
                break;
            case 2:
            case 4:
                retval = 200; // sans EPS
                break;
        }
    }

    // Afficher le suivi dans le moniteur
    // monitor("TotalPointsBEPC - anScol " + anScol + " " + retval);

    return retval;
}

const decisionBEPC = (P2: number, Type_Candidat: number, anneeScolaire: string): string => {
    let decision: string = "Refusé";
    if (P2 >= totalPointsBEPC(Type_Candidat, anneeScolaire) / 2) decision = "Admis";
    return decision;
}

const pointsBac = (RefExam: number): number => {
    let Pts: number = 0;

    switch (RefExam) {
        case 2: case 3: case 4: case 5: case 7: case 8: case 9: case 10:
            Pts = 200;
            break;
        case 11: case 12: case 13: case 14: case 15: case 16: case 17: case 18:
            Pts = 240;
            break;
        default:
            Pts = 0;
            break;
    }

    return Pts;
}



const decisionBAC = (RefExam: number, Total: number): string => {
    let Pts: number;
    let retval: string;

    Pts = pointsBac(RefExam);

    switch (true) {
        case Total >= Pts:
            retval = "Admis(e)";
            break;
        case Total >= 1 && Total <= Pts - 1:
            retval = "Refusé(e)";
            break;
        case Total === 0:
            retval = "Absent(e)";
            break;
        default:
            retval = "Indéterminé(e)";
            break;
    }

    return retval;
}

function decisionCEPE(Total: number, TGP: number, TypeCandidat: number): string {
    switch (TypeCandidat) {
        case 5: return TGP >= 85 ? "Admis" : "Refusé"; // Of sans CEPE
        case 6: return "Ancien certifié"; // Of avec CEPE
        case 7: return Total >= 85 ? "Admis" : "Refusé"; // Libre
        default: return "Indéterminé"; // Cas par défaut
    }
}

const typeCandidat = (candLibre: boolean, disp: boolean, cepe: boolean, typeExam: number): number => {
    switch (typeExam) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5: // BEPC & BAC
            // Officiel avec EPS
            if (!candLibre && !disp) return 1;

            // Officiel sans EPS
            if (!candLibre && disp) return 2;

            // Libre avec EPS
            if (candLibre && !disp) return 3;

            // Libre sans EPS
            if (candLibre && disp) return 4;
            break;

        case 6: // CEPE
            // Officiel sans CEPE
            if (!candLibre && !cepe) return 5;

            // Officiel avec CEPE
            if (!candLibre && cepe) return 6;

            // Libre (évidemment sans CEPE)
            if (candLibre) return 7;
            break;

        default:
            throw new Error("Type d'examen non pris en charge");
    }
};


const calculerTotal = (RefExam: number, Tp: number, MatFac: number): number => {
    let retval: number;

    switch (RefExam) {
        case 1: retval = Tp + MatFac || 0; break;
        case 2: case 3: case 4: case 5: case 7: case 8: case 9: case 10: case 11: case 12: case 13: case 14: case 15: case 16: case 17: case 18:
            retval = Tp >= pointsBac(RefExam) ? Tp + MatFac || Tp : Tp;
            break;
        default: retval = Tp || 0; break;
    }

    return retval;
}

function pond(T: number, mga: number, Type_Candidat: number, anneeScolaire: string): number {
    let anScol: number = 0;

    // if (cBoolParamEtab("opt_mga_tj")) return T;

    if (anScol === 0) {
        // const anScolStr: string = ParamEtab("AnScol1");
        anScol = parseInt(anneeScolaire.substring(5));
    }

    switch (true) {
        case anScol < 2022:
            switch (Type_Candidat) {
                case 1: return +(0.6 * T + 4.4 * mga).toFixed(2); // officiel avec EPS
                case 2: return +(0.6 * T + 4 * mga).toFixed(2); // officiel sans EPS
                case 3: case 4: return T; // Libres
                default: return 0;
            }
        case anScol >= 2022:
            switch (Type_Candidat) {
                case 1: return +(0.6 * T + 18 * 0.4 * mga).toFixed(2); // officiel avec EPS
                case 2: return +(0.6 * T + 17 * 0.4 * mga).toFixed(2); // officiel sans EPS
                case 3: case 4: return T; // Libres
                default: return 0;
            }
        default: return 0;
    }
}



const findDec = (RefExam: number, TypeCand: any, T: number, P2: number, TGP: number, anneeScolaire: string): { retval: string, pointCommun: number } => {
    let retval: string;
    let pointCommun: number
    if (T === 0) {
        retval = "Absent";
        pointCommun = 0;
        return { retval, pointCommun };
    }

    switch (RefExam) {
        case 1:
            retval = decisionBEPC(P2, TypeCand, anneeScolaire);
            pointCommun = P2;
            break;
        case 2: case 3: case 4: case 5: case 7: case 8: case 9: case 10:
        case 11: case 12: case 13: case 14: case 15: case 16: case 17: case 18:
            retval = decisionBAC(RefExam, T);
            pointCommun = T;
            break;
        case 6:
            retval = decisionCEPE(T, TGP, TypeCand);
            pointCommun = TGP;
            break;

        default:
            retval = "Exam inconnu"; break;
    }

    return { retval, pointCommun };
}

const nZ = (value?: number) => {
    let note = 0
    if (value) note = value;
    return note
}
/**
 * Recuperer moyenne des élèves
 * @param id 
 * @returns 
 */
const recupMoyennesEleve = (periodeEval: number): Promise<IEleveMoyenne[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);

            //recuperer promotion notes et t_notes
            const tNotes = await functions.fetchTNotesGeneral(periodeEval);
            const notes = await functions.fetchNotesGeneral(periodeEval);
            const tNotesTech = await functions.fetchTNotesTechnique(periodeEval);
            console.log("🚀 ~ file: services.ts:1756 ~ returnnewPromise ~ tNotesTech:", tNotesTech)
            // const eleves = await functions.getEleveWithClasse()
            //merger les notes et t_notes (rang et moyenne)
            const noteTNotes = merge2ArraysOfObjects(tNotes, notes, "idEleve");
            const mergeData = [...noteTNotes, ...tNotesTech]
            // const mergedDataWithEleves = merge2ArraysOfObjects(noteTNotes, eleves, "idEleve")
            const formatedData = mergeData.map(item => {
                const dfa = shortDecFinAn(item.idTypeClasse, item.decision, item.sexe, item.serie)
                return {
                    idEleve: item[`idEleve`],
                    idClasse: item[`idClasse`],
                    "CF": item[`CF${periodeEval}`],
                    "OG": item[`OG${periodeEval}`],
                    "EO": item[`EO${periodeEval}`],
                    "FR": item[`FR${periodeEval}`],
                    "PHILO": item[`PHILO${periodeEval}`],
                    "HG": item[`HG${periodeEval}`],
                    "AN": item[`AN${periodeEval}`],
                    "LV2": item[`LV2${periodeEval}`],
                    "MATH": item[`MATH${periodeEval}`],
                    "SP": item[`SP${periodeEval}`],
                    "SVT": item[`SVT${periodeEval}`],
                    "EPS": item[`EPS${periodeEval}`],
                    "APMUS": item[`APMUS${periodeEval}`],
                    "ECM": item[`ECM${periodeEval}`],
                    "COND": item[`COND${periodeEval}`],
                    "MOYG": item[`MOYG${periodeEval}`],
                    "MOYG2": item[`MOYG2`],
                    "MOYG3": item[`MOYG3`],
                    "MOYG4": item[`MOYG4`],
                    "MOYGRangG": item[`MOYG${periodeEval}`] ? `${item[`MOYG${periodeEval}`]} - ${item[`RangG${periodeEval}`]}` : null,
                    "MOYG2RangG2": item[`MOYG2`] ? `${item[`MOYG2`]} - ${item[`RangG2`]}` : null,
                    "MOYG3RangG3": item[`MOYG3`] ? `${item[`MOYG3`]} - ${item[`RangG3`]}` : null,
                    "MOYG4RangG4": item[`MOYG4`] ? `${item[`MOYG4`]} - ${item[`RangG4`]}` : null,
                    "MCA": item[`MCA${periodeEval}`],
                    "MCB": item[`MCB${periodeEval}`],
                    "Info": item[`Info${periodeEval}`],
                    "TM": item[`TM${periodeEval}`],
                    "MCC": item[`MCC${periodeEval}`],
                    "MCD": item[`MCD${periodeEval}`],
                    "RangCF": item[`RangCF${periodeEval}`],
                    "RangOG": item[`RangOG${periodeEval}`],
                    "RangEO": item[`RangEO${periodeEval}`],
                    "RangFR": item[`RangFR${periodeEval}`],
                    "RangPHILO": item[`RangPHILO${periodeEval}`],
                    "RangHG": item[`RangHG${periodeEval}`],
                    "RangAN": item[`RangAN${periodeEval}`],
                    "RangLV2": item[`RangLV2${periodeEval}`],
                    "RangMATH": item[`RangMATH${periodeEval}`],
                    "RangSP": item[`RangSP${periodeEval}`],
                    "RangSVT": item[`RangSVT${periodeEval}`],
                    "RangEPS": item[`RangEPS${periodeEval}`],
                    "RangAPMUS": item[`RangAPMUS${periodeEval}`],
                    "RangECM": item[`RangECM${periodeEval}`],
                    "RangMCA": item[`RangMCA${periodeEval}`],
                    "RangMCB": item[`RangMCB${periodeEval}`],
                    "RangInfo": item[`RangInfo${periodeEval}`],
                    "RangMCC": item[`RangMCC${periodeEval}`],
                    "RangMCD": item[`RangMCD${periodeEval}`],
                    "RangG": item[`RangG${periodeEval}`],
                    "nomEleve": item[`nomEleve`],
                    "prenomEleve": item[`prenomEleve`],
                    "nomPrenomEleve": `${item['nomEleve']} ${item['prenomEleve']}`,
                    "matriculeEleve": item[`matriculeEleve`],
                    "libelleClasseCourt": item[`libelleClasseCourt`],
                    "libelleClasseLong": item[`libelleClasseLong`],
                    "cellulaireTuteur": item[`telTuteur`],
                    "serie": item[`serie`],
                    "idNiveau": item[`idNiveau`],
                    "idOrdreEnseignement": item[`idOrdreEnseignement`],
                    "idTypeClasse": item[`idTypeClasse`],
                    "libelleOrdreEnseignement": item[`ordreEnseignement`],
                    "libelleNiveauCourt": item[`libelleNiveauCourt`],
                    "libelleNiveauParSerie": item[`libelleNiveauParSerie`],
                    "dfa": dfa
                }
            })
            resolve(formatedData)
        } catch (error) {
            console.log("🚀 ~ file: services.ts:1396 ~ returnnewPromise ~ error:", error)
            reject(error);
        }
    });
}

const calculateTotalPoint = (item) => {
    const fields = ["CF", "MATH", "SP", "AN_Ecrit", "AN_Oral", "DQ", "MatAuSort", "EPS", "Philo", "FRO", "LV2", "LV2O", "HG", "SVT", "LV1", "EtText", "AEM", "DICTEE", "EDHC", "EGD", "EC", "TPI", "OC_E", "OC_O"];
    return fields.reduce((acc, field) => acc + nZ(item[field]), 0);
};
/**
 * recuperer les résultats de top jurys
 * @param id 
 * @returns 
 */
const fetchTopJuryResultats = async () => {
    try {
        const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);

        const topJuryData = await functions.fetchTopJuryResultats();
        const parentsEleves = await functions.fetchParents();

        const formatedData = topJuryData.map(item => {
            const totalPoint = calculateTotalPoint(item);
            const total = calculerTotal(item.RefExam, totalPoint, item.MatFac);
            const typeCand = typeCandidat(item.CandLibre, item.Disp, item.CEPE, item.RefExam);
            const p2 = pond(total, item.MGA, typeCand, anscol1);
            const soixantePourcentT1 = item.CandLibre ? null : +(0.6 * total).toFixed(2);
            const TGP = item.CandLibre ? total : parseFloat((nZ(item["40%T2"]) + nZ(soixantePourcentT1)).toFixed(2));
            const decision = findDec(item.RefExam, typeCand, total, p2, TGP, anscol1);
            return {
                ...item,
                totalPoint,
                total,
                typeCand,
                p2,
                "60%T1": soixantePourcentT1,
                TGP,
                decision: decision.retval,
                pointCommun: decision.pointCommun
            };
        });

        const mergedData = merge2ArraysOfObjects(formatedData, parentsEleves, "matriculeEleve");
        const filterNumCellDiffNull = mergedData.filter(item => item.cellulaireTuteur);

        return filterNumCellDiffNull;
    } catch (error) {
        throw error;
    }
};

/**
 * recuperer les sessions de top jurys
 * @param id 
 * @returns 
 */
const fetchTopJurySession = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);
            const topJurySessionData = await functions.fetchTopJurySession();
            resolve(topJurySessionData);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * recuperer les sessions de top jurys
 * @param id 
 * @returns 
 */
const fetchElevesMoyennesPrimaire = (data: IPayloadMoyenne) => {
    console.log("🚀 ~ file: services.ts:1890 ~ fetchElevesMoyennesPrimaire ~ data:", data)
    return new Promise(async (resolve, reject) => {
        try {
            const { compoId } = data
            const moyennes = await functions.compoMoyennesPrimaire(data);
            console.log("🚀 ~ file: services.ts:1895 ~ returnnewPromise ~ moyennes:", moyennes)
            const notes = await functions.compoMatieresNotesPrimaire([compoId]);
            console.log("🚀 ~ file: services.ts:1897 ~ returnnewPromise ~ notes:", notes)
            const dataGroupe = regrouperEvaluationParEleve(notes);
            const mergeData = merge2ArraysOfObjects(moyennes, dataGroupe, "idEleve")
            resolve(mergeData);
        } catch (error) {
            reject(error);
        }
    });
}
const getListeCompoPrimaire = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const compos = await functions.getListeCompoPrimaire();
            resolve(compos);
        } catch (error) {
            reject(error);
        }
    });
}



export default {
    creditSms,
    createOrUpdateSmsAccount,
    sendSmsVba,
    insererSmsBoiteEnvoie,
    supprimerSms,
    archiverSms,
    getClasses,
    getEleves,
    getPersonnel,
    getNiveaux,
    insererMessageGroupeBoiteEnvoi,
    envoyerMessage,
    messageBoiteEnvoie,
    envoyerMessagesAssiduite,
    archiverMessages,
    supprimerMessages,
    messageSmsBoiteEnvoie,
    envoyerSmsFromXServer,
    envoyerSmsAssiduite,
    listeCompteSms,
    changeDefaultSmsAccount,
    listeProviders,
    vbaSmsToSendBox,
    listeFournisseurs,
    addOrUpdateFournisseur,
    deleteFournisseur,
    fetchStudentsEvalNotes,
    fetchEvalProgs,
    envoyerSmsResultatScolaire,
    envoyerNotificationResultatsScolaires,
    envoiSmsProvider,
    recupMoyennesEleve,
    fetchTopJuryResultats,
    fetchTopJurySession,
    fetchElevesMoyennesPrimaire,
    getListeCompoPrimaire
}

