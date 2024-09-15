import { ISmsSpider, ITblSmsSpider, ISendBoxMessages, IAssiduite, IEleveWithClasseItem, IParentContact, IPayloadNewSmsAccount, ISendBoxSms, IFournisseur, IMembrePersonnel, IMatiere } from './interfaces';
import {
  appCnx,
  executeToMsAccess,
  fetchFromMsAccess,
  paramEtabObjet,
} from "../databases/accessDB";
import { chunksArray } from '../helpers/function';
import { _executeSql, _selectSql } from '../databases';
const uuid = require("uuid");

/**
 * verrouiller et recupperer les message à envoyer (symtel)
 * @param sessionId
 * @param providerId
 * @returns
 */
export function markAndFetchMessageToSend(sessionId: string, providerId: number): Promise<ISmsSpider[]> {
  return new Promise(async (resolve, reject) => {
    try {

      //Verrouiller les messages de cette sessionId afin qu'il ne soit pas envoyer a nouveau par un autre utilisateur (une autre sessionId)
      // const sqlUpdate = `UPDATE tbl_sms SET Expediteur = "${sessionId}",MsgLocked=-1 WHERE MsgSend = 0 AND MsgLocked = 0 AND TypeSMS = 1`
      const sqlUpdate = `UPDATE tbl_sms SET Expediteur = "${sessionId}",MsgLocked=-1 WHERE MsgSend = 0 AND MsgLocked = 0`
      await executeToMsAccess(sqlUpdate, appCnx);

      //fetcher les messages lié qui seront envoyé 
      const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const sql = `SELECT "${anscol1}" AS anneeScolaire,"${codeetab}" AS codeEtab,"${providerId}" AS providerId, RefMsg AS idMessage,RefElève AS idEleve,DateCreationMsg AS dateCreationMessage,NumTel AS numeroTelephone,
       Expediteur AS expediteur,LibMsg AS libelleMessage, MsgSend AS messageSend,DateEnvoi AS dateEnvoi,CodeOp AS codeOp, SelectMsg AS selectMessage,MsgPriority AS messagePriority,
       MsgLocked AS messageLocked, TransactionID AS transactionId, TypeSMS AS typeSms 
       FROM tbl_sms 
       WHERE Expediteur = "${sessionId}"`
      const result = await fetchFromMsAccess<ISmsSpider[]>(sql, appCnx);
      if (!result.length) return reject({ name: "NO_SMS_IN_SENDBOX", message: "Aucun message dans la boite d'envoi" })
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * deverrouiller des messages d'une session afin qu'on puisse les envoyer a nouveau
 * @param messagesIds 
 * @returns 
 */
export function unlockMessages(sessionId: string): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    try {
      const sqlUpdate = `UPDATE tbl_sms SET MsgLocked=0, MsgSend = 0 WHERE  Expediteur = "${sessionId}"`
      await executeToMsAccess(sqlUpdate, appCnx);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}


/**
 * marquer des messages symtel comme etant envoyé (spider)
 * @param messagesIds 
 * @returns 
 */
export function setMessageAsSent(sessionId: string, sender: string): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `UPDATE tbl_Sms SET Expediteur ="${sender}", MsgSend = -1,DateEnvoi = Now(),CodeOp =1, TransactionID ="${sessionId}"
            WHERE Expediteur="${sessionId}"`
      await executeToMsAccess(sql, appCnx);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * listes des niveaux
 * @returns 
 */
export function fetchNiveaux() {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT DISTINCT Niveaux.RefNiveau, Niveaux.NiveauCourt
      FROM Niveaux INNER JOIN ((Elèves INNER JOIN Classes ON Elèves.RefClasse = Classes.RefClasse) INNER JOIN
      TypesClasses ON Classes.RefTypeClasse = TypesClasses.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau
      ORDER BY Niveaux.RefNiveau`;
      const result = await fetchFromMsAccess(sql, appCnx);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * recuperer la liste des eleves
 * @returns 
 */
export function fetchStudents() {
  return new Promise(async (resolve, reject) => {
    try {

      const sql = `SELECT Elèves.RefElève AS idEleve, Elèves.RefElève AS idPersonne, [NomElève] & " " & [PrénomElève] AS nomPrenomEleve, Classes.ClasseCourt AS libelleClasseCourt, Classes.OrdreClasse AS OrdreClasse, Elèves.Tuteur AS nomPrenomTuteur, Elèves.TélTuteur AS telephoneTuteur, Classes.RefClasse AS idClasse, Niveaux.RefNiveau AS idNiveau, Niveaux.NiveauCourt AS libelleNiveauCourt, TypesClasses.RefTypeClasse AS idTypeClasse, ordre_enseig.ref_ordre_enseig AS idOrdreEnseignement, ordre_enseig.lib_ordre_enseig AS libelleOrdreEnseignement, TypesClasses.Niveau AS libelleNiveauParSerie
      FROM ((((Elèves INNER JOIN Classes ON Elèves.RefClasse = Classes.RefClasse) INNER JOIN TypesClasses ON Classes.RefTypeClasse = TypesClasses.RefTypeClasse) INNER JOIN Filières ON TypesClasses.Filière = Filières.RefFilière) INNER JOIN ordre_enseig ON Filières.ref_ordre_enseig = ordre_enseig.ref_ordre_enseig) INNER JOIN Niveaux ON TypesClasses.Niveau = Niveaux.RefNiveau
      WHERE (((Elèves.TélTuteur) Is Not Null And (Elèves.TélTuteur)<>""))
      ORDER BY Classes.OrdreClasse, Elèves.NomElève, Elèves.PrénomElève;
           
      `;

      const result = await fetchFromMsAccess(sql, appCnx);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * recuperer la liste des évaluations des eleves
 * @returns 
 */
export function fetchStudentsEvalNotes(idEleves?: number[]) {
  return new Promise(async (resolve, reject) => {
    try {
      const filter = idEleves
        ? `AND Elèves.RefElève IN (${idEleves.join(",")})`
        : "";
      const sql = `SELECT Elèves.RefElève AS idEleve, Elèves.RefClasse AS idClasse, [NomElève] & " " & [PrénomElève] AS nomPrenomEleve, IIf(IsNull([tb_eval_note].[noteEval]),[tb_eval_prog].[typeEval] & '-' & [Matières].[MatCourt] & ':abs',[tb_eval_prog].[typeEval] & '-' & [Matières].[MatCourt] & ':' & [tb_eval_note].[noteEval] & '/' & [tb_eval_prog].[coefEval]*20) AS evaluation, Elèves.MatriculeNational AS matriculeEleve, Elèves.Sexe AS sexe, tb_eval_note.dateSaisie, tb_eval_note.dateModif, tb_eval_prog.periodeEval, tb_eval_prog.numEval, tb_eval_prog.coefEval, tb_eval_prog.dateCompo, tb_eval_prog.typeEval, Matières.MatCourt AS libelleMatiereCourt, Matières.MatLong AS libelleMatiereLong, Classes.OrdreClasse, Classes.ClasseCourt AS libelleClasseCourt, Classes.ClasseLong, Elèves.Tuteur AS nomPrenomTuteur, Elèves.TélTuteur AS cellulaireTuteur, tb_eval_note.noteEval, ordre_enseig.lib_ordre_enseig AS libelleOrdreEnseignement, Niveaux.NiveauCourt AS libelleNiveauCourt, Classes.RefTypeClasse AS libelleNiveauParSerie
      FROM ((((Matières INNER JOIN (Elèves INNER JOIN (Classes INNER JOIN (tb_eval_prog INNER JOIN tb_eval_note ON tb_eval_prog.idEval = tb_eval_note.idEval) ON Classes.RefClasse = tb_eval_prog.refClasse) ON Elèves.RefElève = tb_eval_note.refEleve) ON Matières.RefMatière = tb_eval_prog.refMat) INNER JOIN TypesClasses ON Classes.RefTypeClasse = TypesClasses.RefTypeClasse) INNER JOIN Filières ON TypesClasses.Filière = Filières.RefFilière) INNER JOIN ordre_enseig ON Filières.ref_ordre_enseig = ordre_enseig.ref_ordre_enseig) INNER JOIN Niveaux ON TypesClasses.Niveau = Niveaux.RefNiveau
      WHERE (((Elèves.TélTuteur) Is Not Null And (Elèves.TélTuteur)<>""))
      ${filter} ORDER BY Classes.OrdreClasse, Elèves.NomElève, Elèves.PrénomElève;
      
      `;
      // const sql = ` SELECT Elèves.RefElève AS idEleve, Elèves.RefClasse AS idClasse, [NomElève] & " " & [PrénomElève] AS nomPrenomEleve, 
      // IIf(IsNull([tb_eval_note].[noteEval]),[tb_eval_prog].[typeEval] & '-' & [Matières].[MatCourt] & ':abs',[tb_eval_prog].[typeEval] & '-' & [Matières].[MatCourt] & ':' & [tb_eval_note].[noteEval] & '/20') AS evaluation, Elèves.MatriculeNational AS matriculeEleve, Elèves.Sexe AS sexe, tb_eval_note.dateSaisie, tb_eval_note.dateModif, tb_eval_prog.periodeEval, tb_eval_prog.numEval, tb_eval_prog.coefEval, tb_eval_prog.dateCompo, tb_eval_prog.typeEval, Matières.MatCourt AS libelleMatiereCourt, Matières.MatLong AS libelleMatiereLong, Classes.OrdreClasse, Classes.ClasseCourt AS libelleClasseCourt, Classes.ClasseLong, Elèves.Tuteur AS nomPrenomTuteur, Elèves.TélTuteur AS cellulaireTuteur, tb_eval_note.noteEval, ordre_enseig.lib_ordre_enseig AS libelleOrdreEnseignement, Niveaux.NiveauCourt AS libelleNiveauCourt
      // FROM ((((Matières INNER JOIN (Elèves INNER JOIN (Classes INNER JOIN (tb_eval_prog INNER JOIN tb_eval_note ON tb_eval_prog.idEval = tb_eval_note.idEval) ON Classes.RefClasse = tb_eval_prog.refClasse) ON Elèves.RefElève = tb_eval_note.refEleve) ON Matières.RefMatière = tb_eval_prog.refMat) INNER JOIN TypesClasses ON Classes.RefTypeClasse = TypesClasses.RefTypeClasse) INNER JOIN Filières ON TypesClasses.Filière = Filières.RefFilière) INNER JOIN ordre_enseig ON Filières.ref_ordre_enseig = ordre_enseig.ref_ordre_enseig) INNER JOIN Niveaux ON TypesClasses.Niveau = Niveaux.RefNiveau
      // ${filter} ORDER BY Classes.OrdreClasse, Elèves.NomElève, Elèves.PrénomElève;
      // `;
      const result = await fetchFromMsAccess(sql, appCnx);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * recuperer la liste des évaluations programmés
 * @returns 
 */
export function fetchEvalProgs() {
  return new Promise(async (resolve, reject) => {
    try {

      const sql = `SELECT Classes.ClasseCourt AS libelleClasseCourt, Classes.OrdreClasse,tb_eval_prog.periodeEval, 
      tb_eval_prog.numEval, tb_eval_prog.coefEval, tb_eval_prog.dateCompo, Matières.MatLong AS libelleMatiereLong, 
      tb_eval_prog.typeEval, Matières.RefMatière AS idClasse, Matières.MatCourt AS libelleMatiereCourt
      FROM Matières INNER JOIN (tb_eval_prog INNER JOIN Classes ON tb_eval_prog.refClasse = Classes.RefClasse)
       ON Matières.RefMatière = tb_eval_prog.refMat ORDER BY Classes.OrdreClasse;           
      `;

      const result = await fetchFromMsAccess(sql, appCnx);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}


/**
 * recuperer la liste des personnels
 * @returns 
 */
export function fetchPersonnel(personnelIds: number[] | null = null): Promise<IMembrePersonnel[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const filter = personnelIds
        ? `AND Personnel.RefPersonnel IN (${personnelIds.join(",")})`
        : "";
      const sql = `SELECT "${anscol1}" AS anneeScolaire, "${codeetab}" AS codeEtab, "" AS whatsApp, "" AS email,
      Personnel.RefPersonnel AS idPersonne, Personnel.fonction AS idFonction, Personnel.RefPersonnel AS idPersonnel ,[Personnel.NomPers] & " " & [Personnel.PrénomPers] AS nomPrenomPersonnel ,
       Fonction.Fonction AS fonction, Personnel.Matricule AS matriculePersonnel, Personnel.Sexe AS sexe, Personnel.TélPers AS phone1,
        Personnel.CelPers AS phone2, Personnel.DateNaiss AS dateNaissance, Personnel.LieuNaiss AS lieuNaissance, Diplomes.NomDiplome AS libelleDiplome,
         Personnel.Quartier AS residence, Personnel.SitMatr AS situationMatrimoniale, Personnel.DateEmbauche AS dateEmbauche, Personnel.N°CNPS AS numeroCnps,
          Personnel.NbEnfants AS nombreEnfant, Personnel.Corps AS corpsMetier,  Matières.MatCourt AS specialite
      FROM ((Personnel LEFT JOIN Fonction ON Personnel.Fonction = Fonction.RefFonction)
      LEFT JOIN Diplomes ON Personnel.RefDiplome = Diplomes.RefDiplome) LEFT JOIN Matières ON Personnel.RefMatière = Matières.RefMatière WHERE Personnel.CelPers Is Not Null And Personnel.CelPers <> "" ${filter}  ORDER BY Personnel.NomPers;
      `;
      const result: IMembrePersonnel[] = await fetchFromMsAccess(
        sql,
        appCnx
      );
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}


/**
 * inserer des messages dans la boite d'envoi
 * @param data 
 * @returns 
 */
export function insertSendBoxMessage(data) {
  return new Promise(async (resolve, reject) => {
    try {
      const fields = `anneeScolaire,codeEtab,sessionId,studentId,targetAppId,phone,messageTitle,messageContent,alertLevel,createdAt`;
      const valuesChunks = chunksArray(data, 450);
      await Promise.all(valuesChunks.map(async chunkItem => {
        let valuesPlaceholders = chunkItem.map(() => "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").join(', ');
        const sql = `INSERT INTO messages_apps (${fields}) VALUES ${valuesPlaceholders}`;
        let values = [];
        chunkItem.forEach((arr) => { arr.forEach((item) => { values.push(item) }) });
        await _executeSql(sql, values);
      }))
      resolve(true);

    } catch (error) {
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
      const valuesChunks = chunksArray(data, 450);
      await Promise.all(valuesChunks.map(async chunkItem => {
        let valuesPlaceholders = chunkItem.map(() => "(?, ?, ?, ?, ?, ?, ?, ?)").join(', ');
        const sql = `INSERT INTO messages_sms (${fields}) VALUES ${valuesPlaceholders}`;
        let values = [];
        chunkItem.forEach((arr) => { arr.forEach((item) => { values.push(item) }) });
        await _executeSql(sql, values);
      }))
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}


/**
 * fetcher les messages de la boite d'envoie en attente d'etre envoyé et ensuite les verrouiller afin qu'il ne puissent pas etre envoyé par un autre client (users)
 * @returns 
 */
export const fetchSendBoxMessageNotSent = (sessionIds: string[]): Promise<ISendBoxMessages[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT messages_apps.*, "ETAB" as sender FROM messages_apps WHERE messageLocked = 0  AND sentAt IS NULL AND sessionId IN('${sessionIds.join("','")}')`;
      const result: ISendBoxMessages[] = await _selectSql(sql, []);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * fetcher les sms de la boite d'envoie en attente d'etre envoyé et ensuite les verrouiller afin qu'il ne puissent pas etre envoyé par un autre client (users)
 * @returns 
 */
export const fetchSendBoxSmsNotSent = (sessionIds: string[] | null = null): Promise<ISendBoxSms[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { anscol1, codeetab } = await paramEtabObjet([
        "Anscol1",
        "CodeEtab",
      ]);
      const baseSql = `SELECT 
      anneeScolaire,
      codeEtab,
      smsId,
      sessionId,
      idPersonne,
      smsDestinataireKey,
      phone,
      smsContent,
      createdAt FROM messages_sms WHERE smsLocked = 0  AND sentAt IS NULL AND anneeScolaire = ? AND codeEtab=?`;

      const sql = (sessionIds || sessionIds.length)
        ? `${baseSql} AND sessionId IN('${sessionIds.join("','")}')`
        : baseSql;

      const result: ISendBoxSms[] = await _selectSql(sql, [anscol1, codeetab]);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Verrouiller ou deverouiller des messages
 */
export function toggleLockUnlockMessage(messagesIds: number[], newStatus) {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `UPDATE messages_apps SET messageLocked=? WHERE messageId IN(${messagesIds.join(",")})`;
      await _executeSql(sql, [newStatus]);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Verrouiller ou deverouiller des sms
 * @param smsIds 
 * @param newStatus 
 * @returns 
 */
export function toggleLockUnlockSms(smsIds: number[], newStatus) {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `UPDATE messages_sms SET smsLocked=? WHERE smsId IN(${smsIds.join(",")})`;
      await _executeSql(sql, [newStatus]);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * recuppert tous les messages de la boite d'envoi
 * @returns 
 */
export function fetchSendBoxMessage(sessionIds: string[] = null) {
  return new Promise(async (resolve, reject) => {
    try {
      const { anscol1, codeetab } = await paramEtabObjet([
        "Anscol1",
        "CodeEtab",
      ]);
      const baseSql = `SELECT * FROM messages_apps WHERE codeEtab = ? AND anneeScolaire = ?`
      const sql = sessionIds
        ? `${baseSql}  AND sessionId IN ("${sessionIds.join('","')}")`
        : baseSql;
      console.log("sql", sql);
      const result: ISendBoxMessages[] = await _selectSql(sql, [codeetab, anscol1]);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * recuppert tous les sms de la boite d'envoi
 * @param sessionIds 
 * @returns 
 */
export function fetchSendBoxSms(sessionIds: string[] = null) {
  return new Promise(async (resolve, reject) => {
    try {
      const { anscol1, codeetab } = await paramEtabObjet([
        "Anscol1",
        "CodeEtab",
      ]);
      console.log("🚀 ~ file: functions.ts:375 ~ returnnewPromise ~ anscol1:", anscol1)
      const baseSql = `SELECT * FROM messages_sms WHERE codeEtab = ? AND anneeScolaire = ?`
      const sql = sessionIds
        ? `${baseSql} AND  sessionId IN ("${sessionIds.join('","')}")`
        : baseSql;
      console.log("🚀 ~ file: functions.ts:268 ~ returnnewPromise ~ sql:", sql)
      const result: ISendBoxMessages[] = await _selectSql(sql, [codeetab, anscol1]);
      resolve(result);
    } catch (error) {
      console.log("🚀 ~ file: functions.ts:386 ~ returnnewPromise ~ error:", error)
      reject(error);
    }
  });
}


/**
 *  mettre a jour les données (fcm, readAt etc) d'un message ou plusieurs messages
 * @returns 
 */
export function updateSendBoxMessagesData(messagesUpdatedValues) {
  return new Promise(async (resolve, reject) => {
    try {
      const fields = `anneeScolaire,codeEtab,messageId,sessionId,studentId,targetAppId,phone,messageTitle,messageContent,alertLevel,messageLocked,fcmMessageId,sentAt,createdAt`;
      const valuesChunks = chunksArray(messagesUpdatedValues, 450);
      await Promise.all(valuesChunks.map(async chunkItem => {
        let valuesPlaceholders = chunkItem.map(() => "(?, ?,?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?)").join(', ');
        const sql = `REPLACE INTO messages_apps (${fields}) VALUES ${valuesPlaceholders}`;
        let values = [];
        chunkItem.forEach((arr) => { arr.forEach((item) => { values.push(item) }) });
        await _executeSql(sql, values);
      }))
      resolve(true)
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * 
 * @param smsUpdatedValues 
 * @returns 
 */
export function updateSendBoxMessagesSmsData(smsUpdatedValues) {
  return new Promise(async (resolve, reject) => {
    try {
      const fields = `anneeScolaire,codeEtab,smsId,sessionId,providerId,transactionId,idPersonne,smsDestinataireKey,phone,smsContent,smsLocked,sentAt,createdAt`;
      const valuesChunks = chunksArray(smsUpdatedValues, 450);
      await Promise.all(valuesChunks.map(async chunkItem => {
        let valuesPlaceholders = chunkItem.map(() => "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").join(', ');
        const sql = `REPLACE INTO messages_sms (${fields}) VALUES ${valuesPlaceholders}`;
        let values = [];
        chunkItem.forEach((arr) => { arr.forEach((item) => { values.push(item) }) });
        await _executeSql(sql, values);
      }))
      resolve(true)
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Envoyer les message points assiduites des eleves pour la periode defini
 * @param dateDebut 
 * @param dateFin 
 * @param idEleves 
 * @returns 
 */
export const getElevePeriodeAssiduite = (dateDebut: string, dateFin: string, idEleves: number[]): Promise<IAssiduite[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      // const sql = `SELECT * FROM assiduite WHERE idEleve IN('${idEleves.join("','")}')`;
      const sql = `SELECT * FROM assiduite WHERE idEleve IN('${idEleves.join("','")}') AND dateAppel BETWEEN date(?) AND date(?)`;
      const result: IAssiduite[] = await _selectSql(sql, [dateDebut, dateFin]);
      resolve(result);
    } catch (error) {
      console.log("🚀 ~ file: functions.ts:230 ~ returnnewPromise ~ error:", error)
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

      const sql = `SELECT "${anscol1}" AS anneeScolaire, "${codeetab}" AS codeEtab, Elèves.RefElève AS idEleve, Elèves.TélTuteur AS numeroCellulaire,"tuteur" AS filiation, Elèves.Tuteur AS nomPrenomParent, Elèves.ProfessionTuteur AS professionParent , Elèves.ResidenceTuteur AS residenceParent , Elèves.EmailTuteur AS emailParent 
FROM Elèves
      WHERE Elèves.TélTuteur Is Not Null And Elèves.TélTuteur <> "" ${filter}
      UNION ALL
      SELECT "${anscol1}" AS anneeScolaire, "${codeetab}" AS codeEtab, Elèves.RefElève AS idEleve, Elèves.MobilePère AS numeroCellulaire,"père" AS filiation, Elèves.NomPère AS nomPrenomParent, Elèves.ProfessionPère AS professionParent , Elèves.ResidencePère AS residenceParent , Elèves.EmailPère AS emailParent 
      FROM Elèves
      WHERE Elèves.MobilePère Is Not Null And Elèves.MobilePère <> "" ${filter}
      UNION ALL
      SELECT "${anscol1}" AS anneeScolaire, "${codeetab}" AS codeEtab, Elèves.RefElève AS idEleve, Elèves.MobileMère AS numeroCellulaire ,"mère" AS filiation, Elèves.NomMère AS nomPrenomParent, Elèves.ProfessionMère AS professionParent , Elèves.ResidenceMère AS residenceParent , Elèves.EmailMère AS emailParent
      FROM Elèves
      WHERE Elèves.MobileMère Is Not Null And Elèves.MobileMère <>"" ${filter}`
      const result = await fetchFromMsAccess<IParentContact[]>(sql, appCnx);

      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * 
 * @param studentIds 
 * @returns 
 */
export function fetchMatieres(
): Promise<IMatiere[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const { anscol1, codeetab } = await paramEtabObjet([
        "Anscol1",
        "CodeEtab",
      ]);

      const sql = `SELECT Matières.RefMatière AS idMatiere, Matières.MatCourt AS libelleMatiereCourt, Matières.MatLong AS libelleMatiereLong
      FROM Matières;
      `
      const result = await fetchFromMsAccess<IMatiere[]>(sql, appCnx);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}


/**
 * recupperer les contacts des tuteurs des eleves
 * Ps: normallement on doit les recupperer de facon distinct; par exemple ainsi si le numero pere est egalement numero tuteur, il devrait etre recupere qu'une seule fois
 * @param studentIds 
 * @returns 
 */
export function fetchTutueurs(
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

      const sql = `SELECT "${anscol1}" AS anneeScolaire, "${codeetab}" AS codeEtab, Elèves.RefElève AS idEleve, Elèves.TélTuteur AS numeroCellulaire,"tuteur" AS filiation, Elèves.Tuteur AS nomPrenomParent, Elèves.ProfessionTuteur AS professionParent , Elèves.ResidenceTuteur AS residenceParent , Elèves.EmailTuteur AS emailParent 
      FROM Elèves WHERE Elèves.TélTuteur Is Not Null And Elèves.TélTuteur <> "" ${filter}
     `
      const result = await fetchFromMsAccess<IParentContact[]>(sql, appCnx);
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
function getEleveWithClasse(idEleves: number[] | null = null): Promise<IEleveWithClasseItem[]> {

  return new Promise(async (resolve, reject) => {
    try {
      const filter = idEleves
        ? ` WHERE Elèves.RefElève IN (${idEleves.join(",")})`
        : "";
      console.log("🚀 ~ file: functions.ts:560 ~ returnnewPromise ~ filter:", filter)

      const sql = `SELECT DISTINCT Elèves.RefElève AS idEleve,Elèves.nomElève AS nomEleve, Elèves.prénomElève AS prenomEleve,Elèves.matriculeNational AS matriculeEleve,
      Classes.ClasseCourt AS libelleClasseCourt,Classes.ClasseLong AS libelleClasseLong, Elèves.RefClasse AS idClasse
      FROM Elèves INNER JOIN Classes ON Elèves.RefClasse = Classes.RefClasse ${filter}
              `;
      const result = await fetchFromMsAccess<IEleveWithClasseItem[]>(sql, appCnx);
      console.log("🚀 ~ file: functions.ts:569 ~ returnnewPromise ~ result:", result)
      resolve(result);
    } catch (error) {
      console.log("🚀 ~ file: functions.ts:571 ~ returnnewPromise ~ error:", error)
      reject(error);
    }
  });
}


/**
 * marquer des messages comme archivés
 * @param sessionIds 
 * @returns 
 */
export function archiverMessages(sessionIds: string[]) {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `UPDATE messages_apps SET messageArchived=1 WHERE sessionId IN("${sessionIds.join('","')}")`;
      await _executeSql(sql, []);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Marquer des messages comme supprimés
 * @param sessionIds 
 * @returns 
 */
export function supprimerMessages(sessionIds: string[]) {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `UPDATE messages_apps SET messageDeleted=1 WHERE sessionId IN("${sessionIds.join('","')}")`;
      await _executeSql(sql, []);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Marquer des messages comme supprimés
 * @param sessionIds 
 * @returns 
 */
export function supprimerSms(sessionIds: string[]) {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `UPDATE messages_sms SET smsDeleted=1 WHERE sessionId IN("${sessionIds.join('","')}")`;
      console.log("🚀 ~ file: functions.ts:486 ~ returnnewPromise ~ sql:", sql)
      await _executeSql(sql, []);
      resolve(true);
    } catch (error) {
      console.log("🚀 ~ file: functions.ts:490 ~ returnnewPromise ~ error:", error)
      reject(error);
    }
  });
}


/**
 * marquer des sms comme archivés
 * @param sessionIds 
 * @returns 
 */
export function archiverSms(sessionIds: string[]) {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `UPDATE messages_sms SET smsArchived=1 WHERE sessionId IN("${sessionIds.join('","')}")`;
      await _executeSql(sql, []);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Obtenir la liste des comptes sms
 * @returns 
 */
function listeCompteSms(
): Promise<IPayloadNewSmsAccount[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const { codeetab } = await paramEtabObjet(["CodeEtab",]);
      const sql = `SELECT sms_accounts.*,_sms_providers.* FROM sms_accounts 
      LEFT JOIN _sms_providers ON sms_accounts.providerId = _sms_providers.id
      WHERE sms_accounts.codeEtab = ?`
      const result = await _selectSql(sql, [codeetab]);
      resolve(result);
    } catch (error) {
      console.log("🚀 ~ file: functions.ts:529 ~ returnnewPromise ~ error:", error)
      reject(error);
    }
  });
}

/**
 * Obtenir la liste des  providers sms
 * @returns 
 */
function listeProviders(
): Promise<IPayloadNewSmsAccount[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT * FROM _sms_providers`
      const result = await _selectSql(sql, []);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * creer ou mettre a jour un compte sms 
 * @returns 
 */
function createSmsAccount(data: IPayloadNewSmsAccount) {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      const { codeetab } = await paramEtabObjet(["CodeEtab",]);
      const { providerId,
        login,
        password,
        sender,
        price,
        sendSmsAppel } = data;
      const sql = `INSERT INTO sms_accounts (codeEtab,providerId,login,password,sender,price,sendSmsAppel) VALUES (?,?,?,?,?,?,?)`
      await _executeSql(sql, [codeetab, providerId, login, password, sender, price, sendSmsAppel]);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * creer ou mettre a jour un compte sms 
 * @returns 
 */
function updateSmsAccount(data: IPayloadNewSmsAccount) {
  console.log("🚀 ~ file: functions.ts:696 ~ updateSmsAccount ~ data:", data)
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      const { codeetab } = await paramEtabObjet(["CodeEtab",]);
      const { providerId,
        login,
        password,
        sender,
        price,
        sendSmsAppel,
        sendSmsAfterControl
      } = data;
      const sql = `UPDATE sms_accounts SET login=?,password =?, sender=? ,price=?, sendSmsAppel=?, sendSmsAfterControl=? WHERE codeEtab =? AND providerId=? `
      await _executeSql(sql, [login, password, sender, price, sendSmsAppel, sendSmsAfterControl, codeetab, providerId,]);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Si ce compte est utilisé pour l'envoi de SMS pour le contrôle scolaire,
 * mettez à zéro les champs sendSmsAfterControl des autres comptes SMS de l'établissement.
 * @returns 
 */
function disableSchoolControlOthersAccount() {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      const { codeetab } = await paramEtabObjet(["CodeEtab",]);
      const sql = `UPDATE sms_accounts SET sendSmsAfterControl=? WHERE codeEtab=?`
      await _executeSql(sql, [0, codeetab]);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Si ce compte est utilisé pour l'envoi de SMS pour l'appel numérique,
 * mettez à zéro les champs sendSmsAppel des autres comptes SMS de l'établissement.
 * @returns 
 */
function disableSmsAppelOthersAccount() {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      const { codeetab } = await paramEtabObjet(["CodeEtab",]);
      const sql = `UPDATE sms_accounts SET sendSmsAppel=? WHERE codeEtab=?`
      await _executeSql(sql, [0, codeetab]);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Changer le compte d'envoi sms
 * @param providerId 
 * @returns 
 */
export function changeDefaultSmsAccount(providerId: number) {
  return new Promise(async (resolve, reject) => {
    try {
      const { codeetab } = await paramEtabObjet(["CodeEtab"]);
      //marquer aucun compte comme compte par defaut
      const sql = `UPDATE sms_accounts SET defaultAccount=? WHERE codeEtab=?`;
      await _executeSql(sql, [0, codeetab]);

      //marquer le compte du provider comme compte par defaut
      const sqlUpdate = `UPDATE sms_accounts SET defaultAccount=? WHERE codeEtab=? AND providerId=?`;
      await _executeSql(sqlUpdate, [1, codeetab, providerId]);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * ajouter ou mettre a jour un fournisseur
 * @returns 
 */
function addOrUpdateFournisseur(data: IFournisseur) {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      const { codeetab } = await paramEtabObjet(["CodeEtab"]);
      // Si idFournisseur === "0" on genere un uuid sinon on prend id qui vient
      const idFournisseur = data.idFournisseur === "0" ? uuid.v4() : data.idFournisseur;
      const {
        nomPrenomFournisseur,
        fonctionFournisseur,
        cellulaireFournisseur,
      } = data;
      const values = [nomPrenomFournisseur, fonctionFournisseur, cellulaireFournisseur, codeetab, idFournisseur];
      const sql = "INSERT OR REPLACE INTO fournisseurs (nomPrenomFournisseur, fonctionFournisseur, cellulaireFournisseur, codeEtab, idFournisseur) VALUES (?, ?, ?, ?, ?)";
      await _executeSql(sql, values);
      resolve(true);
    } catch (error) {
      console.error("Error in addOrUpdateFournisseur:", error);
      reject(error);
    }
  });
}
/**
 * supprimer un fournisseur
 * @param id 
 * @returns 
 */
function deleteFournisseur(idFournisseur: number) {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      const sql = `DELETE FROM fournisseurs WHERE idFournisseur = ?`
      await _executeSql(sql, [idFournisseur]);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Obtenir la liste des fournisseurs
 * @param idFournisseur 
 * @returns 
 */
function getListeFournisseurs(fournisseurIds?: number[]): Promise<IFournisseur[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const { codeetab } = await paramEtabObjet(["CodeEtab"]);

      const filter = fournisseurIds ? `AND idFournisseur IN ('${fournisseurIds.join("','")}')` : ``
      const sql = `SELECT fournisseurs.*, fournisseurs.idFournisseur AS idPersonne  FROM fournisseurs WHERE codeEtab = ? ${filter} ORDER BY nomPrenomFournisseur ASC`

      const result: IFournisseur[] = await _selectSql(sql, [codeetab]);
      resolve(result);
    } catch (error) {
      console.error("Error in getListeFournisseurs:", error);
      reject(error);
    }
  });
}

/**
 * recuperer toutes les t_notes du general
 *  @param periodeEval 
 * @returns 
 */
export function fetchTNotesGeneral(periodeEval: number): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT T_Notes.RefElève AS idEleve, T_Notes.RefTypeClasse, T_Notes.RefClasse, T_Notes.CF1, T_Notes.OG1, 
      T_Notes.EO1, T_Notes.FR1, T_Notes.PHILO1, T_Notes.HG1, T_Notes.AN1, T_Notes.LV21, T_Notes.MATH1, T_Notes.SP1, T_Notes.SVT1,
       T_Notes.EPS1, T_Notes.APMUS1, T_Notes.ECM1, T_Notes.COND1, T_Notes.MOYG1, T_Notes.MCA1, T_Notes.MCB1, T_Notes.Info1, T_Notes.TM1, 
       T_Notes.MCC1, T_Notes.MCD1, Elèves.LV2, Elèves.Arts, Classes.LV2 AS classeLV2, Classes.Arts AS classeArts, T_Notes.CoefFR1, 
       T_Notes.CoefPHILO1, T_Notes.CoefHG1, T_Notes.CoefAN1, T_Notes.CoefLV21, T_Notes.CoefMATH1, T_Notes.CoefSP1, T_Notes.CoefSVT1,
        T_Notes.CoefEPS1, T_Notes.CoefAPMUS1, T_Notes.CoefECM1, T_Notes.CoefCOND1, Elèves.TélTuteur AS telTuteur,
         Elèves.NomElève AS nomEleve, Elèves.PrénomElève AS prenomEleve, Classes.ClasseCourt AS libelleClasseCourt, 
         Classes.ClasseLong AS libelleClasseLong, Elèves.MatriculeNational AS matriculeEleve, TypesClasses.Série AS serie, 
         TypesClasses.RefTypeClasse AS idTypeClasse, Niveaux.RefNiveau AS idNiveau, Filières.OrdreEnseignement AS ordreEnseignement,
          Niveaux.NiveauCourt AS libelleNiveauCourt
      FROM (ordre_enseig INNER JOIN Filières ON ordre_enseig.ref_ordre_enseig = Filières.ref_ordre_enseig) 
      INNER JOIN (Niveaux INNER JOIN (TypesClasses INNER JOIN ((T_Notes INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève) 
      INNER JOIN Classes ON Elèves.RefClasse = Classes.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) 
      ON Niveaux.RefNiveau = TypesClasses.Niveau) ON Filières.RefFilière = TypesClasses.Filière
      WHERE (((Elèves.TélTuteur) Is Not Null And (Elèves.TélTuteur)<>""))
      ORDER BY Classes.OrdreClasse, Elèves.NomElève, Elèves.PrénomElève;
      `.replace(/1/g, periodeEval.toString());

      const result = await fetchFromMsAccess<any[]>(sql, appCnx);
      resolve(result);
    } catch (error) {
      console.log("🚀 ~ file: functions-vba.ts:1430 ~ returnnewPromise ~ error:", error)
      reject(error);
    }
  });
}

/**
 * recuperer les notes du general
 * @param periodeEval 
 * @returns 
 */
export function fetchNotesGeneral(periodeEval: number): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT Notes.RefElève AS idEleve, Notes.RangCF1, Notes.RangOG1, Notes.RangEO1, Notes.RangFR1, Notes.RangPHILO1, Notes.RangHG1,
       Notes.RangAN1, Notes.RangLV21, Notes.RangMATH1, Notes.RangSP1, Notes.RangSVT1, Notes.RangEPS1, Notes.RangAPMUS1,
        Notes.RangECM1, Notes.RangMCA1, Notes.RangMCB1, Notes.RangInfo1, Notes.RangMCC1, Notes.RangMCD1, Notes.RangG1
      FROM Notes;            
      `.replace(/1/g, periodeEval.toString());
      const result = await fetchFromMsAccess<any[]>(sql, appCnx);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

export default {
  markAndFetchMessageToSend,
  setMessageAsSent,
  unlockMessages,
  fetchNiveaux,
  fetchStudents,
  fetchParents,
  updateSendBoxMessagesData,
  insertSendBoxMessage,
  fetchSendBoxMessageNotSent,
  fetchSendBoxMessage,
  toggleLockUnlockMessage,
  getElevePeriodeAssiduite,
  getEleveWithClasse,
  archiverMessages,
  supprimerMessages,
  insertSendBoxSms,
  fetchSendBoxSmsNotSent,
  toggleLockUnlockSms,
  updateSendBoxMessagesSmsData,
  fetchSendBoxSms,
  supprimerSms,
  archiverSms,
  listeCompteSms,
  createSmsAccount,
  updateSmsAccount,
  changeDefaultSmsAccount,
  listeProviders,
  fetchPersonnel,
  addOrUpdateFournisseur,
  deleteFournisseur,
  getListeFournisseurs,
  fetchStudentsEvalNotes,
  fetchEvalProgs,
  disableSchoolControlOthersAccount,
  disableSmsAppelOthersAccount,
  fetchMatieres,
  fetchTNotesGeneral,
  fetchNotesGeneral
}
