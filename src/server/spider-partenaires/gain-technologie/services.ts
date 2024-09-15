import functions from "./functions";
import axios from "axios";
import Logger from "../../helpers/logger";
import { BASE_API, GAIN_SERV_VIE_ECOLE_ID } from "./constants";
import { IGainClassItem, IGainLogItem, IGainStudentItem } from "./interface";
import { sleep } from "../../helpers/function";

/**
 * initialiser la base de donnée de gain
 * @returns
 */
export const initializeService = (io, sections) => {
  return new Promise(async (resolve, reject) => {
    try {
      //vidage des tables a reinitialiser
      const gainToken = await checkServiceGainActivated();
      const tables = sections.map((item) => `${item}=1&`);
      const url = `${BASE_API}/vider?${tables.join("")}token=${gainToken}`;
      await axios.delete(url);

      if (sections.includes("classe")) {
        io.to(globalThis.serverFrontEndSocketId).emit("initialize service", {
          message: "Initialisation des classes en cours …",
          status: 2,
          section: "classe",
        });
        await creerClasses();
        await functions.setGainLogsGroupActionSuccess("classe");
        io.to(globalThis.serverFrontEndSocketId).emit("initialize service focus", {
          message: "Initialisation des classes terminée",
          status: 1,
          section: "classe",
        });
        sleep(500);
      }
      if (sections.includes("eleve")) {
        io.to(globalThis.serverFrontEndSocketId).emit("initialize service", {
          message: "Initialisation des élèves en cours …",
          status: 2,
          section: "eleve",
        });
        await ajouterEleves();
        await functions.setGainLogsGroupActionSuccess("eleve");
        io.to(globalThis.serverFrontEndSocketId).emit("initialize service", {
          message: "Initialisation des élèves terminée",
          status: 1,
          section: "eleve",
        });
        sleep(500);
      }
      if (sections.includes("echglobal")) {
        io.to(globalThis.serverFrontEndSocketId).emit("initialize service", {
          message: "Initialisation échéancier global en cours …",
          status: 2,
          section: "echglobal",
        });
        await creerEcheancierGlobal();
        await functions.setGainLogsGroupActionSuccess("echglobal");
        io.to(globalThis.serverFrontEndSocketId).emit("initialize service", {
          message: "Initialisation échéancier global terminée",
          status: 1,
          section: "echglobal",
        });
        sleep(500);
      }
      if (sections.includes("echperso")) {
        io.to(globalThis.serverFrontEndSocketId).emit("initialize service", {
          message: "Initialisation échéanciers individuel en cours …",
          status: 2,
          section: "echperso",
        });
        await fetchEcheancierIndividuel();
        await functions.setGainLogsGroupActionSuccess("echperso");
        io.to(globalThis.serverFrontEndSocketId).emit("initialize service", {
          message: "Initialisation échéanciers individuel terminée",
          status: 1,
          section: "echperso",
        });
        sleep(500);
      }
      if (sections.includes("paiement")) {
        io.to(globalThis.serverFrontEndSocketId).emit("initialize service", {
          message: "Initialisation des paiements en cours …",
          status: 2,
          section: "paiement",
        });
        await initPaiements();
        await functions.setGainLogsGroupActionSuccess("paiement");
        io.to(globalThis.serverFrontEndSocketId).emit("initialize service", {
          message: "Initialisation des paiements terminés",
          status: 1,
          section: "paiement",
        });
      }
      resolve(true);
    } catch (error) {
      console.log(
        "🚀 ~ file: services.ts ~ line 97 ~ returnnewPromise ~ error",
        error
      );
      Logger.error(
        "Une erreur s'est produite lors de l'initialisation du service - Veuillez réessayer !"
      );
      reject(
        "Une erreur s'est produite lors de l'initialisation du service - Veuillez réessayer !"
      );
    }
  });
};

/**
 * reexecuter une action gain echoué auparavant
 * @param logId l'id du log
 * @returns
 */
export const resendGainAction = (logIds: number[]) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkServiceGainActivated();
      const logs: any = await functions.fetchLogs(logIds);

      if (logs.length === 0) {
        reject("Aucun logs n’a été trouvé");
      }
      let successLogsIds = []; //pour stocker les id des logs qui ont correctement renvoyé
      //  let processResendError = false;
      //function pour rexecuter (renvoyer) les actions gain
      //  const processResend = (logs) => {
      await Promise.all(
        logs.map(async (log) => {
          //pour chaque log, determiner l'action a effectuer et executer la fonction gain correspondante
          const payload = JSON.parse(log.payload);
          const action = log.action;
          const logId = log.id;
          //    try {
          switch (action) {
            case "AJOUTER_ELEVE":
              await ajouterEleves(payload, false);
              successLogsIds = [...successLogsIds, logId];
              break;
            case "MODIFIER_ELEVE":
              const _payload = payload[0];
              await modifierEleve(_payload, false);
              successLogsIds = [...successLogsIds, logId];
              break;
            case "SUPPRIMER_ELEVE":
              await supprimerEleve(payload, false);
              successLogsIds = [...successLogsIds, logId];
              break;
            case "INITIALISER_PAIEMENT":
              await initPaiements(payload, false);
              successLogsIds = [...successLogsIds, logId];
              break;
            case "INSERER_PAIEMENT":
              await insererPaiement(payload, false);
              successLogsIds = [...successLogsIds, logId];
              break;
            case "MODIFIER_PAIEMENT":
              await modifierPaiements(payload, false);
              successLogsIds = [...successLogsIds, logId];
              break;
            case "SUPPRIMER_PAIEMENT":
              await supprimerPaiements(payload, false);
              successLogsIds = [...successLogsIds, logId];
              break;
            case "AJOUTER_CLASSE":
              await creerClasses(payload, false);
              successLogsIds = [...successLogsIds, logId];
              break;
            case "MODIFIER_CLASSE":
              await modifierClasse(payload, false);
              successLogsIds = [...successLogsIds, logId];
              break;
            case "SUPPRIMER_CLASSE":
              await supprimerClasse(payload, false);
              successLogsIds = [...successLogsIds, logId];
              break;
            case "ENVOYER_ECHEANCIER_GLOBAL":
              await fetchEcheancierGlobal(false);
              successLogsIds = [...successLogsIds, logId];
              break;
            case "ENVOYER_ECHEANCIER_INDIVIDUEL":
              await fetchEcheancierIndividuel(payload, false);
              successLogsIds = [...successLogsIds, logId];
              break;
            case "CREER_ECHEANCIER_PERSO":
              await creerEcheancierPerso(payload, false);
              successLogsIds = [...successLogsIds, logId];
              break;
            case "ENVOYER_ELEVES_MANQUANTS":
              await resendMissingStudents(false);
              successLogsIds = [...successLogsIds, logId];
              break;
          }
          /* } catch (error) {
            console.log(
              "IN CATCHHHHHHHH ++++++++++++++++++++++++++++++++++++",
              error
            );
            processResendError = true;
            console.log({ error });
          } */
        })
      );

      // };

      /* try {
        console.log("processResendError BEFORE",processResendError)
        await processResend(logs);
        console.log("processResendError AFTER",processResendError)

        if (processResendError) {
          reject("Une erreur s’est produite lors du renvoi des donnés logs");
          console.log(
            "RESEND ERROR ++++++++++++++++++++++++++++++++++++",
            processResendError
          );
        }else{
          await functions.setGainLogsSuccess(logIds);
          const logsData = await functions.fetchLogs(logIds);
          console.log(
            "RESEND SUCESS ++++++++++++++++++++++++++++++++++++",
            processResendError
          );
          resolve(logsData);
        }

      } catch (error) {
        console.log("🚀 ~ file: services.ts ~ line 207 ~ returnnewPromise ~ error", error)
        reject("Une erreur s’est produite lors du renvoi des donnés logs");
      } */

      /* if (processResendError) {
        reject("Une erreur s’est produite lors du renvoi des donnés logs");
        return;
      } */

      console.log("successLogsIds++++++++++++++++", successLogsIds);
      await functions.setGainLogsSuccess(successLogsIds);
      const logsData = await functions.fetchLogs(logIds);
      resolve(logsData);
    } catch (error) {
      console.log(
        "🚀 ~ file: services.ts ~ line 168 ~ returnnewPromise ~ error",
        error
      );
      Logger.error("Une erreur s’est produite lors du renvoi des donnés logs");
      reject(error);
    }
  });
};

export const getGainLogs = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkServiceGainActivated();
      const logs = await functions.fetchLogs();
      resolve(logs);
    } catch (error) {
      Logger.error("Erreur de la recuperation des logs gain technologie");
      reject(error);
    }
  });
};

/**
 * renvoyer l'ensemble des eleves par present dans la liste de Gain
 * @return
 */
export const resendMissingStudents = (setLog = true) => {
  return new Promise(async (resolve, reject) => {
    try {
      const gainToken = await checkServiceGainActivated();
      //fetcher la liste des eleves presente chez Gain Technologie
      const url = `${BASE_API}/eleves?token=${gainToken}`;
      const response = await axios.get(url);
      const gainStudents = response.data.data;

      //fetcher la liste des eleves presente chez Spider
      const spiderStudents = await functions.fetchEleves();
      const missingStudents = [];
      //croiser ces deux liste afin de retrouver la liste des eleves absente chez Gain
      //@ts-ignore
      spiderStudents.map((item) => {
        if (!gainStudents.find((item2) => item2.ideleve == item.ideleve.toString())) {
          missingStudents.push(item.ideleve);
        }
      });

      if (missingStudents.length !== 0) { //si des eleves manquant trouvé
        //renvoyer les eleves manquants
        await ajouterEleves(missingStudents);
        //renvoyer les echeanciers individuels de ces eleves
        await fetchEcheancierIndividuel(missingStudents);
        //renvoyer les paiments pour ces eleves
        const paiements = await functions.fetchPaiementEleves(missingStudents);
        const url = `${BASE_API}/paiementsFull?token=${gainToken}`;
        await axios.post(url, paiements);
        if (setLog) {
           await functions.setGainHistoric("ENVOYER_ELEVES_MANQUANTS", null, 1);
        }
        resolve(true);
      }else{
        resolve(true);
      }
    
    } catch (error) {
      if (setLog) {
      await functions.setGainHistoric("ENVOYER_ELEVES_MANQUANTS", null, 0);
      }
      reject(error);
    }
  });
};

/**
 * Ajouter un eleve chez Gain technologie
 * @param studentId l'id de l'eleve chez spider App
 * @returns
 */
export const ajouterEleves = (
  studentIds: number[] | null = null,
  setLog = true
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const gainToken = await checkServiceGainActivated();
      const eleves = await functions.fetchEleves<IGainStudentItem[]>(
        studentIds
      );
      const action = "AJOUTER_ELEVE";
      if (eleves.length === 0) {
        if (setLog) {
          await functions.setGainHistoric(action, studentIds, 0);
        }
        reject("Aucun élève correspondant aux identifiants fournis");
      } else {
        const url = `${BASE_API}/elevesFull?token=${gainToken}`;
        const response = await axios.post(url, eleves);
        if (setLog) {
          await functions.setGainHistoric(action, studentIds, 1);
        }
        resolve(response.data);
      }
    } catch (error) {
      Logger.error("Erreur de l'ajout élève chez gain technologie");
      if (setLog) {
        const action = "AJOUTER_ELEVE";
        await functions.setGainHistoric(action, studentIds, 0);
      }
      reject(error);
    }
  });
};

/**
 * Modifier un eleve chez Gain technologie
 * @param studentId studentId l'id de l'eleve chez spider App
 * @returns
 */
export const modifierEleve = (studentId: number, setLog = true) => {
  return new Promise(async (resolve, reject) => {
    try {
      const gainToken = await checkServiceGainActivated();
      const studentIds = [studentId];

      const eleves: IGainStudentItem[] = await functions.fetchEleves(
        studentIds
      );

      const action = "MODIFIER_ELEVE";
      if (eleves.length === 0) {
        if (setLog) {
          await functions.setGainHistoric(action, studentId, 0);
        }
        reject("Aucun eleve correspondant aux critères soumis");
      } else {
        const url = `${BASE_API}/elevesFull?token=${gainToken}`;
        const response = await axios.post(url, eleves);
        if (setLog) {
          await functions.setGainHistoric(action, studentId, 1);
        }
        resolve(response.data);
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: services.ts ~ line 298 ~ returnnewPromise ~ error",
        error
      );
      Logger.error("Erreur de modification élève chez gain technologie");
      if (setLog) {
        const action = "MODIFIER_ELEVE";
        await functions.setGainHistoric(action, studentId, 0);
      }
      reject(error);
    }
  });
};

/**
 * supprimer un eleve chez gain technologie
 * @param studentId
 * @returns
 */
export const supprimerEleve = (studentIds: number[] | null, setLog = true) => {
  return new Promise(async (resolve, reject) => {
    try {
      const gainToken = await checkServiceGainActivated();
      const action = "SUPPRIMER_ELEVE";
      if (!studentIds) {
        //suppression total de tous les eleves
        if (setLog) {
          await functions.setGainHistoric(action, studentIds, 0);
        }
        reject("CAS NON GERE");
      } else {
        if (studentIds.length === 1) {
          //suppression un seul eleves
          const url = `${BASE_API}/eleves/${studentIds[0]}?token=${gainToken}`;
          const response = await axios.delete(url);
          if (setLog) {
            await functions.setGainHistoric(action, studentIds, 1);
          }
          resolve(response.data);
        } else {
          //supression de plusieurs eleves
          if (setLog) {
            await functions.setGainHistoric(action, studentIds, 0);
          }
          reject("CAS NON GERE");
        }
      }
    } catch (error) {
      Logger.error("Erreur de la suppression élève chez gain technologie");
      if (setLog) {
        const action = "SUPPRIMER_ELEVE";
        await functions.setGainHistoric(action, studentIds, 0);
      }
      reject(error);
    }
  });
};

export const synchroniserIdentifiant = (setLog = true) => {
  return new Promise(async (resolve, reject) => {
    try {
      const gainToken = await checkServiceGainActivated();
      const action = "synchroniser Identifiant";
      const identifiantsList = await functions.fetchElevesIdentifiant();
      console.log("🚀 ~ file: services.ts ~ line 451 ~ returnnewPromise ~ identifiantsList", identifiantsList)
      const url = `${BASE_API}/identifiants?token=${gainToken}`;
      console.log("🚀 ~ file: services.ts ~ line 452 ~ returnnewPromise ~ url", url)
      const response = await axios.put(url, identifiantsList);
      console.log("🚀 ~ file: services.ts ~ line 453 ~ returnnewPromise ~ response", response.data)
      // console.log("🚀identifiantsList envoye chez gain ...");
      if (setLog) {
        await functions.setGainHistoric(action, null, 1);
      }
      resolve(true);
    } catch (error) {
      console.log(
        "🚀 ~ file: services.ts ~ line 233 ~ returnnewPromise ~ error",
        error
      );
      Logger.error(
        "Erreur de la synchronisation d'identifiant  chez gain technologie"
      );
      if (setLog) {
        const action = "synchroniser Identifiant";
        await functions.setGainHistoric(action, null, 0);
      }
      reject(error);
    }
  });
};
/**
 *
 * @param versementIds
 * @returns
 */
export const initPaiements = (
  versementIds: number[] | null = null,
  setLog = true
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const gainToken = await checkServiceGainActivated();
      const paiements: any = await functions.fetchPaiements(versementIds);

      const action = "INITIALISER_PAIEMENT";
      //inserer un ou plusieurs paiement liés à un ou plusieurs versements
      const url = `${BASE_API}/paiementsFull?token=${gainToken}`;
      const response = await axios.post(url, paiements);

      if (setLog) {
        await functions.setGainHistoric(action, versementIds, 1);
      }
      resolve(response.data);
    } catch (error) {
      Logger.error("Erreur lors d'insertion paiements chez gain technologie");
      const action = "INITIALISER_PAIEMENT";
      if (setLog) {
        await functions.setGainHistoric(action, versementIds, 0);
      }
      reject(error);
    }
  });
};

/**
 * Inserer les paiements pour un ou plusieurs versements
 * @param versementIds
 * @returns
 */
export const insererPaiement = (
  versementIds: number[] | null = null,
  setLog = true
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const gainToken = await checkServiceGainActivated();
      const paiements: any = await functions.fetchPaiements(versementIds);
      const action = "INSERER_PAIEMENT";
      // inserer un ou plusieurs paiement liés à un ou plusieurs versements
      const url = `${BASE_API}/paiementsFull?token=${gainToken}`;
      const response = await axios.post(url, paiements);
      if (setLog) {
        await functions.setGainHistoric(action, versementIds, 1);
      }
      resolve(response.data);
      // resolve(paiements)
    } catch (error) {
      Logger.error("Erreur lors d'insertion paiements chez gain technologie");
      if (setLog) {
        const action = "INSERER_PAIEMENT";
        await functions.setGainHistoric(action, versementIds, 0);
      }
      reject(error);
    }
  });
};

/**
 * modifier les paiements d'un ou plusieurs versements
 * @param versementIds
 * @returns
 */
export const modifierPaiements = (
  versementIds: number[] | null = null,
  setLog = true
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const gainToken = await checkServiceGainActivated();
      const paiements = await functions.fetchPaiements(versementIds);
      const action = "MODIFIER_PAIEMENT";
      if (!versementIds) {
        if (setLog) {
          await functions.setGainHistoric(action, versementIds, 0);
        }
        reject("CAS NON GERE");
      } else {
        //modifier les paiements de plusieurs versement
        if (versementIds.length === 1) {
          //modifier les paiement d'un seul versement
          const url = `${BASE_API}/paiements/${versementIds[0]}?token=${gainToken}`;
          const response = await axios.put(url, paiements);
          if (setLog) {
            await functions.setGainHistoric(action, versementIds, 1);
          }
          resolve(response.data);
        } else {
          if (setLog) {
            await functions.setGainHistoric(action, versementIds, 0);
          }
          //modifier les paiements liés à un ou plusieurs versement
          reject("CAS NON GERE");
        }
      }
    } catch (error) {
      Logger.error(
        "Erreur lors de la modication paiements chez gain technologie"
      );
      if (setLog) {
        const action = "MODIFIER_PAIEMENT";
        await functions.setGainHistoric(action, versementIds, 0);
      }
      reject(error);
    }
  });
};

/**
 * supprimer les paiements d'un ou plusieurs versements
 * @param versementIds
 * @returns
 */
export const supprimerPaiements = (
  versementIds: number[] | null = null,
  setLog = true
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const gainToken = await checkServiceGainActivated();
      const action = "SUPPRIMER_PAIEMENT";
      if (!versementIds) {
        if (setLog) {
          await functions.setGainHistoric(action, versementIds, 0);
        }
        //supprimer les paiements de tous les versements
        reject("CAS NON GERE");
      } else {
        //supprimer les paiements liées a un ou plusieurs versement
        if (versementIds.length === 1) {
          //supprimer les paiement d'un seul versement
          const url = `${BASE_API}/paiements/${versementIds[0]}?token=${gainToken}`;
          const response = await axios.delete(url);
          if (setLog) {
            await functions.setGainHistoric(action, versementIds, 1);
          }
          resolve(response.data);
        } else {
          if (setLog) {
            await functions.setGainHistoric(action, versementIds, 0);
          }
          //supprimer les paiements de plusieurs versement
          reject("CAS NON GERE");
        }
      }
    } catch (error) {
      Logger.error(
        "Erreur lors de la suppression paiements chez gain technologie"
      );
      if (setLog) {
        const action = "SUPPRIMER_PAIEMENT";
        await functions.setGainHistoric(action, versementIds, 0);
      }
      reject(error);
    }
  });
};

/**
 * Créer une ou plusieur classe
 * @param classeIds
 * @returns
 */

export const creerClasses = (
  classeIds: number[] | null = null,
  setLog = true
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const gainToken = await checkServiceGainActivated();
      // récupère les classes dans spider (tableau d'objets)
      const fullClasses: IGainClassItem[] = await functions.fetchClasses(
        classeIds
      );

      const classes: IGainClassItem[] = fullClasses.map((item) => ({
        ...item,
        branche: item.branche
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "")
          .replace(/ /g, ""),
        serie: item.serie
          ? item.serie
              .normalize("NFD")
              .replace(/\p{Diacritic}/gu, "")
              .replace(/ /g, "")
          : "",
        nom: item.nom
          .replace(/\./g, "")
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, ""),
      }));

      const nbClasses = classes.length;
      const action = "AJOUTER_CLASSE";
      if (nbClasses === 0) {
        if (setLog) {
          await functions.setGainHistoric(action, classeIds, 0);
        }
        reject("Aucune classe correspondant aux critères soumis");
      } else {
        const url = `${BASE_API}/classesFull?token=${gainToken}`;
        const response = await axios.post(url, classes);
        if (setLog) {
          await functions.setGainHistoric(action, classeIds, 1);
        }
        resolve(response.data);
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: services.ts ~ line 359 ~ returnnewPromise ~ error",
        error
      );
      Logger.error(
        "Erreur lors de la création d'une classe chez gain technologie"
      );
      if (setLog) {
        const action = "AJOUTER_CLASSE";
        await functions.setGainHistoric(action, classeIds, 0);
      }
      reject(error);
    }
  });
};

/**
 * Modifier une ou plusieurs classe
 * @param classeIds
 * @returns
 */
export const modifierClasse = (
  classeIds: number[] | null = null,
  setLog = true
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const gainToken = await checkServiceGainActivated();
      const fullClasses: IGainClassItem[] = await functions.fetchClasses(
        classeIds
      );
      const classes: IGainClassItem[] = fullClasses.map((item) => ({
        ...item,
        nom: item.nom
          .replace(/\./g, "")
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, ""),
      }));
      const action = "MODIFIER_CLASSE";
      if (classes.length === 1) {
        //modifier une seule classe
        const classe = classes[0];
        const idClasse = classe.idclasse.toString();
        const url = `${BASE_API}/classes/${idClasse}?token=${gainToken}`;
        await axios.put(url, classe);
        if (setLog) {
          await functions.setGainHistoric(action, classeIds, 1);
        }
        resolve(true);
      } else {
        if (setLog) {
          await functions.setGainHistoric(action, classeIds, 0);
        }
        //modifier plusieurs classes
        reject("CAS NON GERE");
      }
    } catch (error) {
      Logger.error(
        "Erreur lors de la modification classe chez gain technologie"
      );
      if (setLog) {
        const action = "MODIFIER_CLASSE";
        await functions.setGainHistoric(action, classeIds, 0);
      }
      reject(error);
    }
  });
};

/**
 * supprimer une ou plusieurs classes
 * @param classeIds
 * @returns
 */
export const supprimerClasse = (
  classeIds: number[] | null = null,
  setLog = true
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const gainToken = await checkServiceGainActivated();
      const action = "SUPPRIMER_CLASSE";
      if (!classeIds) {
        if (setLog) {
          await functions.setGainHistoric(action, classeIds, 0);
        }
        //suppression de toutes les classes
        reject("CAS NON GERE");
      } else {
        if (classeIds.length === 1) {
          //supprimer une seule classes
          const idClasse = classeIds[0].toString();
          const url = `${BASE_API}/classes/${idClasse}?token=${gainToken}`;
          await axios.delete(url);
          if (setLog) {
            await functions.setGainHistoric(action, classeIds, 1);
          }
          resolve(true);
        } else {
          if (setLog) {
            await functions.setGainHistoric(action, classeIds, 0);
          }
          //supprimer plusieurs classe
          reject("CAS NON GERE");
        }
      }
    } catch (error) {
      Logger.error(
        "Erreur lors de la suppression classe chez gain technologie"
      );
      if (setLog) {
        const action = "SUPPRIMER_CLASSE";
        await functions.setGainHistoric(action, classeIds, 0);
      }
      reject(error);
    }
  });
};

/**
 * creer un echeancier  global pour touts les niveaux de l'etablissement
 * @returns
 */
export const creerEcheancierGlobal = (setLog = true) => {
  return new Promise(async (resolve, reject) => {
    try {
      const gainToken = await checkServiceGainActivated();
      const action = "CREER_ECHEANCIER_GLOBAL";
      const echeanciers = await functions.fetchEcheanciers("global");

      const url = `${BASE_API}/echeanciersFull?token=${gainToken}`;
      const response = await axios.post(url, echeanciers);
      if (setLog) {
        await functions.setGainHistoric(action, null, 1);
      }
      resolve(response.data);
    } catch (error) {
      Logger.error(
        "Erreur lors de l'insertion echeancier global chez gain technologie"
      );
      if (setLog) {
        const action = "CREER_ECHEANCIER_GLOBAL";
        await functions.setGainHistoric(action, null, 0);
      }
      reject(error);
    }
  });
};

export const initEcheancierPerso = (
  elevesIds: number[] | null = null,
  setLog = true
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const gainToken = await checkServiceGainActivated();
      const action = "INITIALISER_ECHEANCIER_PERSO";
      const echeanciers = await functions.fetchEcheanciers("perso", elevesIds);
      const url = `${BASE_API}/echeancierFull?token=${gainToken}`;
      const response = await axios.post(url, echeanciers);
      if (setLog) {
        await functions.setGainHistoric(action, elevesIds, 1);
      }
      resolve(response.data);
    } catch (error) {
      Logger.error(
        "Erreur lors de l'initialisation echeancier perso chez gain technologie"
      );
      if (setLog) {
        const action = "INITIALISER_ECHEANCIER_PERSO";
        await functions.setGainHistoric(action, elevesIds, 0);
      }
      reject(error);
    }
  });
};

/**
 * creer echeancier personnalisé pour un ou plusieurs eleves
 * @param elevesIds
 * @returns
 */
export const creerEcheancierPerso = (
  elevesIds: number[] | null = null,
  setLog = true
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const gainToken = await checkServiceGainActivated();
      const action = "CREER_ECHEANCIER_PERSO";
      const echeanciers = await functions.fetchEcheancierIndividuel(elevesIds);
      const payload = {
        ideleve: elevesIds[0].toString(),
        echeancier: echeanciers,
      };

      const url = `${BASE_API}/echeancier?token=${gainToken}`;
      const response = await axios.post(url, payload);

      if (setLog) {
        await functions.setGainHistoric(action, elevesIds, 1);
      }
      resolve(response.data);
    } catch (error) {
      Logger.error(
        "Erreur lors de l'insertion echeancier perso chez gain technologie"
      );
      if (setLog) {
        const action = "CREER_ECHEANCIER_PERSO";
        await functions.setGainHistoric(action, elevesIds, 0);
      }
      reject(error);
    }
  });
};

/**
 * Envoyer les echeanciers individuel chez gain technologie
 * @param elevesIds
 * @param setLog
 * @returns
 */
export const fetchEcheancierIndividuel = (
  elevesIds: number[] | null = null,
  setLog = true
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const gainToken = await checkServiceGainActivated();
      const action = "ENVOYER_ECHEANCIER_INDIVIDUEL";
      const echeanciers = await functions.fetchEcheancierIndividuel(elevesIds);

      const url = `${BASE_API}/echeancierFull?token=${gainToken}`;
      const response = await axios.post(url, echeanciers);
      if (setLog) {
        await functions.setGainHistoric(action, elevesIds, 1);
      }
      resolve(response.data);
      //resolve(echeanciers);
    } catch (error) {
      Logger.error(
        "Erreur lors de l'initialisation echeancier individuel chez gain technologie"
      );
      if (setLog) {
        const action = "ENVOYER_ECHEANCIER_INDIVIDUEL";
        await functions.setGainHistoric(action, elevesIds, 0);
      }
      reject(error);
    }
  });
};

export const fetchEcheancierGlobal = (setLog = true) => {
  return new Promise(async (resolve, reject) => {
    try {
      const gainToken = await checkServiceGainActivated();
      const action = "ENVOYER_ECHEANCIER_GLOBAL";
      const echeanciers = await functions.fetchEcheancierGlobal();

      const url = `${BASE_API}/echeanciersFull?token=${gainToken}`;
      const response = await axios.post(url, echeanciers);
      if (setLog) {
        await functions.setGainHistoric(action, null, 1);
      }
      resolve(response.data);
      // resolve(echeanciers);
    } catch (error) {
      Logger.error(
        "Erreur lors de l'initialisation echeancier individuel chez gain technologie"
      );
      if (setLog) {
        const action = "ENVOYER_ECHEANCIER_GLOBAL";
        await functions.setGainHistoric(action, null, 0);
      }
      reject(error);
    }
  });
};

/**
 * recupperer les moyennes 
 * @param periode le trimestre ou semestre pour lequel on veut recupperer les moyennes
 * @param classe l'identifiant de la classe si defini
 * @param matiere la matiere si defini
 * @returns 
 */
export const fetchMoyenneWithParams = (periode,classe=null,matiere=null)=>{
  return new Promise (async(resolve,reject)=>{
    try {
      const gainToken = await checkServiceGainActivated();
      let url = `${BASE_API}/moyennes?token=${gainToken}&periode=${periode}`;
      url+= classe !== null ? `${url}&classe=${classe}`:""
      url+=  matiere !== null ? `${url}&matiere=${matiere}`:""
      const response = await axios.get(url);
      if(response.data.status === true){
        resolve(response.data.message)
      }else{
        reject("Une erreur s'est produite lors de la recuperation moyenne chez Gain technologie")
      }
     
    } catch (error) {
      console.log("🚀 ~ file: services.ts ~ line 987 ~ returnnewPromise ~ error", error)
      reject(error);
    }
  })
}

/**
 * recupperer les notes chez gain technologie
 * @param periode (1er Trimestre,2eme Trimestre, 3eme Trimestre)
 * @param classe l'id de la classe
 * @param matiere 
 * @param eleve l'id de l'eleve
 * @returns
 */
export const fetchMarkWithParams = (periode,classe=null,matiere=null,eleve=null)=>{
  return new Promise (async(resolve,reject)=>{
    try {
      const gainToken = await checkServiceGainActivated();
      let url = `${BASE_API}/notes?token=${gainToken}&periode=${periode}`;
      url+= classe !== null ? `${url}&classe=${classe}`:""
      url+=  matiere !== null ? `${url}&matiere=${matiere}`:""
      url+=  eleve !== null ? `${url}&eleve=${eleve}`:""
      const response = await axios.get(url);
      if(response.data.status === true){
        resolve(response.data.message)
      }else{
        reject("Une erreur s'est produite lors de la recuperation des notes chez Gain technologie")
      }
     
    } catch (error) {
      console.log("🚀 ~ file: services.ts ~ line 1027 ~ returnnewPromise ~ error", error)
      reject(error);
    }
  })
}

/**
 * recupperer les notes chez gain technologie
 * @param periode (1er Trimestre,2eme Trimestre, 3eme Trimestre)
 * @param classe l'id de la classe
 * @param matiere 
 * @param eleve l'id de l'eleve
 * @returns
 */
 export const fetchRatingWithParams = (periode,classe=null,matiere=null)=>{
  return new Promise (async(resolve,reject)=>{
    try {
      const gainToken = await checkServiceGainActivated();
      let url = `${BASE_API}/evaluations?token=${gainToken}&periode=${periode}`;
      url+= classe !== null ? `${url}&classe=${classe}`:""
      url+=  matiere !== null ? `${url}&matiere=${matiere}`:""
      const response = await axios.get(url);
      if(response.data.status === true){
        resolve(response.data.message)
      }else{
        reject("Une erreur s'est produite lors de la recuperation des evaluations chez Gain technologie")
      }
     
    } catch (error) {
      console.log("🚀 ~ file: services.ts ~ line 1027 ~ returnnewPromise ~ error", error)
      reject(error);
    }
  })
}

/**
 * Fetcher les matieres chez Gain
 * @returns 
 */
export const fetchSubjects = ()=>{
  return new Promise (async(resolve,reject)=>{
    try {
      const gainToken = await checkServiceGainActivated();
      let url = `${BASE_API}/matieres?token=${gainToken}`;
      const response = await axios.get(url);
      if(response.data.status === true){
        resolve(response.data.message)
      }else{
        reject("Une erreur s'est produite lors de la recuperation des matieres chez Gain technologie")
      }
     
    } catch (error) {
      console.log("🚀 ~ file: services.ts ~ line 1027 ~ returnnewPromise ~ error", error)
      reject(error);
    }
  })
}

/**
 * Tester gain token est valide en fetchant la liste des classes
 * @param token
 * @returns
 */
export const testGainToken = (token) => {
  return new Promise(async (resolve, reject) => {
    try {
      const url = `${BASE_API}/classes?token=${token}`;
      const response = await axios.get(url);
      if (!response.data.status) {
        reject(false);
      } else {
        resolve(true);
      }
    } catch (error) {
      Logger.error("Clé d'activation Gain invalide - Veuillez réessayer!");
      reject(false);
    }
  });
};

/**
 * verifier si pour ce service est active ou si le token est defini
 * @returns
 */
export const checkServiceGainActivated = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const serviceMatch = globalThis.gainService.find(
        (item) => item.idService === GAIN_SERV_VIE_ECOLE_ID
      );

      if (serviceMatch) {
        const config = serviceMatch.config;
        if (serviceMatch.activated === 0 || !config.token) {
          reject("Token invalide ou service non activé");
        }
        resolve(config.token);
      } else {
        reject("Ce service n'existe pas chez Gain technologie");
      }
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * fetcher les eleves present chez Gain
 */
export const fetchGainStudents = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const gainToken = await checkServiceGainActivated();
      const url = `${BASE_API}/eleves?token=${gainToken}`;
      const response = await axios.get(url);
      if (!response.data.status) {
        reject(false);
      } else {
        resolve(response.data.data);
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const fetchGainClasses = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const gainToken = await checkServiceGainActivated();
      const url = `${BASE_API}/classes?token=${gainToken}`;
      const response = await axios.get(url);
      if (!response.data.status) {
        reject(false);
      } else {
        resolve(response.data.message);
      }
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  resendMissingStudents,
  modifierEleve,
  supprimerEleve,
  synchroniserIdentifiant,
  ajouterEleves,
  insererPaiement,
  modifierPaiements,
  supprimerPaiements,
  creerClasses,
  modifierClasse,
  supprimerClasse,
  creerEcheancierGlobal,
  creerEcheancierPerso,
  initializeService,
  getGainLogs,
  resendGainAction,
  fetchEcheancierIndividuel,
  fetchEcheancierGlobal,
  fetchMoyenneWithParams,
  fetchMarkWithParams,
  fetchRatingWithParams,
  fetchGainStudents,
  fetchGainClasses,
  testGainToken,
  fetchSubjects
};
