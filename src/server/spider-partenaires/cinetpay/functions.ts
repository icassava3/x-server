import { _executeSql, _selectSql } from "../../databases/index";
import Logger from '../../helpers/logger';
import { ICinetPayLogItem } from "./interfaces";
import { executeToMsAccess, fetchFromMsAccess, appCnx } from "../../databases/accessDB";
import { sleep } from "../../helpers/function";

const setCinetPayHistoric = (
  action: string,
  payload: any,
  statut: number
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const dateNow = new Date().toLocaleString();
      const sql = `INSERT INTO cinetpay_logs (action, payload, statut,date) VALUES (?, ?, ?, ?)`;
      const payloadStringify = JSON.stringify(payload);
      const sqlParams = [action, payloadStringify, statut, dateNow];
      await _executeSql(sql, sqlParams);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};



export function fetchLogs<ICinetPayLogItem>(logIds: number[] | null = null) {
  return new Promise(async (resolve, reject) => {
    try {
      if (logIds) {
        const sql = `SELECT * FROM cinetpay_logs WHERE id IN  (${logIds.join(
          ","
        )})`;
        const result: ICinetPayLogItem[] = await _selectSql(sql, []);
        resolve(result);
      } else {
        const sql = `SELECT * FROM cinetpay_logs`;
        const result: ICinetPayLogItem[] = await _selectSql(sql, []);
        resolve(result);
      }
    } catch (error) {
      Logger.error("Erreur lors de recuperation eleves pour gain technologie");
      reject(error);
    }
  });
}


/**
*marquer comme succes (statut =1)  des logs cinetpay
* @param logIds
* @returns
*/
export const setLogsSuccess = (logIds: number[]): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const dateNow = new Date().toLocaleString();
      const sql = `UPDATE cinetpay_logs SET statut = ?,date=? WHERE id IN  (${logIds.join(
        ","
      )})`;
      await _executeSql(sql, [1, dateNow]);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};


// /**
//  * inserer un versement focus ecole dans spider access
//  * @returns 
//  */
// const insertFocusVersement = (successData: any): Promise<Boolean> => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const dateNow = new Date()
//       const dateSql = `#${dateNow.getMonth() + 1}/${dateNow.getDate()}/${dateNow.getFullYear()} ${dateNow.getHours()}:${dateNow.getMinutes()}:${dateNow.getSeconds()}#`
//       // const dateSql = `#${dateNow.getMonth() + 1}/${dateNow.getDate()}/${dateNow.getFullYear()}#`

//       // console.log("🚀 ~ file: functions.ts ~ line 157 ~ returnnewPromise ~ dateSql", dateSql)
//       // const dateNow = moment().format('#MM/DD/YYYY#')

//       const { metadata, transaction_id } = successData
//       const sql = `INSERT INTO Versements (refElève,dateVers,operateur,clientVers,modePaie,cinetpay_transaction_id)
//       VALUES (${metadata.studentId},${dateSql},"spider_auto_sync","xxx",4,"${transaction_id}")`;
//       // console.log("🚀 ~ file: functions.ts ~ line 162 ~ returnnewPromise ~ sql", sql)
//       await executeToMsAccess(sql, appCnx);
//       resolve(true);
//     } catch (error) {
//       console.log("🚀 ~ file: functions.ts ~ line 166 ~ returnnewPromise ~ error", error)
//       Logger.error(
//         ""
//       );
//       reject(error);
//     }
//   });
// };

// /**
//  * /verifier aucun versement efectué dans spider access pour cette transaction ID
//  * @returns 
//  */
// const checkCinetpayVersementExist = (transactionId: string): Promise<any> => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const sql = `SELECT * FROM Versements WHERE cinetpay_transaction_id = "${transactionId}"`;
//       const result = await fetchFromMsAccess<any>(sql, appCnx);
//       if (result.length > 0) {
//         resolve(true)
//       } else {
//         resolve(false)
//       }

//     } catch (error) {
//       Logger.error(
//         ""
//       );
//       reject(error);
//     }
//   });
// };

// /**
//  * Obtenir l'id du versement d'une transaction
//  * @param transactionId 
//  * @returns 
//  */
// const getFocusVersementId = (transactionId: string): Promise<any> => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const sql = `SELECT RefVersement FROM Versements WHERE cinetpay_transaction_id = "${transactionId}"`;
//       const result = await fetchFromMsAccess<any>(sql, appCnx);
//       if (result.length === 1) {
//         resolve(result[0].RefVersement)
//       } else {
//         resolve(null)
//       }

//     } catch (error) {
//       Logger.error(
//         ""
//       );
//       reject(error);
//     }
//   });
// };

// /**
//  * l'id du versement
//  * @param metadata proveient de cinetpay
//  * @returns 
//  */
// const insertFocusDetailVersement = (amount: number, studentId: number, versementId: number, idRubrique: number): Promise<Boolean> => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const sql = `INSERT INTO DetailsVersements (RefVers,RefTypeVers,RefElève,Montant)
//       VALUES (${versementId},${idRubrique},${studentId},${amount})`;
//       await executeToMsAccess(sql, appCnx);
//       resolve(true);
//     } catch (error) {
//       console.log("🚀 ~ file: functions.ts ~ line 166 ~ returnnewPromise ~ error", error)
//       Logger.error(
//         ""
//       );
//       reject(error);
//     }
//   });
// };

// /**
//  * inserer un mouvement pour le versement effectué
//  * @param versementId 
//  * @returns 
//  */
// const insertMouvement = (versementId: number): Promise<Boolean> => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const sql = `
//              INSERT INTO T_Mouvements ( RefOperation, LibMouv, TypeMouv, RefBeneficiaire, BeneficiaireMouv, StatutElève, RefClasse, ClasseCourt, DateMouv, ValeurMouv, Operateur, OpModif, DateModif )
//              SELECT Versements.RefVersement AS RefOperation, TypesVersement.LibelléVers AS LibMouv, "Crédit" AS TypeMouv, Elèves.RefElève AS RefBeneficiaire, [NomElève] & " " & [PrénomElève] AS BeneficiaireMouv, Elèves.StatutElève, Classes.RefClasse, Classes.ClasseCourt, Versements.DateVers AS DateMouv, DetailsVersements.Montant AS ValeurMouv, Versements.Operateur, Versements.OpModif, Versements.DateModif
//              FROM (TypesVersement INNER JOIN (DetailsVersements INNER JOIN (Elèves INNER JOIN Versements ON Elèves.RefElève = Versements.RefElève) ON DetailsVersements.RefVers = Versements.RefVersement) ON TypesVersement.RefTypeVers = DetailsVersements.RefTypeVers) INNER JOIN Classes ON Elèves.RefClasse = Classes.RefClasse
//              GROUP BY Versements.RefVersement, TypesVersement.LibelléVers, "Crédit", Elèves.RefElève, [NomElève] & " " & [PrénomElève], Elèves.StatutElève, Classes.RefClasse, Classes.ClasseCourt, Versements.DateVers, DetailsVersements.Montant, Versements.Operateur, Versements.OpModif, Versements.DateModif
//              HAVING Versements.RefVersement= ${versementId}
//              `
//       await executeToMsAccess(sql, appCnx);
//       resolve(true);
//     } catch (error) {
//       console.log("🚀 ~ file: functions.ts ~ line 166 ~ returnnewPromise ~ error", error)
//       Logger.error(
//         ""
//       );
//       reject(error);
//     }
//   });
// };

// /**
//  * Compter le nombre total de versement effectué pour cet eleve
//  * @param studentId 
//  * @returns 
//  */
// const countStudentVersement = (studentId: number): Promise<number> => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const sql = `SELECT COUNT (*) AS countVers FROM Versements WHERE RefElève = ${studentId}`;
//       const result = await fetchFromMsAccess(sql, appCnx);
//       console.log("🚀 ~ file: functions.ts ~ line 210 ~ returnnewPromise ~ result", result)
//       resolve(result[0].countVers);
//     } catch (error) {
//       console.log("🚀 ~ file: functions.ts ~ line 212 ~ returnnewPromise ~ error", error)
//       Logger.error("");
//       reject(error);
//     }
//   });
// };

// /**
//  * Marquer l'eleve comme inscrit
//  * @param studentId 
//  * @returns 
//  */
// const setEleveInscrit = (studentId: number): Promise<Boolean> => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const sql = `UPDATE Elèves SET Inscrit=YES, DateInscrip=Date() WHERE Inscrit=NO And RefElève= ${studentId}`
//       await executeToMsAccess(sql, appCnx);
//       resolve(true);
//     } catch (error) {
//       console.log("🚀 ~ file: functions.ts ~ line 232 ~ returnnewPromise ~ error", error)
//       Logger.error("");
//       reject(error);
//     }
//   });
// };

// /**
//  * Mettre a jour les donnes de l'eleve dans la table point_vers
//  * @param studentId 
//  * @returns 
//  */
// const updateStudentPointVers = (studentId: number): Promise<Boolean> => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const sql1 = `DELETE * FROM tbl_point_vers_eleve_rubr WHERE RefElève = ${studentId}`
//       await executeToMsAccess(sql1, appCnx);

//       const sqll = `SELECT * FROM tbl_point_vers_eleve_rubr WHERE RefElève = ${studentId}`
//       const ress = await fetchFromMsAccess(sqll,appCnx)
//       console.log("🚀 ~ file: functions.ts ~ line 253 ~ returnnewPromise ~ ress", ress)
//      sleep(2000)
//       const sql2 = `INSERT INTO tbl_point_vers_eleve_rubr 
//       SELECT * FROM req_point_vers_eleve_rubr 
//       WHERE RefElève=${studentId}`
//       await executeToMsAccess(sql2, appCnx);

//       resolve(true);
//     } catch (error) {
//       console.log("🚀 ~ file: functions.ts ~ line 257 ~ returnnewPromise ~ error", error)
//       Logger.error("");
//       reject(error);
//     }
//   });
// };



export default {
  setCinetPayHistoric,
  fetchLogs,
  setLogsSuccess,
  // insertFocusVersement,
  // checkCinetpayVersementExist,
  // getFocusVersementId,
  // insertFocusDetailVersement,
  // insertMouvement,
  // countStudentVersement,
  // setEleveInscrit,
  // updateStudentPointVers
}
