import functions from "./functions";
import Logger from "../../helpers/logger";
import { IMemoPaymentItem, IMemoStudentItem } from "./interface";
import { sleep } from "../../helpers/function";
import { MEMO_SERV_ID } from "./constants";

/**
 * initialiser la base de donnée de Memo
 * @param studentIds
 * @returns
 */
export const initializeService = (io) => {
  return new Promise(async (resolve, reject) => {
    try {
     await checkMemoActivated()
      io.to(globalThis.serverFrontEndSocketId).emit("initialize service", {
        message: "Initialisation  des élèves en cours …",
        status: 2,
      });
      await ajouterEleves();
      io.to(globalThis.serverFrontEndSocketId).emit("initialize service", {
        message: "Initialisation  des élèves terminés",
        status: 1,
      });
      sleep(500);
      io.to(globalThis.serverFrontEndSocketId).emit("initialize service", {
        message: "Initialisation  des paiements  en cours …",
        status: 2,
      });
      await insererModifierPaiements();
      io.to(globalThis.serverFrontEndSocketId).emit("initialize service", {
        message: "Initialisation  des paiements  terminés",
        status: 1,
      });
      resolve(true);
    } catch (error) {
      Logger.error("");
      reject(error);
    }
  });
};

/**
 * inserer un ou plusieurs eleves chez memo
 * @param studentIds 
 * @returns 
 */
export const ajouterEleves = (studentIds: number[] | null = null) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkMemoActivated()
      await functions.supprimerEleves(studentIds);
      await functions.insertStudents(studentIds);
      resolve(true);
    } catch (error) {
      Logger.error("");
      reject(error);
    }
  });
};

/**
 * modifier (supprimer inserer) un ou plusieurs eleves chez memo
 * @param studentId 
 * @returns 
 */
export const modifierEleve = (studentId: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkMemoActivated()
      const studentIds = [studentId];
      await functions.supprimerEleves(studentIds);
      await functions.insertStudents(studentIds);
      resolve(true);
    } catch (error) {
      Logger.error("Erreur de modification élève chez memo");
      reject(error);
    }
  });
};

/**
 * supprimer un ou plusieurs eleves chez memo
 * @param studentIds 
 * @returns 
 */
export const supprimerEleves = (studentIds: number[] | null) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkMemoActivated()
      const data = await functions.supprimerEleves(studentIds);
      resolve(true);
    } catch (error) {
      Logger.error("");
      reject(error);
    }
  });
};

/**
 * inserer ou modifier plusieurs paiments chez memo
 * @param versementIds 
 * @returns 
 */
export const insererModifierPaiements = (
  versementIds: number[] | null = null
) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkMemoActivated()
      await functions.supprimerPaiements(versementIds);
      await functions.insererPaiements(versementIds);
      resolve(true);
    } catch (error) {
      Logger.error("");
      reject(error);
    }
  });
};

/**
 * supprimer un ou plusieurs paiements chez memo
 * @param versementIds 
 * @returns 
 */
export const supprimerPaiements = (versementIds: number[] | null = null) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkMemoActivated()
      await functions.supprimerPaiements(versementIds);
      resolve(true);
    } catch (error) {
      Logger.error("");
      reject(error);
    }
  });
};

/**
 * Verfifier le service memo est bien activer dans cet etablissement
 * @returns 
 */
export const checkMemoActivated = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const serviceMatch = globalThis.memoService.find(
        (item) => item.idService === MEMO_SERV_ID
      );
      console.log("serviceMatch", serviceMatch);
      if (serviceMatch) {
        if (serviceMatch.activated === 0) {
          reject("Service non activé");
        }
        resolve(true);
      } else {
        reject("Service introuvalble ou non activé");
      }
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  initializeService,
  ajouterEleves,
  modifierEleve,
  supprimerEleves,
  insererModifierPaiements,
  supprimerPaiements,
};
