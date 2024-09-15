import { _executeSql, _selectSql } from "../databases";
import { appCnx, fetchFromMsAccess } from "../databases/accessDB";
import Logger from "../helpers/logger";
import {
    partenaireCampusFranceId,
    partenaireCinetPayId,
    partenaireEdiattahId,
    partenaireFocusEcoleId,
    partenaireGainId,
    partenaireMemoId,
    partenaireSchoolControlId,
    partenairesymtelId,
    WAREHOUSE_PART_ID,
    WAREHOUSE_SERV_ID
} from "./constants";

import {
    IPartner,
    IService,
    ISpiderClassseItem,
    ISpiderClassseMatiereProf,
    ISpiderDetailsVersementRubriqueObligatoireItem,
    ISpiderDetailsVersementRubriqueOptionnelItem,
    ISpiderEcheancierIndividuelItem,
    ISpiderEcheancierPersonnelEleveRubriqueItem,
    ISpiderEcheancierRubriqueOptionnelItem,
    ISpiderEcheancierTypeClasseRubriqueObligatoireItem,
    ISpiderEleveRubriqueItem,
    ISpiderEvaluationProgrammationItem,
    ISpiderHoraireItem,
    ISpiderOptionTypeClasseRubriqueObligatoireItem,
    ISpiderPlageHoraireItem,
    ISpiderRubriqueItem,
    ISpiderRubriqueOptionnelGlobalItem,
    ISpiderSouscriptionFraisRubriqueOptionnelItem,
    ISpiderStudentItem,
    ISpiderTypeClasseRubriqueObligatoireItem,
    ISpiderVersementItem
} from "./interfaces";

/**
 * fetcher tous les logs warehouse
 * @param logIds 
 * @returns 
 */
export function fetchLogs<ILogItem>() {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT * FROM warehouse_logs WHERE statut=0`;
            const result: ILogItem[] = await _selectSql(sql, []);
            resolve(result);
        } catch (error) {
            Logger.error("Erreur lors de recuperation eleves pour gain technologie");
            reject(error);
        }
    });
}

/**
 * selectionner les action http qui ont echouée
 * @returns 
 */
export function fetchHttpFailsLogs<ILogItem>() {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT * FROM http_fails_logs WHERE statut=0`;
            const result: ILogItem[] = await _selectSql(sql, []);
            resolve(result);
        } catch (error) {
            Logger.error("Erreur lors de recuperation eleves pour gain technologie");
            reject(error);
        }
    });
}


/**
 * retourner des logs warehouse pour les actions echoué
 * @param logIds 
 * @returns 
 */
export function fetchErrorsLogs<ILogItem>() {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT * FROM warehouse_logs WHERE statut=0`;
                const result: ILogItem[] = await _selectSql(sql, []);
            resolve(result);
        } catch (error) {
            Logger.error("Erreur lors de recuperation eleves pour gain technologie");
            reject(error);
        }
    });
}


export const setHttpFailsLogsSuccess = (logIds: number[]): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            const dateNow = new Date().toLocaleString();
            const sql = `UPDATE http_fails_logs SET statut = ?,created_at=? WHERE id IN  (${logIds.join(
                ","
            )})`;
            await _executeSql(sql, [1, dateNow]);
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
};

export const setLogsSuccess = (logIds: number[]): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            const dateNow = new Date().toLocaleString();
            const sql = `UPDATE warehouse_logs SET statut = ?,date=? WHERE id IN  (${logIds.join(
                ","
            )})`;
            await _executeSql(sql, [1, dateNow]);
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * associé les patenaires et leurs differents services
 * @returns 
 */
export const getPartnersServices = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const services = {
                symtel: [],
                ediattah: [],
                gain: [],
                memo: [],
                campusFrance: [],
                cinetpay: {},
                focusEcole: [],
                warehouse: [],
                schoolControl:{}
            }
            const sql = `SELECT * FROM services`;
            const result: IService[] = await _selectSql(sql, [])
            await Promise.all(result.map((item: IService) => {
                // item.config = JSON.parse(item.config)
                // if (typeof item.config === "object" && item.config !== null) item.config = JSON.parse(item.config)
                if (item.idPartenaire === partenairesymtelId) {
                    services.symtel.push({ ...item, config: JSON.parse(item.config) })
                } else if (item.idPartenaire === partenaireEdiattahId) {
                    services.ediattah.push({ ...item, config: JSON.parse(item.config) })
                } else if (item.idPartenaire === partenaireGainId) {
                    services.gain.push({ ...item, config: JSON.parse(item.config) })
                } else if (item.idPartenaire === partenaireMemoId) {
                    services.memo.push({ ...item, config: JSON.parse(item.config) })
                } else if (item.idPartenaire === partenaireCampusFranceId) {
                    services.campusFrance.push({ ...item, config: JSON.parse(item.config) })
                } else if (item.idPartenaire === partenaireCinetPayId) {
                    services.cinetpay = { ...item, config: JSON.parse(item.config) }
                } else if (item.idPartenaire === partenaireFocusEcoleId) {
                    services.focusEcole.push({ ...item, config: JSON.parse(item.config) })
                }else if (item.idPartenaire === partenaireSchoolControlId) {
                    services.schoolControl = { ...item, config: JSON.parse(item.config) }
                }
            }))
            resolve(services)
        } catch (error) {
            reject(error)
        }
    })
}


/**
 * recupper la liste des partenaires
 * @returns 
 */
export const getPartnersList = (): (Promise<IPartner[]>) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT * FROM partenaires`
            const partners: IPartner[] = await _selectSql(sql, [])
            resolve(partners)
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * recuperer la liste des services d'un partenaire
 * @param partnerId 
 * @returns 
 */
export const getServices = (partnerId: string): Promise<IService[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT * FROM services WHERE idPartenaire = ?`
            const services: IService[] = await _selectSql(sql, [partnerId])
            resolve(services)
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * obtenir les données sur le service warehouse
 * @param serviceId 
 * @returns 
 */
export const getServiceData = (): Promise<IService> => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT * FROM services WHERE idService = ?`
            const service: IService[] = await _selectSql(sql, [WAREHOUSE_SERV_ID])
            if (service.length === 0) {
                reject({ message: "Une erreur s’est produite lors de la récupération des donnes du service warehouse" })
            }
            resolve(service[0])
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * activer ou desactiver le service warehouse
 * @param data
 * @returns
 */
export const activateServiceWarehouse = (data: (string | number)[]): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `INSERT INTO services (idService,idPartenaire,libelle,description,neededKey,config,activated,initialized,sendData) VALUES (?,?,?,?,?,?,?,?,?)`
            await _executeSql(sql, data)
            resolve(true);
        } catch (error) {
            console.log("🚀 ~ file: functions.ts ~ line 180 ~ returnnewPromise ~ error", error)
            reject(error)
        }
    })
}

/**
 * desactiver le service warehouse en local
 * @param data 
 * @returns 
 */
export const deactivateService = (config: string,): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `DELETE FROM services WHERE idService = ?`
            await _executeSql(sql, [WAREHOUSE_SERV_ID])
            resolve(true);
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * maruer le service warehouse comme initializé
 * @param data 
 * @returns 
 */
export const initializeService = (serviceId: string): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `UPDATE services SET initialized = ? WHERE idService = ?`
            await _executeSql(sql, [1, serviceId])
            resolve(true);
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * ecrire les logs wharehouse server
 * @param action 
 * @param payload 
 * @param statut 
 * @returns 
 */
const insertWhserverLog = (
    action: string,
    payload: any,
    statut: number
) => {
    return new Promise(async (resolve, reject) => {
        try {
            const dateNow = new Date().toLocaleString();
            const sql = `INSERT INTO warehouse_logs (action, payload, statut,date) VALUES (?, ?, ?, ?)`;
            const payloadStringify = JSON.stringify(payload);

            const sqlParams = [action, payloadStringify, statut, dateNow];
            await _executeSql(sql, sqlParams);
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
};

// export const fetchAllWhConfigs = async (versementIds: number[] | null = null): Promise<ISpiderVersementItem[]> => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const baseSql = `SELECT * FROM versement`
//             const sql = versementIds
//                 ? `${baseSql} WHERE idVersement IN (${versementIds.join(",")})`
//                 : baseSql;
//             const result = await _selectSql(sql, [])
//             resolve(result);
//         } catch (error) {
//             Logger.error("Erreur lors de recuperation paiements pour gain technologie");
//             reject(error);
//         }
//     });
// };

/**
 * mettre a jour les config de warehouse dans sqlite
 * @returns 
 */
const updateWarehouseConfig = (warehouseConfig) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `UPDATE xserver_config SET value= ? WHERE key =? `;
            const payloadStringify = JSON.stringify(warehouseConfig);
            const sqlParams = [payloadStringify, "warehouseConfig"];
            await _executeSql(sql, sqlParams);
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
};


/**
 * 
 * @returns 
 */
const deleteWarehouseConfig = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `DELETE FROM xserver_config WHERE key = ?`
            const sqlParams = ["warehouseConfig"];
            await _executeSql(sql, sqlParams);
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
};


/**
 * fetcher un ou plusieurs versement
 * @param versementIds 
 * @returns 
 */
export const fetchVersements = async (versementIds: number[] | null = null): Promise<ISpiderVersementItem[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const baseSql = `SELECT * FROM versement`
            const sql = versementIds
                ? `${baseSql} WHERE idVersement IN (${versementIds.join(",")})`
                : baseSql;
            const result = await _selectSql(sql, [])
            resolve(result);
        } catch (error) {
            Logger.error("Erreur lors de recuperation paiements pour gain technologie");
            reject(error);
        }
    });
};

/**
 * fetcher les details de versement pour une rubrique obligatoire
 * @param versementIds 
 * @returns 
 */
export const fetchDetailsVersementRubriqueObligatoire = (versementIds: number[] | null = null): Promise<ISpiderDetailsVersementRubriqueObligatoireItem[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const baseSql = `SELECT * FROM details_versement_rubrique_obligatoire`
            const sql = versementIds
                ? `${baseSql} WHERE details_versement_rubrique_obligatoire.idVersement IN (${versementIds.join(",")})`
                : baseSql;

            const result = await _selectSql(sql, [])
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
 * fetcher les details de versement pour une rubrique optionnel
 * @param versementIds 
 * @returns 
 */
export const fetchDetailsVersementRubriqueOptionnel = (versementIds: number[] | null = null): Promise<ISpiderDetailsVersementRubriqueOptionnelItem[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const baseSql = `SELECT * FROM details_versement_rubrique_optionnel`
            const sql = versementIds
                ? `${baseSql} WHERE details_versement_rubrique_optionnel.idVersement IN (${versementIds.join(",")})`
                : baseSql;
            const result = await _selectSql(sql, [])
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
 * recuper un ou plusieurs classe de la base access et les inserrer dans sqlite
 * @returns 
 */
export function insertClassesListFromVba(classeListArray): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
        try {

            const fields = `anneeScolaire,codeEtab,idClasse,idTypeclasse,ordreClasse,libelleClasseCourt,libelleClasseLong,lv2,arts`;
            let valuesPlaceholders = classeListArray.map(() => "(?, ?, ?, ?, ?, ?, ?, ?, ?)").join(', ');
            const sqlInsert = `INSERT INTO classes (${fields}) VALUES ${valuesPlaceholders}`;
            let values = [];
            classeListArray.forEach((arr) => { arr.forEach((item) => { values.push(item) }) });
            await _executeSql(sqlInsert, values);
            resolve(true)

        } catch (error) {
            console.log("🚀 ~ file: functions.ts ~ line 43 ~ returnnewPromise ~ error", error)
            reject(error);
        }
    });
}


export function insertTypeClasseListFromVba(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
        try {
            const sqlGet = `SELECT TypesClasses.RefTypeClasse AS idTypeClasse, TypesClasses.Série AS serie, Niveaux.NiveauCourt, Niveaux.NiveauLong,Niveaux.Cycle
            FROM TypesClasses INNER JOIN Niveaux ON TypesClasses.Niveau = Niveaux.RefNiveau;`;
            const typeClassesList = await fetchFromMsAccess<any[]>(sqlGet, appCnx);

            //insertion multiple vba
            const typeClassesArray = []
            typeClassesList.map(item => typeClassesArray.push([
                item.idTypeClasse,
                item.serie,
                item.NiveauCourt,
                item.NiveauLong,
                item.Cycle
            ]))

            const fields = "idTypeClasse,serie,niveauCourt,niveauLong,cycle";
            let valuesPlaceholders = typeClassesArray.map(() => "(?, ?, ?,?,?)").join(', ');
            const sqlInsert = `INSERT INTO typesClasses (${fields}) VALUES ${valuesPlaceholders}`;
            let values = [];
            typeClassesArray.forEach((arr) => { arr.forEach((item) => { values.push(item) }) });
            await _executeSql(sqlInsert, values);
            resolve(true)

        } catch (error) {
            console.log("🚀 ~ file: functions.ts ~ line 43 ~ returnnewPromise ~ error", error)
            reject(error);
        }
    });
}


/**
 * recupper un ou plusieurs eleves de la base access et les inserer dans la base sqlite
 */
export function insertElevesFromVba(eleveListArray: any[]): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
        try {

            const fields = `anneeScolaire,codeEtab,idEleve,idClasse,matricule,nomEleve,prenomEleve,statutEleve,sexe,niveau,numeroExtrait,
            dateEnregExtrait, dateNaissance, lieuNaissance, mobile, lv2, arts, nationalite, residenceEleve, emailEleve, inscrit, dateInscrit, etabOrigine, redoublant,
                transfert, numeroTransfert, decisionAffectation,nomPrenomTuteur,telephoneTuteur`;
            let valuesPlaceholders = eleveListArray.map(() => "(?, ?, ?, ? ,? ,? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?)").join(', ');

            const sqlInsert = `INSERT INTO eleves (${fields}) VALUES ${valuesPlaceholders}`;
            let values = [];
            eleveListArray.forEach((arr) => { arr.forEach((item) => { values.push(item) }) });
            await _executeSql(sqlInsert, values);
            resolve(true)
        } catch (error) {
            console.log("🚀 ~ file: functions.ts ~ line 43 ~ returnnewPromise ~ error", error)
            reject(error);
        }
    });
}

export function insertElevesFromVba__test(eleveListArray: any[]): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
        try {

            const fields = `anneeScolaire,codeEtab,idEleve,idClasse,matricule,nomEleve,prenomEleve,statutEleve,sexe,niveau,numeroExtrait,
            dateEnregExtrait, dateNaissance, lieuNaissance, mobile, lv2, arts, nationalite, residenceEleve, emailEleve, inscrit, dateInscrit, etabOrigine, redoublant,
                transfert, numeroTransfert, decisionAffectation`;
            //  let valuesPlaceholders = eleveListArray.map(() => "(?, ?, ?, ? ,? ,? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").join(', ');
            let valuesPlaceholders = eleveListArray.map((item) => `("${[...item]}")`).join(', ');
            console.log("🚀 ~ file: functions.ts ~ line 450 ~ returnnewPromise ~ valuesPlaceholders", valuesPlaceholders)

            const sqlInsert = `INSERT INTO eleves (${fields}) VALUES ?`;
            // let values = [];
            // eleveListArray.forEach((arr) => { arr.forEach((item) => { values.push(item) }) });
            await _executeSql(sqlInsert, [valuesPlaceholders]);
            resolve(true)
        } catch (error) {
            console.log("🚀 ~ file: functions.ts ~ line 43 ~ returnnewPromise ~ error", error)
            reject(error);
        }
    });
}

// export function insertElevesFromVba(eleveListArray: any[]): Promise<boolean> {
//     return new Promise(async (resolve, reject) => {
//         try {

//             const fields = `anneeScolaire,codeEtab,idEleve,idClasse,matricule,nomEleve,prenomEleve,statutEleve,sexe,niveau,numeroExtrait,
//             dateEnregExtrait, dateNaissance, lieuNaissance, mobile, lv2, arts, nationalite, residenceEleve, emailEleve, inscrit, dateInscrit, etabOrigine, redoublant,
//                 transfert, numeroTransfert, decisionAffectation`;
//             let valuesPlaceholders = eleveListArray.map(() => "(?, ?, ?, ? ,? ,? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?)").join(', ');

//             const sqlInsert = `INSERT INTO eleves (${fields}) VALUES ${valuesPlaceholders}`;
//             let values = [];
//             eleveListArray.forEach((arr) => { arr.forEach((item) => { values.push(item) }) });
//             console.log("values+++++++++++++++++", values)
//             await _executeSql(sqlInsert, values);
//             resolve(true)
//         } catch (error) {
//             reject(error);
//         }
//     });
// }


/**
 * recuuper les horaires 
 * @returns 
 */
// export function fecthHoraires(): Promise<ISpiderHoraireItem[]> {
//     return new Promise(async (resolve, reject) => {
//         try {

//             const sql = `SELECT Horaires.RefHoraire AS idHoraire, Horaires.Horaire AS libelleHoraire, Horaires.PlageHoraire AS plageHoraire FROM Horaires;`;
//             const result = await fetchFromMsAccess<ISpiderHoraireItem[]>(sql, appCnx);
//             resolve(result);
//         } catch (error) {
//             Logger.error(
//                 "Erreur lors de recuperation paiements pour gain technologie"
//             );
//             reject(error);
//         }
//     });
// };

/**
 * recupperer les plage horaire
 * @returns 
 */
// export function fecthPlageHoraires(): Promise<ISpiderPlageHoraireItem[]> {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const sql = `SELECT PlagesHoraires.Chrono AS chrono, PlagesHoraires.Utilisation AS utilisation, PlagesHoraires.Debut AS debut, PlagesHoraires.Fin AS fin
//       FROM PlagesHoraires;`;
//             const result = await fetchFromMsAccess<ISpiderPlageHoraireItem[]>(
//                 sql,
//                 appCnx
//             );
//             resolve(result);
//         } catch (error) {
//             Logger.error("Erreur lors de l'envoi plage horaire chez focus ecole");
//             reject(error);
//         }
//     });
// };

/**
 * fetcher la programtion des evalutions
 * @param evalIds 
 * @returns 
 */
// export function fecthEvalProg(evalIds: number[] | null = null): Promise<ISpiderEvaluationProgrammationItem[]> {
//     return new Promise(async (resolve, reject) => {
//         try {


//             const baseSql = `SELECT tb_eval_prog.idEval AS idEvaluationProgrammation, tb_eval_prog.refClasse AS idClasse, tb_eval_prog.refMat AS idMatiere,
//        tb_eval_prog.periodeEval AS periodeEvaluation, tb_eval_prog.numEval AS numeroEvaluation, tb_eval_prog.coefEval AS coefficientEvaluation,
//         tb_eval_prog.dateCompo AS dateComposition, tb_eval_prog.typeEval AS typeEvaluation FROM tb_eval_prog`;
//             const sql = evalIds
//                 ? `${baseSql} WHERE tb_eval_prog.idEval IN (${evalIds.join(",")})`
//                 : baseSql;
//             const result = await fetchFromMsAccess<ISpiderEvaluationProgrammationItem[]>(
//                 sql,
//                 appCnx
//             );
//             resolve(result);
//         } catch (error) {
//             Logger.error("Erreur lors de fetch programtion evaluation ");
//             reject(error);
//         }
//     });
// };


/**
 * fetcher l'echenacier individuel defini dans spider pour un ou plusieurs eleves
 * @param studentIds 
 * @returns 
 */
export function fetchEcheancierIndividuel(studentIds: number[] | null = null): Promise<ISpiderEcheancierIndividuelItem[]> {
    return new Promise(async (resolve, reject) => {
        try {
            const baseSql = `SELECT echeancier_individuel.idEleve, echeancier_individuel.idRubrique, echeancier_individuel.dateDebutPeriode, 
      echeancier_individuel.datefinPeriode, echeancier_individuel.montantDejaPaye, echeancier_individuel.montantPeriode, 
      echeancier_individuel.priorite, echeancier_individuel.libelleGroupeRubrique, echeancier_individuel.descriptionGroupeRubrique,
       echeancier_individuel.libelleCategorieGroupeRubrique, echeancier_individuel.libelleNaturePaiement, 
       echeancier_individuel.libellePeriode, echeancier_individuel.libelleRubrique, echeancier_individuel.descriptionRubrique,
        echeancier_individuel.nomEleve, echeancier_individuel.prenomEleve, echeancier_individuel.statutEleve,
         echeancier_individuel.ancienneteEleve, echeancier_individuel.idSouscriptionFraisRubriqueOptionnel
      FROM echeancier_individuel
      `;

            const sql = studentIds
                ? `${baseSql} WHERE echeancier_individuel.idEleve IN (${studentIds.join(",")})`
                : baseSql;
            const result = await _selectSql(sql, [])
            resolve(result);
        } catch (error) {
            Logger.error("Erreur lors de recuperation eleves pour focus ecole");
            reject(error);
        }
    });
}

/**
 * marquer toutes un groupe d'action (classe , eleve ...) comme success
 * @param actionFor
 * @returns
 */
export const setWarehouseLogsGroupActionSuccess = (
    actionFor: string
): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            let actionsList = "()";
            if (actionFor === "eleve") {
                actionsList = "('ENVOYER_ELEVE','MODIFIER_ELEVE','SUPPRIMER_ELEVE')";
            } else if (actionFor === "classe") {
                actionsList = "('ENVOYER_CLASSE','MODIFIER_CLASSE','SUPPRIMER_CLASSE')";
            } else if (actionFor === "versement") {
                actionsList =
                    "('ENVOYER_VERSEMENT','MODIFIER_PAIEMENT','SUPPRIMER_VERSEMENT')";
            } else if (actionFor === "echindividuel") {
                actionsList =
                    "('ENVOYER_ECHEANCIER_INDIVIDUEL')";
            }
            const dateNow = new Date().toLocaleString();
            const sql = `UPDATE warehouse_logs SET statut = ?,date=? WHERE action IN  ${actionsList}`;
            await _executeSql(sql, [1, dateNow]);
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
};
/**
 * Fetcher les rubriques optionnel global defini dans spider
 * @returns 
 */
export function fetchRubriqueOptionnelGlobal(): Promise<ISpiderRubriqueOptionnelGlobalItem[]> {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT rubrique_optionnel_global.idRubriqueOptionnelGlobal, rubrique_optionnel_global.idRubrique, rubrique_optionnel_global.montantRubrique, rubrique_optionnel_global.nombreVersement
      FROM rubrique_optionnel_global`;
            const result = await _selectSql(sql, [])
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}
/**
 *  Fetcher l'echeancier global des rubriques optionnel defini dans spider
 * @returns 
 */
export function fetchEcheancierRubriqueOptionnelGlobal(): Promise<ISpiderEcheancierRubriqueOptionnelItem[]> {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT echeancier_rubrique_optionnel_global.idEcheancierRubriqueOptionnelGlobal, echeancier_rubrique_optionnel_global.idRubriqueOptionnelGlobal, echeancier_rubrique_optionnel_global.libellePeriode, echeancier_rubrique_optionnel_global.dateDebutPeriode, echeancier_rubrique_optionnel_global.dateFinPeriode, echeancier_rubrique_optionnel_global.montantPeriode
      FROM echeancier_rubrique_optionnel_global;`;
            const result = await _selectSql(sql, []);
            resolve(result);
        } catch (error) {
            Logger.error("Erreur lors de recuperation eleves pour focus ecole");
            reject(error);
        }
    });
}

/**
 * fetcher les rubriques defini dans spider
 * @returns 
 */
export function fecthRubriques(rubriqueIds: number[] | null = null): Promise<ISpiderRubriqueItem[]> {
    return new Promise(async (resolve, reject) => {
        try {

            const baseSql = `SELECT rubrique.idRubrique, rubrique.idGroupeRubrique, rubrique.libelleRubrique, rubrique.descriptionRubrique, rubrique.idNaturePaiement, rubrique.desabonnementInterdit
      FROM rubrique`;

            const sql = rubriqueIds
                ? `${baseSql} WHERE rubrique.idRubrique IN (${rubriqueIds.join(",")})`
                : baseSql;

            const result = await _selectSql(sql, []);
            resolve(result);
        } catch (error) {
            Logger.error(
                "Erreur lors de recuperation rubriques"
            );
            reject(error);
        }
    });
};

/**
 * Fetcher les options a tenir compte pour les rubliques obigatoires
 * @returns 
 */
export function fetchOptionTypeClasseRubriqueObligatoire(): Promise<ISpiderOptionTypeClasseRubriqueObligatoireItem[]> {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT option_typeclasse_rubrique_obligatoire_newspd.idOptionTypeClasseRubrique, option_typeclasse_rubrique_obligatoire_newspd.idTypeClasse, option_typeclasse_rubrique_obligatoire_newspd.idRubrique, option_typeclasse_rubrique_obligatoire_newspd.priorite, option_typeclasse_rubrique_obligatoire_newspd.tenirCompteDeStatut, option_typeclasse_rubrique_obligatoire_newspd.tenirCompteDeAnciennete, option_typeclasse_rubrique_obligatoire_newspd.tenirCompteDeGenre
      FROM option_typeclasse_rubrique_obligatoire_newspd;`;
            const result = await fetchFromMsAccess<ISpiderOptionTypeClasseRubriqueObligatoireItem[]>(sql, appCnx);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 *  fetcher les rubriques obligatoires definit suivant les types classes
 * @returns 
 */
export function fetchTypeClasseRubriqueObligatoire(): Promise<ISpiderTypeClasseRubriqueObligatoireItem[]> {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT typeclasse_rubrique_obligatoire_newspd.idTypeClasseRubrique, typeclasse_rubrique_obligatoire_newspd.idOptionTypeClasseRubrique, typeclasse_rubrique_obligatoire_newspd.nombreVersement, typeclasse_rubrique_obligatoire_newspd.montantRubrique, typeclasse_rubrique_obligatoire_newspd.statut, typeclasse_rubrique_obligatoire_newspd.anciennete, typeclasse_rubrique_obligatoire_newspd.genre
        FROM typeclasse_rubrique_obligatoire_newspd;      `;
            const result = await fetchFromMsAccess<ISpiderTypeClasseRubriqueObligatoireItem[]>(sql, appCnx);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}


/**
 * fetcher les echeances des rubriques obligatoires
 * @returns 
 */
export function fetchEcheancierTypeClasseRubriqueObligatoire(): Promise<ISpiderEcheancierTypeClasseRubriqueObligatoireItem[]> {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT echeancier_typeclasse_rubrique_obligatoire_newspd.idTypeClasseRubrique, echeancier_typeclasse_rubrique_obligatoire_newspd.libellePeriode, echeancier_typeclasse_rubrique_obligatoire_newspd.dateDebutPeriode, echeancier_typeclasse_rubrique_obligatoire_newspd.dateFinPeriode, echeancier_typeclasse_rubrique_obligatoire_newspd.montantPeriode
        FROM echeancier_typeclasse_rubrique_obligatoire_newspd;`;
            const result = await fetchFromMsAccess<ISpiderEcheancierTypeClasseRubriqueObligatoireItem[]>(sql, appCnx);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * fetcher les echeances de un ou  plusieurs rubrique personnalisé de un ou plusieur eleves (eleve rubrique)
 * @param idEleveRubrique l'id de la tabzl eleve rubrique
 */
export function fetchEcheancierPersonnelEleveRubrique(idEleveRubrique: number[] | null = null): Promise<ISpiderEcheancierPersonnelEleveRubriqueItem[]> {
    return new Promise(async (resolve, reject) => {
        try {
            const baseSql = `SELECT echeancier_personnel_eleve_rubrique_newspd.idEcheancierRubriquePersonnel, echeancier_personnel_eleve_rubrique_newspd.idEleveRubrique, 
      echeancier_personnel_eleve_rubrique_newspd.libellePeriode, echeancier_personnel_eleve_rubrique_newspd.dateDebutPeriode,
       echeancier_personnel_eleve_rubrique_newspd.dateFinPeriode, echeancier_personnel_eleve_rubrique_newspd.montantPeriode
      FROM echeancier_personnel_eleve_rubrique_newspd`;
            const sql = baseSql
            // ? `${baseSql} WHERE echeancier_personnel_eleve_rubrique_newspd.idEleveRubrique.idEleve IN ("${idEleveRubrique.join(`","`)}")`
            // : baseSql;
            console.log("🚀 ~ file: functions.ts ~ line 1023 ~ returnnewPromise ~ sql", sql)
            const result = await fetchFromMsAccess<ISpiderEcheancierPersonnelEleveRubriqueItem[]>(sql, appCnx);
            resolve(result);
        } catch (error) {
            Logger.error("Erreur lors de recuperation eleve rubrque");
            reject(error);
        }
    });
}


/**
 * Fetcher tous les rubriques qu'un ou plusieurs ont personnalisé (le rythme de paiement / versement ...)
 * @param eleveIds 
 * @returns 
 */
export function fetchEleveRubrique(eleveIds: number[] | null = null): Promise<ISpiderEleveRubriqueItem[]> {
    return new Promise(async (resolve, reject) => {
        try {
            const baseSql = `SELECT eleve_rubrique_newspd.idEleveRubrique, eleve_rubrique_newspd.idEleve, eleve_rubrique_newspd.idRubrique, eleve_rubrique_newspd.nombreVersement, eleve_rubrique_newspd.montantRubrique
      FROM eleve_rubrique_newspd`;
            const sql = eleveIds
                ? `${baseSql} WHERE eleve_rubrique_newspd.idEleve IN (${eleveIds.join(",")})`
                : baseSql;
            const result = await fetchFromMsAccess<ISpiderEleveRubriqueItem[]>(sql, appCnx);
            resolve(result);
        } catch (error) {
            Logger.error("Erreur lors de recuperation eleve rubrque");
            reject(error);
        }
    });
}

/**
 * Fetcher les souscription rubrique optionnnel effectué par un ou plusieur eleve
 * @returns 
 */
export function fetchSouscriptionFraisRubriqueOptionnel(eleveIds: number[] | null = null): Promise<ISpiderSouscriptionFraisRubriqueOptionnelItem[]> {
    return new Promise(async (resolve, reject) => {
        try {
            const baseSql = `SELECT souscription_frais_rubrique_optionnel.idSouscriptionFraisRubriqueOptionnel, souscription_frais_rubrique_optionnel.idEcheancierRubriqueOptionnel,
       souscription_frais_rubrique_optionnel.idEleve, souscription_frais_rubrique_optionnel.personnalise
      FROM souscription_frais_rubrique_optionnel`;
            const sql = eleveIds
                ? `${baseSql} WHERE souscription_frais_rubrique_optionnel.idEleve IN (${eleveIds.join(",")})`
                : baseSql;
            // const result = await _selectSql<ISpiderSouscriptionFraisRubriqueOptionnelItem[]>(sql, appCnx);
            const result = await _selectSql(sql, [])
            resolve(result);
        } catch (error) {
            Logger.error("Erreur lors de recuperation eleves pour focus ecole");
            reject(error);
        }
    });
}


export default {
    setHttpFailsLogsSuccess,
    setLogsSuccess,
    getPartnersList,
    getServices,
    getServiceData,
    activateServiceWarehouse,
    deactivateService,
    initializeService,
    insertWhserverLog,
    fetchVersements,
    fetchDetailsVersementRubriqueObligatoire,
    fetchDetailsVersementRubriqueOptionnel,
    insertClassesListFromVba,
    insertElevesFromVba,
    fetchEcheancierIndividuel,
    setWarehouseLogsGroupActionSuccess,
    fetchRubriqueOptionnelGlobal,
    fetchEcheancierRubriqueOptionnelGlobal,
    fecthRubriques,
    fetchOptionTypeClasseRubriqueObligatoire,
    fetchTypeClasseRubriqueObligatoire,
    fetchEcheancierTypeClasseRubriqueObligatoire,
    fetchEleveRubrique,
    fetchEcheancierPersonnelEleveRubrique,
    fetchSouscriptionFraisRubriqueOptionnel,
    fetchLogs,
    fetchErrorsLogs,
    updateWarehouseConfig,
    deleteWarehouseConfig,
    insertTypeClasseListFromVba,
    fetchHttpFailsLogs
}