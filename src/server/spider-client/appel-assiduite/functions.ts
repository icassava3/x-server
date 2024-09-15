import { appCnx, fetchFromMsAccess, paramEtabObjet } from './../../databases/accessDB';
import { assiduiteEleveItem, classesAbsences, IAppelNoneFormatedItem, IJustifierAssiduitePayload, IPontageEleve, IProfAffecteClassse, ISpiderPlanning, matieresAbsences, sms } from "./interfaces";
import { _executeSql, _selectSql } from "../../databases";
import Logger from "../../helpers/logger";
import moment from "moment";
const _ = require("lodash");



/**
 * Enregistrer q'un eleve a mangé
 * 
 */

const insererPointageEleveCantine = (data: IPontageEleve): Promise<number> => {
    return new Promise(async (resolve, reject) => {
        try {
            const dateNow = moment().format("YYYY-MM-DD")
            const values = [
                data.idEleve,
                data.codeEtab,
                data.anneeScolaire,
                dateNow
            ]

            const resx: boolean = await verifierSiEleveExisteDansLaBD(data.idEleve)
            if (resx) {
                const sql = `INSERT INTO pointage_cantine (idEleve, codeEtab, anneeScolaire, datePointage) VALUES (?,?,?,?)`;
                const pointageEleveCantineInserted: any = await _executeSql(sql, [...values]);
                resolve(pointageEleveCantineInserted.lastID);
            } else {
                return reject({ name: 'ELEVE_UNKNOW', message: "Cet élève n'existe pas dans la base de données." })
            }
        } catch (error) {
            if (error.code = 'SQLITE_CONSTRAINT') {
                return reject({ name: 'SQLITE_CONSTRAINT', message: 'Cet élève a déjà été enregistré.' })
            }
            reject(error);
        }


    })
}

const verifierSiEleveExisteDansLaBD = (idEleve: number): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT * FROM eleves WHERE idEleve = ?`;
            const result: (any)[] = await _selectSql(sql, [idEleve])
            if (result.length > 0) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (error) {
            reject(error)
        }
    })
}

/**
 *  Obtenir la liste des eleves qui ont mangé
 * @param idEleve 
 * @returns 
 */


const getElevePointeALaCantine = (idEleve: number): Promise<IPontageEleve[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT * FROM eleves 
            JOIN pointage_cantine ON eleves.idEleve = pointage_cantine.idEleve AND eleves.idEleve = ?`;
            const result: (any)[] = await _selectSql(sql, [idEleve])
            resolve(result)
        } catch (error) {
            reject(error);
        }
    });
}


const getAllAppels = (): Promise<IAppelNoneFormatedItem[]> => {
    return new Promise(async (resolve, reject) => {
        try {

            const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);

            const sql = `SELECT * FROM appel WHERE anneeScolaire=? AND codeEtab=? ORDER BY dateAppel DESC,plageHoraire DESC`;
            const result: IAppelNoneFormatedItem[] = await _selectSql(sql, [anscol1, codeetab])
            resolve(result)
        } catch (error) {
            console.log("🚀 ~ file: functions.ts ~ line 88 ~ returnnewPromise ~ error", error)
            reject(error);
        }
    });
}


const getAssiduite = (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {

            const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);

            const sql = `SELECT * FROM assiduite WHERE anneeScolaire=? AND codeEtab=? ORDER BY dateAppel DESC,plageHoraire DESC`;
            const result: (any)[] = await _selectSql(sql, [anscol1, codeetab])
            resolve(result)
        } catch (error) {
            console.log("🚀 ~ file: functions.ts ~ line 102 ~ returnnewPromise ~ error", error)
            reject(error);
        }
    });
}

const getDatesAppels = (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT DISTINCT dateAppel FROM appel`;
            const result: (any)[] = await _selectSql(sql)
            const newResult = result.map((item: any) => item.dateAppel)
            resolve(newResult)
        } catch (error) {
            console.log("🚀 ~ file: functions.ts ~ line 116 ~ returnnewPromise ~ error", error)
            reject(error);
        }
    });
}

const getPlagesHorairesAppels = (): Promise<string[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT DISTINCT plageHoraire FROM assiduite`;
            const result: (any)[] = await _selectSql(sql)
            const newResult = result.map((item: any) => item.plageHoraire)
            resolve(newResult)
        } catch (error) {
            console.log("🚀 ~ file: functions.ts ~ line 129 ~ returnnewPromise ~ error", error)
            reject(error);
        }
    });
}

const getMatieresAppels = (): Promise<string[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT DISTINCT libelleMatiereLong FROM assiduite`;
            const matieres: (any)[] = await _selectSql(sql)
            const newMatiere = matieres.map((matiereItem: any) => matiereItem.libelleMatiereLong)
            resolve(newMatiere)
        } catch (error) {
            console.log("🚀 ~ file: services.ts ~ line 154 ~ returnnewPromise ~ error", error)
            reject(error);
        }

    });
};

const getProfesseursAppels = (): Promise<string[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT DISTINCT operateurSaisie FROM assiduite`;
            const professeurs: (any)[] = await _selectSql(sql)
            const newProfesseurs = professeurs.map((professeurItem: any) => professeurItem.operateurSaisie)
            resolve(newProfesseurs)
        } catch (error) {
            console.log("🚀 ~ file: functions.ts ~ line 159 ~ returnnewPromise ~ error", error)
            reject(error);
        }

    });
};

const getClassesAppels = (): Promise<string[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT DISTINCT libelleClasseCourt FROM assiduite`;
            const classes: (any)[] = await _selectSql(sql)
            const newClasses = classes.map((classeItem: any) => classeItem.libelleClasseCourt)
            resolve(newClasses)
        } catch (error) {
            console.log("🚀 ~ file: functions.ts ~ line 159 ~ returnnewPromise ~ error", error)
            reject(error);
        }

    });
};

/**
 * Obtenir les assiduité des eleves d'une ou plusieurs classe
 * @param classeIds 
 * @returns 
 */
const getClasseElevesAssiduite = (classeIds: number[], dateDebut: string, dateFin: string): Promise<assiduiteEleveItem[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("🚀 ~ file: functions.ts:186 ~ getClasseElevesAssiduite ~ classeIds", classeIds)
            // const sql = `SELECT idEleve,COUNT(idEleve) AS totalAbsenceRetard FROM assiduite WHERE idClasse IN (${classeIds.join(",")}) GROUP BY idEleve`;
            const { anscol1, codeetab } = await paramEtabObjet([
                "Anscol1",
                "CodeEtab",
            ]);
            const sql = `
                SELECT
                    anneeScolaire,
                    codeEtab,
                    idEleve,
                    idClasse,
                    SUM(status = 1) AS absences,
                    SUM(status = 2) AS retards,
                    SUM(coalesce(justifie,0)) AS abs_justif
                    FROM assiduite
                    WHERE idClasse IN (${classeIds.join(",")}) AND (strftime('%s', dateAppel) BETWEEN strftime('%s',"${dateDebut}") AND strftime('%s', "${dateFin}"))
                    GROUP BY anneeScolaire,
                            codeEtab,
                            idEleve
                    HAVING anneeScolaire = "${anscol1}"
                    AND codeEtab = "${codeetab}"
            `;
            const res: assiduiteEleveItem[] = await _selectSql(sql);
            console.log("sql+++++++++++++", sql)
            resolve(res)
        } catch (error) {
            console.log("🚀 ~ file: functions.ts ~ line 159 ~ returnnewPromise ~ error", error)
            reject(error);
        }

    });
};

/**
 * Justifié l'absence ou le retard d'un eleve
 * @param data 
 * @returns 
 */
const justifierAbsenceRetard = (data: IJustifierAssiduitePayload): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            const { idEleve, dateAppel, idSeance, motif } = data;
            const sql = `UPDATE assiduite SET motif = ? WHERE idEleve = ? AND dateAppel=? AND idSeance=?`;
            await _executeSql(sql, [motif, idEleve, dateAppel, idSeance]);
            resolve(true);
        } catch (error) {
            console.log("🚀 ~ file: functions.ts ~ line 159 ~ returnnewPromise ~ error", error)
            reject(error);
        }

    });
};

/**
 * DASHBOARD STATISTQUES
 */

/**
 * Obtenir la liste des dix élèves les plus absents
 * @param data 
 * @returns 
 */
const getElevesLesPlusAbsents = (): Promise<string[]> => {
    return new Promise(async (resolve, reject) => {
        try {

            const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);

            const sql = `SELECT idEleve,  count(idEleve) as nombreAbsence 
            FROM assiduite WHERE anneeScolaire=? AND codeEtab=? AND status = 1 
            GROUP BY idEleve  ORDER BY count(idEleve) DESC LIMIT 10
            `;
            const eleves: (any)[] = await _selectSql(sql, [anscol1, codeetab])
            resolve(eleves)
        } catch (error) {
            reject(error);
        }

    });
};

/**
 * Obtenir la liste des dix classes avec le plus d'absences 
 * @param data 
 * @returns 
 */
const getClasseAvecLePlusDeAbsents = (): Promise<classesAbsences[]> => {
    return new Promise(async (resolve, reject) => {
        try {

            const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);

            const sql = `SELECT idClasse, count(idClasse) as nombreAbsences 
            FROM assiduite WHERE anneeScolaire=? AND codeEtab=? AND status = 1
            GROUP BY idClasse   LIMIT 10
            `;
            const classes: (any)[] = await _selectSql(sql, [anscol1, codeetab])
            resolve(classes)
        } catch (error) {
            reject(error);
        }

    });
};

/**
 * Obtenir la liste des 10 matières avec le plus d'absents
 * @param data 
 * @returns 
 */
const getMatieresAvecLePlusDeAbsents = (): Promise<matieresAbsences[]> => {
    return new Promise(async (resolve, reject) => {
        try {

            const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);

            const sql = `SELECT libelleMatiereCourt, libelleMatiereLong, 
            count(libelleMatiereCourt) as nombreAbsentDansLaMatiere 
            FROM assiduite WHERE anneeScolaire=? AND codeEtab=? AND status = 1 
            GROUP BY libelleMatiereCourt  LIMIT 10
            `;
            const matieres: (any)[] = await _selectSql(sql, [anscol1, codeetab])
            resolve(matieres)
        } catch (error) {
            reject(error);
        }

    });
};

/**
 * Obtenir le nombre de retards, d'absences et de justifications par jour et en tout
 */

const getNombreRetardsAbsencesJustifications = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let today = new Date();
            let dateAppel = `${today.toJSON().slice(0, 10)}`;

            const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);

            /**
             console.log("🚀 ~ file: functions.ts:320 ~ returnnewPromise ~ dateAppel", dateAppel)
             * Récuperer le tout
             */
            const sql1 = `SELECT   count(idEleve) as nombreRetards FROM assiduite WHERE anneeScolaire=? AND codeEtab=? AND  status = 2`;
            const sql2 = `SELECT   count(idEleve) as nombreAbsences FROM assiduite WHERE anneeScolaire=? AND codeEtab=? AND  status = 1`;
            const sql3 = `SELECT   count(idEleve) as nombreJustifications FROM assiduite WHERE anneeScolaire=? AND codeEtab=? AND  justifie = 1`;

            const nombreRetardsEnTout: (any)[] = await _selectSql(sql1, [anscol1, codeetab])
            const nombreAbsencesEnTout: (any)[] = await _selectSql(sql2, [anscol1, codeetab])
            const nombreJustificationsEnTout: (any)[] = await _selectSql(sql3, [anscol1, codeetab])

            /**
             * Récuperer par jour
             */

            const sql4 = `SELECT   count(idEleve) as nombreRetards FROM assiduite WHERE anneeScolaire=? AND codeEtab=? AND status = 2 AND dateAppel = ?`;
            const sql5 = `SELECT   count(idEleve) as nombreAbsences FROM assiduite WHERE anneeScolaire=? AND codeEtab=? AND status = 1 AND dateAppel = ?`;
            const sql6 = `SELECT   count(idEleve) as nombreJustifications FROM assiduite WHERE anneeScolaire=? AND codeEtab=? AND justifie = 1 AND dateAppel = ?`;

            const nombreRetardsJour: (any)[] = await _selectSql(sql4, [anscol1, codeetab, dateAppel])
            const nombreAbsencesJour: (any)[] = await _selectSql(sql5, [anscol1, codeetab, dateAppel])
            console.log("🚀 ~ file: functions.ts:340 ~ returnnewPromise ~ nombreAbsencesJour", nombreAbsencesJour)
            const nombreJustificationsJour: (any)[] = await _selectSql(sql6, [anscol1, codeetab, dateAppel])

            resolve({
                assiduiteEnTout: {
                    nombresAbsences: nombreAbsencesEnTout[0]['nombreAbsences'],
                    nombresRetards: nombreRetardsEnTout[0]['nombreRetards'],
                    nombresJustifications: nombreJustificationsEnTout[0]['nombreJustifications']
                },
                assiduiteParJour: {
                    nombresAbsences: nombreAbsencesJour[0]['nombreAbsences'],
                    nombresRetards: nombreRetardsJour[0]['nombreRetards'],
                    nombresJustifications: nombreJustificationsJour[0]['nombreJustifications']
                }
            }
            )
        } catch (error) {
            reject(error);
        }

    });
};

/**
 * Obtenir le nombre de sms envoyé ou non  en tout
 */

const getNombreSmsEnvoyeOuNon = (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            let today = new Date();
            let dateAppel = `${today.toJSON().slice(0, 10)}`;

            const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);

            /**
             * Récuperer le tout
             */
            const sql1 = `SELECT count(idEleve) as smsEnvoye FROM assiduite WHERE anneeScolaire=? AND codeEtab=? AND sms_send_status = 1
            `;
            const sql2 = `SELECT count(idEleve) as smsNonEnvoye FROM assiduite WHERE anneeScolaire=? AND codeEtab=? AND sms_send_status IS NULL OR sms_send_status = 0 
            `;
            const smsEnvoyeEnTout: (any)[] = await _selectSql(sql1, [anscol1, codeetab])
            const smsNonEnvoyeEnTout: (any)[] = await _selectSql(sql2, [anscol1, codeetab])
            /**
             * Récuperer par jour
             */
            const sql3 = `SELECT count(idEleve) as smsEnvoye FROM assiduite WHERE anneeScolaire=? AND codeEtab=? AND sms_send_status = 1 AND dateAppel = ?
            `;
            const sql4 = `SELECT count(idEleve) as smsNonEnvoye FROM assiduite WHERE anneeScolaire=? AND codeEtab=? AND (sms_send_status IS NULL OR sms_send_status = 0) AND dateAppel = ?
            `;
            const smsEnvoyeParJour: (any)[] = await _selectSql(sql3, [anscol1, codeetab, dateAppel])
            const smsNonEnvoyeParJour: (any)[] = await _selectSql(sql4, [anscol1, codeetab, dateAppel])

            resolve({
                smsEnvoyeEnTout: {
                    smsEnvoyesEnTout: smsEnvoyeEnTout[0]['smsEnvoye'],
                    smsNonEnvoyesEnTout: smsNonEnvoyeEnTout[0]['smsNonEnvoye']
                },
                smsEnvoyeParJour: {
                    smsEnvoyesParJour: smsEnvoyeParJour[0]['smsEnvoye'],
                    smsNonEnvoyesParJour: smsNonEnvoyeParJour[0]['smsNonEnvoye']
                }

            })
        } catch (error) {
            reject(error);
        }

    });
};
/**
 * Obtenir les classes avec leur id depuis vba
 * @param idClasses 
 * @returns 
 */
function getClasseWithIdClasse(idClasses: number[]): Promise<(any)> {

    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT DISTINCT Classes.RefClasse AS idClasse,
                Classes.ClasseCourt AS libelleClasseCourt,Classes.ClasseLong AS libelleClasseLong
                FROM Classes
                WHERE Classes.RefClasse IN (${idClasses.join(",")})
                `;
            const result = await fetchFromMsAccess<any>(sql, appCnx);
            resolve(result);
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
function getEleveWithClasse(idEleves: number[]): Promise<(any)> {

    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT DISTINCT Elèves.RefElève AS idEleve,Elèves.nomElève AS nomEleve, Elèves.prénomElève AS prenomEleve,Elèves.matriculeNational AS matriculeEleve,
                Classes.ClasseCourt AS libelleClasseCourt,Classes.ClasseLong AS libelleClasseLong
                FROM Elèves INNER JOIN Classes ON Elèves.RefClasse = Classes.RefClasse
                WHERE Elèves.RefElève IN (${idEleves.join(",")})
                `;
            const result = await fetchFromMsAccess<any>(sql, appCnx);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Obtenir la liste des professeurs affectés à une classe
 * @param classeIds 
 * @returns 
 */
export const getProfAffecteClasse = async (): Promise<IProfAffecteClassse[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const { anscol1, codeetab } = await paramEtabObjet([
                "Anscol1",
                "CodeEtab",
            ]);
            const baseSql = `SELECT
         Classes_Matière_Prof.RefClasse AS idClasse,
         Classes_Matière_Prof.RefMatière AS idMatiere,
         Classes_Matière_Prof.RefPersonnel AS idPersonnel
        FROM Classes_Matière_Prof`;
            const result = await fetchFromMsAccess<IProfAffecteClassse[]>(
                baseSql,
                appCnx
            );
            resolve(result);
        } catch (error) {
            Logger.error(
                "Erreur lors de recuperation paiements pour gain technologie"
            );
            reject(error);
        }
    });
};


/**
 * recupperer le planning d'une classes
 */
function fetchPlannig(
   idClasse: number
): Promise<ISpiderPlanning[]> {
    return new Promise(async (resolve, reject) => {
        try {
            const { anscol1, codeetab } = await paramEtabObjet([
                "Anscol1",
                "CodeEtab",
            ]);
            const baseSql = `SELECT DISTINCT horaire_plage_modele.RefHoraire AS idHoraire, classe_matieres_prof_eval.refClasse AS idClasse, classe_matieres_prof_eval.refMat AS idMatiere,
            Personnel.RefPersonnel AS idPersonnel, Seances.RefSeance AS idSeance, classe_matieres_prof_eval.ClasseCourt AS libelleClasseCourt,  horaire_plage_modele.Horaire AS libelleHoraire,
            classe_matieres_prof_eval.matCourt AS libelleMatiereCourt, classe_matieres_prof_eval.matLong AS libelleMatiereLong,
            Personnel.NomPers AS nomPersonnel, Personnel.PrénomPers AS prenomPersonnel, horaire_plage_modele.PlageHoraire AS plageHoraire,
            Personnel.Sexe AS sexe, Salles.NomSalle AS libelleSalle, Salles.RefSalle AS idSalle,"${anscol1}" AS anneeScolaire,"${codeetab}" AS codeEtab
            FROM (((Seances LEFT JOIN Personnel ON Seances.RefPers = Personnel.RefPersonnel) LEFT JOIN Salles ON Seances.RefSalle = Salles.RefSalle)
            INNER JOIN classe_matieres_prof_eval ON (Seances.RefPers = classe_matieres_prof_eval.refPers) AND (Seances.RefClasse = classe_matieres_prof_eval.refClasse)
            AND (Seances.RefMatière = classe_matieres_prof_eval.refMat)) INNER JOIN horaire_plage_modele
            ON (Seances.idModelePlageHoraire = horaire_plage_modele.idModelePlageHoraire) AND (Seances.RefHoraire = horaire_plage_modele.RefHoraire)
            WHERE classe_matieres_prof_eval.refClasse = ${idClasse}
            `;
            //   const sql = classeIds
            //     ? `${baseSql} WHERE classe_matieres_prof_eval.refClasse IN (${classeIds.join(
            //         ","
            //       )})`
            //     : baseSql;
            const result = await fetchFromMsAccess<ISpiderPlanning[]>(baseSql, appCnx);
            resolve(result);
        } catch (error) {
            Logger.error(
                "Erreur lors de recuperation paiements pour gain technologie"
            );
            reject(error);
        }
    });
}

/**
 * Récuperer les les appels qui ont été effectué dans la journée en fonction de la classe
 */
const getAppelParClasse = ( dateAppel: string, idClasse: number) => {
    return new Promise(async (resolve, reject) => {
        try {
            // let today = new Date();
            // let dateAppel = `${today.toJSON().slice(0, 10)}`;
            const { anscol1, codeetab } = await paramEtabObjet([
                "Anscol1",
                "CodeEtab",
            ]);
            const sql = `SELECT * FROM appel WHERE dateAppel = ? AND idClasse = ? AND anneeScolaire = ? AND codeEtab = ? `;
            const result: (any)[] = await _selectSql(sql, [dateAppel, idClasse, anscol1, codeetab])
            resolve(result)
        } catch (error) {
            reject(error);
        }
    });
}
/**
 * Récuperer le nombre d'absence effectué dans chaque plage horraire en fonction de la classe et de la date
 */
const getNombreAbsenceParPlage = ( dateAppel: string, idClasse: number) => {
    return new Promise(async (resolve, reject) => {
        try {
         
            const { anscol1, codeetab } = await paramEtabObjet([
                "Anscol1",
                "CodeEtab",
            ]);
            const sqlAbsent = `SELECT count(plageHoraire) as nombreAbsent, idSeance , dateAppel FROM assiduite WHERE status = 1 AND dateAppel =? AND idClasse = ? AND anneeScolaire = ? AND codeEtab = ? GROUP BY plageHoraire`;
            const result1: (any)[] = await _selectSql(sqlAbsent, [dateAppel, idClasse, anscol1, codeetab])
            resolve(result1)
        } catch (error) {
            reject(error);
        }
    });
}
/**
 * Récuperer le nombre de retards effectué dans chaque plage horraire en fonction de la classe et de la date
 */
const getNombreRetardByPlage = ( dateAppel: string, idClasse: number) => {
    return new Promise(async (resolve, reject) => {
        try {
     
            const { anscol1, codeetab } = await paramEtabObjet([
                "Anscol1",
                "CodeEtab",
            ]);
            const sqlRetard = `SELECT count(plageHoraire) as nombreRetard, idSeance, dateAppel FROM assiduite WHERE status = 2 AND dateAppel =? AND idClasse = ? AND anneeScolaire = ? AND codeEtab = ? GROUP BY plageHoraire`;
            const result2: (any)[] = await _selectSql(sqlRetard, [dateAppel, idClasse, anscol1, codeetab])
            resolve(result2)
        } catch (error) {
            reject(error);
        }
    });
}

// Fetcher tout le planning des classes
const GetPlanningClasse = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let sql = `SELECT DISTINCT 
        classe_matieres_prof_eval.refTypeClasse, 
        classe_matieres_prof_eval.refClasse AS idClasse, 
        horaire_plage_modele.RefHoraire AS idHoraire, 
        classe_matieres_prof_eval.refMat AS idMatiere, Personnel.RefPersonnel AS idPersonnel, Seances.RefSeance AS idSeance, classe_matieres_prof_eval.ClasseCourt AS libelleClasseCourt, horaire_plage_modele.Horaire AS libelleHoraire, classe_matieres_prof_eval.matCourt AS libelleMatiereCourt, classe_matieres_prof_eval.matLong AS libelleMatiereLong, Personnel.NomPers AS nomPersonnel, Personnel.PrénomPers AS prenomPersonnel, horaire_plage_modele.PlageHoraire AS plageHoraire, Personnel.Sexe AS sexe, Salles.NomSalle AS libelleSalle, Salles.RefSalle AS idSalle
        FROM (((Seances LEFT JOIN Personnel ON Seances.RefPers = Personnel.RefPersonnel) LEFT JOIN Salles ON Seances.RefSalle = Salles.RefSalle) INNER JOIN classe_matieres_prof_eval ON (Seances.RefMatière = classe_matieres_prof_eval.refMat) AND (Seances.RefClasse = classe_matieres_prof_eval.refClasse) AND (Seances.RefPers = classe_matieres_prof_eval.refPers)) INNER JOIN horaire_plage_modele ON (Seances.RefHoraire = horaire_plage_modele.RefHoraire) AND (Seances.idModelePlageHoraire = horaire_plage_modele.idModelePlageHoraire)
        ORDER BY classe_matieres_prof_eval.refTypeClasse;                
        `;
            const sqlResult = await fetchFromMsAccess<any[]>(sql, appCnx);
            if (sqlResult.length === 0) return resolve([{}]);
            resolve(sqlResult);
        } catch (err: any) {
            console.log("🚀 ~ file: functions.ts:725 ~ returnnewPromise ~ err", err)
            return reject(err);
        }
    });
};

/**
 * Permet de tester la disponibilité des bases access
 * @returns 
 */
export const checkMsAccesDatabasesStatus = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let sql = `SELECT TypesClasses.RefTypeClasse, Niveaux.NiveauCourt
            FROM Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau
            WHERE (((TypesClasses.RefTypeClasse)=1));                
        `;
            const sqlResult = await fetchFromMsAccess<any[]>(sql, appCnx);
            resolve(sqlResult);
        } catch (err: any) {
            return reject(err);
        }
    });
};

/**
 * Permet de tester la disponibilité de la base sqlite
 * @returns 
 */
export const checkSqliteDatabaseStatus = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT * FROM xserver_config`;
            const result: (any)[] = await _selectSql(sql, [])
            resolve(result)
        } catch (error) {
            reject(error);
        }
    });
}

export default {
    insererPointageEleveCantine,
    getElevePointeALaCantine,
    getAllAppels,
    getAssiduite,
    getPlagesHorairesAppels,
    getDatesAppels,
    getMatieresAppels,
    getProfesseursAppels,
    getClassesAppels,
    getClasseElevesAssiduite,
    justifierAbsenceRetard,
    getElevesLesPlusAbsents,
    getClasseAvecLePlusDeAbsents,
    getMatieresAvecLePlusDeAbsents,
    getNombreSmsEnvoyeOuNon,
    getNombreRetardsAbsencesJustifications,
    getClasseWithIdClasse,
    getEleveWithClasse,
    getProfAffecteClasse,
    fetchPlannig,
    getAppelParClasse,
    getNombreAbsenceParPlage,
    getNombreRetardByPlage,
    GetPlanningClasse,
    checkMsAccesDatabasesStatus,
    checkSqliteDatabaseStatus
}