import {
  fetchFromMsAccess,
  executeToMsAccess,
  appCnx,
  dataCnx
} from "../../databases/accessDB";
import Logger from "../../helpers/logger";
import { IMemoPaymentItem, IMemoStudentItem } from "./interface";

/**
 * fetcher un ou plusieurs eleve chez spider au format voulu par memo
 * @param studentId
 * @returns
 */
export function fetchEleves<IMemoStudentItem>(
  studentIds: number[] | null = null
): Promise<IMemoStudentItem> {
  return new Promise(async (resolve, reject) => {
    try {
      const baseSql = `SELECT DISTINCT Elèves.RefElève AS Refelv, Elèves.nomElève AS Nom, Elèves.prénomElève AS Prenom,
        IIf([Elèves].[statutElève]=1,"AFF","NAFF") AS Statut, IIf([Elèves].[sexe]=1,"M","F") AS Sexe,
        [classes].[ClasseCourt] AS Classe,
        IIf(Elèves.[matriculeNational] is null AND Elèves.[matric_prov_dsps] is null,"", IIf(Elèves.[matriculeNational] is null,Elèves.[matric_prov_dsps],Elèves.[matriculeNational])) AS Mle
        FROM Niveau_DPES INNER JOIN (Elèves INNER JOIN Classes ON Elèves.RefClasse = Classes.RefClasse) ON Niveau_DPES.RefTypeClasse = Classes.RefTypeClasse
        WHERE Elèves.inscrit = yes`;
      const sql = studentIds
        ? `${baseSql} AND Elèves.RefElève IN (${studentIds.join(",")})`
        : `${baseSql}`;

      const result = await fetchFromMsAccess<IMemoStudentItem>(sql, appCnx);

      resolve(result);
    } catch (error) {
      Logger;
      reject(error);
    }
  });
}


export function insertStudents<IMemoStudentItem>(
  studentIds: number[] | null = null
): Promise<IMemoStudentItem> {
  return new Promise(async (resolve, reject) => {
    try {
      const baseSql = `SELECT DISTINCT Elèves.RefElève AS Refelv, Elèves.nomElève AS Nom, Elèves.prénomElève AS Prenom,
        IIf([Elèves].[statutElève]=1,"AFF","NAFF") AS Statut, IIf([Elèves].[sexe]=2,"F","M") AS Sexe,
        [classes].[ClasseCourt] AS Classe,
        IIf(Elèves.[matriculeNational] is null AND Elèves.[matric_prov_dsps] is null,"", IIf(Elèves.[matriculeNational] is null,Elèves.[matric_prov_dsps],Elèves.[matriculeNational])) AS Mle, Elèves.DateInscrip AS Date_ins
        FROM Elèves INNER JOIN Classes ON Elèves.RefClasse = Classes.RefClasse
        WHERE Elèves.inscrit = yes`;
      const sql = studentIds
        ? `${baseSql} AND Elèves.RefElève IN (${studentIds.join(",")})`
        : `${baseSql}`;
      const insertSql = `INSERT INTO memo_Eleve ${sql}`
      const result = await executeToMsAccess(insertSql, appCnx)
      resolve(result);
    } catch (error) {
      Logger;
      reject(error);
    }
  });
}




/**
 * supprimer un eleve dans la base access memo
 * @param studentId
 * @returns
 */
const supprimerEleves = async (studentIds: number[] | null) => {
  return new Promise(async (resolve, reject) => {
    try {
      const baseSql = `DELETE FROM memo_eleve`;
      const sql = studentIds
        ? `${baseSql}  WHERE memo_eleve.Refelv IN (${studentIds.join(",")})`
        : `${baseSql}`;
      const result = await executeToMsAccess(sql, appCnx);
      resolve(result);
    } catch (error) {
      Logger;
      reject(error);
    }
  });
};

/**
 * fetcher tous les paiements ou les paiements liés a un versement chez spider
 * @param versementId
 * @returns
 */

/* export function fetchPaiements<IMemoPaymentItem>(versementIds: number[] | null = null): Promise<IMemoPaymentItem> {
  return new Promise(async (resolve, reject) => {
    try {
      const baseSql = `SELECT [Versements].[RefElève] AS Refelv, DetailsVersements.Montant AS Montant, [RefVersement] AS NumRecu, TypesVersement.LibelléVers AS Libelle, [Versements].[DateVers] AS Datepaie
          FROM tbl_mode_paie INNER JOIN (TypesVersement INNER JOIN (Versements INNER JOIN DetailsVersements ON Versements.RefVersement = DetailsVersements.RefVers) ON TypesVersement.RefTypeVers = DetailsVersements.RefTypeVers) ON tbl_mode_paie.id_mode_paie = Versements.ModePaie`;

      const sql = versementIds
        ? `${baseSql} WHERE Versements.RefVersement IN (${versementIds.join(",")})`
        : `${baseSql}`;
      const result = await fetchFromMsAccess<IMemoPaymentItem>(sql, appCnx);
      resolve(result);
    } catch (error) {
      Logger;
      reject(error);
    }
  });
}; */


export function insererPaiements<IMemoPaymentItem>(versementIds: number[] | null = null): Promise<IMemoPaymentItem> {
  return new Promise(async (resolve, reject) => {
    try {
      const baseSql = `SELECT [Versements].[RefElève] AS Refelv, [RefVersement] AS NumRecu,TypesVersement.LibelléVers AS Libelle,DetailsVersements.Montant AS Montant, [Versements].[DateVers] AS Datepaie
          FROM tbl_mode_paie INNER JOIN (TypesVersement INNER JOIN (Versements INNER JOIN DetailsVersements ON Versements.RefVersement = DetailsVersements.RefVers) ON TypesVersement.RefTypeVers = DetailsVersements.RefTypeVers) ON tbl_mode_paie.id_mode_paie = Versements.ModePaie`;
      const sql = versementIds
        ? `${baseSql} WHERE Versements.RefVersement IN (${versementIds.join(",")})`
        : `${baseSql}`;
      const insertSql = `INSERT INTO memo_paiement ${sql}`
      const result = await executeToMsAccess(insertSql, appCnx)
      resolve(result);
    } catch (error) {
      Logger;
      reject(error);
    }
  });
};

/**
 * supprimer tous les paiements liés a un versement
 * @param versementId
 * @returns
 */
const supprimerPaiements = (versementIds: number[] | null = null) => {
  return new Promise(async (resolve, reject) => {
    try {
      const baseSql = `DELETE FROM memo_paiement`
      const sql = versementIds
        ? `${baseSql}  WHERE memo_paiement.NumRecu IN (${versementIds.join(",")})`
        : `${baseSql}`;
      const result = await executeToMsAccess(sql, appCnx);
      resolve(result);
    } catch (error) {
      Logger;
      reject(error);
    }
  });
};


export default {
  fetchEleves,
  supprimerEleves,
  insererPaiements,
  supprimerPaiements,
  insertStudents
};
