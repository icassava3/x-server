import { sleep } from "../../helpers/function";
import { FOCUS_ECOLE_SERVER_BASE_URL, FOCUS_ECOLE_SERV_ID } from "./constants";
import functions from "./functions";

import moment from "moment";
import {
  IFocusEcoleClasseItem,
  IFocusEcoleEcheancierItem,
  IFocusEcolePaymentItem,
  IFocusEcoleStudentItem,
  IFocusEcoleHoraireItem,
  IFocusEcolePlageHoraireItem,
  IFocusEcolePersonnelItem,
  IFocusEcoleMatiereItem,
  IFocusEcoleSeanceItem,
  ISpiderMatiereItem,
  ISpiderSalleItem,
  IFocusEcoleSalleItem,
  IFocusEcoleEvaluationNoteItem,
  ISpiderClassseItem,
  IFocusEcoleEvaluationProgrammationItem,
  ISpiderPersonnelItem,
  ISpiderPlageHoraireItem,
  IFocusEcoleClassseMatiereProf,
  IFocusEcoleGroupeRubriqueItem,
  IFocusEcoleLibelleEcheanceItem,
  IFocusEcoleIRubriqueItem,
  IFocusEcoleEcheancierIndividuelItem,
  IFocusEcoleSouscriptionFraisOptionnelItem,
  IFocusEcoleEleveRubriqueItem,
  IFocusEcoleEcheancierPersonnelEleveRubriqueItem,
  IFocusEcoleEcheancierRubriqueOptionnelItem,
  IFocusEcoleRubriqueOptionnelGlobalItem,
  IFocusEcoleOptionTypeClasseRubriqueObligatoireItem,
  IFocusEcoleTypeClasseRubriqueObligatoireItem,
  IFocusEcoleEcheancierTypeClasseRubriqueObligatoireItem,
  IFocusEcoleISpiderVersementItem,
  IFocusEcoleDetailsVersementRubriqueObligatoireItemItem,
  IFocusEcoleDetailsVersementRubriqueOptionnelItem,
} from "./interfaces";
import axios from "axios";
import Logger from "../../helpers/logger";
import { paramEtabObjet } from "../../databases/accessDB";
import { fetchPrivateRoute } from '../../helpers/apiClient';
import redisFunctions from "../../databases/redis/functions";

/**
 * Verifier si le service focus ecole est activé
 */
export const checkServiceFocusEcoleActivated = () => {
  return new Promise(async (resolve, reject) => {
    try {

      const serviceMatch = globalThis.focusEcoleService.find(
        (item) => item.idService === FOCUS_ECOLE_SERV_ID
      );
      if (serviceMatch) {
        if (serviceMatch.activated !== 1) {
          reject("Service non activé");
        }
        resolve(serviceMatch);
      } else {
        reject("Service introuvalble ou non activé");
      }
    } catch (error) {
      reject(error);
    }
  });
};


/**
 * envoyer a nouveau les actions cinetpay qui ont echoué
 * @param logIds 
 * @returns 
 */
export const resendFailedAction = (logIds: number[]) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkServiceFocusEcoleActivated();//verifier le service focus ecole activé
      await checkAuthorizedSerialNumber() //verifier le numero serie disque autorisé
      const logs: any = await functions.fetchLogs(logIds);
      if (logs.length === 0) {
        reject("Aucun logs n’a été trouvé");
      }
      let successLogsIds = []; //pour stocker les id des logs qui ont été correctement renvoyé

      await Promise.all(
        logs.map(async (log) => {
          //pour chaque log, determiner l'action a effectuer et executer la fonction cinetpay correspondante
          const payload = JSON.parse(log.payload);
          const action = log.action;
          const logId = log.id;
          switch (action) {
            case "ENVOYER_ELEVE":
              await sendStudents(payload, false);
              successLogsIds = [...successLogsIds, logId];
              break;
            case "MODIFIER_ELEVE":
              await sendStudents(payload, false);
              successLogsIds = [...successLogsIds, logId];
              break;
            case "SUPPRIMER_ELEVE":
              await deleteStudents(payload, false);
              successLogsIds = [...successLogsIds, logId];
              break;
            case "ENVOYER_VERSEMENT":
              await sendPayments(payload, false);
              successLogsIds = [...successLogsIds, logId];
              break;
            case "MODIFIER_PAIEMENT":
              await sendPayments(payload, false);
              successLogsIds = [...successLogsIds, logId];
              break;
            case "SUPPRIMER_VERSEMENT":
              await deletePayments(payload, false);
              successLogsIds = [...successLogsIds, logId];
              break;
            case "ENVOYER_CLASSE":
              await sendClasses(payload, false);
              successLogsIds = [...successLogsIds, logId];
              break;
            case "MODIFIER_CLASSE":
              await sendClasses(payload, false);
              successLogsIds = [...successLogsIds, logId];
              break;
            case "SUPPRIMER_CLASSE":
              await deleteClasse(payload, false);
              successLogsIds = [...successLogsIds, logId];
              break;
            case "ENVOYER_ECHEANCIER_INDIVIDUEL":
              await sendIndividualEcheanciers(payload, false);
              successLogsIds = [...successLogsIds, logId];
              break;
          }

        })
      );

      await functions.setLogsSuccess(successLogsIds);
      const logsData = await functions.fetchLogs(logIds);
      resolve(logsData);
    } catch (error) {
      Logger.error("Une erreur s’est produite lors du renvoi des donnés logs");
      reject(error);
    }
  });
};


/**
 * Verifier si le numero du disque enregistré (a l'activation) pour ce service correspond au numero du disque du present ordinateur
 * @returns 
 */
export const checkAuthorizedSerialNumber = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const authorizedHddSerialNumber = globalThis.focusEcoleService[0].config.hddSerialNumber;
      const currentPcHDDSerialNumber = await redisFunctions.getGlobalVariable("currentPcHDDSerialNumber");

      if (authorizedHddSerialNumber === currentPcHDDSerialNumber) {
        resolve(true)
      } else {
        reject('Operation non autorisé sur cet ordinateur')
      }

    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Activer ou desactiver un service chez focus ecole
 */
export const activateDeactivateService = (action: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { anscol1, codeetab } = await paramEtabObjet([
        "Anscol1",
        "CodeEtab",
      ]);
      const currentPcHDDSerialNumber = await redisFunctions.getGlobalVariable("currentPcHDDSerialNumber");
      //Activer ou desactiver le service focus ecole  sur la base en ligne
      const apiPayload = { codeEtab: codeetab, anneeScolaire: anscol1, action, hddserialnumber: currentPcHDDSerialNumber }

      const apiUrl = `${FOCUS_ECOLE_SERVER_BASE_URL}/activerdesactiverservice`;
      const result: any = await fetchPrivateRoute(apiUrl, apiPayload)

      if (result.status === 1) {
        console.log('in sucess ++++++++++++++++++++++++++++')
        resolve(result.data)
      } else {
        console.log('why error ++++++++++++++++++++++++++++')

        reject(result.errors);
      }
    } catch (error) {
      console.log("🚀 ~ file: services.ts ~ line 45 ~ returnnewPromise ~ error", error)
      reject(error);
    }
  });
};


/**
 * Effectuer l'initialistation des services chez focus ecole
 */
export const initializeService = (io, sections) => {
  return new Promise(async (resolve, reject) => {
    try {

      await checkServiceFocusEcoleActivated();//verifier le service focus ecole activé
      await checkAuthorizedSerialNumber() //verifier le numero serie disque autorisé


      if (sections.includes("parametab")) {
        io.to(globalThis.serverFrontEndSocketId).emit(
          "initialize service",
          {
            message: "Initialisation params etab  en cours …",
            status: 2,
            section: "parametab",
          }
        );
        await sendParamEtab();
        await functions.setFocusEcoleLogsGroupActionSuccess("parametab");
        io.to(globalThis.serverFrontEndSocketId).emit(
          "initialize service",
          {
            message: "Initialisation params etab terminée",
            status: 1,
            section: "parametab",
          }
        );
        sleep(500);
      }
      if (sections.includes("matiere")) {
        io.to(globalThis.serverFrontEndSocketId).emit(
          "initialize service",
          {
            message: "Initialisation matieres en cours …",
            status: 2,
            section: "matiere",
          }
        );
        await sendMatieres();
        await functions.setFocusEcoleLogsGroupActionSuccess("matiere");
        io.to(globalThis.serverFrontEndSocketId).emit(
          "initialize service",
          {
            message: "Initialisation matieres terminée",
            status: 1,
            section: "matiere",
          }
        );
        sleep(500);
      }
      if (sections.includes("salle")) {
        io.to(globalThis.serverFrontEndSocketId).emit(
          "initialize service",
          {
            message: "Initialisation salles en cours …",
            status: 2,
            section: "salle",
          }
        );
        await sendSalles();
        await functions.setFocusEcoleLogsGroupActionSuccess("salle");
        io.to(globalThis.serverFrontEndSocketId).emit(
          "initialize service",
          {
            message: "Initialisation salles  terminée",
            status: 1,
            section: "salle",
          }
        );
        sleep(500);
      }
      if (sections.includes("evalnote")) {
        io.to(globalThis.serverFrontEndSocketId).emit(
          "initialize service",
          {
            message: "Initialisation notes evaluations en cours …",
            status: 2,
            section: "evalnote",
          }
        );
        await sendEvaluationNotes();
        await functions.setFocusEcoleLogsGroupActionSuccess("evalnote");
        io.to(globalThis.serverFrontEndSocketId).emit(
          "initialize service",
          {
            message: "Initialisation notes evaluations  terminée",
            status: 1,
            section: "evalnote",
          }
        );
        sleep(500);
      }

      if (sections.includes("evalprog")) {
        io.to(globalThis.serverFrontEndSocketId).emit(
          "initialize service",
          {
            message: "Initialisation notes evaluations en cours …",
            status: 2,
            section: "evalprog",
          }
        );
        await sendEvalProg();
        await functions.setFocusEcoleLogsGroupActionSuccess("evalprog");
        io.to(globalThis.serverFrontEndSocketId).emit(
          "initialize service",
          {
            message: "Initialisation notes evaluations  terminée",
            status: 1,
            section: "evalprog",
          }
        );
        sleep(500);
      }

      if (sections.includes("personnel")) {
        io.to(globalThis.serverFrontEndSocketId).emit(
          "initialize service",
          {
            message: "Initialisation personnel en cours …",
            status: 2,
            section: "personnel",
          }
        );
        await sendPersonnel();
        await functions.setFocusEcoleLogsGroupActionSuccess("personnel");
        io.to(globalThis.serverFrontEndSocketId).emit(
          "initialize service",
          {
            message: "Initialisation personnel terminée",
            status: 1,
            section: "personnel",
          }
        );
        sleep(500);
      }
      if (sections.includes("plagehoraire")) {
        io.to(globalThis.serverFrontEndSocketId).emit(
          "initialize service",
          {
            message: "Initialisation horaires en cours …",
            status: 2,
            section: "plagehoraire",
          }
        );
        await sendPlageHoraires();
        await functions.setFocusEcoleLogsGroupActionSuccess("plagehoraire");
        io.to(globalThis.serverFrontEndSocketId).emit(
          "initialize service",
          {
            message: "Initialisation horaires terminée",
            status: 1,
            section: "plagehoraire",
          }
        );
        sleep(500);
      }

      if (sections.includes("horaire")) {
        io.to(globalThis.serverFrontEndSocketId).emit(
          "initialize service",
          {
            message: "Initialisation horaires en cours …",
            status: 2,
            section: "horaire",
          }
        );
        await sendHoraires();
        await functions.setFocusEcoleLogsGroupActionSuccess("horaire");
        io.to(globalThis.serverFrontEndSocketId).emit(
          "initialize service",
          {
            message: "Initialisation horaires terminée",
            status: 1,
            section: "horaire",
          }
        );
        sleep(500);
      }

      if (sections.includes("classematiereprof")) {
        io.to(globalThis.serverFrontEndSocketId).emit(
          "initialize service",
          {
            message: "Initialisation des classes matiere prof en cours …",
            status: 2,
            section: "classematiereprof",
          }
        );
        await sendClassesMatiereProf();
        await functions.setFocusEcoleLogsGroupActionSuccess("classematiereprof");
        io.to(globalThis.serverFrontEndSocketId).emit(
          "initialize service",
          {
            message: "Initialisation des classes matiere prof terminée",
            status: 1,
            section: "classematiereprof",
          }
        );
        sleep(500);
      }

      if (sections.includes("classe")) {
        io.to(globalThis.serverFrontEndSocketId).emit(
          "initialize service",
          {
            message: "Initialisation des classes en cours …",
            status: 2,
            section: "classe",
          }
        );
        await sendClasses();
        await sendTypeClasses();
        await functions.setFocusEcoleLogsGroupActionSuccess("classe");
        io.to(globalThis.serverFrontEndSocketId).emit(
          "initialize service",
          {
            message: "Initialisation des classes terminée",
            status: 1,
            section: "classe",
          }
        );
        sleep(500);
      }

      if (sections.includes("eleve")) {
        io.to(globalThis.serverFrontEndSocketId).emit(
          "initialize service",
          {
            message: "Initialisation des élèves en cours …",
            status: 2,
            section: "eleve",
          }
        );
        await sendStudents();
        await functions.setFocusEcoleLogsGroupActionSuccess("eleve");
        io.to(globalThis.serverFrontEndSocketId).emit(
          "initialize service",
          {
            message: "Initialisation des élèves terminée",
            status: 1,
            section: "eleve",
          }
        );
        sleep(500);
      }

      if (sections.includes("echindividuel")) {
        io.to(globalThis.serverFrontEndSocketId).emit(
          "initialize service",
          {
            message: "Initialisation échéanciers individuel en cours …",
            status: 2,
            section: "echindividuel",
          }
        );
        await sendIndividualEcheanciers(); //envoyer le contenu de la table echeancier individuel

        await functions.setFocusEcoleLogsGroupActionSuccess("echindividuel");
        io.to(globalThis.serverFrontEndSocketId).emit(
          "initialize service",
          {
            message: "Initialisation échéanciers individuel terminée",
            status: 1,
            section: "echindividuel",
          }
        );
        sleep(500);
      }

      if (sections.includes("versement")) {
        io.to(globalThis.serverFrontEndSocketId).emit(
          "initialize service",
          {
            message: "Initialisation des versements en cours …",
            status: 2,
            section: "versement",
          }
        );
        // await sendVersement();
        await sendPayments();

        await functions.setFocusEcoleLogsGroupActionSuccess("versement");
        io.to(globalThis.serverFrontEndSocketId).emit(
          "initialize service",
          {
            message: "Initialisation des versements terminés",
            status: 1,
            section: "versement",
          }
        );
      }

      if (sections.includes("seance")) {
        console.log("seances +++++++++++++++++++++++++++++++++++++++++++")
        io.to(globalThis.serverFrontEndSocketId).emit(
          "initialize service",
          {
            message: "Initialisation seances en cours …",
            status: 1,
            section: "seances",
          }
        );
        await sendSeances();
        await functions.setFocusEcoleLogsGroupActionSuccess("seances");
        io.to(globalThis.serverFrontEndSocketId).emit(
          "initialize service",
          {
            message: "Initialisation des seances terminés",
            status: 2,
            section: "seances",
          }
        );
      }

      if (sections.includes("grouperubrique")) {
        io.to(globalThis.serverFrontEndSocketId).emit(
          "initialize service",
          {
            message: "Initialisation groupe rubrique en cours …",
            status: 1,
            section: "grouperubrique",
          }
        );
        await sendGroupeRubriques();
        await functions.setFocusEcoleLogsGroupActionSuccess("grouperubrique");
        io.to(globalThis.serverFrontEndSocketId).emit(
          "initialize service",
          {
            message: "Initialisation des grouperubrique terminés",
            status: 2,
            section: "grouperubrique",
          }
        );
      }

      if (sections.includes("rubrique")) {
        io.to(globalThis.serverFrontEndSocketId).emit(
          "initialize service",
          {
            message: "Initialisation rubrique en cours …",
            status: 1,
            section: "rubrique",
          }
        );
        await sendRubriques();
        await functions.setFocusEcoleLogsGroupActionSuccess("rubrique");
        io.to(globalThis.serverFrontEndSocketId).emit(
          "initialize service",
          {
            message: "Initialisation des rubrique terminés",
            status: 2,
            section: "rubrique",
          }
        );
      }

      // if (sections.includes("libelleecheance")) {
      //   io.to(globalThis.serverFrontEndSocketId).emit(
      //     "initialize service",
      //     {
      //       message: "Initialisation libelles echeances en cours …",
      //       status: 1,
      //       section: "libelleecheance",
      //     }
      //   );
      //   await sendLibelleEcheances();
      //   await functions.setFocusEcoleLogsGroupActionSuccess("libelleecheance");
      //   io.to(globalThis.serverFrontEndSocketId).emit(
      //     "initialize service",
      //     {
      //       message: "Initialisation des libelles echeances terminés",
      //       status: 2,
      //       section: "libelleecheance",
      //     }
      //   );
      // }

      if (sections.includes("echobligatoireglobal")) {
        io.to(globalThis.serverFrontEndSocketId).emit(
          "initialize service",
          {
            message: "Initialisation echeancier  obligatoire globale en cours …",
            status: 1,
            section: "echobligatoireglobal",
          }
        );
        await sendEcheancierObligatoirelGlobal();
        await functions.setFocusEcoleLogsGroupActionSuccess("echobligatoireglobal");
        io.to(globalThis.serverFrontEndSocketId).emit(
          "initialize service",
          {
            message: "Initialisation echeancier obligatoire global terminés",
            status: 2,
            section: "echobligatoireglobal",
          }
        );
      }

      if (sections.includes("echoptionnelglobal")) {
        io.to(globalThis.serverFrontEndSocketId).emit(
          "initialize service",
          {
            message: "Initialisation echeancier  optionnel globale en cours …",
            status: 1,
            section: "echoptionnelglobal",
          }
        );
        await sendEcheancierOptionnelGlobal();
        await functions.setFocusEcoleLogsGroupActionSuccess("echoptionnelglobal");
        io.to(globalThis.serverFrontEndSocketId).emit(
          "initialize service",
          {
            message: "Initialisation echeancier optionnel global terminés",
            status: 2,
            section: "echoptionnelglobal",
          }
        );
      }

      if (sections.includes("echpersonnel")) {
        io.to(globalThis.serverFrontEndSocketId).emit(
          "initialize service",
          {
            message: "Initialisation échéanciers personnel en cours …",
            status: 2,
            section: "echpersonnel",
          }
        );
        await sendEleveEcheancierPersonnel() //envoyer les rubrique personnalisé pour ce eleve

        await functions.setFocusEcoleLogsGroupActionSuccess("echpersonnel");
        io.to(globalThis.serverFrontEndSocketId).emit(
          "initialize service",
          {
            message: "Initialisation échéanciers personnel terminée",
            status: 1,
            section: "echpersonnel",
          }
        );
        sleep(500);
      }


      if (sections.includes("souscriptionfraisoptionel")) {
        io.to(globalThis.serverFrontEndSocketId).emit(
          "initialize service",
          {
            message: "Initialisation sosucription frais optionel en cours …",
            status: 1,
            section: "souscriptionfraisoptionel",
          }
        );
        await sendSouscriptionFraisRubriqueOptionnel();
        await functions.setFocusEcoleLogsGroupActionSuccess("souscriptionfraisoptionel");
        io.to(globalThis.serverFrontEndSocketId).emit(
          "initialize service",
          {
            message: "Initialisation sosucription frais optionel terminés",
            status: 2,
            section: "souscriptionfraisoptionel",
          }
        );
      }




      resolve(true);
    } catch (error) {

      reject(error);
    }
  });
};

/**
 * Enoyer les params de l'etablissement vers focus ecoles
 * @returns 
 */
export const sendParamEtab = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // await checkServiceFocusEcoleActivated();//verifier le service focus ecole activé
      // await checkAuthorizedSerialNumber() //verifier le numero serie disque autorisé

      const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab", "AnScol2", "BPEtab", "DRENComplet",
        "DRENouDDEN", "DREN", "Fondateur", "NomChefEtab", "NomCompletEtab", "NomEtabAbr", "TélChefEtab", "TélCorrespondant", "TelEtab", "TélFondateur", "method_calc_eval", "DecoupSemestres"]);;
      const { anscol1, codeetab } = paramObj;
      const url = `${FOCUS_ECOLE_SERVER_BASE_URL}/add/parametab`;
      const etabData = {
        anneeScolaire: anscol1,
        codeEtab: codeetab,
        paramEtab: { ...paramObj, modeCalc: paramObj.method_calc_eval || 1 }
      }
      await fetchPrivateRoute(url, etabData)
      resolve(true);
    } catch (error) {

      reject(error);
    }
  });
};

export const sendTypeClasses = (
  classeIds: number[] | null = null,
  setLog = true
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const action = "ENVOYER_TYPE_CLASSE";
      await checkServiceFocusEcoleActivated();//verifier le service focus ecole activé
      await checkAuthorizedSerialNumber() //verifier le numero serie disque autorisé

      //recupperer les types classes
      const fullTypeClasses: any[] = await functions.fetchTypeClasses();
      console.log("🚀 ~ file: services.ts ~ line 721 ~ returnnewPromise ~ fullTypeClasses", fullTypeClasses)

      const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const { anscol1, codeetab } = paramObj;

      const typeClasses: IFocusEcoleClasseItem[] = fullTypeClasses.map((item) => ({
        ...item,
        anneeScolaire: anscol1,
        codeEtab: codeetab
      }));

      const url = `${FOCUS_ECOLE_SERVER_BASE_URL}/ajouter/typeclasse`;
      // const response = await axios.post(url, classes);
      const response: any = await fetchPrivateRoute(url, typeClasses);

      if (setLog) {
        await functions.setFocusEcoleHistoric(action, null, 1);
      }
      if (response.status === 1) {
        resolve(response);
      }

    } catch (error) {
      if (setLog) {
        const action = "ENVOYER_TYPE_CLASSE";
        await functions.setFocusEcoleHistoric(action, classeIds, 0);
      }
      reject(error);
    }
  });
};
/**
 * Envoyer une ou plusieurs classes vers focus ecole
 * @param classeIds
 * @param setLog
 * @returns
 */
export const sendClasses = (
  classeIds: number[] | null = null,
  setLog = true
) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkServiceFocusEcoleActivated();//verifier le service focus ecole activé
      await checkAuthorizedSerialNumber() //verifier le numero serie disque autorisé

      // récupère les classes dans spider (tableau d'objets)
      const fullClasses: ISpiderClassseItem[] = await functions.fetchClasses(classeIds);

      const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const { anscol1, codeetab } = paramObj;

      const classes: IFocusEcoleClasseItem[] = fullClasses.map((item) => ({
        ...item,
        idClasse: item.idClasse,
        anneeScolaire: anscol1,
        codeEtab: codeetab
      }));

      const nbClasses = classes.length;

      const action = "ENVOYER_CLASSE";
      if (nbClasses === 0) {
        if (setLog) {
          await functions.setFocusEcoleHistoric(action, classeIds, 0);
        }
        reject("Aucune classe correspondant aux critères soumis");
      } else {
        console.log("here+++++++++++++++++++++++")
        const url = `${FOCUS_ECOLE_SERVER_BASE_URL}/ajouter/classe`;
        // const response = await axios.post(url, classes);
        const response: any = await fetchPrivateRoute(url, classes);

        if (setLog) {
          await functions.setFocusEcoleHistoric(action, classeIds, 1);
        }
        if (response.status === 1) {
          resolve(response);
        }
      }
    } catch (error) {
      Logger.error("Erreur lors de la création d'une classe chez focus ecole");
      if (setLog) {
        const action = "ENVOYER_CLASSE";
        await functions.setFocusEcoleHistoric(action, classeIds, 0);
      }
      reject(error);
    }
  });
};

/**
 * Supprimer un ou plusieurs classes chez focus ecoles
 * @param classeIds
 * @param setLog
 * @returns
 */
export const deleteClasse = (
  classeIds: number[] | null = null,
  setLog = true
) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkServiceFocusEcoleActivated();//verifier le service focus ecole activé
      await checkAuthorizedSerialNumber() //verifier le numero serie disque autorisé
      const action = "SUPPRIMER_CLASSE";
      if (!classeIds) {
        reject("Veuillez selectionner les classes à supprimer");
      } else {
        if (classeIds.length === 0) {
          reject("Veuillez selectionner les classes à supprimer");
        } else {
          const { anscol1, codeetab } = await paramEtabObjet([
            "Anscol1",
            "CodeEtab",
          ]);
          const classes: any[] = classeIds.map((idClasse) => ({
            anneeScolaire: anscol1,
            codeEtab: codeetab,
            idClasse,
          }));

          const url = `${FOCUS_ECOLE_SERVER_BASE_URL}/supprimer/classe`;
          // await axios.post(url, classes);
          await fetchPrivateRoute(url, classes);

          if (setLog) {
            await functions.setFocusEcoleHistoric(action, classeIds, 1);
          }
          resolve(true);
        }
      }
    } catch (error) {
      Logger.error(
        "Erreur lors de la suppression classe chez gain technologie"
      );
      if (setLog) {
        const action = "SUPPRIMER_CLASSE";
        await functions.setFocusEcoleHistoric(action, classeIds, 0);
      }
      reject(error);
    }
  });
};

/**
 * envoyer un ou plusieur eleves vers focus ecole
 * @param studentIds
 * @param setLog
 * @returns
 */
export const sendStudents = (
  studentIds: number[] | null = null,
  setLog = true
) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkServiceFocusEcoleActivated();//verifier le service focus ecole activé
      await checkAuthorizedSerialNumber() //verifier le numero serie disque autorisé
      const fullEleves = await functions.fetchStudents(studentIds);
      const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const { anscol1, codeetab } = paramObj;

      const eleves: IFocusEcoleStudentItem[] = fullEleves.map((item) => ({
        ...item,
        anneeScolaire: anscol1,
        codeEtab: codeetab,
        dateNaissance: moment(item.dateNaissance).format("YYYY-MM-DD"),
        dateEnregExtrait: moment(item.dateEnregExtrait).format("YYYY-MM-DD"),
        dateInscrit: moment(item.dateInscrit).format("YYYY-MM-DD"),
      }));
      console.log("🚀 ~ file: services.ts ~ line 575 ~ consteleves:IFocusEcoleStudentItem[]=fullEleves.map ~ eleves__1", eleves[0])
      console.log("🚀 ~ file: services.ts ~ line 575 ~ consteleves:IFocusEcoleStudentItem[]=fullEleves.map ~ eleves__2", eleves[1])
      console.log("🚀 ~ file: services.ts ~ line 575 ~ consteleves:IFocusEcoleStudentItem[]=fullEleves.map ~ eleves__3", eleves[2])

      const action = "ENVOYER_ELEVE";
      if (eleves.length === 0) {
        if (setLog) {
          await functions.setFocusEcoleHistoric(action, studentIds, 0);
        }
        reject("Aucun élève correspondant aux identifiants fournis");
      } else {
        const url = `${FOCUS_ECOLE_SERVER_BASE_URL}/ajouter/eleve`;
        //  const response = await axios.post(url, eleves);
        const response: any = await fetchPrivateRoute(url, eleves)

        if (setLog) {
          await functions.setFocusEcoleHistoric(action, studentIds, 1);
        }
        if (response.status === 1) {
          resolve(response);
        } else {
          reject("Erreur de l'envoi élève ches focus ecole")
        }
      }
    } catch (error) {
      Logger.error("Erreur de l'envoi élève ches focus ecole");
      if (setLog) {
        const action = "ENVOYER_ELEVE";
        await functions.setFocusEcoleHistoric(action, studentIds, 0);
      }
      reject(error);
    }
  });
};

/**
 * envoyer les echeanciers individuels d'un ou plusieurs eleves vers focus ecoles
 * @param elevesIds
 * @param
 * @returns
 */
export const sendIndividualEcheanciers = (
  elevesIds: number[] | null = null,
  setLog = true
) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkServiceFocusEcoleActivated();//verifier le service focus ecole activé
      await checkAuthorizedSerialNumber() //verifier le numero serie disque autorisé
      const action = "ENVOYER_ECHEANCIER_INDIVIDUEL";
      // const fullEcheanciers = await functions.fetchIndividualEcheancier(elevesIds);//old functions
      const fullEcheanciers = await functions.fetchEcheancierIndividuel(elevesIds);

      const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const { anscol1, codeetab } = paramObj;

      const echeanciers: IFocusEcoleEcheancierIndividuelItem[] = fullEcheanciers.map(
        (item) => ({
          ...item,
          anneeScolaire: anscol1,
          codeEtab: codeetab,
          dateDebutPeriode: moment(item.dateDebutPeriode).format("YYYY-MM-DD"),
          dateFinPeriode: moment(item.dateFinPeriode).format("YYYY-MM-DD"),
        })
      );
      console.log("🚀 ~ file: services.ts ~ line 748 ~ returnnewPromise ~ echeanciers", echeanciers.length)

      const url = `${FOCUS_ECOLE_SERVER_BASE_URL}/ajouter/echeancier`;
      const response = await fetchPrivateRoute(url, echeanciers);

      if (setLog) {
        await functions.setFocusEcoleHistoric(action, elevesIds, 1);
      }
      resolve(response);
    } catch (error) {
      console.log("🚀 ~ file: services.ts ~ line 921 ~ returnnewPromise ~ error", error)
      Logger.error("Erreur lors de l'envoi echeancier individuel");
      if (setLog) {
        const action = "ENVOYER_ECHEANCIER_INDIVIDUEL";
        await functions.setFocusEcoleHistoric(action, elevesIds, 0);
      }
      reject(error);
    }
  });
};

/**
 * envoyer les rubriques personnalisé et echeances d'un ou plusieurs eleves vers focus ecole
 */
export const sendEleveEcheancierPersonnel = (elevesIds: number[] | null = null, setLog = true) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkServiceFocusEcoleActivated();//verifier le service focus ecole activé
      await checkAuthorizedSerialNumber() //verifier le numero serie disque autorisé
      const action = "ENVOYER_ELEVE_RUBRIQUE_PERSONNEL";
      const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const { anscol1, codeetab } = paramObj;

      const fullEleveRubriques = await functions.fetchEleveRubrique(elevesIds);//recuperer les rubrique perosnnalise

      const eleveRubriquesIds: number[] = []; //tableau pour contenir les idEleveRubrique dont on va recupuprer plus tard les echeances
      const eleveRubriques: IFocusEcoleEleveRubriqueItem[] = fullEleveRubriques.map((item) => {
        eleveRubriquesIds.push(item.idEleveRubrique)
        return {
          ...item,
          anneeScolaire: anscol1,
          codeEtab: codeetab,
        }
      });
      console.log("🚀 ~ file: services.ts ~ line 866 ~ returnnewPromise ~ eleveRubriquesIds", eleveRubriquesIds)

      const fullEchancePersonnelEleveRubriques = await functions.fetchEcheancierPersonnelEleveRubrique(eleveRubriquesIds);//recuperer les echeances des rubriques personnalisé
      const echancePersonnelEleveRubriques: IFocusEcoleEcheancierPersonnelEleveRubriqueItem[] = fullEchancePersonnelEleveRubriques.map(
        (item) => ({
          ...item,
          anneeScolaire: anscol1,
          codeEtab: codeetab,
          dateDebutPeriode: moment(item.dateDebutPeriode).format("YYYY-MM-DD"),
          dateFinPeriode: moment(item.dateFinPeriode).format("YYYY-MM-DD"),
        })
      );
      console.log("🚀 ~ file: services.ts ~ line 885 ~ returnnewPromise ~ echancePersonnelEleveRubriques", echancePersonnelEleveRubriques)

      //envoyer les données rubriques personnalisé et echeances vers focus ecole
      const url1 = `${FOCUS_ECOLE_SERVER_BASE_URL}/ajouter/eleverubrique`;
      const url2 = `${FOCUS_ECOLE_SERVER_BASE_URL}/ajouter/echeancierpersonneleleverubrique`;
      await fetchPrivateRoute(url1, eleveRubriques);
      // await fetchPrivateRoute(url2, echancePersonnelEleveRubriques);
      if (setLog) {
        await functions.setFocusEcoleHistoric(action, elevesIds, 1);
      }
      resolve(true);
    } catch (error) {
      if (setLog) {
        const action = "ENVOYER_ELEVE_RUBRIQUE_PERSONNEL";
        await functions.setFocusEcoleHistoric(action, elevesIds, 0);
      }
      reject(error);
    }
  });
};


/**
 *  Envoyer l'echeancier global des rubriques obligatoires  vers focus ecole 
 */
export const sendEcheancierObligatoirelGlobal = (setLog = true) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkServiceFocusEcoleActivated();//verifier le service focus ecole activé
      await checkAuthorizedSerialNumber() //verifier le numero serie disque autorisé
      const action = "ENVOYER_ECHEANCIER_OPTIONNEL_GLOBAL";
      const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const { anscol1, codeetab } = paramObj;

      /* debut Fetcher les options a tenir compte pour les rubliques obigatoires */
      const fullOptionTypeClasseRubriqueObligatoire = await functions.fetchOptionTypeClasseRubriqueObligatoire();
      const optionTypeClasseRubriqueObligatoire: IFocusEcoleOptionTypeClasseRubriqueObligatoireItem[] = fullOptionTypeClasseRubriqueObligatoire.map(
        (item) => ({
          ...item,
          anneeScolaire: anscol1,
          codeEtab: codeetab
        })
      );
      /* fin  Fetcher les options a tenir compte pour les rubliques obigatoires */

      /* debut fetcher les rubriques obligatoires definit suivant les types classes */
      const fullTypeClasseRubriqueObligatoire = await functions.fetchTypeClasseRubriqueObligatoire();
      const typeClasseRubriqueObligatoire: IFocusEcoleTypeClasseRubriqueObligatoireItem[] = fullTypeClasseRubriqueObligatoire.map(
        (item) => ({
          ...item,
          anneeScolaire: anscol1,
          codeEtab: codeetab
        })
      );
      /* fin fetcher les rubriques obligatoires definit suivant les types classes */

      /* debut  fetcher les echeances des rubriques obligatoires*/
      const fullEcheancierTypeClasseRubriqueObligatoire = await functions.fetchEcheancierTypeClasseRubriqueObligatoire();
      const echeancierTypeClasseRubriqueObligatoire: IFocusEcoleEcheancierTypeClasseRubriqueObligatoireItem[] = fullEcheancierTypeClasseRubriqueObligatoire.map(
        (item) => ({
          ...item,
          anneeScolaire: anscol1,
          codeEtab: codeetab,
          dateDebutPeriode: moment(item.dateDebutPeriode).format("YYYY-MM-DD"),
          dateFinPeriode: moment(item.dateFinPeriode).format("YYYY-MM-DD"),
        })
      );
      console.log("🚀 ~ file: services.ts ~ line 924 ~ returnnewPromise ~ echeancierTypeClasseRubriqueObligatoire", echeancierTypeClasseRubriqueObligatoire)
      /* fin  fetcher les echeances des rubriques obligatoires */

      //envoyer les données rubriques personnalisé et echeances vers focus ecole
      const url1 = `${FOCUS_ECOLE_SERVER_BASE_URL}/ajouter/optiontypeclasserubriqueobligatoire`;
      const url2 = `${FOCUS_ECOLE_SERVER_BASE_URL}/ajouter/typeclasserubriqueobligatoire`;
      const url3 = `${FOCUS_ECOLE_SERVER_BASE_URL}/ajouter/echeanciertypeclasserubriqueobligatoire`;
      await fetchPrivateRoute(url1, optionTypeClasseRubriqueObligatoire);
      await fetchPrivateRoute(url2, typeClasseRubriqueObligatoire);
      await fetchPrivateRoute(url3, echeancierTypeClasseRubriqueObligatoire);

      if (setLog) {
        await functions.setFocusEcoleHistoric(action, null, 1);
      }
      resolve(true);
    } catch (error) {
      if (setLog) {
        const action = "ENVOYER_ECHEANCIER_OPTIONNEL_GLOBAL";
        await functions.setFocusEcoleHistoric(action, null, 0);
      }
      reject(error);
    }
  });
};


/**
 * Envoyer les versement et detail versement vers focus ecole
 * @param versementIds 
 * @param setLog 
 * @returns 
 */
export const sendVersement = (versementIds: number[] | null = null,
  setLog = true) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkServiceFocusEcoleActivated();//verifier le service focus ecole activé
      await checkAuthorizedSerialNumber() //verifier le numero serie disque autorisé
      const action = "ENVOYER_VERSEMENT";
      const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const { anscol1, codeetab } = paramObj;

      /* debut fetcher un ou plusieurs versement */
      const fullVersement = await functions.fetchVersements(versementIds);
      const versements: IFocusEcoleISpiderVersementItem[] = fullVersement.map(
        (item) => ({
          ...item,
          anneeScolaire: anscol1,
          codeEtab: codeetab
        })
      );
      /* fin fetcher un ou plusieurs versement */

      /* debut fetcher les details de versement pour les rubrique obligatoire */
      const fullDetailsVersementRubriqueObligatoire = await functions.fetchDetailsVersementRubriqueObligatoire(versementIds);
      const detailsVersementRubriqueObligatoire: IFocusEcoleDetailsVersementRubriqueObligatoireItemItem[] = fullDetailsVersementRubriqueObligatoire.map(
        (item) => ({
          ...item,
          anneeScolaire: anscol1,
          codeEtab: codeetab
        })
      );
      /** fin fetcher les details de versement pour les rubrique obligatoire */

      /* debut fetcher les details de versement pour une rubrique obligatoire*/
      const fullDetailsVersementRubriqueOptionnel = await functions.fetchDetailsVersementRubriqueOptionnel(versementIds);
      const detailsVersementRubriqueOptionnel: IFocusEcoleDetailsVersementRubriqueOptionnelItem[] = fullDetailsVersementRubriqueOptionnel.map(
        (item) => ({
          ...item,
          anneeScolaire: anscol1,
          codeEtab: codeetab,
        })
      );
      /* fin fetcher les details de versement pour une rubrique obligatoire  */

      //envoyer les données versement et detail versement vers focus ecole
      const url1 = `${FOCUS_ECOLE_SERVER_BASE_URL}/ajouter/optiontypeclasserubriqueobligatoire`;
      const url2 = `${FOCUS_ECOLE_SERVER_BASE_URL}/ajouter/typeclasserubriqueobligatoire`;
      const url3 = `${FOCUS_ECOLE_SERVER_BASE_URL}/ajouter/echeanciertypeclasserubriqueobligatoire`;
      await fetchPrivateRoute(url1, versements);
      await fetchPrivateRoute(url2, detailsVersementRubriqueObligatoire);
      await fetchPrivateRoute(url3, detailsVersementRubriqueOptionnel);

      if (setLog) {
        await functions.setFocusEcoleHistoric(action, null, 1);
      }
      resolve(true);
    } catch (error) {
      if (setLog) {
        const action = "ENVOYER_VERSEMENT";
        await functions.setFocusEcoleHistoric(action, null, 0);
      }
      reject(error);
    }
  });
};

























/**
 * Envoyer l'echeancier global des rubriques optionnelle  vers focus ecole 
 * @param setLog 
 * @returns 
 */
export const sendEcheancierOptionnelGlobal = (setLog = true) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkServiceFocusEcoleActivated();//verifier le service focus ecole activé
      await checkAuthorizedSerialNumber() //verifier le numero serie disque autorisé
      const action = "ENVOYER_ECHEANCIER_OPTIONNEL_GLOBAL";
      const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const { anscol1, codeetab } = paramObj;

      /* debut fetcher les rubriques optionnelle */
      const fullRubriqueOptionnelGlobal = await functions.fetchRubriqueOptionnelGlobal();
      const rubriqueOptionnelGlobal: IFocusEcoleRubriqueOptionnelGlobalItem[] = fullRubriqueOptionnelGlobal.map(
        (item) => ({
          ...item,
          anneeScolaire: anscol1,
          codeEtab: codeetab
        })
      );
      /* fin fetcher les rubriques optionnelle */

      /* debut fetcher les echeancier des  rubriques optionnelle */
      const fullEchancierRubriqueOptionnel = await functions.fetchEcheancierRubriqueOptionnelGlobal();//recuperer les echeances des rubriques personnalisé
      const echeancierRubriqueOptionnel: IFocusEcoleEcheancierRubriqueOptionnelItem[] = fullEchancierRubriqueOptionnel.map(
        (item) => ({
          ...item,
          anneeScolaire: anscol1,
          codeEtab: codeetab,
          dateDebutPeriode: moment(item.dateDebutPeriode).format("YYYY-MM-DD"),
          dateFinPeriode: moment(item.dateFinPeriode).format("YYYY-MM-DD"),
        })
      );
      console.log("🚀 ~ file: services.ts ~ line 1110 ~ returnnewPromise ~ echeancierRubriqueOptionnel", echeancierRubriqueOptionnel)
      /* fin fetcher les echeancier des  rubriques optionnelle */

      //envoyer les données rubriques personnalisé et echeances vers focus ecole
      const url1 = `${FOCUS_ECOLE_SERVER_BASE_URL}/ajouter/rubriqueoptionnelglobal`;
      const url2 = `${FOCUS_ECOLE_SERVER_BASE_URL}/ajouter/echeancierrubriqueoptionnelglobal`;
      await fetchPrivateRoute(url1, rubriqueOptionnelGlobal);
      await fetchPrivateRoute(url2, echeancierRubriqueOptionnel);

      if (setLog) {
        await functions.setFocusEcoleHistoric(action, null, 1);
      }
      resolve(true);
    } catch (error) {
      if (setLog) {
        const action = "ENVOYER_ECHEANCIER_OPTIONNEL_GLOBAL";
        await functions.setFocusEcoleHistoric(action, null, 0);
      }
      reject(error);
    }
  });
};

/**
 * envoyer vers focus ecole les souscription rubrique optionnnel effectué par les éléves
 * @param setLog 
 * @returns 
 */
export const sendSouscriptionFraisRubriqueOptionnel = (studentIds: number[] | null = null, setLog = true) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkServiceFocusEcoleActivated();//verifier le service focus ecole activé
      await checkAuthorizedSerialNumber() //verifier le numero serie disque autorisé
      const action = "ENVOYER_SOUSCRIPTION_FRAIS_OPTIONNEL";
      const fullSouscriptions = await functions.fetchSouscriptionFraisRubriqueOptionnel(studentIds);
      const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const { anscol1, codeetab } = paramObj;

      const souscriptions: IFocusEcoleSouscriptionFraisOptionnelItem[] = fullSouscriptions.map(
        (item) => ({
          ...item,
          anneeScolaire: anscol1,
          codeEtab: codeetab,
        })
      );

      const url = `${FOCUS_ECOLE_SERVER_BASE_URL}/ajouter/souscriptionfraisrubriqueoptionnel`;
      const response = await fetchPrivateRoute(url, souscriptions);

      if (setLog) {
        await functions.setFocusEcoleHistoric(action, null, 1);
      }
      resolve(response);
    } catch (error) {
      console.log(
        "🚀 ~ file: services.ts ~ line 228 ~ returnnewPromise ~ error",
        error
      );
      Logger.error("Erreur lors de l'envoi echeancier global optionnnelle");
      if (setLog) {
        const action = "ENVOYER_SOUSCRIPTION_FRAIS_OPTIONNEL";
        await functions.setFocusEcoleHistoric(action, null, 0);
      }
      reject(error);
    }
  });
};


/**
 * Envoyer le personnel de l'etablissement vers focus ecole
 * @param personnelIds
 * @param setLog
 * @returns
 */
export const sendPersonnel = (personnelIds: number[] | null = null, setLog = true) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkServiceFocusEcoleActivated();//verifier le service focus ecole activé
      await checkAuthorizedSerialNumber() //verifier le numero serie disque autorisé
      const action = "ENVOYER_PERSONNEL";
      const fullPersonnel: ISpiderPersonnelItem[] = await functions.fecthPersonnel(personnelIds);
      const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const { anscol1, codeetab } = paramObj;

      const personnel: IFocusEcolePersonnelItem[] = fullPersonnel.map(
        (item) => ({
          ...item,
          anneeScolaire: anscol1,
          codeEtab: codeetab,
          dateNaissance: moment(item.dateNaissance).format("YYYY-MM-DD"),
          dateEmbauche: moment(item.dateEmbauche).format("YYYY-MM-DD"),
          numeroWhatsApp: "",
          email: ""
        })
      );
      console.log("🚀 ~ file: services.ts ~ line 1155 ~ returnnewPromise ~ personnel", personnel)

      const url = `${FOCUS_ECOLE_SERVER_BASE_URL}/ajouter/personnel`;
      const response: any = await fetchPrivateRoute(url, personnel);
      console.log("🚀 ~ file: services.ts ~ line 637 ~ returnnewPromise ~ response", response)
      if (setLog) {
        await functions.setFocusEcoleHistoric(action, personnelIds, 1);
      }
      resolve(response.data);
    } catch (error) {
      console.log(
        "🚀 ~ file: services.ts ~ line 228 ~ returnnewPromise ~ error",
        error
      );
      Logger.error("Erreur lors de l'envoi echeancier individuel");
      if (setLog) {
        const action = "ENVOYER_PERSONNEL";
        await functions.setFocusEcoleHistoric(action, personnelIds, 0);
      }
      reject(error);
    }
  });
};

/**
 * supprimer un ou plusieurs personnel de l'etbalissement chez focus ecole
 * @param personnelIds 
 * @param setLog 
 * @returns 
 */
export const deletePersonnel = (
  personnelIds: number[] | null = null,
  setLog = true
) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkServiceFocusEcoleActivated();//verifier le service focus ecole activé
      await checkAuthorizedSerialNumber() //verifier le numero serie disque autorisé
      const action = "SUPPRIMER_PERSONNEL";
      if (!personnelIds) {
        reject("Veuillez indiquer le personnel à supprimer");
      } else {
        if (personnelIds.length === 0) {
          reject("Veuillez indiquer le personnel à supprimer");
        } else {

          const { anscol1, codeetab } = await paramEtabObjet([
            "Anscol1",
            "CodeEtab",
          ]);
          const personnel: any[] = personnelIds.map((idPersonnel) => ({
            anneeScolaire: anscol1,
            codeEtab: codeetab,
            refPers: idPersonnel
          }));
          const url = `${FOCUS_ECOLE_SERVER_BASE_URL}/supprimer/personnel`;
          await fetchPrivateRoute(url, personnel);
          if (setLog) {
            await functions.setFocusEcoleHistoric(action, url, 1);
          }
          resolve(true);
        }
      }
    } catch (error) {
      Logger.error("Erreur lors de la suppression personnels chez focus ecole");
      if (setLog) {
        const action = "SUPPRIMER_PERSONNEL";
        await functions.setFocusEcoleHistoric(action, personnelIds, 0);
      }
      reject(error);
    }
  });
};


/**
 * envoyer les notes d'evauations vers focus ecoles
 * @param evalIds 
 * @param setLog
 * @returns
 */
export const sendEvaluationNotes = (
  evalIds: number[] | null = null,
  setLog = true
) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkServiceFocusEcoleActivated();//verifier le service focus ecole activé
      await checkAuthorizedSerialNumber() //verifier le numero serie disque autorisé
      const action = "ENVOYER_NOTES_EVALUATIONS";
      const fullEvalNotes = await functions.fecthEvaluationNotes(evalIds);
      console.log("🚀 ~ file: services.ts ~ line 714 ~ returnnewPromise ~ fullEvalNotes", fullEvalNotes[0])

      const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const { anscol1, codeetab } = paramObj;

      const evalnotes: IFocusEcoleEvaluationNoteItem[] = fullEvalNotes.map(
        (item) => ({
          ...item,
          anneeScolaire: anscol1,
          codeEtab: codeetab,
          dateSaisie: moment(item.dateSaisie).format("YYYY-MM-DD"),
          dateModification: moment(item.dateModification).format("YYYY-MM-DD"),
        })
      );
      console.log("🚀 ~ file: services.ts ~ line 728 ~ returnnewPromise ~ evalnotes", evalnotes)

      const url = `${FOCUS_ECOLE_SERVER_BASE_URL}/ajouter/evalnote`;
      const response: any = await fetchPrivateRoute(url, evalnotes);
      // console.log("🚀 ~ file: services.ts ~ line 732 ~ returnnewPromise ~ response", response)
      if (setLog) {
        await functions.setFocusEcoleHistoric(action, evalIds, 1);
      }
      resolve(response.data);
    } catch (error) {
      console.log(
        "🚀 ~ file: services.ts ~ line 228 ~ returnnewPromise ~ error",
        error
      );
      Logger.error("Erreur lors de l'envoi notes evaluations");
      if (setLog) {
        const action = "ENVOYER_NOTES_EVALUATIONS";
        await functions.setFocusEcoleHistoric(action, evalIds, 0);
      }
      reject(error);
    }
  });
};

/**
 * Supprimer les une ou plusieurs notes evaluations 
 * @param evalIds 
 * @param setLog 
 * @returns 
 */
const deleteEvalNotes = (
  evalIds: number[] | null = null,
  setLog = true
) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkServiceFocusEcoleActivated();//verifier le service focus ecole activé
      await checkAuthorizedSerialNumber() //verifier le numero serie disque autorisé
      const action = "SUPPRIMER_NOTES_EVALUATIONS";
      if (!evalIds) {
        reject("Veuillez indiquer les notes à supprimer");
      } else {
        if (evalIds.length === 0) {
          reject("Veuillez indiquer les versements à supprimer");
        } else {

          const { anscol1, codeetab } = await paramEtabObjet([
            "Anscol1",
            "CodeEtab",
          ]);

          const evals: any[] = evalIds.map((idEval) => ({
            anneeScolaire: anscol1,
            codeEtab: codeetab,
            idEval,
          }));
          const url = `${FOCUS_ECOLE_SERVER_BASE_URL}/supprimer/versement`;
          await fetchPrivateRoute(url, evals);

          if (setLog) {
            await functions.setFocusEcoleHistoric(action, url, 1);
          }
          resolve(true);
        }
      }
    } catch (error) {
      Logger.error("Erreur lors de la suppression notes evaluations chez focus ecole");
      if (setLog) {
        const action = "SUPPRIMER_NOTES_EVALUATIONS";
        await functions.setFocusEcoleHistoric(action, evalIds, 0);
      }
      reject(error);
    }
  });
};

/**
 * Envoyer la programation des evaluations vers Focus ecole
 * @param evalIds
 * @param setLog
 * @returns
 */
export const sendEvalProg = (
  evalIds: number[] | null = null,
  setLog = true
) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkServiceFocusEcoleActivated();//verifier le service focus ecole activé
      await checkAuthorizedSerialNumber() //verifier le numero serie disque autorisé
      const action = "ENVOYER_PROGRAMATION_EVALUATIONS";
      const fullEvalProgs = await functions.fecthEvalProg(evalIds);
      const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const { anscol1, codeetab } = paramObj;

      const evalProgs: IFocusEcoleEvaluationProgrammationItem[] = fullEvalProgs.map(
        (item) => ({
          ...item,
          anneeScolaire: anscol1,
          codeEtab: codeetab,
          dateComposition: moment(item.dateComposition).format("YYYY-MM-DD"),
        })
      );
      console.log("🚀 ~ file: services.ts ~ line 889 ~ returnnewPromise ~ evalProgs", evalProgs[0])


      const url = `${FOCUS_ECOLE_SERVER_BASE_URL}/ajouter/evalprog`;
      const response: any = await fetchPrivateRoute(url, evalProgs);

      if (setLog) {
        await functions.setFocusEcoleHistoric(action, evalIds, 1);
      }
      resolve(response.data);
    } catch (error) {
      console.log(
        "🚀 ~ file: services.ts ~ line 228 ~ returnnewPromise ~ error",
        error
      );
      Logger.error("");
      if (setLog) {
        const action = "ENVOYER_PROGRAMATION_EVALUATIONS";
        await functions.setFocusEcoleHistoric(action, evalIds, 0);
      }
      reject(error);
    }
  });
};

const deleteEvalProg = (
  evalIds: number[] | null = null,
  setLog = true
) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkServiceFocusEcoleActivated();//verifier le service focus ecole activé
      await checkAuthorizedSerialNumber() //verifier le numero serie disque autorisé
      const action = "SUPPRIMER_PROGRAMATION_EVALUATIONS";
      if (!evalIds) {
        reject("Veuillez indiquer les programmations à supprimer");
      } else {
        if (evalIds.length === 0) {
          reject("Veuillez indiquer les programmations à supprimer");
        } else {

          const { anscol1, codeetab } = await paramEtabObjet([
            "Anscol1",
            "CodeEtab",
          ]);
          const evals: any[] = evalIds.map((idEval) => ({
            anneeScolaire: anscol1,
            codeEtab: codeetab,
            idEval,
          }));
          const url = `${FOCUS_ECOLE_SERVER_BASE_URL}/supprimer/evalprog`;
          await fetchPrivateRoute(url, evals);
          if (setLog) {
            await functions.setFocusEcoleHistoric(action, url, 1);
          }
          resolve(true);
        }
      }
    } catch (error) {
      Logger.error("Erreur lors de la suppression programmations evaluations chez focus ecole");
      if (setLog) {
        const action = "SUPPRIMER_PROGRAMATION_EVALUATIONS";
        await functions.setFocusEcoleHistoric(action, evalIds, 0);
      }
      reject(error);
    }
  });
};



/**
 *  Envoyer les salles de classe vers focus ecole
 * @param roomIds 
 * @param setLog 
 * @returns 
 */
const sendSalles = (roomIds: number[] | null = null, setLog = true): Promise<IFocusEcoleSalleItem[] | any> => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkServiceFocusEcoleActivated();//verifier le service focus ecole activé
      await checkAuthorizedSerialNumber() //verifier le numero serie disque autorisé
      const action = "ENVOYER_SALLE";
      const fullRooms: ISpiderSalleItem[] = await functions.fecthSalles(
        roomIds
      );
      const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const { anscol1, codeetab } = paramObj;

      const rooms: IFocusEcoleSalleItem[] = fullRooms.map((item) => ({
        ...item,
        anneeScolaire: anscol1,
        codeEtab: codeetab,
      }));

      const url = `${FOCUS_ECOLE_SERVER_BASE_URL}/ajouter/salle`;
      const response: any = await fetchPrivateRoute(url, rooms);

      if (setLog) {
        await functions.setFocusEcoleHistoric(action, roomIds, 1);
      }
      resolve(response.data);
    } catch (error) {
      Logger.error("Erreur lors de l'envoi salles");
      if (setLog) {
        const action = "ENVOYER_SALLE";
        await functions.setFocusEcoleHistoric(action, roomIds, 0);
      }
      reject(error);
    }
  });
};


/**
 * Suppirmer une ou plusieurs salles de classes
 * @param roomIds 
 * @param setLog 
 * @returns 
 */
const deleteRooms = (
  roomIds: number[] | null = null,
  setLog = true
) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkServiceFocusEcoleActivated();//verifier le service focus ecole activé
      await checkAuthorizedSerialNumber() //verifier le numero serie disque autorisé
      const action = "SUPPRIMER_SALLE";
      if (!roomIds) {
        reject("Veuillez indiquer les salles à supprimer");
      } else {
        if (roomIds.length === 0) {
          reject("Veuillez indiquer les salles à supprimer");
        } else {

          const { anscol1, codeetab } = await paramEtabObjet([
            "Anscol1",
            "CodeEtab",
          ]);
          const rooms: any[] = roomIds.map((idRoom) => ({
            anneeScolaire: anscol1,
            codeEtab: codeetab,
            refSalle: idRoom,
          }));
          const url = `${FOCUS_ECOLE_SERVER_BASE_URL}/supprimer/rooms`;
          await fetchPrivateRoute(url, rooms);
          if (setLog) {
            await functions.setFocusEcoleHistoric(action, url, 1);
          }
          resolve(true);
        }
      }
    } catch (error) {
      Logger.error("Erreur lors de la suppression salles chez focus ecole");
      if (setLog) {
        const action = "SUPPRIMER_SALLE";
        await functions.setFocusEcoleHistoric(action, roomIds, 0);
      }
      reject(error);
    }
  });
};


/**
 * Envoyer la liste des matieres de l'etablissement vers focus ecole
 * @param matieresIds
 * @param setLog
 * @returns
 */
export const sendMatieres = (matieresIds: number[] | null = null, setLog = true): Promise<IFocusEcoleMatiereItem | any> => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkServiceFocusEcoleActivated();//verifier le service focus ecole activé
      await checkAuthorizedSerialNumber() //verifier le numero serie disque autorisé
      const action = "ENVOYER_MATIERE";
      const fullMatieres: ISpiderMatiereItem[] =
        await functions.fecthMatieres(matieresIds);
      const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const { anscol1, codeetab } = paramObj;

      const matieres: IFocusEcoleMatiereItem[] = fullMatieres.map((item) => ({
        ...item,
        anneeScolaire: anscol1,
        codeEtab: codeetab
      }));
      console.log("🚀 ~ file: services.ts ~ line 1069 ~ constmatieres:IFocusEcoleMatiereItem[]=fullMatieres.map ~ matieres", matieres)

      const url = `${FOCUS_ECOLE_SERVER_BASE_URL}/ajouter/matiere`;
      const response: any = await fetchPrivateRoute(url, matieres);

      if (setLog) {
        await functions.setFocusEcoleHistoric(action, matieresIds, 1);
      }
      resolve(response.data);
    } catch (error) {
      Logger.error("Erreur lors de l'envoi matieres");
      if (setLog) {
        const action = "ENVOYER_MATIERE";
        await functions.setFocusEcoleHistoric(action, matieresIds, 0);
      }
      reject(error);
    }
  });
};

/**
 * suprimer des matieres 
 * @param matieresIds 
 * @param setLog 
 * @returns 
 */
export const deleteMatieres = (
  matieresIds: number[] | null = null,
  setLog = true
) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkServiceFocusEcoleActivated();//verifier le service focus ecole activé
      await checkAuthorizedSerialNumber() //verifier le numero serie disque autorisé
      const action = "SUPPRIMER_MATIERE";
      if (!matieresIds) {
        reject("Veuillez indiquer les matieres à supprimer");
      } else {
        if (matieresIds.length === 0) {
          reject("Veuillez indiquer les matieres à supprimer");
        } else {
          const { anscol1, codeetab } = await paramEtabObjet([
            "Anscol1",
            "CodeEtab",
          ]);
          const matieres: any[] = matieresIds.map((idMatiere) => ({
            anneeScolaire: anscol1,
            codeEtab: codeetab,
            refMat: idMatiere,
          }));
          const url = `${FOCUS_ECOLE_SERVER_BASE_URL}/supprimer/matiere`;
          await fetchPrivateRoute(url, matieres);
          if (setLog) {
            await functions.setFocusEcoleHistoric(action, url, 1);
          }
          resolve(true);
        }
      }
    } catch (error) {
      Logger.error("Erreur lors de la suppression matiere chez focus ecole");
      if (setLog) {
        const action = "SUPPRIMER_MATIERE";
        await functions.setFocusEcoleHistoric(action, matieresIds, 0);
      }
      reject(error);
    }
  });
};


/**
 * Envoyer un ou plusieurs versement chez focus ecole
 * @param versementIds
 * @param setLog
 * @returns
 */
export const sendPayments = (
  versementIds: number[] | null = null,
  setLog = true
) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkServiceFocusEcoleActivated();//verifier le service focus ecole activé
      await checkAuthorizedSerialNumber() //verifier le numero serie disque autorisé
      const fullPaiements: any = await functions.fetchPayments(versementIds);

      const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const { anscol1, codeetab } = paramObj;
      const paiements: IFocusEcolePaymentItem[] = fullPaiements.map((item) => ({
        ...item,
        idMoyenPaiement: 1,//la table moyen paiment doit etre créer 
        anneeScolaire: anscol1,
        codeEtab: codeetab,
        datePaiement: moment(item.datePaiement).format("YYYY-MM-DD"),
        dateEnregistrement: moment(item.dateEnregistrement).format("YYYY-MM-DD"),
      }));


      const action = "ENVOYER_VERSEMENT";
      // inserer un ou plusieurs paiement liés à un ou plusieurs versements
      const url = `${FOCUS_ECOLE_SERVER_BASE_URL}/ajouter/versement`;
      const response = await fetchPrivateRoute(url, paiements);

      if (setLog) {
        await functions.setFocusEcoleHistoric(action, versementIds, 1);
      }
      resolve(response);
    } catch (error) {
      console.log(
        "🚀 ~ file: services.ts ~ line 258 ~ returnnewPromise ~ error",
        error
      );
      Logger.error("Erreur lors d'insertion paiements chez focus ecole");
      if (setLog) {
        const action = "ENVOYER_VERSEMENT";
        await functions.setFocusEcoleHistoric(action, versementIds, 0);
      }
      reject(error);
    }
  });
};

/**
 * Supprimer un ou plusieurs paiement chez focus ecole
 * @param versementIds *
 * @param setLog
 * @returns
 */
export const deletePayments = (
  versementIds: number[] | null = null,
  setLog = true
) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkServiceFocusEcoleActivated();//verifier le service focus ecole activé
      await checkAuthorizedSerialNumber() //verifier le numero serie disque autorisé
      const action = "SUPPRIMER_VERSEMENT";
      if (!versementIds) {
        reject("Veuillez indiquer les versements à supprimer");
      } else {
        if (versementIds.length === 0) {
          reject("Veuillez indiquer les versements à supprimer");
        } else {
          const { anscol1, codeetab } = await paramEtabObjet([
            "Anscol1",
            "CodeEtab",
          ]);
          const payments: any[] = versementIds.map((idVersement) => ({
            anneeScolaire: anscol1,
            codeEtab: codeetab,
            idVersement,
          }));
          const url = `${FOCUS_ECOLE_SERVER_BASE_URL}/supprimer/versement`;
          await fetchPrivateRoute(url, payments);
          if (setLog) {
            await functions.setFocusEcoleHistoric(action, url, 1);
          }
          resolve(true);
        }
      }
    } catch (error) {
      Logger.error("Erreur lors de la suppression paiements chez focus ecole");
      if (setLog) {
        const action = "SUPPRIMER_VERSEMENT";
        await functions.setFocusEcoleHistoric(action, versementIds, 0);
      }
      reject(error);
    }
  });
};

/**
 * envoyer la liste des profs par matiere et par classe
 * @param setLog
 * @returns
 */
const sendClassesMatiereProf = (setLog = true) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkServiceFocusEcoleActivated();//verifier le service focus ecole activé
      await checkAuthorizedSerialNumber() //verifier le numero serie disque autorisé
      const fullClassesMatieresProfs = await functions.fetchClassesMatieresProfs();
      const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const { anscol1, codeetab } = paramObj;
      const classesMatieresProfs: IFocusEcoleClassseMatiereProf[] = fullClassesMatieresProfs.map((item) => ({
        ...item,
        anneeScolaire: anscol1,
        codeEtab: codeetab,
      }));
      console.log("🚀 ~ file: services.ts ~ line 1247 ~ constclassesMatieresProfs:ISpiderClassseMatiereProf[]=fullClassesMatieresProfs.map ~ classesMatieresProfs", classesMatieresProfs[0])

      const action = "ENVOYER_CLASSE_MATIERE_PROF";
      // inserer un ou plusieurs paiement liés à un ou plusieurs versements
      const url = `${FOCUS_ECOLE_SERVER_BASE_URL}/ajouter/classematiereprof`;
      const response: any = await fetchPrivateRoute(url, classesMatieresProfs);
      if (setLog) {
        await functions.setFocusEcoleHistoric(action, null, 1);
      }
      resolve(response.data);
    } catch (error) {

      Logger.error("Erreur lors d'envoi classes matiere prof chez focus ecole");
      if (setLog) {
        const action = "ENVOYER_CLASSE_MATIERE_PROF";
        await functions.setFocusEcoleHistoric(action, null, 0);
      }
      reject(error);
    }
  });
};

/**
 * envoyer horaire vers focus ecole
 * @param setLog 0
 * @returns
 */
const sendHoraires = (setLog = true) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkServiceFocusEcoleActivated();//verifier le service focus ecole activé
      await checkAuthorizedSerialNumber() //verifier le numero serie disque autorisé
      const fullHoraires = await functions.fecthHoraires();
      const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const { anscol1, codeetab } = paramObj;
      const horaires: IFocusEcoleHoraireItem[] = fullHoraires.map((item) => ({
        ...item,
        anneeScolaire: anscol1,
        codeEtab: codeetab,
      }));

      const action = "ENVOYER_HORAIRE";
      // inserer un ou plusieurs paiement liés à un ou plusieurs versements
      const url = `${FOCUS_ECOLE_SERVER_BASE_URL}/ajouter/horaire`;
      const response: any = await fetchPrivateRoute(url, horaires);
      if (setLog) {
        await functions.setFocusEcoleHistoric(action, null, 1);
      }
      resolve(response.data);
    } catch (error) {

      Logger.error("Erreur lors d'envoi horaire focus ecole");
      if (setLog) {
        const action = "ENVOYER_HORAIRE";
        await functions.setFocusEcoleHistoric(action, null, 0);
      }
      reject(error);
    }
  });
};

/**
 * Envoyer les seances des emploi de temps programmé vers focus ecoles
 * @param setLog 
 * @returns 
 */
const sendSeances = (setLog = true) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkServiceFocusEcoleActivated();//verifier le service focus ecole activé
      await checkAuthorizedSerialNumber() //verifier le numero serie disque autorisé
      const fullSeances = await functions.fecthSeances();
      const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const { anscol1, codeetab } = paramObj;
      const seances: IFocusEcoleSeanceItem[] = fullSeances.map((item) => ({
        ...item,
        anneeScolaire: anscol1,
        codeEtab: codeetab,
      }));
      console.log("🚀 ~ file: services.ts ~ line 1330 ~ constseances:IFocusEcoleSeanceItem[]=fullSeances.map ~ seances", seances[0])

      const action = "ENVOYER_SEANCE";

      // inserer un ou plusieurs paiement liés à un ou plusieurs versements
      const url = `${FOCUS_ECOLE_SERVER_BASE_URL}/ajouter/seance`;
      const response: any = await fetchPrivateRoute(url, seances);
      if (setLog) {
        await functions.setFocusEcoleHistoric(action, null, 1);
      }
      resolve(response.data);
    } catch (error) {

      Logger.error("Erreur lors de l'envoi seance vers focus ecole");
      if (setLog) {
        const action = "ENVOYER_SEANCE";
        await functions.setFocusEcoleHistoric(action, null, 0);
      }
      reject(error);
    }
  });
};

/**
 * Envoyer les groupes rubriques vers focus ecole
 * @param setLog 
 * @returns 
 */
const sendGroupeRubriques = (setLog = true) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkServiceFocusEcoleActivated();//verifier le service focus ecole activé
      await checkAuthorizedSerialNumber() //verifier le numero serie disque autorisé
      const fullGroupeRubriques = await functions.fecthGroupeRubriques();
      const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const { anscol1, codeetab } = paramObj;
      const groupesRubriques: IFocusEcoleGroupeRubriqueItem[] = fullGroupeRubriques.map((item) => ({
        ...item,
        anneeScolaire: anscol1,
        codeEtab: codeetab,
      }));
      console.log("🚀 ~ file: services.ts ~ line 1834 ~ constgroupesRubriques:IFocusEcoleGroupeRubriqueItem[]=fullGroupeRubriques.map ~ groupesRubriques", groupesRubriques)

      const action = "ENVOYER_GROUPE_RUBRIQUE";

      const url = `${FOCUS_ECOLE_SERVER_BASE_URL}/ajouter/grouperubrique`;
      const response: any = await fetchPrivateRoute(url, groupesRubriques);
      if (setLog) {
        await functions.setFocusEcoleHistoric(action, null, 1);
      }
      resolve(response.data);
    } catch (error) {

      Logger.error("Erreur lors de l'envoi groupe rubrique vers focus ecole");
      if (setLog) {
        const action = "ENVOYER_GROUPE_RUBRIQUE";
        await functions.setFocusEcoleHistoric(action, null, 0);
      }
      reject(error);
    }
  });
};

/**
 * envoyer les rubriques vers fcus ecoele
 * @param setLog 
 * @returns 
 */
const sendRubriques = (rubriqueIds: number[] | null = null, setLog = true) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkServiceFocusEcoleActivated();//verifier le service focus ecole activé
      await checkAuthorizedSerialNumber() //verifier le numero serie disque autorisé
      const fullRubriques = await functions.fecthRubriques(rubriqueIds);
      const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const { anscol1, codeetab } = paramObj;
      const rubriques: IFocusEcoleIRubriqueItem[] = fullRubriques.map((item) => ({
        ...item,
        anneeScolaire: anscol1,
        codeEtab: codeetab,
      }));
      console.log("🚀 ~ file: services.ts ~ line 1874 ~ construbriques:IFocusEcoleIRubriqueItem[]=fullRubriques.map ~ rubriques", rubriques)

      const action = "ENVOYER_RUBRIQUE";

      const url = `${FOCUS_ECOLE_SERVER_BASE_URL}/ajouter/rubrique`;
      const response: any = await fetchPrivateRoute(url, rubriques);
      if (setLog) {
        await functions.setFocusEcoleHistoric(action, null, 1);
      }
      resolve(response.data);
    } catch (error) {

      Logger.error("Erreur lors de l'envoi rubrique vers focus ecole");
      if (setLog) {
        const action = "ENVOYER_RUBRIQUE";
        await functions.setFocusEcoleHistoric(action, null, 0);
      }
      reject(error);
    }
  });
};

/**
 * Envoyer les libelles des echeances vers focus ecole
 * @param setLog 
 * @returns 
 */
const sendLibelleEcheances = (setLog = true) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkServiceFocusEcoleActivated();//verifier le service focus ecole activé
      await checkAuthorizedSerialNumber() //verifier le numero serie disque autorisé
      const fullLibelleEcheances = await functions.fecthLibelleEcheances();
      const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const { anscol1, codeetab } = paramObj;
      const libelleEcheances: IFocusEcoleLibelleEcheanceItem[] = fullLibelleEcheances.map((item) => ({
        ...item,
        anneeScolaire: anscol1,
        codeEtab: codeetab,
      }));

      const action = "ENVOYER_LIBELLE_ECHEANCE";

      const url = `${FOCUS_ECOLE_SERVER_BASE_URL}/ajouter/libelleecheance`;
      const response: any = await fetchPrivateRoute(url, libelleEcheances);
      if (setLog) {
        await functions.setFocusEcoleHistoric(action, null, 1);
      }
      resolve(response.data);
    } catch (error) {

      Logger.error("Erreur lors de l'envoi libelle echeance vers focus ecole");
      if (setLog) {
        const action = "ENVOYER_LIBELLE_ECHEANCE";
        await functions.setFocusEcoleHistoric(action, null, 0);
      }
      reject(error);
    }
  });
};



/**
 * Envoyer plages horaires vers focus ecole
 * @param setLog
 * @returns
 */
const sendPlageHoraires = (setLog = true) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkServiceFocusEcoleActivated();//verifier le service focus ecole activé
      await checkAuthorizedSerialNumber() //verifier le numero serie disque autorisé
      const fullPlagesHoraires: ISpiderPlageHoraireItem[] = await functions.fecthPlageHoraires();
      const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const { anscol1, codeetab } = paramObj;
      const plagesHoraires: IFocusEcolePlageHoraireItem[] =
        fullPlagesHoraires.map((item) => ({
          ...item,
          anneeScolaire: anscol1,
          codeEtab: codeetab,
          debut: moment(item.debut).format("HH:mm"),
          fin: moment(item.fin).format("HH:mm"),
        }));

      const action = "ENVOYER_PLAGE_HORAIRE";
      // inserer un ou plusieurs paiement liés à un ou plusieurs versements
      const url = `${FOCUS_ECOLE_SERVER_BASE_URL}/ajouter/plagehoraire`;
      const response: any = await fetchPrivateRoute(url, plagesHoraires);
      if (setLog) {
        await functions.setFocusEcoleHistoric(action, null, 1);
      }
      resolve(response.data);
    } catch (error) {
      Logger.error("Erreur lors d'envoi plage horaire focus ecole");
      if (setLog) {
        const action = "ENVOYER_PLAGE_HORAIRE";
        await functions.setFocusEcoleHistoric(action, null, 0);
      }
      reject(error);
    }
  });
};

/**
 * Supprimer un ou plusiuers eleves vers focus ecole
 * @param studentIds
 * @param setLog
 * @returns
 */
export const deleteStudents = (studentIds: number[] | null, setLog = true) => {
  return new Promise(async (resolve, reject) => {
    try {

      await checkServiceFocusEcoleActivated();//verifier le service focus ecole activé
      await checkAuthorizedSerialNumber() //verifier le numero serie disque autorisé
      const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const { anscol1, codeetab } = paramObj;

      const students: any[] = studentIds.map((idEleve) => ({
        anneeScolaire: anscol1,
        codeEtab: codeetab,
        idEleve: idEleve,
      }));

      const action = "SUPPRIMER_ELEVE";
      if (students.length === 0) {
        // aucun eleve trouve
        if (setLog) {
          await functions.setFocusEcoleHistoric(action, studentIds, 0);
        }
        reject("Aucun eleve n'a été trouvé");
      } else {
        //suppression un ou plusieurs eleves
        const url = `${FOCUS_ECOLE_SERVER_BASE_URL}/supprimer/eleve`;
        //   const response = await axios.post(url, students);
        const response: any = await fetchPrivateRoute(url, students)
        if (setLog) {
          await functions.setFocusEcoleHistoric(action, studentIds, 1);
        }
        resolve(response);
      }
    } catch (error) {
      Logger.error("Erreur de la suppression élève chez focus ecole");
      if (setLog) {
        const action = "SUPPRIMER_ELEVE";
        await functions.setFocusEcoleHistoric(action, studentIds, 0);
      }
      reject(error);
    }
  });
};

/**
 * Obtenir tous les logs de focus ecole
 * @returns
 */
export const getLogs = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkServiceFocusEcoleActivated();//verifier le service focus ecole activé
      await checkAuthorizedSerialNumber() //verifier le numero serie disque autorisé
      const logs = await functions.fetchLogs();
      resolve(logs);
    } catch (error) {
      Logger.error("Erreur de la recuperation des logs gain technologie");
      reject(error);
    }
  });
};

/**
 * Fetcher les echeranciers individuel d'un ou plusieurs eleves
 * studentIds: number[] | null
 */
export const fetchStudentsEcheanchiers = (studentIds: number[] | null) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkServiceFocusEcoleActivated();//verifier le service focus ecole activé
      await checkAuthorizedSerialNumber() //verifier le numero serie disque autorisé
      const fullEcheanciers = await functions.fetchIndividualEcheancier(studentIds);

      const { anscol1, codeetab } = await paramEtabObjet([
        "Anscol1",
        "CodeEtab",
      ]);
      const echeanciers: IFocusEcoleEcheancierItem[] = fullEcheanciers.map(
        (item) => ({
          ...item,
          anneeScolaire: anscol1,
          codeEtab: codeetab,
          dateLimitePeriode: moment(item.dateLimitePeriode).format("YYYY-MM-DD"),
        })
      );

      resolve(echeanciers);
    } catch (error) {
      Logger.error("Erreur de la recuperation des logs gain technologie");
      reject(error);
    }
  });
};


/**
 * envoyer messages spider vers focus ecole 
 * @param req 
 * @param res 
 */
export const sendMessages = (fakeMessageData: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkServiceFocusEcoleActivated();//verifier le service focus ecole activé
      await checkAuthorizedSerialNumber() //verifier le numero serie disque autorisé
      // const fullEcheanciers = await functions.fetchIndividualEcheancier(studentIds);
      const { anscol1, codeetab } = await paramEtabObjet([
        "Anscol1",
        "CodeEtab",
      ]);

      const fakeMessages: any = {
        idTag: 1,
        idNiveauAlert: 1,
        anneeScolaire: anscol1,
        codeEtab: codeetab,
        titre: "Fete de fin d'année",
        contenu: ""
      }
      console.log("🚀 ~ file: services.ts ~ line 1511 ~ returnnewPromise ~ fakeMessages", fakeMessages)

      // );

      // const url = `${FOCUS_ECOLE_SERVER_BASE_URL}/ajouter/echeancier`;
      // const response = await fetchPrivateRoute(url, fakeMessageData);

      // if (setLog) {
      //   await functions.setFocusEcoleHistoric(action, elevesIds, 1);
      // }
      resolve(true);
    } catch (error) {
      Logger.error("Erreur de la recuperation des logs gain technologie");
      reject(error);
    }
  });
};


/**
 *  fetcher en ligne les souscriptions aux rubriques optionnelle pas encore recuprer par spider 
 * @returns 
 */
export const focusNotRecoveredRubricoptionalSubscribed = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkServiceFocusEcoleActivated();//verifier le service focus ecole activé
      await checkAuthorizedSerialNumber() //verifier le numero serie disque autorisé

      const { anscol1, codeetab } = await paramEtabObjet([
        "Anscol1",
        "CodeEtab",
      ]);
      const apiPayload = { anneeScolaire: anscol1, codeEtab: codeetab }

      const apiUrl = `${FOCUS_ECOLE_SERVER_BASE_URL}/souscription/rubrique/optionnelle/enattente`;
      const result: any = await fetchPrivateRoute(apiUrl, apiPayload)

      if (result.status === 1) {
        console.log("result.data.", result.data)
        if (result.data.length > 0) {
          const rubricSubscribed = result.data.map(item => ({ idEleve: item.idEleve, idRubriqueOptionnelGlobal: item.idRubriqueOptionnelGlobal }))

          // await Promise.all(result.data.map(async item => {
          //   await financeEcheanciersServices.souscriptionRubriqueOptionnel({ idEleve: item.idEleve, idRubriqueOptionnelGlobal: item.idRubriqueOptionnelGlobal })
          // }))
        }
        resolve(result.data)
      } else {
        reject(false)
      }
      resolve(result.data)
    } catch (error) {
      Logger.error("Erreur de la recuperation des logs cinetpay");
      reject(error);
    }
  });
};

/**
 * marque comme recupperé les rubriques souscrite qui etait en attente de reccuperation
 * @param eleveRubriqueOptionnelGlobal 
 * @returns 
 */
export const focusSetNotRecoveredRubricoptionalSubscribedAsRecovered = (eleveRubriqueOptionnelGlobal: { idEleve: number, idRubriqueOptionnelGlobal: number }[]): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { anscol1, codeetab } = await paramEtabObjet([
        "Anscol1",
        "CodeEtab",
      ]);
      const data = eleveRubriqueOptionnelGlobal.map(item => ({
        ...item,
        anneeScolaire: anscol1,
        codeEtab: codeetab,
      }))
      const url = `${FOCUS_ECOLE_SERVER_BASE_URL}/souscription/rubrique/optionnelle/recupere`;
      fetchPrivateRoute(url, data);
      resolve(true)
    } catch (error) {
      Logger.error("Erreur de la recuperation des logs cinetpay");
      reject(error);
    }
  });
};


export default {
  initializeService,
  sendParamEtab,
  getLogs,
  sendStudents,
  deleteStudents,
  sendClasses,
  deleteClasse,
  sendPayments,
  deletePayments,
  sendIndividualEcheanciers,
  fetchStudentsEcheanchiers,
  resendFailedAction,
  activateDeactivateService,
  sendPersonnel,
  deletePersonnel,
  sendEvaluationNotes,
  deleteEvalNotes,
  sendSalles,
  deleteRooms,
  sendEvalProg,
  deleteEvalProg,
  sendPlageHoraires,
  sendHoraires,
  sendClassesMatiereProf,
  sendMessages,
  sendLibelleEcheances,
  sendGroupeRubriques,
  sendRubriques,
  sendEcheancierObligatoirelGlobal,
  sendEcheancierOptionnelGlobal,
  focusNotRecoveredRubricoptionalSubscribed,
  focusSetNotRecoveredRubricoptionalSubscribedAsRecovered,
  sendSouscriptionFraisRubriqueOptionnel,
  sendVersement
};
