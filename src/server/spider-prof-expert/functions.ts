
import {
    appCnx,
    fetchFromMsAccess,
    paramEtabObjet,
} from "../../server/databases/accessDB";
import { _executeSql, _selectSql } from "../databases";
import { chunksArray } from "../helpers/function";
import { IAppel, IAssiduite, IClasse, IEleve, IEtabParams, IEvalNote, IEvalProg } from "./interfaces";
import redisFunctions from "../databases/redis/functions";

/**
 * Obtenir l'id du prof dans prod dans spider a partir de son numero telephone
 * @param userPhone 
 * @returns 
 */
const getProfId = (userPhone: string): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT Personnel.RefPersonnel AS idPersonne FROM Personnel WHERE Personnel.TélPers="${userPhone}" OR Personnel.CelPers="${userPhone}" `;
            const result = await fetchFromMsAccess<any[]>(sql, appCnx);
            if (result.length === 0) return reject({ name: 'USER_NOT_FOUND', message: `Votre numéro de telephone ${userPhone} n'est pas associé à un enseignant dans la base de l'établissement` })
            if (result.length >= 2) return reject({ name: 'MULTIPLE_USERS_FOUND', message: `Le numéro de telephone ${userPhone} est associé à plusieurs enseignant dans la base de l'établissement` })
            resolve(result[0].idPersonne)
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Obtenir les parametres d'etablissement pour un prof
 * @param userPhone 
 * @returns 
 */
const getProfEtabParams = (anneeScolaire: string, codeEtab: string, libEtab: string, modeCalc: number, decoupSemestres: number, idPersonnel: number, mode_calc_moy_period: number, coef_test_lourd: number): Promise<IEtabParams> => {
    return new Promise(async (resolve, reject) => {
        try {
            const sqlParams = `SELECT '${anneeScolaire}' AS anneeScolaire, '${codeEtab}' AS codeEtab, Personnel.RefPersonnel AS idPersonnel,
                [Personnel].[NomPers] & ' ' & [PrénomPers] AS nomPersonnel, Fonction.Fonction as fonction,
                Matières.MatLong AS specialite, Personnel.CelPers AS phone, "${libEtab}" AS libEtab, '' AS whatsapp, '' AS facebook, '' AS email,
                ${modeCalc} AS modeCalc, ${decoupSemestres} as decoupSemestres, '' as logo, ${mode_calc_moy_period} AS mode_calc_moy_period, ${coef_test_lourd} AS coef_test_lourd
                FROM (Personnel INNER JOIN Fonction ON Personnel.Fonction = Fonction.RefFonction) LEFT JOIN Matières ON Personnel.RefMatière = Matières.RefMatière
                WHERE personnel.RefPersonnel=${idPersonnel}`

            const resultParams = await fetchFromMsAccess<IEtabParams[]>(sqlParams, appCnx);
            resolve(resultParams[0])
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Obtenir la liste des eleves d'un prof
 * @param anneeScolaire 
 * @param codeEtab 
 * @param idPersonnel 
 * @returns 
 */
const getProfEleves = (anneeScolaire: string, codeEtab: string, idPersonnel: number): Promise<IEleve[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const matricOrMatricProv = await redisFunctions.getGlobalVariable("matricOrMatricProv");

            const sqlEleves = `SELECT '${anneeScolaire}' AS anneeScolaire, '${codeEtab}' AS codeEtab,
                  Elèves.RefElève AS idEleve, Classes.RefClasse AS idClasse, [NomElève] AS nomEleve, [PrénomElève] AS prenomEleve, ${matricOrMatricProv},
                  [Elèves].[dateNaiss] AS dateNaissance, [Elèves].[lieuNaiss] AS lieuNaissance, iif(Elèves.sexe is null or Elèves.sexe=1,"M","F") As sexe ,
                  IIf([elèves].[lv2] Is Null And [classes].[lv2] Is Null,"",  IIf([classes].[lv2]="Allemand" or [classes].[lv2]="Espagnol",LEFT([classes].[lv2],3), IIf(([Elèves].[Lv2] Is Not Null) And ([Elèves].[lv2] = "Allemand" or [Elèves].[lv2] = "Espagnol"),LEFT([Elèves].[lv2],3),""))) AS lv2,
                  IIf([elèves].[arts] Is Null And [classes].[arts] Is Null,"",IIf([classes].[arts]="AP" or [classes].[arts]="MUS",[classes].[arts], IIf(([Elèves].[arts] Is Not Null) And ([Elèves].[arts] = "AP" or [Elèves].[arts] = "MUS"),[Elèves].[arts],""))) AS arts,
                  Abs([elèves].[InaptEPS]) AS dispEPS, [elèves].[TélTuteur] AS parentPhone, iif([StatutElève] is null or [StatutElève]=2,0,1) as affecte, '' as photo
                  FROM Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
                  WHERE Classes.refClasse IN(SELECT refClasse FROM classe_matieres_prof_eval WHERE refPers =${idPersonnel}) AND Elèves.inscrit= -1 `

            const resultEleves = await fetchFromMsAccess<IEleve[]>(sqlEleves, appCnx);
            resolve(resultEleves)
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Obtenir la liste des classes d'un prof
 * @param anneeScolaire 
 * @param codeEtab 
 * @param idPersonnel 
 * @returns 
 */
const getProfClasses = (anneeScolaire: string, codeEtab: string, idPersonnel: number): Promise<IClasse[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const sqlClasses = `SELECT '${anneeScolaire}' AS anneeScolaire, '${codeEtab}' AS codeEtab,
                          refClasse As idClasse, IIf([idSousMatiere] Is Null, [refMat], [idSousMatiere]) AS idMatiere, classeCourt, refTypeClasse As idTypeClasse, 
                          ordreClasse, IIf([idSousMatiere] Is Null, [matCourt], [libelleSousMatiereCourt]) AS libelleMatiereCourt,
                          IIf([idSousMatiere] Is Null, [matLong], [libelleSousMatiereLong]) AS libelleMatiereLong,refPers As idPersonnel,[nomPers] AS nomPersonnel
                          FROM classe_matieres_prof_eval
                          WHERE refPers =${idPersonnel}`
            const resultClasses = await fetchFromMsAccess<IClasse[]>(sqlClasses, appCnx);
            resolve(resultClasses)
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Obtenir la liste des evaluations programme pour un prof
 * @param anneeScolaire 
 * @param codeEtab 
 * @param idPersonnel 
 * @returns 
 */
const getProfEvalProgs = (anneeScolaire: string, codeEtab: string, idPersonnel: number): Promise<IEvalProg[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const sqlProg = `
            SELECT '${anneeScolaire}' AS anneeScolaire, '${codeEtab}' AS codeEtab, B.idEval AS idEval, B.refClasse AS idClasse, B.refMat AS idMatiere, 
            B.periodeEval, B.numEval, B.coefEval AS coefEval, B.dateCompo AS dateCompo, B.typeEval AS typeEval
            FROM tb_eval_prog AS B 
            INNER JOIN 
            (SELECT classe_matieres_prof_eval.refClasse AS idClasse, IIf([idSousMatiere] Is Null,[refMat],[idSousMatiere]) AS idMatiere, 
                IIf([idSousMatiere] Is Null,[matCourt],[libelleSousMatiereCourt]) AS libelleMatiereCourt, 
                IIf([idSousMatiere] Is Null,[matLong],[libelleSousMatiereLong]) AS libelleMatiereLong, classe_matieres_prof_eval.refTypeClasse, 
            classe_matieres_prof_eval.ordreClasse, classe_matieres_prof_eval.nomPers, classe_matieres_prof_eval.refPers, classe_matieres_prof_eval.classeCourt
            FROM classe_matieres_prof_eval)  AS A 
            ON (B.refMat = A.idMatiere) AND (B.refClasse = A.idClasse)
            WHERE A.refPers=${idPersonnel};
            `
            const resultProg = await fetchFromMsAccess<IEvalProg[]>(sqlProg, appCnx);
            resolve(resultProg)
        } catch (error) {
            reject(error);
        }
    });
};


/**
 * Obtenir la liste des notes des evaluations pour un prof
 * @param anneeScolaire 
 * @param codeEtab 
 * @param idPersonnel 
 * @returns 
 */
const getProfEvalNotes = (anneeScolaire: string, codeEtab: string, idPersonnel: number): Promise<IEvalNote[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const sqlNotes = `SELECT '${anneeScolaire}' AS anneeScolaire, '${codeEtab}' AS codeEtab, B.idEval, tb_eval_note.refEleve AS idEleve, 
            tb_eval_note.noteEval, tb_eval_note.dateSaisie, tb_eval_note.opSaisie, tb_eval_note.dateModif,
            tb_eval_note.opModif, tb_eval_note.recup, tb_eval_note.device
            FROM (tb_eval_prog AS B
            INNER JOIN
            (SELECT refClasse AS idClasse, IIf([idSousMatiere] Is Null,[refMat],[idSousMatiere]) AS idMatiere,
            IIf([idSousMatiere] Is Null,[matCourt],[libelleSousMatiereCourt]) AS libelleMatiereCourt,
            IIf([idSousMatiere] Is Null,[matLong],[libelleSousMatiereLong]) AS libelleMatiereLong, refTypeClasse, ordreClasse, nomPers, refPers, classeCourt
            FROM classe_matieres_prof_eval)  AS A
            ON (B.refMat = A.idMatiere) AND (B.refClasse = A.idClasse))
            INNER JOIN tb_eval_note ON B.idEval = tb_eval_note.idEval
            WHERE A.refPers =${idPersonnel}`


            const resultNotes = await fetchFromMsAccess<IEvalNote[]>(sqlNotes, appCnx);
            resolve(resultNotes)
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Obtenir le planning (emploi du temps) d'un personnel enseignant
 */
const getProfPlanning = (anneeScolaire: string, codeEtab: string, idPersonnel: number): Promise<IEvalNote[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const sqlNotes = `SELECT DISTINCT horaire_plage_modele.RefHoraire AS idHoraire, classe_matieres_prof_eval.refClasse AS idClasse, classe_matieres_prof_eval.refMat AS idMatiere,
Personnel.RefPersonnel AS idPersonnel, Seances.RefSeance AS idSeance, classe_matieres_prof_eval.ClasseCourt AS libelleClasseCourt,  horaire_plage_modele.Horaire AS libelleHoraire,
classe_matieres_prof_eval.matCourt AS libelleMatiereCourt, classe_matieres_prof_eval.matLong AS libelleMatiereLong,
Personnel.NomPers AS nomPersonnel, Personnel.PrénomPers AS prenomPersonnel, horaire_plage_modele.PlageHoraire AS plageHoraire,
Personnel.Sexe AS sexe, Salles.NomSalle AS libelleSalle, Salles.RefSalle AS idSalle
FROM (((Seances LEFT JOIN Personnel ON Seances.RefPers = Personnel.RefPersonnel) LEFT JOIN Salles ON Seances.RefSalle = Salles.RefSalle)
INNER JOIN classe_matieres_prof_eval ON (Seances.RefPers = classe_matieres_prof_eval.refPers) AND (Seances.RefClasse = classe_matieres_prof_eval.refClasse)
AND (Seances.RefMatière = classe_matieres_prof_eval.refMat)) INNER JOIN horaire_plage_modele
ON (Seances.idModelePlageHoraire = horaire_plage_modele.idModelePlageHoraire) AND (Seances.RefHoraire = horaire_plage_modele.RefHoraire)
WHERE Seances.refPers =${idPersonnel}`
            const resultNotes = await fetchFromMsAccess<IEvalNote[]>(sqlNotes, appCnx);
            resolve(resultNotes)
        } catch (error) {
            reject(error);
        }
    });
};


const getProfPlanning__old = (anneeScolaire: string, codeEtab: string, idPersonnel: number): Promise<IEvalNote[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const sqlNotes = `SELECT DISTINCT Horaires.RefHoraire AS idHoraire, classe_matieres_prof_eval.refClasse AS idClasse, 
            classe_matieres_prof_eval.refMat AS idMatiere, Personnel.RefPersonnel AS idPersonnel, Seances.RefSeance AS idSeance, 
            classe_matieres_prof_eval.ClasseCourt AS libelleClasseCourt, Horaires.Horaire AS libelleHoraire, classe_matieres_prof_eval.matCourt AS libelleMatiereCourt, 
            classe_matieres_prof_eval.matLong AS libelleMatiereLong, Personnel.NomPers AS nomPersonnel, Personnel.PrénomPers AS prenomPersonnel, 
            Horaires.PlageHoraire AS plageHoraire, Personnel.Sexe AS sexe, Salles.NomSalle AS libelleSalle, Salles.RefSalle AS idSalle
FROM (((Seances LEFT JOIN Personnel ON Seances.RefPers = Personnel.RefPersonnel) INNER JOIN Horaires ON Seances.RefHoraire = Horaires.RefHoraire) 
LEFT JOIN Salles ON Seances.RefSalle = Salles.RefSalle) 
INNER JOIN classe_matieres_prof_eval ON (classe_matieres_prof_eval.refPers = Seances.RefPers) AND (Seances.RefClasse = classe_matieres_prof_eval.refClasse) 
AND (Seances.RefMatière = classe_matieres_prof_eval.refMat)
WHERE Seances.refPers =${idPersonnel}`
            const resultNotes = await fetchFromMsAccess<IEvalNote[]>(sqlNotes, appCnx);
            resolve(resultNotes)
        } catch (error) {
            reject(error);
        }
    });
};


/**
 * selectionner tous les assiduite (absence, retard) pointé par un professeur
 * @param idPersonnel 
 * @returns 
 */
const getProfElevesAssiduite = (idPersonnel: number): Promise<IAssiduite[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT * FROM assiduite WHERE idPersonnel = ?`
            const res: IAssiduite[] = await _selectSql(sql, [idPersonnel]);
            resolve(res)
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * recupper tous les appel effectuées par un professeur
 * @param idPersonnel 
 * @returns 
 */
const getProfElevesAppel = (idPersonnel: number): Promise<IAppel[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT * FROM appel WHERE idPersonnel = ?`
            const res: IAppel[] = await _selectSql(sql, [idPersonnel]);
            resolve(res)
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * marquer un ou plusieurs eleve comme absent / retard si pas encore recupperer par l'etablissement
 * @param dataAbsenceArray 
 * @returns 
 */
const insererAssiduite = (dataAbsenceArray: (string | number | Date)[][]): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const fields = `anneeScolaire,codeEtab,idEleve,idSeance,dateAppel,plageHoraire,libelleMatiereCourt,libelleMatiereLong,status,dateSaisie,operateurSaisie,dateModif,
            operateurModif,recup,device,idClasse,idPersonnel,fcm_messageId,fcm_send_status,fcm_date_lecture,sms_messageId,sms_send_status,createdAt,updatedAt`

            let valuesPlaceholders = dataAbsenceArray.map(() => "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").join(', ');
            const sql = `INSERT OR IGNORE INTO assiduite (${fields}) VALUES ${valuesPlaceholders}`;
            let values = [];
            dataAbsenceArray.forEach((arr) => { arr.forEach((item) => { values.push(item) }) });
            const res = await _executeSql(sql, values);
            resolve(res)
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * inserer les données d'un appel 
 * @param  
 * @returns 
 */
const insererAppel = (data: (string | number)[][]): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            const fields = `anneeScolaire,codeEtab,idSeance,dateAppel,idClasse,idPersonnel,plageHoraire,libelleMatiereCourt,
      											libelleMatiereLong,dateSaisie,operateurSaisie,device,recup,status,createdAt,updatedAt`;
            // const placeHolder = "(?" + ",?".repeat(fields.split(",").length - 1) + ")"
            // const appelValuesChunks = chunksArray(data, 450);
            // appelValuesChunks.map(async (chunkItem) => {
            //     const placeholders = chunkItem.map(() => placeHolder).join(', ');
            //     console.log("🚀 ~ file: functions.ts:305 ~ appelValuesChunks.map ~ placeholders", placeholders)
            //     const values = chunkItem.map(arr => arr.map(arrItem => arrItem))
            //     console.log("🚀 ~ file: functions.ts:307 ~ appelValuesChunks.map ~ values", values)
            //     const sqlAppel = `INSERT OR IGNORE INTO appel (${fields}) VALUES ${placeholders}`;
            //     await _executeSql(sqlAppel, values);
            // })

            const valuesChunks = chunksArray(data, 450);
            await Promise.all(valuesChunks.map(async chunkItem => {
                let valuesPlaceholders = chunkItem.map(() => "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").join(', ');
                const sql = `INSERT OR IGNORE INTO appel (${fields}) VALUES ${valuesPlaceholders}`;
                let values = [];
                chunkItem.forEach((arr) => { arr.forEach((item) => { values.push(item) }) });
                await _executeSql(sql, values);
            }))
            resolve(true)
        } catch (error) {
            console.log("🚀 ~ file: functions.ts:318 ~ returnnewPromise ~ error", error)
            reject(error);
        }
    });
};

/**
 * recuperer les logs prof experts
 */
export function fetchErrorLogs<IFocusEcoleLogItem>(logIds: number[] | null = null) {
    return new Promise(async (resolve, reject) => {
        try {
            if (logIds) {
                const sql = `SELECT * FROM prof_expert_logs WHERE id IN  (${logIds.join(
                    ","
                )})`;
                const result: IFocusEcoleLogItem[] = await _selectSql(sql, []);
                resolve(result);
            } else {
                const sql = `SELECT * FROM prof_expert_logs`;
                const result: IFocusEcoleLogItem[] = await _selectSql(sql, []);
                resolve(result);
            }
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Loguer une erreur (envoi, recuperation de donne) de prof expert
 * @param action 
 * @param payload 
 * @param statut 
 * @returns 
 */
const insererProfExpertLog = (action: string, payload: any, logStatus: 0 | 1, anneeScolaire: string, codeEtab: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const dateNow = new Date().toLocaleString();
            const sql = `INSERT INTO prof_expert_logs (anneeScolaire,codeEtab,action, payload, statut,created_at,updated_at) VALUES (?,?,?, ?, ?, ?, ?)`;
            const payloadStringify = JSON.stringify(payload);
            await _executeSql(sql, [anneeScolaire, codeEtab, action, payloadStringify, logStatus, dateNow, dateNow]);
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * supprimer les assiduite qui ne sont pas encore recuperer par l'etablissement
 * @param dataAbsenceArray 
 * @returns 
 */
const supprimerAssiduiteNonRecupere = (dataAbsenceArray: any): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {

            let valuesPlaceholders = dataAbsenceArray.map((item) => `(idEleve=? AND idSeance=? AND dateAppel=? AND recup=0)`).join(' OR ');

            const sql = `DELETE FROM assiduite WHERE ${valuesPlaceholders}`
            let values = [];
            dataAbsenceArray.forEach((arr) => { arr.forEach((item) => { values.push(item) }) });
            const res = await _executeSql(sql, values);
            resolve(res)
        } catch (error) {
            console.log("🚀 ~ file: functions.ts ~ line 217 ~ returnnewPromise ~ error", error)
            reject(error);
        }
    });
};

/**
 * Maj assiduite 
 * @param dataAbsenceArray 
 * @returns 
 */
const updateAssiduite = (assisduiteUpdatedValues: any): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {

            const fields = `anneeScolaire,codeEtab,idEleve,idSeance,dateAppel,plageHoraire,
            libelleMatiereCourt,libelleMatiereLong,status,dateSaisie,operateurSaisie,dateModif,operateurModif,
            recup,device,idClasse,idPersonnel,motif,justifie,fcm_messageId,fcm_send_status,fcm_date_lecture,sms_messageId,sms_send_status,createdAt,updatedAt`

            // const placeHolder = "(?" + ",?".repeat(fields.split(",").length - 1) + ")"
            // const assisduiteValuesChunks = chunksArray(assisduiteUpdatedValues, 450);
            // assisduiteValuesChunks.map(async (chunkItem) => {
            //     const placeholders = chunkItem.map(() => placeHolder).join(', ');
            //     console.log("🚀 ~ file: functions.ts:408 ~ assisduiteValuesChunks.map ~ placeholders", placeholders)
            //     const values = chunkItem.map(arr => arr.map(arrItem => arrItem))
            //     console.log("🚀 ~ file: functions.ts:410 ~ assisduiteValuesChunks.map ~ values", values)
            //     const sqlAppel = `REPLACE INTO assiduite (${fields}) VALUES ${placeholders}`;
            //     await _executeSql(sqlAppel, values);
            // })

            const valuesChunks = chunksArray(assisduiteUpdatedValues, 450);
            await Promise.all(valuesChunks.map(async chunkItem => {
                let valuesPlaceholders = chunkItem.map(() => "(?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?)").join(', ');
                const sql = `REPLACE INTO assiduite (${fields}) VALUES ${valuesPlaceholders}`;
                let values = [];
                chunkItem.forEach((arr) => { arr.forEach((item) => { values.push(item) }) });
                await _executeSql(sql, values);
            }))
            resolve(true)
        } catch (error) {
            // console.log("🚀 ~ file: functions.ts ~ line 217 ~ returnnewPromise ~ error", error)
            reject(error);
        }
    });
};


const getAppel = (idSeance: number, dateAppel: string, idClasse: number, anneeScolaire: string, codeEtab: string): Promise<IAppel[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT * FROM appel WHERE anneeScolaire = ? AND codeEtab=? AND idClasse=? AND idSeance = ? AND dateAppel=?`
            const res: IAppel[] = await _selectSql(sql, [anneeScolaire, codeEtab, idClasse, idSeance, dateAppel]);
            resolve(res)
        } catch (error) {
            reject(error);
        }
    });
};


const getPersonnelAssignedToMatiere = (): Promise<any[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);
            const sql = `SELECT DISTINCT classe_matieres_prof_eval.refPers AS idPersonne, classe_matieres_prof_eval.refPers AS idPersonnel,
             "${anscol1}" AS anneeScolaire, "${codeetab}" AS codeEtab, classe_matieres_prof_eval.classeCourt,
              classe_matieres_prof_eval.matCourt AS specialite, Personnel.TélPers AS phone1, Personnel.CelPers AS phone2,
               classe_matieres_prof_eval.nomPers AS nomPrenomPersonnel, Fonction.Fonction AS fonction,Personnel.email
            FROM (classe_matieres_prof_eval INNER JOIN Personnel ON classe_matieres_prof_eval.refPers = Personnel.RefPersonnel)
            INNER JOIN Fonction ON Personnel.Fonction = Fonction.RefFonction
            ORDER BY classe_matieres_prof_eval.nomPers;
             `
            const result = await fetchFromMsAccess<IEvalNote[]>(sql, appCnx);
            resolve(result)
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * recuperer les évaluations programmées
 * @returns 
 */
export function getEvaluationProgrammee(): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT tb_eval_prog.idEval as idProg FROM tb_eval_prog;`
            const result = await fetchFromMsAccess<any>(sql, appCnx);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * recuperer les notes evalutions
 * @returns 
 */
export function getEvaluation(): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT tb_eval_note.idEval as idNote
            FROM tb_eval_note INNER JOIN tb_eval_prog ON tb_eval_note.idEval = tb_eval_prog.idEval;
            `
            const result = await fetchFromMsAccess<any>(sql, appCnx);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
};

export default {
    getProfId,
    getProfEtabParams,
    getProfEleves,
    getProfClasses,
    getProfEvalProgs,
    getProfEvalNotes,
    getProfPlanning,
    getProfElevesAssiduite,
    insererAppel,
    insererAssiduite,
    supprimerAssiduiteNonRecupere,
    updateAssiduite,
    insererProfExpertLog,
    getProfElevesAppel,
    getAppel,
    getPersonnelAssignedToMatiere,
    getEvaluationProgrammee,
    getEvaluation
}