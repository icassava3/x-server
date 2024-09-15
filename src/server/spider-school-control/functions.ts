import { appCnx, dataCnx, fetchFromMsAccess, paramEtabObjet } from "../databases/accessDB";

import moment from "moment";
import { ISchoolControlActivitiesConfig } from "../../client/store/interfaces";
import { _executeSql, _selectSql } from "../databases";
import { IActivite, IItemStudentDataFraisScolaire, IEleveClasse, ISchoolControlActivityStatusUpdate, IHistoriquePointagePayload, IPersonnelFonction, IPointage, IPointagePayload, IControleItem, IParentContact } from "./interfaces";
import { getTodayDateTime } from "../helpers/function";
import { ISendBoxMessages } from "../spider-messagerie/interfaces";

/**
 * Enregistrer le pointage d'une personne pour une activité
 * 
 */

const insererPointage = (data: IPointagePayload): Promise<number> => {
    const { idPersonne, idActivite, anneeScolaire, codeEtab, operateur, idPlage, sensAcces } = data
    return new Promise(async (resolve, reject) => {
        try {
            const dateNow = moment().format("YYYY-MM-DD")
            const sensAccesValues = sensAcces || 0;
            const values = [
                idActivite,
                idPersonne,
                codeEtab,
                anneeScolaire,
                idPlage,
                operateur,
                dateNow,
                sensAccesValues
            ];
            const sql = `INSERT INTO pointage (idActivite,idPersonne, codeEtab, anneeScolaire, idPlage, operateur, datePointage,sensAcces) VALUES (?,?,?,?,?,?,?,?)`;

            const pointageEleveCantineInserted: any = await _executeSql(sql, [...values]);
            resolve(pointageEleveCantineInserted.lastID);

        } catch (error) {
            reject(error);
        }
    })
}


/**
 *  Obtenir la liste des pointages d'un eleve pour une activite et pour une date
 * @param idEleve 
 * @returns 
 */
const getEleveActivitePointage = (idEleve: number, idActivite: string, idPlage: number = null): Promise<IPointage[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const today = moment().format("YYYY-MM-DD")
            let sql = `SELECT pointage.*,_activite_school_control.libelleActivite
                FROM pointage INNER JOIN _activite_school_control ON pointage.idActivite = _activite_school_control.idActivite
                 WHERE pointage.idPersonne=? AND pointage.idActivite=? AND pointage.datePointage=?`;
            let values = [idEleve, idActivite, today];
            if (idPlage) {
                sql = `${sql}  AND pointage.idPlage=?`;
                values.push(idPlage)
            }
            const result: (any)[] = await _selectSql(sql, values)
            resolve(result)
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Obtenir les info sur un pointage
 * @param idPointage 
 * @returns 
 */
const getPointageData = (idPointage): Promise<IPointage[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            let sql = `SELECT pointage.*,_activite_school_control.libelleActivite
                FROM pointage INNER JOIN _activite_school_control ON pointage.idActivite = _activite_school_control.idActivite
                 WHERE pointage.idPointage=? `;
            const result: (any)[] = await _selectSql(sql, [idPointage])
            resolve(result[0])
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Obtenir les eleves avec leur classes depuis vba
 * @param idEleves 
 * @returns 
 */
export function getEleveWithClasse(idEleves: number[]): Promise<(IEleveClasse[])> {

    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT DISTINCT Elèves.RefElève AS idPersonne,Elèves.Sexe AS genre,Elèves.nomElève AS nomEleve, Elèves.prénomElève AS prenomEleve,Elèves.matriculeNational AS matriculeEleve,
                Classes.ClasseCourt AS libelleClasseCourt,Classes.ClasseLong AS libelleClasseLong
                FROM Elèves INNER JOIN Classes ON Elèves.RefClasse = Classes.RefClasse
                WHERE Elèves.RefElève IN (${idEleves.join(",")})
                `;
            const result = await fetchFromMsAccess<IEleveClasse[]>(sql, appCnx);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}


/**
 * Obtenir les membres du personnel avec leur fonctions depuis vba
 * @param idEleves 
 * @returns 
 */
export function getPersonnelWithFonction(idPersonne: number[]): Promise<(IPersonnelFonction[])> {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT Personnel.RefPersonnel AS idPersonnel, Personnel.NomPers AS nomPersonnel, Personnel.PrénomPers AS prenomPersonnel,IIf(Personnel.Sexe="M",1,2) AS genre, Fonction.Fonction AS fonction
            FROM Personnel LEFT JOIN Fonction ON Personnel.Fonction = Fonction.RefFonction
            WHERE Personnel.RefPersonnel IN (${idPersonne.join(",")})`;
            const result = await fetchFromMsAccess<IPersonnelFonction[]>(sql, appCnx);
            resolve(result);
        } catch (error) {
            console.log("🚀 ~ file: functions.ts ~ line 43 ~ returnnewPromise ~ error", error)
            reject(error);
        }
    });
}

/**
 * Obtenir l'historiques des pointages d'une activité
 * @param data 
 * @returns 
 */
const getHistoriquePointageActivite = (data: IHistoriquePointagePayload): Promise<IPointage[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const { datePointage, idActivite, codeEtab, anneeScolaire } = data
            let result: IPointage[] = [];
            if (datePointage) {
                const today = moment(datePointage).format("YYYY-MM-DD")
                const sql = `SELECT pointage.*,_activite_school_control.libelleActivite
                FROM pointage INNER JOIN _activite_school_control ON pointage.idActivite = _activite_school_control.idActivite
                WHERE pointage.idActivite=? AND pointage.datePointage=? AND pointage.codeEtab=? AND pointage.anneeScolaire=?`;
                // console.log("🚀 ~ file: functions.ts ~ line 91 ~ returnnewPromise ~ sql", sql)
                result = await _selectSql(sql, [idActivite, today, codeEtab, anneeScolaire]);
            } else {
                const sql = `SELECT pointage.*,_activite_school_control.libelleActivite 
                            FROM pointage INNER JOIN _activite_school_control ON pointage.idActivite = _activite_school_control.idActivite 
                            WHERE pointage.codeEtab=? AND pointage.anneeScolaire=?`;
                result = await _selectSql(sql, [codeEtab, anneeScolaire]);
            }
            resolve(result);

        } catch (error) {
            reject(error);
        }
    });
}


export function getSuperUser(spdUser: string): Promise<(IEleveClasse[])> {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT user FROM UsysDroits WHERE [UsysDroits].[User]="${spdUser}" AND [UsysDroits].[module]="SUPER ADMIN"`;
            console.log("🚀 ~ file: functions.ts ~ line 105 ~ returnnewPromise ~ sql", sql)
            const result = await fetchFromMsAccess<IEleveClasse[]>(sql, dataCnx);
            resolve(result);

        } catch (error) {
            console.log("🚀 ~ file: functions.ts ~ line 43 ~ returnnewPromise ~ error", error)
            reject(error);
        }
    });
}

// /**
//  * Selectionner tous les echeanciers dont la date limite est passée
//  * @returns 
//  */
// export function controleEcheanciers(): Promise<(IItemStudentDataFraisScolaire[])> {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const sql = `SELECT echeancier.idEleve, echeancier.idRubrique, echeancier.libelleRubrique, echeancier.datelimite, echeancier.optionnel, 
//             echeancier.montant AS netAPayer, echeancier.dejaPaye AS dejaPaye, echeancier.solde AS resteAPayer, Elèves.Sexe AS genre, 
//             Elèves.NomElève AS nomEleve, Elèves.PrénomElève AS prenomEleve, Elèves.MatriculeNational AS matriculeEleve, Classes.ClasseCourt AS libelleClasseCourt,
//              Classes.ClasseLong AS libelleClasseLong, tbl_groupe_rubrique_optionnel.libelle_groupe AS libelleGroupeOptionnel, TypesVersement.groupe_optionnel AS idGroupeOptionnel,
//               echeancier.description
//             FROM (((echeancier INNER JOIN Elèves ON echeancier.idEleve = Elèves.RefElève) INNER JOIN Classes ON Elèves.RefClasse = Classes.RefClasse) INNER JOIN TypesVersement ON echeancier.idRubrique = TypesVersement.RefTypeVers) LEFT JOIN tbl_groupe_rubrique_optionnel ON TypesVersement.groupe_optionnel = tbl_groupe_rubrique_optionnel.id_groupe;

//             `;
//             const result = await fetchFromMsAccess<IItemStudentDataFraisScolaire[]>(sql, appCnx);
//             resolve(result);

//         } catch (error) {
//             console.log("🚀 ~ file: functions.ts ~ line 43 ~ returnnewPromise ~ error", error)
//             reject(error);
//         }
//     });
// }


export function controleEcheanciers(studentIds: number[] | null = null): Promise<(IItemStudentDataFraisScolaire[])> {
    return new Promise(async (resolve, reject) => {
        try {
            const baseSql = `SELECT echeancier.idEleve, echeancier.idRubrique, echeancier.libelleRubrique, echeancier.datelimite, echeancier.optionnel,
            echeancier.montant AS netAPayer, echeancier.dejaPaye AS dejaPaye, echeancier.solde AS resteAPayer, Elèves.Sexe AS genre,
            Elèves.NomElève AS nomEleve, Elèves.PrénomElève AS prenomEleve, Elèves.MatriculeNational AS matriculeEleve, Classes.ClasseCourt AS libelleClasseCourt,
             Classes.ClasseLong AS libelleClasseLong, tbl_groupe_rubrique_optionnel.libelle_groupe AS libelleGroupeOptionnel, TypesVersement.groupe_optionnel AS idGroupeOptionnel,
              echeancier.description
            FROM (((echeancier INNER JOIN Elèves ON echeancier.idEleve = Elèves.RefElève) INNER JOIN Classes ON Elèves.RefClasse = Classes.RefClasse)
            INNER JOIN TypesVersement ON echeancier.idRubrique = TypesVersement.RefTypeVers)
            LEFT JOIN tbl_groupe_rubrique_optionnel ON TypesVersement.groupe_optionnel = tbl_groupe_rubrique_optionnel.id_groupe
            `;
            const sql = studentIds
                ? `${baseSql} WHERE echeancier.idEleve IN (${studentIds.join(",")})`
                : baseSql;
            const result = await fetchFromMsAccess<IItemStudentDataFraisScolaire[]>(sql, appCnx);
            resolve(result);
        } catch (error) {
            console.log(":fusée: ~ file: functions.ts ~ line 43 ~ returnnewPromise ~ error", error)
            reject(error);
        }
    });
}












/**
* Obtenir la liste des actvités
*/
export const getListeActivites = (data?): Promise<IActivite[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            let sql = ``
            if (data?.idTypeActiviteSchoolControl) {
                sql = `SELECT * FROM _activite_school_control WHERE idTypeActiviteSchoolControl=?`
            } else {
                sql = `SELECT * FROM _activite_school_control `
            }
            const result: IActivite[] = await _selectSql(sql, [data?.idTypeActiviteSchoolControl]);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

/*
 * Enregistrer la configuration de l'activité pour un etablissement
 */
const insererSchoolControlActivitiesConfig = (data: ISchoolControlActivitiesConfig): Promise<number> => {
    return new Promise(async (resolve, reject) => {
        try {
            const { anscol1, codeetab } = await paramEtabObjet([
                "Anscol1",
                "CodeEtab",
            ]);
            const configStringify = JSON.stringify(data.config)
            const values = [
                codeetab,
                anscol1,
                data.idActivite,
                configStringify
            ]
            const sql = `INSERT INTO schoolcontrol_activities_config (codeEtab, anneeScolaire, idActivite, config) VALUES (?,?,?,?)`;
            const schoolControlConfigInserted: any = await _executeSql(sql, [...values]);
            resolve(schoolControlConfigInserted.lastID);

        } catch (error) {
            console.log("🚀 ~ file: functions.ts:233 ~ returnnewPromise ~ error:", error)
            reject(error);
        }
    })
}

/*
 * Modifier la configuration d'un activité de school control
 */
const updateSchoolControlActivitiesConfig = (data: ISchoolControlActivitiesConfig): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            const { anscol1, codeetab } = await paramEtabObjet([
                "Anscol1",
                "CodeEtab",
            ]);
            const configStringify = JSON.stringify(data.config)
            const values = [
                configStringify,
                codeetab,
                anscol1,
                data.idActivite
            ]
            const sql = `UPDATE schoolcontrol_activities_config SET config = ? WHERE codeEtab = ? AND anneeScolaire = ? AND idActivite = ?`;
            await _executeSql(sql, [...values]);
            resolve(true);

        } catch (error) {
            reject(error);
        }
    })
}

const getSchoolControlActivitiesConfig = (idActivite: string): Promise<ISchoolControlActivitiesConfig[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("🚀 ~ file: functions.ts:271 ~ getSchoolControlActivitiesConfig ~ idActivite:", idActivite)
            const { anscol1, codeetab } = await paramEtabObjet([
                "Anscol1",
                "CodeEtab",
            ]);
            const sql = `SELECT * FROM schoolcontrol_activities_config WHERE codeEtab = ?  AND  anneeScolaire = ? AND idActivite = ?`;
            const schoolConfig = await _selectSql(sql, [codeetab, anscol1, idActivite]);
            console.log("🚀 ~ file: functions.ts:280 ~ returnnewPromise ~ schoolConfig:", schoolConfig)
            if (!schoolConfig.length) return resolve([])
            const dataParsed: ISchoolControlActivitiesConfig[] = [{ ...schoolConfig[0], config: JSON.parse(schoolConfig[0].config) }]
            console.log("🚀 ~ file: functions.ts:270 ~ returnnewPromise ~ dataParsed:", dataParsed)
            resolve(dataParsed);
        } catch (error) {
            reject(error);
        }
    })
}

export const getAllSchoolControlActivitiesConfig = (): Promise<ISchoolControlActivitiesConfig[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const { anscol1, codeetab } = await paramEtabObjet([
                "Anscol1",
                "CodeEtab",
            ]);
            const sql = `SELECT * FROM schoolcontrol_activities_config WHERE codeEtab = ? AND anneeScolaire = ? `;
            const data = await _selectSql(sql, [codeetab, anscol1]);
            if (!data.length) {
                resolve([])
            } else {
                const dataParse: ISchoolControlActivitiesConfig[] = data?.map((item: any) => {
                    return { ...item, config: JSON.parse(item.config) }
                })
                resolve(dataParse);
            }
        } catch (error) {
            reject(error);
        }
    })
}

/*
 * Activer ou desactiver une activité de school control
 */
const toggleSchoolControlActivityStatus = (data: ISchoolControlActivityStatusUpdate): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            const { anscol1, codeetab } = await paramEtabObjet([
                "Anscol1",
                "CodeEtab",
            ]);
            const values = [
                data.status,
                codeetab,
                anscol1,
                data.idActivite,
            ]
            const sql = `UPDATE schoolcontrol_activities_config SET activiteStatus = ? WHERE codeEtab = ? AND anneeScolaire = ? AND idActivite = ?`;
            await _executeSql(sql, [...values]);
            resolve(true);

        } catch (error) {
            reject(error);
        }
    })
}

/*
 * Enregistrer un controle effectué sur une personne pour une activité
 */
const insererControle = (data: IControleItem): Promise<number> => {
    return new Promise(async (resolve, reject) => {
        try {
            const dateNow = getTodayDateTime();
            const { codeEtab, anneeScolaire, idActivite, idPersonne, operateur, aJour, accepte } = data;
            const sql = `INSERT INTO controle (codeEtab, anneeScolaire, idActivite, idPersonne,operateur,aJour,accepte,dateControle) VALUES (?,?,?,?,?,?,?,?)`;
            const schoolControlConfigInserted: any = await _executeSql(sql, [codeEtab, anneeScolaire, idActivite, idPersonne, operateur, aJour, accepte, dateNow]);
            resolve(schoolControlConfigInserted.lastID);
        } catch (error) {
            console.log("🚀 ~ file: functions.ts:233 ~ returnnewPromise ~ error:", error)
            reject(error);
        }
    })
}

/**
 * mettre a jour decison apres controle, marquer l'eleve comme accepté 
 * @param data 
 * @returns 
 */
const updateControleDecison = (idControle: number, decision: number): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            const { anscol1, codeetab } = await paramEtabObjet([
                "Anscol1",
                "CodeEtab",
            ]);
            const sql = `UPDATE controle SET accepte = ? WHERE codeEtab = ? AND anneeScolaire = ? AND idControle=?`;
            await _executeSql(sql, [decision, codeetab, anscol1, idControle]);
            resolve(true);
        } catch (error) {
            console.log("🚀 ~ file: functions.ts:368 ~ returnnewPromise ~ error:", error)
            reject(error);
        }
    })
}

/**
 * Obtenir la liste des controles effectues
 * @returns 
 */
export const listeControles = (idControle: number = null) => {
    return new Promise<IControleItem[]>(async (resolve, reject) => {
        try {
            const { anscol1, codeetab } = await paramEtabObjet([
                "Anscol1",
                "CodeEtab",
            ]);

            let values = [codeetab, anscol1];
            let sql = `SELECT * FROM controle WHERE codeEtab = ? AND anneeScolaire = ? `;
            if (idControle) {
                sql = `${sql} AND idControle = ?`;
                values = [...values, idControle]
            }

            const result = await _selectSql(sql, values);
            resolve(result)
        } catch (error) {
            reject(error);
        }
    })
}



/**
 * Obtenir la liste des pointages effectues
 * @returns 
 */
export const listePointages = () => {
    return new Promise<IControleItem[]>(async (resolve, reject) => {
        try {
            const { anscol1, codeetab } = await paramEtabObjet([
                "Anscol1",
                "CodeEtab",
            ]);
            const sql = `SELECT * FROM pointage WHERE codeEtab = ? AND anneeScolaire = ? `;
            const result = await _selectSql(sql, [codeetab, anscol1]);
            resolve(result)
        } catch (error) {
            reject(error);
        }
    })
}

export const getPersonnlAdministrative = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT
            Personnel.RefPersonnel AS idPersonnel,
            Personnel.NomPers AS nomPersonnel,
            Personnel.PrénomPers AS prenomPersonnel,
            IIf(Personnel.Sexe="M",1,2) AS genre,
            Personnel.Fonction AS fonction,
            Fonction.Fonction AS fonctionPers
            FROM Personnel LEFT JOIN Fonction ON Personnel.Fonction = Fonction.RefFonction
            WHERE (((Personnel.Fonction)<>6));
            `;
            const result = await fetchFromMsAccess<IPersonnelFonction[]>(sql, appCnx);
            resolve(result);
        } catch (error) {
            console.log(":fusée: ~ file: functions.ts ~ line 43 ~ returnnewPromise ~ error", error)
            reject(error);
        }
    });
}

/**
 * recupperer les contacts des parents des eleves
 * Ps: normallement on doit les recupperer de facon distinct, ainsi si le pere est egalement tuteur, il devrait etre recupere qu'une seule fois
 * @param studentIds 
 * @returns 
 */
export function fetchParents(
    studentIds: number[] | null = null
): Promise<IParentContact[]> {
    return new Promise(async (resolve, reject) => {
        try {
            const { anscol1, codeetab } = await paramEtabObjet([
                "Anscol1",
                "CodeEtab",
            ]);

            const filter = studentIds
                ? `And Elèves.RefElève IN (${studentIds.join(",")})`
                : "";

            const sql = `SELECT "${anscol1}" AS anneeScolaire, "${codeetab}" AS codeEtab, Elèves.RefElève AS idEleve,Elèves.RefElève AS idPersonne ,Elèves.TélTuteur AS numeroCellulaire,"tuteur" AS filiation, Elèves.Tuteur AS nomPrenomParent, Elèves.ProfessionTuteur AS professionParent , Elèves.ResidenceTuteur AS residenceParent , Elèves.EmailTuteur AS emailParent 
  FROM Elèves
        WHERE Elèves.TélTuteur Is Not Null And Elèves.TélTuteur <> "" ${filter}
        UNION ALL
        SELECT "${anscol1}" AS anneeScolaire, "${codeetab}" AS codeEtab, Elèves.RefElève AS idEleve, Elèves.RefElève AS idPersonne ,Elèves.MobilePère AS numeroCellulaire,"père" AS filiation, Elèves.NomPère AS nomPrenomParent, Elèves.ProfessionPère AS professionParent , Elèves.ResidencePère AS residenceParent , Elèves.EmailPère AS emailParent 
        FROM Elèves
        WHERE Elèves.MobilePère Is Not Null And Elèves.MobilePère <> "" ${filter}
        UNION ALL
        SELECT "${anscol1}" AS anneeScolaire, "${codeetab}" AS codeEtab, Elèves.RefElève AS idEleve,Elèves.RefElève AS idPersonne ,Elèves.MobileMère AS numeroCellulaire ,"mère" AS filiation, Elèves.NomMère AS nomPrenomParent, Elèves.ProfessionMère AS professionParent , Elèves.ResidenceMère AS residenceParent , Elèves.EmailMère AS emailParent
        FROM Elèves
        WHERE Elèves.MobileMère Is Not Null And Elèves.MobileMère <>"" ${filter}`
            const result = await fetchFromMsAccess<IParentContact[]>(sql, appCnx);

            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

export const getSchoolControlSmsAccount = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const { codeetab } = await paramEtabObjet([
                "CodeEtab"
            ]);
            const sql = `SELECT * FROM sms_accounts WHERE codeEtab = ? AND sendSmsAfterControl = 1 `;
            const result = await _selectSql(sql, [codeetab]);
            resolve(result)
        } catch (error) {
            console.log(":fusée: ~ file: functions.ts ~ line 43 ~ returnnewPromise ~ error", error)
            reject(error);
        }
    });
}

/**
 * inserer des sms dans la boite d'envoi
 * @param data 
 * @returns 
 */
export function insertSendBoxSms(data) {
    return new Promise(async (resolve, reject) => {
        try {
            const fields = `anneeScolaire,codeEtab,sessionId,idPersonne,smsDestinataireKey,phone,smsContent,createdAt`;
            const sql = `INSERT INTO messages_sms (${fields}) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
            await _executeSql(sql, data);
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * recuperer tous les sms de school control de la boite d'envoi
 * @param sessionIds 
 * @returns 
 */
export function fetchSchoolControlSendBoxSms(sessionIds: string[] = null) {
    return new Promise(async (resolve, reject) => {
      try {
        const { anscol1, codeetab } = await paramEtabObjet([
          "Anscol1",
          "CodeEtab",
        ]);
        const baseSql = `SELECT * FROM messages_sms WHERE codeEtab = ? AND anneeScolaire = ? AND smsDestinataireKey = ?`
        const sql = sessionIds
          ? `${baseSql}  AND sessionId IN ("${sessionIds.join('","')}")`
          : baseSql;
        console.log("🚀 ~ file: functions.ts:268 ~ returnnewPromise ~ sql:", sql)
        const result: ISendBoxMessages[] = await _selectSql(sql, [codeetab, anscol1, "schoolControlParentsEleves"]);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

export default {
    getListeActivites,
    insererPointage,
    getEleveActivitePointage,
    getPointageData,
    getEleveWithClasse,
    getHistoriquePointageActivite,
    getPersonnelWithFonction,
    controleEcheanciers,
    insererSchoolControlActivitiesConfig,
    getSchoolControlActivitiesConfig,
    updateSchoolControlActivitiesConfig,
    getAllSchoolControlActivitiesConfig,
    toggleSchoolControlActivityStatus,
    insererControle,
    updateControleDecison,
    listeControles,
    listePointages,
    getPersonnlAdministrative,
    fetchParents,
    getSchoolControlSmsAccount,
    insertSendBoxSms,
    fetchSchoolControlSendBoxSms
}