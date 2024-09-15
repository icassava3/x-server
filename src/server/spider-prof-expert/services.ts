import { paramEtabObjet } from './../databases/accessDB';
import { fetchPrivateRoute, fetchPublicRoute } from "../helpers/apiClient";

import { PROF_EXPERT_SERV, PROF_EXPERT_SERVER_URL, profDataDir } from "./constants";
import functions from "./functions";
import { IAppel, IAppelPayload, IAssiduite, IEncadreur, IEvalsAndProgs, IEvalsAndProgsPayload, IGetEvalsAndProgsResponse, IProfDataPayload } from "./interfaces";
import moment from 'moment';
import { checkWarehouseActivatedAndAuthorizedHddSerialNumber } from '../spider-whserver/services';
import { IAccessConfig } from '../helpers/interfaces';
import redisFunctions from "../databases/redis/functions";
const Json2csvParser = require("json2csv").Parser;
const fs = require("fs");
const uuid = require("uuid")
const _ = require('lodash');

const archiver = require('archiver');
const fse = require('fs-extra')

// register format for archiver
// note: only do it once per Node.js process/application, as duplicate registration will throw an error
archiver.registerFormat('zip-encrypted', require("archiver-zip-encrypted"));
const zipPwd = "@profEx2021"


/**
 * Obtenir les données relatives à un professeur
 * @param userPhone 
 * @returns 
 */
const getProfData = (getProfDataPayload: IProfDataPayload): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const payloadAnneeScolaire = getProfDataPayload.anneeScolaire
            const payloadCodeEtab = getProfDataPayload.codeEtab
            const idPersonnel = await functions.getProfId(getProfDataPayload.userPhone)
            const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab", "method_calc_eval", "decoupSemestres", "NomCompletEtab", "mode_calc_moy_period", "coef_test_lourd"]);
            const anneeScolaire = paramObj.anscol1
            const codeEtab = paramObj.codeetab
            const libEtab = paramObj.nomcompletetab
            const modeCalc = parseInt(paramObj.method_calc_eval || '1')         //2022-10-30 doit être de type number
            const decoupSemestres = parseInt(paramObj.decoupsemestres || '0')     //2022-10-30 doit être de type number
            //Attribuer des valeurs par defaut au cas ou ces 2 paramètres ne sont pas definient dans spider(access)
            const mode_calc_moy_period = paramObj.mode_calc_moy_period ? Number(paramObj.mode_calc_moy_period) : 1
            const coef_test_lourd = paramObj.coef_test_lourd ? Number(paramObj.coef_test_lourd) : 0

            //verifier que codeEtab et annee scolaire envoyé en parametre (par le prof ) correspondent bien à  codeEtab et annee scolaire de l'etablissement
            if (payloadCodeEtab !== codeEtab || payloadAnneeScolaire !== anneeScolaire) return reject({ name: "SCHOOL_NO_MATCH", message: "Les paramètres de votre requête ne correspondent pas à l'établissement actif sur x-Server" })
            const params = await functions.getProfEtabParams(anneeScolaire, codeEtab, libEtab, modeCalc, decoupSemestres, idPersonnel, mode_calc_moy_period, coef_test_lourd)

            const config = await redisFunctions.getGlobalVariable("accessConfig") as IAccessConfig;

            const logoPath = ` ${config.rootDir}Ressources\\${codeEtab}_logo.jpg`
            params.logo = fs.existsSync(logoPath) ? fs.readFileSync(logoPath, 'base64') : ''

            const resultEleves = await functions.getProfEleves(anneeScolaire, codeEtab, idPersonnel)
            const eleves = resultEleves.map(item => {
                const photoFile = `${config.studentsPhotoDir}${item.idEleve}.jpg`
                return {
                    ...item,
                    photo: fs.existsSync(photoFile)
                        ? fs.readFileSync(photoFile, 'base64')
                        : ''
                }
            })

            const classes = await functions.getProfClasses(anneeScolaire, codeEtab, idPersonnel)
            const evalProgs = await functions.getProfEvalProgs(anneeScolaire, codeEtab, idPersonnel)
            const evalNotes = await functions.getProfEvalNotes(anneeScolaire, codeEtab, idPersonnel)
            const planning = await functions.getProfPlanning(anneeScolaire, codeEtab, idPersonnel)
            const assiduite = await functions.getProfElevesAssiduite(idPersonnel)
            const appel = await functions.getProfElevesAppel(idPersonnel)
            resolve({ params, eleves, classes, evalProgs, evalNotes, planning, assiduite, appel })
        } catch (error) {
            console.log("🚀 ~ file: services.ts ~ line 48 ~ returnnewPromise ~ error", error)
            reject(error);
        }
    });
};

/**
 * Obtenir les données de mise à jour d'un professeur dans la base active sur x-server
 */
const getUpdatedProfData = (updateProfDataPayload: IProfDataPayload): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const idPersonnel = await functions.getProfId(updateProfDataPayload.userPhone)
            const payloadAnneeScolaire = updateProfDataPayload.anneeScolaire
            const payloadCodeEtab = updateProfDataPayload.codeEtab
            const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab", "method_calc_eval", "decoupSemestres", "NomCompletEtab", "mode_calc_moy_period", "coef_test_lourd"]);
            const anneeScolaire = paramObj.anscol1
            const codeEtab = paramObj.codeetab
            const libEtab = paramObj.nomcompletetab
            const modeCalc = paramObj.method_calc_eval || 1
            const decoupSemestres = paramObj.decoupsemestres
            //Attribuer des valeurs par defaut au cas ou ces 2 paramètres ne sont pas definient dans spider(access)
            const mode_calc_moy_period = paramObj.mode_calc_moy_period ? Number(paramObj.mode_calc_moy_period) : 1
            const coef_test_lourd = paramObj.coef_test_lourd ? Number(paramObj.coef_test_lourd) : 0

            //verifier que les paramètres de la requête correspondent bien aux paramètres de la base chargée dans spider
            if (payloadAnneeScolaire !== anneeScolaire || payloadCodeEtab !== codeEtab) return reject("Les paramètres de votre requête ne correspondent pas à l'établissement actif sur x-Server")

            const params = await functions.getProfEtabParams(anneeScolaire, codeEtab, libEtab, modeCalc, decoupSemestres, idPersonnel, mode_calc_moy_period, coef_test_lourd);
            const config = await redisFunctions.getGlobalVariable("accessConfig") as IAccessConfig;

            const logoPath = ` ${config.rootDir}/${codeEtab}_logo.jpg`
            params.logo = fs.existsSync(logoPath) ? fs.readFileSync(logoPath, 'base64') : ''

            const resultEleves = await functions.getProfEleves(anneeScolaire, codeEtab, idPersonnel)
            const eleves = resultEleves.map(item => {
                const photoFile = `${config.studentsPhotoDir}${item.idEleve}.jpg`
                return {
                    ...item,
                    photo: fs.existsSync(photoFile)
                        ? fs.readFileSync(photoFile, 'base64')
                        : ''
                }
            })

            const classes = await functions.getProfClasses(anneeScolaire, codeEtab, idPersonnel)
            const planning = await functions.getProfPlanning(anneeScolaire, codeEtab, idPersonnel)
            resolve({ params, eleves, classes, planning })

        } catch (error) {
            console.log("🚀 ~ file: services.ts ~ line 48 ~ returnnewPromise ~ error", error)
            reject(error);
        }
    });
};

/**
 * obtenir la liste des appels et assiduites en lignes pas encore synchronisé avec spider
 * @returns 
 */
export const recupererAppelAssiduiteNonSynchronise = (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            // await checkWarehouseActivatedAndAuthorizedHddSerialNumber();
            const { anscol1, codeetab } = await paramEtabObjet([
                "Anscol1",
                "CodeEtab",
            ]);
            const url = `${PROF_EXPERT_SERVER_URL}/listeappelassiduitenonsynchronise`;
            const response: any = await fetchPrivateRoute(url, { anneeScolaire: anscol1, codeEtab: codeetab });

            if (response.status === 1) {
                const { appels, assiduites } = response.data
                if (appels.length) {
                    const arrayAppel = (appels as IAppel[]).map(item => ([
                        item.anneeScolaire,
                        item.codeEtab,
                        item.idSeance,
                        moment(item.dateAppel).format("YYYY-MM-DD"),
                        item.idClasse,
                        item.idPersonnel,
                        item.plageHoraire,
                        item.libelleMatiereCourt,
                        item.libelleMatiereLong,
                        moment(item.dateSaisie).format("YYYY-MM-DD"),
                        item.operateurSaisie,
                        item.device,
                        1,//recup
                        "done",
                        moment().format("YYYY-MM-DD HH:mm:ss"),
                        moment().format("YYYY-MM-DD HH:mm:ss")
                    ]))
                    await functions.insererAppel(arrayAppel)
                }

                if (assiduites.length) {
                    const arrayAssiduiteAInserer = (assiduites as IAssiduite[]).map(item => ([
                        item.anneeScolaire,
                        item.codeEtab,
                        item.idEleve,
                        item.idSeance,
                        moment(item.dateAppel).format("YYYY-MM-DD"),
                        item.plageHoraire,
                        item.libelleMatiereCourt,
                        item.libelleMatiereLong,
                        item.status,
                        moment(item.dateSaisie).format("YYYY-MM-DD"),
                        item.operateurSaisie,
                        moment(item.dateModif).format("YYYY-MM-DD"),
                        item.operateurModif,
                        1,
                        item.device,
                        item.idClasse,
                        item.idPersonnel,
                        item.motif,
                        item.justifie,
                        item.fcm_messageId,
                        item.fcm_send_status,
                        item.fcm_date_lecture,
                        item.sms_messageId,
                        item.sms_send_status,
                        moment().format("YYYY-MM-DD HH:mm:ss"),
                        moment().format("YYYY-MM-DD HH:mm:ss")
                    ]))

                    await functions.updateAssiduite(arrayAssiduiteAInserer)
                }

                try {//marquer les assiduites et les appels en ligne comme recuperé
                    const data = { appels, assiduites }
                    await marquerAppelAssiduiteSynchronise(data);
                } catch (error) {
                    console.log("🚀 ~ file: services.ts:189 ~ returnnewPromise ~ error", error)
                }
            }
            resolve(true)
        } catch (error) {
            console.log("🚀 ~ file: services.ts:205 ~ returnnewPromise ~ error", error)
            reject(error);
        }
    });
};

/**
 * marquer un  appel effectué en ligne comme etant sychronisé en local (avec x-server) 
 * @param data 
 * @param setLog 
 * @returns 
 */
export const marquerAppelAssiduiteSynchronise = (data: { appels, assiduites }, setLog = true): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            // await checkWarehouseActivatedAndAuthorizedHddSerialNumber();
            const { appels, assiduites } = data;
            const url_ = `${PROF_EXPERT_SERVER_URL}/synchroniserappelassiduite`;
            const failedHttpLogOptions = (setLog && (appels.length || assiduites.length)) ? {
                service: PROF_EXPERT_SERV,
                action: "SYNCHRONISER_APPEL_ASSIDUITE",
                payload: data
            } : null;
            await fetchPrivateRoute(url_, data, failedHttpLogOptions);
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * inserrer un appel effectué par un prof en local et ensuite envoyé en ligne
 * @returns 
 */
const ajouterAppel = (data: IAppelPayload, io): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {

            const { anscol1, codeetab } = await paramEtabObjet([
                "Anscol1",
                "CodeEtab",
            ]);
            //inserer l'appel en bd
            await functions.insererAppel([
                [
                    anscol1,
                    codeetab,
                    data.idSeance,
                    data.dateAppel,
                    data.idClasse,
                    data.idPersonnel,
                    data.plageHoraire,
                    data.libelleMatiereCourt,
                    data.libelleMatiereLong,
                    data.dateSaisie,
                    data.operateurSaisie,
                    data.device,
                    1,//recup
                    "done",
                    moment().format("YYYY-MM-DD HH:mm:ss"),
                    moment().format("YYYY-MM-DD HH:mm:ss")
                ]
            ])

            //donnee appel a envoyé par socket
            const socketAppelData = [
                {
                    anneeScolaire: anscol1,
                    codeEtab: codeetab,
                    idSeance: data.idSeance,
                    dateAppel: data.dateAppel,
                    idClasse: data.idClasse,
                    plageHoraire: data.plageHoraire,
                    libelleMatiereCourt: data.libelleMatiereCourt,
                    libelleMatiereLong: data.libelleMatiereLong,
                    dateSaisie: data.dateSaisie,
                    operateurSaisie: data.operateurSaisie
                }
            ]

            const arrayAssiduiteASupprimer = []
            const socketAssiduiteData = [];
            const arrayAssiduiteAInserer = data.assiduites.map(item => {
                arrayAssiduiteASupprimer.push([item.idEleve, data.idSeance, data.dateAppel])//supprimer les appels du jour pour la meme seance et pour les memes eleve
                socketAssiduiteData.push({
                    anneeScolaire: anscol1,
                    codeEtab: codeetab,
                    idEleve: item.idEleve,
                    idSeance: data.idSeance,
                    dateAppel: data.dateAppel,
                    plageHoraire: data.plageHoraire,
                    libelleMatiereCourt: data.libelleMatiereCourt,
                    libelleMatiereLong: data.libelleMatiereLong,
                    status: item.status,
                    dateSaisie: data.dateSaisie,
                    operateurSaisie: data.operateurSaisie,
                    dateModif: data.dateModif,
                    operateurModif: data.operateurModif,
                    recup: data.recup,
                    device: data.device,
                    idClasse: data.idClasse,
                    idPersonnel: data.idPersonnel
                })
                return (
                    [
                        anscol1,
                        codeetab,
                        item.idEleve,
                        data.idSeance,
                        data.dateAppel,
                        data.plageHoraire,
                        data.libelleMatiereCourt,
                        data.libelleMatiereLong,
                        item.status,
                        data.dateSaisie,
                        data.operateurSaisie,
                        data.dateModif,
                        data.operateurModif,
                        1,
                        data.device,
                        data.idClasse,
                        data.idPersonnel,
                        null,//item.fcm_messageId,
                        null,//fcm_send_status,
                        null,//fcm_date_lecture,
                        null,//sms_messageId,
                        null,//sms_send_status,
                        moment().format("YYYY-MM-DD HH:mm:ss"),
                        moment().format("YYYY-MM-DD HH:mm:ss")
                    ]
                )
            })
            //suppression des données assuidites à mettre à jour
            let updated = 0
            let updatedData;
            let inserted = 0;
            let insertedData;
            if (arrayAssiduiteASupprimer.length !== 0) {
                updatedData = await functions.supprimerAssiduiteNonRecupere(arrayAssiduiteASupprimer)
                updated = updatedData.affectedRows
                insertedData = await functions.insererAssiduite(arrayAssiduiteAInserer)
                inserted = insertedData.affectedRows - updated
            }

            // informer dashboard client des nouvelles appel assiduité effectué
            const socketData = {
                appel: socketAppelData,
                assiduite: socketAssiduiteData
            }
            io.emit("assiduite_appel", socketData);

            try {
                await reenvoiAppelEnligne(data);
            } catch (error) {
                console.log("🚀 ~ file: services.ts:328 ~ returnnewPromise ~ error", error)
            }

            //retourner les lignes affecté
            // const updated = updatedData.affectedRows
            // const inserted = insertedData.affectedRows - updated
            resolve({ updated, inserted })
        } catch (error) {
            console.log("🚀 ~ file: services.ts ~ line 274 ~ returnnewPromise ~ error", error)
            reject(error);
        }
    });
};


/**
 * re(envoyer) en ligne un appel qui vient d'etre effectué (en local) vers x-server
 * @param data 
 * @returns 
 */
export const reenvoiAppelEnligne = (data: IAppelPayload, setLog: boolean = true): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            // await checkWarehouseActivatedAndAuthorizedHddSerialNumber();
            const url = `${PROF_EXPERT_SERVER_URL}/ajouterappel`;
            const dataAppelRecup = { ...data, recup: 1 }
            const failedHttpLogOptions = setLog ? {
                service: PROF_EXPERT_SERV,
                action: "ENVOYER_APPEL_ASSIDUITE",
                payload: dataAppelRecup
            } : null
            const response: any = await fetchPrivateRoute(url, dataAppelRecup, failedHttpLogOptions);
            //maj assiduite apres envoi notification parents*
            if (response.data.length !== 0) {
                const appelAssiduitedUpdated = response.data.map(item => ([
                    item.anneeScolaire,
                    item.codeEtab,
                    item.idEleve,
                    item.idSeance,
                    moment(item.dateAppel).format("YYYY-MM-DD"),
                    item.plageHoraire,
                    item.libelleMatiereCourt,
                    item.libelleMatiereLong,
                    item.status,
                    moment(item.dateSaisie).format("YYYY-MM-DD"),
                    item.operateurSaisie,
                    moment(item.dateModif).format("YYYY-MM-DD"),
                    item.operateurModif,
                    item.recup,
                    item.device,
                    item.idClasse,
                    item.idPersonnel,
                    item.motif,
                    item.justifie,
                    item.fcm_messageId,
                    item.fcm_send_status,
                    item.fcm_date_lecture,
                    item.sms_messageId,
                    item.sms_send_status,
                    moment().format("YYYY-MM-DD HH:mm:ss"),
                    moment().format("YYYY-MM-DD HH:mm:ss")
                ]))
                await functions.updateAssiduite(appelAssiduitedUpdated)
            }
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * obtenir les appels et assiduite pour les eleves d'un prof
 * @param idPersonnel 
 * @returns 
 */
const getProfEleveAppelAssiduite = (idPersonnel: number): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const assiduite = await functions.getProfElevesAssiduite(idPersonnel)
            const appel = await functions.getProfElevesAppel(idPersonnel)
            resolve({ assiduite, appel })
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Recupérer les évaluations et les programmations depuis PROF-EXPERT-SERVER et en faire des fichiers csv
 * et retourner leurs chemins
 * @param data 
 * @returns 
 */
const getEvalsAndProgs = (data: IEvalsAndProgsPayload): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        try {
            const evalNoteFieldsList = ["anScol", "codeEtab", "idEval", "refEleve", "noteEval", "dateSaisie", "opSaisie", "dateModif", "opModif", "recup", "device"]
            const evalProgFieldsList = ["anScol", "codeEtab", "idEval", "refClasse", "refMat", "periodeEval", "numEval", "coefEval", "dateCompo", "typeEval"]

            // Recupérer les évaluations et les programmations depuis Prof-Expert-Server v2
            const apiUrl = `${PROF_EXPERT_SERVER_URL}/getevalsandprogs`
            const res: any = await fetchPrivateRoute(apiUrl, data)

            const responseData: IEvalsAndProgs = res.data
            const { progs, notes } = responseData
            if (!progs.length) return reject({ name: "PROGS_NOT_FOUND", message: "Aucune programmation n'a été trouvée" })

            const progParser = new Json2csvParser({ header: true, quote: '', delimiter: ';' });
            const csv_prog_content = progParser.parse(progs);
            const noteParser = new Json2csvParser({ header: true, quote: '', delimiter: ';' });
            const csv_note_content = notes.length ? noteParser.parse(notes) : noteParser.parse(evalNoteFieldsList);

            // generate encrypted zipFile
            const downloadDir = "C:/SPIDER/spd_save_tmp"
            const sessionID = uuid.v4()
            const zipName = `eval_${data.anScol}_${data.codeEtab}_${sessionID}.zip`
            const zipPath = `${downloadDir}/${zipName}`
            const output = fs.createWriteStream(zipPath);
            const archive = archiver.create('zip-encrypted', { zlib: { level: 8 }, encryptionMethod: 'aes256', password: zipPwd });
            // const archive = archiver.create('zip', { zlib: { level: 8 } });
            archive.pipe(output);
            archive.append(csv_note_content, { name: 'evalNote.csv' })
            archive.append(csv_prog_content, { name: 'evalProg.csv' })
            archive.finalize();

            resolve(zipName)
        } catch (error) {
            console.log("🚀 ~ file: services.ts ~ line 350 ~ returnnewPromise ~ error", error)
            reject(error)
        }

    });
};



/**
 * récuperer tous les eleves d'un professeur
 * @param data 
 * @returns 
 */
const getProfEleves = (getProfDataPayload: IProfDataPayload) => {
    return new Promise(async (resolve, reject) => {
        try {
            const payloadAnneeScolaire = getProfDataPayload.anneeScolaire
            const payloadCodeEtab = getProfDataPayload.codeEtab
            const idPersonnel = await functions.getProfId(getProfDataPayload.userPhone)
            const { anscol1: anneeScolaire, codeetab: codeEtab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);
            //verifier que codeEtab et annee scolaire envoyé en parametre (par le prof ) correspondent bien à  codeEtab et annee scolaire de l'etablissement
            if (payloadCodeEtab !== codeEtab || payloadAnneeScolaire !== anneeScolaire) return reject({ name: "SCHOOL_NO_MATCH", message: "Les paramètres de votre requête ne correspondent pas à l'établissement actif sur x-Server" })
            const accessConfig = await redisFunctions.getGlobalVariable("accessConfig") as IAccessConfig;
            const resultEleves = await functions.getProfEleves(anneeScolaire, codeEtab, idPersonnel)
            const eleves = resultEleves.map(item => {
                const photoFile = `${accessConfig.studentsPhotoDir}${item.idEleve}.jpg`
                return {
                    ...item,
                    photo: fs.existsSync(photoFile)
                        ? fs.readFileSync(photoFile, 'base64')
                        : ''
                }
            })
            resolve(eleves);
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * récuperer toutes les classes d'un professeur
 * @param getProfDataPayload 
 * @returns 
 */
const getProfClasses = (getProfDataPayload: IProfDataPayload) => {
    return new Promise(async (resolve, reject) => {
        try {
            const payloadAnneeScolaire = getProfDataPayload.anneeScolaire
            const payloadCodeEtab = getProfDataPayload.codeEtab
            const idPersonnel = await functions.getProfId(getProfDataPayload.userPhone)
            const { anscol1: anneeScolaire, codeetab: codeEtab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);
            //verifier que codeEtab et annee scolaire envoyé en parametre (par le prof ) correspondent bien à  codeEtab et annee scolaire de l'etablissement
            if (payloadCodeEtab !== codeEtab || payloadAnneeScolaire !== anneeScolaire) return reject({ name: "SCHOOL_NO_MATCH", message: "Les paramètres de votre requête ne correspondent pas à l'établissement actif sur x-Server" })
            const classes = await functions.getProfClasses(anneeScolaire, codeEtab, idPersonnel)
            resolve(classes);
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * récuperer le planning professeur
 * @param getProfDataPayload 
 * @returns 
 */
const getProfPlanning = (getProfDataPayload: IProfDataPayload) => {
    return new Promise(async (resolve, reject) => {
        try {
            const payloadAnneeScolaire = getProfDataPayload.anneeScolaire
            const payloadCodeEtab = getProfDataPayload.codeEtab
            const idPersonnel = await functions.getProfId(getProfDataPayload.userPhone)
            const { anscol1: anneeScolaire, codeetab: codeEtab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);
            //verifier que codeEtab et annee scolaire envoyé en parametre (par le prof ) correspondent bien à  codeEtab et annee scolaire de l'etablissement
            if (payloadCodeEtab !== codeEtab || payloadAnneeScolaire !== anneeScolaire) return reject({ name: "SCHOOL_NO_MATCH", message: "Les paramètres de votre requête ne correspondent pas à l'établissement actif sur x-Server" })
            const planning = await functions.getProfPlanning(anneeScolaire, codeEtab, idPersonnel)

            resolve(planning);
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * 
 * @param getProfDataPayload 
 * @returns 
 */
const getProfEvalsAndProgs = (getProfDataPayload: IProfDataPayload) => {
    return new Promise(async (resolve, reject) => {
        try {
            const payloadAnneeScolaire = getProfDataPayload.anneeScolaire
            const payloadCodeEtab = getProfDataPayload.codeEtab
            const idPersonnel = await functions.getProfId(getProfDataPayload.userPhone)
            const { anscol1: anneeScolaire, codeetab: codeEtab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);
            //verifier que codeEtab et annee scolaire envoyé en parametre (par le prof ) correspondent bien à  codeEtab et annee scolaire de l'etablissement
            if (payloadCodeEtab !== codeEtab || payloadAnneeScolaire !== anneeScolaire) return reject({ name: "SCHOOL_NO_MATCH", message: "Les paramètres de votre requête ne correspondent pas à l'établissement actif sur x-Server" })
            const evalProgs = await functions.getProfEvalProgs(anneeScolaire, codeEtab, idPersonnel)
            const evalNotes = await functions.getProfEvalNotes(anneeScolaire, codeEtab, idPersonnel)

            resolve({ evalProgs, evalNotes });
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * La liste des prof qui font l'appel et l'envoi des notes en ligne
 * @returns 
 */
const checkProfEnvoiAppelNote = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const url = `${PROF_EXPERT_SERVER_URL}/prof-envoi-appels-notes`;
            const res = await fetchPublicRoute(url, {}) as any;
            resolve(res.data)

        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Retirer des comptes prof expert
 * @returns 
 */
const removeAccounts = (phones: string[], userName: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { anscol1, codeetab } = await paramEtabObjet([
                "Anscol1",
                "CodeEtab",
            ]);
            const apiPayload = {
                phones, userName, anneeScolaire: anscol1, codeEtab: codeetab

            }
            const url = `${PROF_EXPERT_SERVER_URL}/remove-accounts`;
            const res = await fetchPublicRoute(url, { ...apiPayload }) as any;
            resolve(res.data)
        } catch (error) {
            reject(error);
        }
    });
}

const getPersonnelAssignedToMatiere = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await functions.getPersonnelAssignedToMatiere();
            const uniqueData = _.uniqBy(data, 'idPersonne');
            resolve(uniqueData);
        } catch (error) {
            reject(error);
        }
    });
};

const generetEachProfDatabaseByUserphone = async (data: { finalArray: IProfDataPayload[] }): Promise<any> => {
    const finalArray = data.finalArray;
    const result: string[] = [];  // Un tableau pour stocker les noms des fichiers ZIP générés
    for (const item of finalArray) {
        const dataProf = await getProfData(item);
        if (dataProf) {
            const fileName = `${dataProf?.params?.idPersonnel}_${dataProf?.params?.nomPersonnel.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(" ", "")}_appData.json`;
            const zipName = fileName.replace(".json", ".zip");
            const zipPath = `${profDataDir}/${zipName}`;
            //Si le dossier prof-data n'existe pas, on le crée.
            await fse.ensureDir(profDataDir)
            const output = await fs.createWriteStream(zipPath);
            const archive = archiver.create('zip-encrypted', { zlib: { level: 8 }, encryptionMethod: 'aes256', password: zipPwd });
            archive.pipe(output);
            archive.append(JSON.stringify(dataProf), { name: fileName });
            await archive.finalize();  // Attend que la finalisation de l'archive soit terminée
            result.push(zipName);  // Ajoute le nom du fichier ZIP au tableau de résultats
        }
    }
    return result;
};

/**
 * Obtenir les utilisateurs d'un etablissement pour l'année en cours
 * @returns 
 */
const getUtilisateursProfExpert = () => {
    return new Promise(async (resolve, reject) => {
        try {
            //1- Obtenir les encadreurs 
            const encadreurs: any = await getPersonnelAssignedToMatiere()
            // console.log("🚀 ~ file: services.ts:722 ~ returnnewPromise ~ encadreurs:", encadreurs)
            //2- Obtenir le tableau des numéros (phone1 et/ou phone2) des encadreurs
            const encadreursphones: string[] = [];
            if (encadreurs) {
                encadreurs.map((item: IEncadreur) => {
                    // Vérifiez d'abord si phone1 existe et ajoutez-le au tableau.
                    if (item.phone1) {
                        encadreursphones.push(item.phone1);
                    }
                    // Ensuite, vérifiez si phone2 existe et ajoutez-le au tableau.
                    if (item.phone2) {
                        encadreursphones.push(item.phone2);
                    }
                });
            }
            // console.log("🚀 ~ encadreurs.map ~ encadreursphones:", encadreursphones)
            const url = `${PROF_EXPERT_SERVER_URL}/getutilisateursprofexpert`;
            const res = await fetchPublicRoute(url, { encadreursphones }) as any;

            //selectionner les numéro et profile du tableau pour envoyer au front
            const finalData = res.data.map(item => {
                return {
                    userPhone: item.userPhone,
                    profile: item.profile
                }
            })
            resolve(finalData)
        } catch (error) {
            reject(error);
        }
    });
}


const getEvaluationsProgs = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const progs = await functions.getEvaluationProgrammee();
            const notes = await functions.getEvaluation();
            resolve({ progs, notes });
        } catch (error) {
            reject(error);
        }
    });
};

export default {
    getProfData,
    recupererAppelAssiduiteNonSynchronise,
    getUpdatedProfData,
    ajouterAppel,
    getProfEleveAppelAssiduite,
    getEvalsAndProgs,
    getProfEleves,
    getProfClasses,
    getProfEvalsAndProgs,
    getProfPlanning,
    reenvoiAppelEnligne,
    marquerAppelAssiduiteSynchronise,
    checkProfEnvoiAppelNote,
    removeAccounts,
    getPersonnelAssignedToMatiere,
    generetEachProfDatabaseByUserphone,
    getUtilisateursProfExpert,
    getEvaluationsProgs
}