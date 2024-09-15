import { FOCUS_ECOLE_SERV_ID } from './../spider-partenaires/focus-ecole/constants';
import Logger from "../helpers/logger";
import functions from "./functions";
import functionsVba from "./functions-vba";
import photoshareService from "../spider-photo-share/services"
const Json2csvParser = require("json2csv").Parser;
const archiver = require('archiver');
const uuid = require("uuid")
const downloadDir = `C:/SPIDER/spd_save_tmp`
const FormData = require('form-data');
var _ = require('lodash');

import {
  IActivateDeactivateService,
  IFocusEcoleClasseItem,
  IClassseMatiereProf,
  IFocusEcoleDetailsVersementRubriqueObligatoireItemItem,
  IFocusEcoleDetailsVersementRubriqueOptionnelItem,
  IFocusEcoleEcheancierIndividuelItem,
  IFocusEcoleEcheancierItem,
  IFocusEcoleEcheancierPersonnelEleveRubriqueItem,
  IFocusEcoleEcheancierRubriqueOptionnelItem,
  IFocusEcoleEcheancierTypeClasseRubriqueObligatoireItem,
  IFocusEcoleEleveRubriqueItem,
  IFocusEcoleEvaluationNoteItem,
  IFocusEcoleEvaluationProgrammationItem,
  IFocusEcoleHoraireItem,
  IFocusEcoleIRubriqueItem,
  IFocusEcoleISpiderVersementItem,
  IFocusEcoleMatiereItem,
  IFocusEcoleOptionTypeClasseRubriqueObligatoireItem,
  IFocusEcolePaymentItem,
  IFocusEcolePersonnelItem,
  IFocusEcolePlageHoraireItem,
  IFocusEcoleRubriqueOptionnelGlobalItem,
  IFocusEcoleSalleItem,
  IFocusEcoleSeanceItem,
  IFocusEcoleSouscriptionFraisOptionnelItem,
  IFocusEcoleStudentItem,
  IFocusEcoleTypeClasseRubriqueObligatoireItem,
  IPartner, IService, ISpiderClassseItem, ISpiderMatiereItem, ISpiderPersonnelItem, ISpiderPlageHoraireItem, ISpiderSalleItem, IParentContact, ISpiderEcheancierItem, IMoyenneItem, IMoyenneMatiere, IMoyenneGeneral
} from "./interfaces";

import { paramEtabObjet } from "../databases/accessDB";
import { servicesConfig } from "../globalVariables";
import { getFileToBase64, merge2ArraysOfObjects, sleep } from "../helpers/function";
import { WAREHOUSE_DESCRIPTION, WAREHOUSE_LIBELLE, WAREHOUSE_PART_ID, WAREHOUSE_SERV_ID } from "./constants";
import { WHSERVER_BASE_URL } from "./constants";
import { fetchPrivateRoute, fetchPublicRoute } from "../helpers/apiClient";
import moment from "moment";
import axios from "axios";
import { getConfig } from '../databases/sqliteVbaConfigDb';
import redisFunctions from "../databases/redis/functions";
import { IWarehouseConfig } from '../helpers/interfaces';
import { openTunnel } from '../tunnel';
import { cacheControleFraisScolaire } from '../databases/redis/redis-cache';
// import schoolControlFunction from "../spider-school-control/functions";
import schoolControlServices from "../spider-school-control/services";

var fs = require("fs");
const fse = require("fs-extra")

// register format for archiver
// note: only do it once per Node.js process/application, as duplicate registration will throw an error
// archiver.registerFormat('zip-encrypted', require("archiver-zip-encrypted"));
const zipPwd = "@profEx2021"

/**
 * Obtenir le warehouse config en ligne
 * @returns 
 */
const getOnlineActivationStatus = () => {
  return new Promise<{ hddserialnumber: string }>(async (resolve, reject) => {
    try {
      const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const url = `${WHSERVER_BASE_URL}/warehouseserviceconfig`;
      const payload = { anneeScolaire: anscol1, codeEtab: codeetab }
      const response: any = await fetchPrivateRoute(url, payload)
      resolve(response.data)
    } catch (error) {
      return reject({ name: "ONLINE_ACTIVATION_STATUS_CHECK_ERROR", message: "Impossible de vérifier l'état d'activation en ligne. Veuillez vérifier votre connexion internet et réessayer" })
    }
  });
}

export const getOnlineWhConfig = () => {
  return new Promise<{ hddserialnumber: string }>(async (resolve, reject) => {
    try {
      const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const url = `${WHSERVER_BASE_URL}/getwarehouseconfig`;
      const payload = { anneeScolaire: anscol1, codeEtab: codeetab }
      const response: any = await fetchPrivateRoute(url, payload)
      resolve(response.data)
    } catch (error) {
      return reject({ name: "ONLINE_GET_WHCONFIG_ERROR", message: "Impossible de récuperer la configuration warehouse en ligne. Veuillez vérifier votre connexion internet et réessayer" })
    }
  });
}


/**
 * Verifier si le service warehouse est activé et le numero disque dur est autorisé
 * @returns
 */
export const checkWarehouseActivatedAndAuthorizedHddSerialNumber = (): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const currentPcHDDSerialNumber = await redisFunctions.getGlobalVariable("currentPcHDDSerialNumber");
      const warehouseConfig = await redisFunctions.getGlobalVariable("warehouseConfig") as IWarehouseConfig;

      //Check le status d'activation du warehouse en local
      if (!warehouseConfig) return reject({ name: "WAREHOUSE_NOT_ACTIVATED", message: "web services non activé" })
      if (warehouseConfig.hddserialnumber !== currentPcHDDSerialNumber) return reject({ name: "WAREHOUSE_BAD_COMPUTER", message: "Opération non autorisée sur cet ordinateur" })

      //Check le status d'activation du warehouse en ligne
      const whOnlineConfig = await getOnlineActivationStatus();
      if (whOnlineConfig.hddserialnumber !== currentPcHDDSerialNumber) return reject({ name: "WAREHOUSE_BAD_COMPUTER", message: "Opération non autorisée sur cet ordinateur" })

      resolve(true)
    } catch (error) {
      console.log("🚀 ~ returnnewPromise ~ error:", error)
      reject(error);
    }
  });
};

/**
 * activer le warehouse
 * @returns 
 */
export const activateWarehouse = (io) => {
  return new Promise(async (resolve, reject) => {
    try {
      const whLocalConfig = await redisFunctions.getGlobalVariable("warehouseConfig") as IWarehouseConfig;
      const whOnlineConfig = await getOnlineWhConfig();
      const currentPcHDDSerialNumber = await redisFunctions.getGlobalVariable("currentPcHDDSerialNumber");

      if ((whLocalConfig && whLocalConfig.hddserialnumber === currentPcHDDSerialNumber) &&
        (whOnlineConfig.hddserialnumber && whOnlineConfig.hddserialnumber === currentPcHDDSerialNumber) &&
        (whLocalConfig && whLocalConfig.hddserialnumber === whOnlineConfig.hddserialnumber && whOnlineConfig.hddserialnumber)) return reject({ name: "WAREHOUSE_ALREADY_ACTIVATED", message: "web services est déjà activé" })

      //activer en ligne
      const action = "activate"
      const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const apiPayload = { anneeScolaire: anscol1, codeEtab: codeetab, action, hddserialnumber: currentPcHDDSerialNumber }
      const apiUrl = `${WHSERVER_BASE_URL}/activerdesactiverservice`;
      await fetchPrivateRoute(apiUrl, apiPayload)
      //activer en local
      const warehouseConfig = { anneeScolaire: anscol1, codeEtab: codeetab, hddserialnumber: currentPcHDDSerialNumber } as IWarehouseConfig
      const currentAllWarehouseConfig = await redisFunctions.getGlobalVariable("allWarehouseConfig") as IWarehouseConfig[];
      const index = currentAllWarehouseConfig.findIndex(item => item.anneeScolaire === anscol1 && item.codeEtab === codeetab);
      if (index > -1) {
        currentAllWarehouseConfig.splice(index, 1, warehouseConfig)
      } else {
        currentAllWarehouseConfig.push(warehouseConfig)
      }
      await functions.updateWarehouseConfig(currentAllWarehouseConfig)
      await redisFunctions.addGlobalVariable("warehouseConfig", warehouseConfig);
      await redisFunctions.addGlobalVariable("allWarehouseConfig", currentAllWarehouseConfig);

      //relancer le tunnnel
      openTunnel(io)
        .then((remoteHostname) => { })
        .catch((error) => {
          Logger.error(`app.ts:125 ~ openTunnel ~ error:", ${error}`)
        })
      resolve(true)
    } catch (error) {
      console.log("🚀 ~ file: services.ts:159 ~ returnnewPromise ~ error:", error)
      reject(
        {
          name: "ONLINE_ACTIVATION_STATUS_CHECK_ERROR",
          message: "Impossible de vérifier l'état d'activation en ligne. Veuillez vérifier votre connexion internet et réessayer"
        }
      )
    }
  });
};

/**
 * desactiver le warehouse
 * @returns 
 */
export const deactivateWarehouse = () => {
  return new Promise(async (resolve, reject) => {
    try {

      const { anscol1, codeetab } = await paramEtabObjet([
        "Anscol1",
        "CodeEtab",
      ]);
      const action = "deactivate";
      const currentPcHDDSerialNumber = await redisFunctions.getGlobalVariable("currentPcHDDSerialNumber");
      //desactiver le service warehouse en ligne
      const apiPayload = { codeEtab: codeetab, anneeScolaire: anscol1, action, hddserialnumber: currentPcHDDSerialNumber }
      const apiUrl = `${WHSERVER_BASE_URL}/activerdesactiverservice`;
      await fetchPrivateRoute(apiUrl, apiPayload)

      //desactivier le service en local
      const currentAllWarehouseConfig = await redisFunctions.getGlobalVariable("allWarehouseConfig") as IWarehouseConfig[];
      const allWarehouseConfig = currentAllWarehouseConfig.filter(item => (item.anneeScolaire !== anscol1 && item.codeEtab !== codeetab))

      await functions.updateWarehouseConfig(allWarehouseConfig)
      await redisFunctions.addGlobalVariable("warehouseConfig", null);
      await redisFunctions.addGlobalVariable("allWarehouseConfig", allWarehouseConfig);
      resolve(true)
    } catch (error) {
      reject(error);
    }
  });
};


/**
 * Initialiser les données en lignes
 */
export const initializeData = (io, sections) => {
  console.log("🚀 ~ file: services.ts:216 ~ initializeData ~ sections:", sections)
  return new Promise(async (resolve, reject) => {
    try {
      if (sections.includes("photoeleve")) {
        try {
          io.emit(
            "initialize service",
            {
              message: "Initialisation photos eleves en cours …",
              status: 2,
              section: "photoeleve",
            }
          );
          await photoshareService.sendStudentsPhotos();
          // await photoshareService.sendStudentsPhotosZip();
          io.emit(
            "initialize service",
            {
              message: "Initialisation photos eleves terminée",
              status: 1,
              section: "photoeleve",
            }
          );
          sleep(500);
        } catch (error) {
          io.emit(
            "initialize service",
            {
              message: "Initialisation photos eleves échouée",
              status: 0,
              section: "photoeleve",
              error: error
            }
          );
        }
      }

      if (sections.includes("parametab")) {
        try {
          io.emit(
            "initialize service",
            {
              message: "Initialisation params etab  en cours …",
              status: 2,
              section: "parametab",
            }
          );
          await envoyerParamEtab();
          io.emit(
            "initialize service",
            {
              message: "Initialisation params etab terminée",
              status: 1,
              section: "parametab",
            }
          );
          sleep(500);
        } catch (error) {
          io.emit(
            "initialize service",
            {
              message: "Initialisation params etab  échouée …",
              status: 0,
              section: "parametab",
              error

            }
          );
        }
      }

      if (sections.includes("matiere")) {
        try {
          io.emit(
            "initialize service",
            {
              message: "Initialisation matieres en cours …",
              status: 2,
              section: "matiere",
            }
          );
          await sendMatieres();
          await functions.setWarehouseLogsGroupActionSuccess("matiere");
          io.emit(
            "initialize service",
            {
              message: "Initialisation matieres terminée",
              status: 1,
              section: "matiere",
            }
          );
        } catch (error) {
          io.emit(
            "initialize service",
            {
              message: "Initialisation matieres échouée …",
              status: 0,
              section: "matiere",
            }
          );
        }
        sleep(500);
      }

      if (sections.includes("salle")) {
        io.emit(
          "initialize service",
          {
            message: "Initialisation salles en cours …",
            status: 2,
            section: "salle",
          }
        );
        await sendSalles();
        await functions.setWarehouseLogsGroupActionSuccess("salle");
        io.emit(
          "initialize service",
          {
            message: "Initialisation salles  terminée",
            status: 1,
            section: "salle",
          }
        );
        sleep(500);
      }

      // envoi de evalprog evalnote en une seule fois
      if (sections.includes("evalprog evalnote")) {
        try {
          io.emit(
            "initialize service",
            {
              message: "Initialisation des evaluations en cours…",
              status: 2,
              section: "evalprog evalnote",
            }
          );
          // programmations
          await sendEvalProg();
          await functions.setWarehouseLogsGroupActionSuccess("evalprog");

          // évaluations
          await sendEvaluationNotes();
          await functions.setWarehouseLogsGroupActionSuccess("evalnote");
          io.emit(
            "initialize service",
            {
              message: "Initialisation des evaluations terminée",
              status: 1,
              section: "evalprog evalnote",
            }
          );
          sleep(500);
        } catch (error) {
          io.emit(
            "initialize service",
            {
              message: "Initialisation des evaluations terminée",
              status: 0,
              section: "evalprog evalnote",
            }
          );
        }

      }

      if (sections.includes("evalnote")) {
        io.emit(
          "initialize service",
          {
            message: "Initialisation notes evaluations en cours …",
            status: 2,
            section: "evalnote",
          }
        );
        await sendEvaluationNotes();
        await functions.setWarehouseLogsGroupActionSuccess("evalnote");
        io.emit(
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
        io.emit(
          "initialize service",
          {
            message: "Initialisation notes evaluations en cours …",
            status: 2,
            section: "evalprog",
          }
        );
        await sendEvalProg();
        await functions.setWarehouseLogsGroupActionSuccess("evalprog");
        io.emit(
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
        try {
          io.emit(
            "initialize service",
            {
              message: "Initialisation personnel en cours …",
              status: 2,
              section: "personnel",
            }
          );
          await sendPersonnel();
          await functions.setWarehouseLogsGroupActionSuccess("personnel");
          io.emit(
            "initialize service",
            {
              message: "Initialisation personnel terminée",
              status: 1,
              section: "personnel",
            }
          );
          sleep(500);
        } catch (error) {
          io.emit(
            "initialize service",
            {
              message: "Initialisation personnel échouée",
              status: 0,
              section: "personnel",
            }
          );
        }
      }

      if (sections.includes("plagehoraire")) {
        try {
          io.emit(
            "initialize service",
            {
              message: "Initialisation plage horaires en cours …",
              status: 2,
              section: "plagehoraire",
            }
          );
          await sendPlageHoraires();
          await functions.setWarehouseLogsGroupActionSuccess("plagehoraire");
          io.emit(
            "initialize service",
            {
              message: "Initialisation plage horaires terminée",
              status: 1,
              section: "plagehoraire",
            }
          );
          sleep(500);
        } catch (error) {
          io.emit(
            "initialize service",
            {
              message: "Initialisation plage horaires échouée",
              status: 0,
              section: "plagehoraire",
            }
          );
        }
      }

      if (sections.includes("horaire")) {
        io.emit(
          "initialize service",
          {
            message: "Initialisation horaires en cours …",
            status: 2,
            section: "horaire",
          }
        );
        await sendHoraires();
        await functions.setWarehouseLogsGroupActionSuccess("horaire");
        io.emit(
          "initialize service",
          {
            message: "Initialisation horaires terminée",
            status: 1,
            section: "horaire",
          }
        );
        sleep(500);
      }

      if (sections.includes("modeleplagehoraire")) {
        io.emit(
          "initialize service",
          {
            message: "Initialisation modèle plage horaires en cours …",
            status: 2,
            section: "modeleplagehoraire",
          }
        );
        await sendModelePlageHoraires();
        await functions.setWarehouseLogsGroupActionSuccess("modeleplagehoraire");
        io.emit(
          "initialize service",
          {
            message: "Initialisation modèle plage horaires terminée",
            status: 1,
            section: "horaire",
          }
        );
        sleep(500);
      }

      if (sections.includes("classematiereprof")) {
        try {
          io.emit(
            "initialize service",
            {
              message: "Initialisation des classes matiere prof en cours …",
              status: 2,
              section: "classematiereprof",
            }
          );
          await envoyerClassesMatiereProf();
          await functions.setWarehouseLogsGroupActionSuccess("classematiereprof");
          io.emit(
            "initialize service",
            {
              message: "Initialisation des classes matiere prof terminée",
              status: 1,
              section: "classematiereprof",
            }
          );
          sleep(500);
        } catch (error) {
          io.emit(
            "initialize service",
            {
              message: "Initialisation des classes matiere prof échouée",
              status: 0,
              section: "classematiereprof",
            }
          );
        }
      }

      if (sections.includes("classe")) {
        try {
          io.emit(
            "initialize service",
            {
              message: "Initialisation des classes en cours …",
              status: 2,
              section: "classe",
            }
          );
          await envoyerClasses();
          await functions.setWarehouseLogsGroupActionSuccess("classe");
          io.emit(
            "initialize service",
            {
              message: "Initialisation des classes terminée",
              status: 1,
              section: "classe",
            }
          );
          sleep(500);
        } catch (error) {
          io.emit(
            "initialize service",
            {
              message: "Initialisation des classes échouée",
              status: 0,
              section: "classe",
            }
          );
        }
      }

      if (sections.includes("eleve")) {
        try {
          io.emit(
            "initialize service",
            {
              message: "Initialisation des élèves en cours …",
              status: 2,
              section: "eleve",
            }
          );
          await envoyerEleves();
          await functions.setWarehouseLogsGroupActionSuccess("eleve");
          io.emit(
            "initialize service",
            {
              message: "Initialisation des élèves terminée",
              status: 1,
              section: "eleve",
            }
          );
          sleep(500);
        } catch (error) {
          io.emit(
            "initialize service",
            {
              message: "Initialisation des élèves échouée",
              status: 0,
              section: "eleve",
            }
          );
        }
      }

      // if (sections.includes("echindividuel")) {
      //   io.emit(
      //     "initialize service",
      //     {
      //       message: "Initialisation échéanciers individuel en cours …",
      //       status: 2,
      //       section: "echindividuel",
      //     }
      //   );
      //   await envoyerEcheancierIndividuel(); //envoyer le contenu de la table echeancier individuel
      //   await functions.setWarehouseLogsGroupActionSuccess("echindividuel");
      //   io.emit(
      //     "initialize service",
      //     {
      //       message: "Initialisation échéanciers individuel terminée",
      //       status: 1,
      //       section: "echindividuel",
      //     }
      //   );
      //   sleep(500);
      // }

      if (sections.includes("versement")) {
        try {
          io.emit(
            "initialize service",
            {
              message: "Initialisation des versements en cours …",
              status: 2,
              section: "versement",
            }
          );
          await envoyerVersement();
          await functions.setWarehouseLogsGroupActionSuccess("versement");
          io.emit(
            "initialize service",
            {
              message: "Initialisation des versements terminés",
              status: 1,
              section: "versement",
            }
          );
        } catch (error) {
          io.emit(
            "initialize service",
            {
              message: "Initialisation des versements échouée",
              status: 0,
              section: "versement",
            }
          );
        }
      }

      if (sections.includes("planning")) {
        try {
          io.emit(
            "initialize service",
            {
              message: "Initialisation planning en cours …",
              status: 2,
              section: "planning",
            }
          );
          await sendPlanning();
          await functions.setWarehouseLogsGroupActionSuccess("planning");
          io.emit(
            "initialize service",
            {
              message: "Initialisation planning terminés",
              status: 1,
              section: "planning",
            }
          );
        } catch (error) {
          io.emit(
            "initialize service",
            {
              message: "Initialisation planning échouée",
              status: 0,
              section: "planning",
            }
          );
        }
      }

      if (sections.includes("seance")) {
        io.emit(
          "initialize service",
          {
            message: "Initialisation seances en cours …",
            status: 1,
            section: "seances",
          }
        );
        await sendSeances();
        await functions.setWarehouseLogsGroupActionSuccess("seances");
        io.emit(
          "initialize service",
          {
            message: "Initialisation des seances terminés",
            status: 2,
            section: "seances",
          }
        );
      }

      if (sections.includes("rubrique")) {
        io.emit(
          "initialize service",
          {
            message: "Initialisation rubrique en cours …",
            status: 1,
            section: "rubrique",
          }
        );
        await sendRubriques();
        await functions.setWarehouseLogsGroupActionSuccess("rubrique");
        io.emit(
          "initialize service",
          {
            message: "Initialisation des rubrique terminés",
            status: 2,
            section: "rubrique",
          }
        );
      }
      if (sections.includes("echobligatoireglobal")) {
        io.emit(
          "initialize service",
          {
            message: "Initialisation echeancier  obligatoire globale en cours …",
            status: 1,
            section: "echobligatoireglobal",
          }
        );
        await sendEcheancierObligatoirelGlobal();
        await functions.setWarehouseLogsGroupActionSuccess("echobligatoireglobal");
        io.emit(
          "initialize service",
          {
            message: "Initialisation echeancier obligatoire global terminés",
            status: 2,
            section: "echobligatoireglobal",
          }
        );
      }

      if (sections.includes("echoptionnelglobal")) {
        io.emit(
          "initialize service",
          {
            message: "Initialisation echeancier  optionnel globale en cours …",
            status: 1,
            section: "echoptionnelglobal",
          }
        );
        await sendEcheancierOptionnelGlobal();
        await functions.setWarehouseLogsGroupActionSuccess("echoptionnelglobal");
        io.emit(
          "initialize service",
          {
            message: "Initialisation echeancier optionnel global terminés",
            status: 2,
            section: "echoptionnelglobal",
          }
        );
      }

      if (sections.includes("echpersonnel")) {
        io.emit(
          "initialize service",
          {
            message: "Initialisation échéanciers personnel en cours …",
            status: 2,
            section: "echpersonnel",
          }
        );
        await sendEleveEcheancierPersonnel() //envoyer les rubrique personnalisé pour ce eleve

        await functions.setWarehouseLogsGroupActionSuccess("echpersonnel");
        io.emit(
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
        io.emit(
          "initialize service",
          {
            message: "Initialisation sosucription frais optionel en cours …",
            status: 1,
            section: "souscriptionfraisoptionel",
          }
        );
        await sendSouscriptionFraisRubriqueOptionnel();
        await functions.setWarehouseLogsGroupActionSuccess("souscriptionfraisoptionel");
        io.emit(
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
      console.log("🚀 ~ file: services.ts:850 ~ returnnewPromise ~ error:", error)

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
      /* fin fetcher les echeancier des  rubriques optionnelle */

      //envoyer les données rubriques personnalisé et echeances vers focus ecole
      const url1 = `${WHSERVER_BASE_URL}/ajouter/rubriqueoptionnelglobal`;
      const url2 = `${WHSERVER_BASE_URL}/ajouter/echeancierrubriqueoptionnelglobal`;
      await fetchPrivateRoute(url1, rubriqueOptionnelGlobal);
      await fetchPrivateRoute(url2, echeancierRubriqueOptionnel);

      if (setLog) {
        await functions.insertWhserverLog(action, null, 1);
      }
      resolve(true);
    } catch (error) {
      if (setLog) {
        const action = "ENVOYER_ECHEANCIER_OPTIONNEL_GLOBAL";
        await functions.insertWhserverLog(action, null, 0);
      }
      reject(error);
    }
  });
};


/**
 * Enoyer les params de l'etablissement vers focus ecoles
 * @returns 
 */
export const envoyerParamEtab = (param: string = null, setLog = true) => {
  return new Promise(async (resolve, reject) => {
    try {

      const { configObject, paramEtabObject } = await getConfig() as any;

      await redisFunctions.addGlobalVariable("accessConfig", configObject);
      await redisFunctions.addGlobalVariable("paramEtab", paramEtabObject);

      //liste des des param qui necessite renvoi des données en lignes
      const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab", "AnScol2", "BPEtab", "DRENComplet",
        "DRENouDDEN", "DREN", "Fondateur", "NomChefEtab", "NomCompletEtab", "NomEtabAbr", "TélChefEtab",
        "TélCorrespondant", "TelEtab", "TélFondateur", "method_calc_eval", "DecoupSemestres", "mode_calc_moy_period", "Nom_CE_prim", "coef_test_lourd"]);
      const { anscol1, codeetab } = paramObj;

      //on vient de mettre ajour un param etab, et ce param ne fait pas parti des param qui necessite renvoi des données en lignes
      if (param && !paramObj.hasOwnProperty(param.toLowerCase())) {
        return resolve(true);
      }
      // logo
      const file = `C:/SPIDER/Ressources/${codeetab}_logo.jpg`;
      const logoBase64 = fs.existsSync(file) ? await getFileToBase64(file) : null;

      const url = `${WHSERVER_BASE_URL}/add/parametab`;
      const etabData = {
        anneeScolaire: anscol1,
        codeEtab: codeetab,
        paramEtab: { ...paramObj, modecalc: parseInt(paramObj.method_calc_eval) },   //tous les parametab doivent être en miniscule
        logoBase64
      }
      const failedHttpLogOptions = setLog ? {
        service: WAREHOUSE_SERV_ID,
        action: "ENVOYER_PARAM_ETAB",
        payload: param
      } : null;
      await fetchPrivateRoute(url, etabData, failedHttpLogOptions)
      resolve(true);
    } catch (error) {
      console.log("🚀 ~ file: services.ts:799 ~ returnnewPromise ~ error:", error)
      reject(error);
    }
  });
};


/**
 * obtenir la liste des partenaires et leurs services depuis la base sqlite
 * @returns
 */
const partnersList = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const partners = await functions.getPartnersList();
      const partnersWithServices = [];
      await Promise.all(
        partners.map(async (item: IPartner) => {
          const services = await functions.getServices(item.idPartenaire);
          partnersWithServices.push({
            ...item,
            services: services,
          });
        })
      );
      resolve(partnersWithServices);
    } catch (error) {
      Logger.error(
        "Une erreur s'est produite lors de la recuperation de la liste des partenaires"
      );
      reject(error);
    }
  });
};

/**
 * Envoyer toutes les données d'un nouvel eleve en ligne
 * @returns
 */
const createStudent = (studentId: number, setLog = true) => {
  return new Promise(async (resolve, reject) => {
    try {

      //recupperer donnee personnel
      const eleve = await functionsVba.fetchStudents([studentId]);
      if (eleve.length === 0) return resolve([]);

      const parents: IParentContact[] = await functionsVba.fetchParents([studentId]);

      //recupperer donnee echeancier
      const echeancier: ISpiderEcheancierItem[] = await functionsVba.fetchEcheancierIndividuel([studentId]);

      const url = `${WHSERVER_BASE_URL}/creer/eleve`;
      const failedHttpLogOptions = setLog ? {
        service: WAREHOUSE_SERV_ID,
        action: "CREER_ELEVE",
        payload: studentId
      } : null;
      const apiPayload = { eleve, echeancier, parents }
      await fetchPrivateRoute(url, apiPayload, failedHttpLogOptions)

      resolve(true);
    } catch (error) {
      Logger.error(
        "Une erreur s'est produite lors de la recuperation de la liste des partenaires"
      );
      reject(error);
    }
  });
};

/**
 * envoyer un ou plusieur eleves vers le wharehouse 
 * @param studentIds
 * @param setLog
 * @returns
 */
export const envoyerEleves = (
  studentIds: number[] | null = null,
  setLog = true
) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("111111111111111")
      const eleves = await functionsVba.fetchStudents(studentIds);
      console.log("2222222222222222222")

      console.log("🚀 ~ returnnewPromise ~ eleves:", eleves.length)

      if (eleves.length === 0) return resolve([]);
      const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const { anscol1, codeetab } = paramObj;

      if (studentIds) {
        const url = `${WHSERVER_BASE_URL}/ajouter/eleve`;
        const failedHttpLogOptions = setLog ? {
          service: WAREHOUSE_SERV_ID,
          action: "ENVOYER_ELEVE",
          payload: studentIds
        } : null;
        await fetchPrivateRoute(url, eleves, failedHttpLogOptions)
      } else {
        const fields = [
          {
            label: 'anneeScolaire',
            value: 'anneeScolaire',
          },
          {
            label: 'codeEtab',
            value: 'codeEtab',
          },
          {
            label: 'idEleve',
            value: 'idEleve',
          },
          {
            label: 'idClasse',
            value: 'idClasse',
          },
          {
            label: 'matricule',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'nomEleve',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'prenomEleve',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },

          {
            label: 'dateNaissance',
            value: (row, field) => moment(row[field.label]).format("YYYY-MM-DD") || field.default,
            default: 'NULL'
          },
          {
            label: 'lieuNaissance',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'statutEleve',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'sexe',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'lv2',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'arts',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'nationalite',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'residenceEleve',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'numeroExtrait',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'dateEnregExtrait',
            value: (row, field) => moment(row[field.label]).format("YYYY-MM-DD") || field.default,
            default: 'NULL'
          },
          {
            label: 'emailEleve',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'inscrit',
            value: (row, field) => row[field.label] ? 1 : 0,
            default: 'NULL'
          },
          {
            label: 'dateInscrit',
            value: (row, field) => moment(row[field.label]).format("YYYY-MM-DD") || field.default,
            default: 'NULL'
          },
          {
            label: 'etabOrigine',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'redoublant',
            value: (row, field) => row[field.label] ? 1 : 0,
            default: 'NULL'
          },
          {
            label: 'transfert',
            value: (row, field) => row[field.label] ? 1 : 0,
            default: 'NULL'
          },
          {
            label: 'numeroTransfert',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'decisionAffectation',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'nomPrenomTuteur',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'telephoneTuteur',
            value: (row, field) => row[field.label] ? `${row[field.label].replace(/\D/g, '').substring(0, 10)}` : "NULL",
            default: 'NULL'
          }
        ]

        const sessionID = uuid.v4()
        const url = `${WHSERVER_BASE_URL}/initialiser/eleve`;
        const zipName = `eleve_${anscol1}_${codeetab}_${sessionID}.zip`
        const fileName = `eleve.csv`;
        await sendZippedInitializeData(fields, eleves, url, zipName, fileName)
      }

      await envoyerParents(studentIds);
      resolve(true);

    } catch (error) {
      console.log("🚀 ~ file: services.ts:1207 ~ returnnewPromise ~ error:", error)
      // console.log("🚀 ~ file: services.ts:1086 ~ returnnewPromise ~ error:", error)
      Logger.error("Erreur de l'envoi élève en ligne");

      reject(error);
    }
  });
};


/**
 * Mettre a jour les données d'un etudiant d'un eleve en ligne
 * @param studentId
 * @returns
 */
const modifierEleve = (studentId: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await envoyerEleves([studentId]);
      resolve(data);
    } catch (error) {
      Logger.error("Erreur lors de la modification eleve chez les partenaires");
      reject(error);
    }
  });
};

/**
 * Supprimer un eleve en ligne
 * @param studentIds
 * @param setLog
 * @returns
 */
export const supprimerEleves = (studentIds: number[] | null, setLog = true) => {
  return new Promise(async (resolve, reject) => {
    try {

      if (studentIds.length === 0) return reject();

      const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const { anscol1, codeetab } = paramObj;

      const students: any[] = studentIds.map((idEleve) => ({
        anneeScolaire: anscol1,
        codeEtab: codeetab,
        idEleve: idEleve,
      }));

      //suppression un ou plusieurs eleves
      const url = `${WHSERVER_BASE_URL}/supprimer/eleve`;
      const failedHttpLogOptions = setLog ? {
        service: WAREHOUSE_SERV_ID,
        action: "SUPPRIMER_ELEVE",
        payload: studentIds
      } : null;
      const response: any = await fetchPrivateRoute(url, students, failedHttpLogOptions)
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Envoyer un ou plusieurs versement de la caisse vba en ligne
 * @param versementIds
 * @param setLog
 * @returns
 */
export const envoyerVersement = (versementIds: number[] | null = null, setLog = true) => {
  return new Promise(async (resolve, reject) => {
    try {
      const versements: any = await functionsVba.fetchPayments(versementIds);
      if (versements.length === 0) return resolve([]);
      const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const { anscol1, codeetab } = paramObj;
      if (versementIds) {
        const url = `${WHSERVER_BASE_URL}/ajouter/versement/vba`;
        const failedHttpLogOptions = setLog ? {
          service: WAREHOUSE_SERV_ID,
          action: "ENVOYER_VERSEMENT",
          payload: versementIds
        } : null
        await fetchPrivateRoute(url, versements, failedHttpLogOptions);
      } else {

        const fields = [
          {
            label: 'anneeScolaire',
            value: 'anneeScolaire',
          },
          {
            label: 'codeEtab',
            value: 'codeEtab',
          },
          {
            label: 'idVersement',
            value: 'idVersement',
          },
          {
            label: 'idEleve',
            value: 'idEleve',
            default: 'NULL'
          },

          {
            label: 'montantVersement',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'dateVersement',
            value: (row, field) => moment(row[field.label]).format("YYYY-MM-DD HH:mm:ss") || field.default,
            default: 'NULL'
          },
          {
            label: 'rubriqueVersement',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'modeVersement',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          }
        ]
        const sessionID = uuid.v4()
        const url = `${WHSERVER_BASE_URL}/initialiser/versement/vba`;
        const zipName = `versement_${anscol1}_${codeetab}_${sessionID}.zip`
        const fileName = `versement.csv`;
        await sendZippedInitializeData(fields, versements, url, zipName, fileName)
      }

      const studentIds: number[] | null = versementIds
        ? _.uniqBy(versements, "idEleve").map(item => item.idEleve)
        : null

      await envoyerEcheancierIndividuel(studentIds);

      resolve(true);
    } catch (error) {
      console.log("🚀 ~ file: services.ts:1251 ~ returnnewPromise ~ error", error)
      reject(error);
    }
  });
};


/**
 * envoyer les contacts parente eleves 
 * @param studentIds 
 * @param setLog 
 * @returns 
 */
export const envoyerParents = (
  studentIds: number[] | null = null, setLog = true
) => {
  return new Promise(async (resolve, reject) => {
    try {

      const parents: IParentContact[] = await functionsVba.fetchParents(studentIds);

      if (parents.length === 0) return resolve([]);

      const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const { anscol1, codeetab } = paramObj;

      if (studentIds) {
        const url = `${WHSERVER_BASE_URL}/ajouter/parent`;
        const failedHttpLogOptions = setLog ? {
          service: WAREHOUSE_SERV_ID,
          action: "ENVOYER_CONTACT_PARENT",
          payload: parents
        } : null;
        await fetchPrivateRoute(url, parents, failedHttpLogOptions);
      } else {

        const fields = [
          {
            label: 'anneeScolaire',
            value: 'anneeScolaire',
          },
          {
            label: 'codeEtab',
            value: 'codeEtab',
          },
          {
            label: 'idEleve',
            value: 'idEleve'
          },
          {
            label: 'numeroCellulaire',
            value: 'numeroCellulaire',
          },
          {
            label: 'filiation',
            value: 'filiation'
          },

          {
            label: 'nomPrenomParent',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },

          {
            label: 'professionParent',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'residenceParent',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'emailParent',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          }

        ]
        const sessionID = uuid.v4()
        const url = `${WHSERVER_BASE_URL}/initialiser/parent`;
        const zipName = `parents_${anscol1}_${codeetab}_${sessionID}.zip`
        const fileName = `parents.csv`;
        await sendZippedInitializeData(fields, parents, url, zipName, fileName)
      }
      resolve(true);
    } catch (error) {
      Logger.error("Erreur lors de la création d'une parent chez focus ecole");
      reject(error);
    }
  });
};

/**
 * mettre ajour les donnees de paiements pour un versement
 * @param versementId
 * @returns
 */
const modifierVersement = (versementId: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      await envoyerVersement([versementId]);
      resolve(true);
    } catch (error) {
      Logger.error("Erreur lors mofication paiements chez les patenaires");
      reject(error);
    }
  });
};


/**
 * Supprimer un ou plusieurs versment 
 * @param versementIds *
 * @param setLog
 * @returns
 */
export const supprimerVersement = (
  versementIds: number[] | null = null,
  setLog = true
) => {
  return new Promise<boolean>(async (resolve, reject) => {
    try {

      //cas ou versementIds = []
      if (versementIds && !versementIds.length) return resolve(true);

      const versements: any = await functionsVba.fetchPayments(versementIds);
      if (versements.length === 0) return reject("Veuillez indiquer les versements à supprimer");

      const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const payments: any[] = versementIds.map((idVersement) => ({
        anneeScolaire: anscol1,
        codeEtab: codeetab,
        idVersement,
      }));
      const url = `${WHSERVER_BASE_URL}/supprimer/versement/vba`;
      const failedHttpLogOptions = setLog ? {
        service: WAREHOUSE_SERV_ID,
        action: "SUPPRIMER_VERSEMENT",
        payload: versementIds
      } : null;
      await fetchPrivateRoute(url, payments, failedHttpLogOptions);

      const studentIds: number[] | null = versementIds
        ? _.uniqBy(versements, "idEleve").map(item => item.idEleve)
        : null
      await envoyerEcheancierIndividuel(studentIds);
      resolve(true);

    } catch (error) {
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
export const envoyerClasses = (
  classeIds: number[] | null = null,
  setLog = true
) => {
  return new Promise(async (resolve, reject) => {
    try {

      // récupère les classes dans spider (tableau d'objets)
      const classes: ISpiderClassseItem[] = await functionsVba.fetchClasses(classeIds);
      if (classes.length === 0) return resolve([]);

      const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const { anscol1, codeetab } = paramObj;

      if (classeIds) {
        const url = `${WHSERVER_BASE_URL}/ajouter/classe`;
        const failedHttpLogOptions = setLog ? {
          service: WAREHOUSE_SERV_ID,
          action: "ENVOYER_CLASSE",
          payload: classeIds
        } : null;

        await fetchPrivateRoute(url, classes, failedHttpLogOptions);
      } else {

        const fields = [
          {
            label: 'anneeScolaire',
            value: 'anneeScolaire',
          },
          {
            label: 'codeEtab',
            value: 'codeEtab',
          },
          {
            label: 'idClasse',
            value: 'idClasse',
          },
          {
            label: 'idTypeclasse',
            value: 'idTypeclasse',
            default: 'NULL'
          },
          {
            label: 'ordreClasse',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'libelleClasseCourt',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'libelleClasseLong',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'arts',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'lv2',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'idInstituteur',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },

        ]
        const sessionID = uuid.v4()
        const url = `${WHSERVER_BASE_URL}/initialiser/classe`;
        const zipName = `classe_${anscol1}_${codeetab}_${sessionID}.zip`
        const fileName = `classe.csv`;
        await sendZippedInitializeData(fields, classes, url, zipName, fileName)
      }

      resolve(true);

    } catch (error) {
      Logger.error("Erreur lors de la création d'une classe chez focus ecole");
      reject(error);
    }
  });
};


/**
 * modifier une classe deja existante chez les differentes patenaires
 * @param classeId
 * @returns
 */
const modifierClasse = (classeId: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await envoyerClasses([classeId]);
      resolve(data);
    } catch (error) {
      Logger.error("Erreur modification classe chez les patenaires");
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
export const supprimerClasses = (
  classeIds: number[] | null = null,
  setLog = true
) => {
  return new Promise(async (resolve, reject) => {
    try {

      if (!classeIds) {
        reject("Veuillez selectionner les classes à supprimer");
      } else {
        if (classeIds.length === 0) {
          return reject("Veuillez selectionner les classes à supprimer");
        } else {
          const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);
          const classes: any[] = classeIds.map((idClasse) => ({
            anneeScolaire: anscol1,
            codeEtab: codeetab,
            idClasse,
          }));

          const url = `${WHSERVER_BASE_URL}/supprimer/classe`;
          const failedHttpLogOptions = setLog ? {
            service: WAREHOUSE_SERV_ID,
            action: "SUPPRIMER_CLASSE",
            payload: classeIds
          } : null;
          await fetchPrivateRoute(url, classes, failedHttpLogOptions);
          resolve(true);
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};


/**
 * envoyer les echeanciers individuels d'un ou plusieurs eleves vers wh server
 * @param studentIds
 * @param setLog
 * @returns
 */
export const envoyerEcheancierIndividuel = (studentIds: number[] | null = null, setLog = true) => {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      const echeanciers: ISpiderEcheancierItem[] = await functionsVba.fetchEcheancierIndividuel(studentIds);
      //ne pas effectuer d'action si aucun echeancier trouvé pour le(s) eleves
      if (!echeanciers.length) return resolve(true);
      const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const { anscol1, codeetab } = paramObj;

      // mettre à jour les echeanciers dans redis
      schoolControlServices.redisInitSchoolControl(studentIds);

      if (studentIds) {//ajouter echeancier pour quelques eleves
        const url = `${WHSERVER_BASE_URL}/ajouter/echeancier/vba`;
        await fetchPrivateRoute(url, echeanciers);
      } else {//initialiser echeanciers pour tous les eleves
        const fields = [
          {
            label: 'anneeScolaire',
            value: 'anneeScolaire',
          },
          {
            label: 'codeEtab',
            value: 'codeEtab',
          },
          {
            label: 'idEleve',
            value: 'idEleve',
          },
          {
            label: 'rubrique',
            value: 'rubrique',
          },
          {
            label: 'periode',
            value: 'periode',
          },
          {
            label: 'montant',
            value: 'montant',
          },
          {
            label: 'datelimite',
            value: (row, field) => moment(row[field.label]).format("YYYY-MM-DD") || field.default,
            default: 'NULL'
          },
          {
            label: 'description',
            value: 'description',
            default: 'NULL'
          },
          {
            label: 'dejaPaye',
            value: (row, field) => row[field.label] || 0,
            default: 0
          },
          {
            label: 'idRubrique',
            value: 'idRubrique',
            default: 'NULL'
          },
          {
            label: 'categorieVersement',
            value: 'categorieVersement',
            default: 'NULL'
          },
          {
            label: 'priorite',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'optionnel',
            value: (row, field) => row[field.label] ? 1 : 0,
            default: 'NULL'
          },
          {
            label: 'solde',
            value: 'solde',
            default: 'NULL'
          },
        ]
        const sessionID = uuid.v4()
        const url = `${WHSERVER_BASE_URL}/initialiser/echeancier/vba`;
        const zipName = `echeancier_${anscol1}_${codeetab}_${sessionID}.zip`;
        const fileName = `echeancier.csv`;
        await sendZippedInitializeData(fields, echeanciers, url, zipName, fileName)
      }
      resolve(true);
    } catch (error) {
      console.log(":fusée: ~ file: services.ts:1609 ~ returnnewPromise ~ error", error)
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


      const personnel: ISpiderPersonnelItem[] = await functionsVba.fecthPersonnel(personnelIds);

      if (personnel.length === 0) return resolve([]);
      const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const { anscol1, codeetab } = paramObj;

      if (personnelIds) {
        const url = `${WHSERVER_BASE_URL}/ajouter/personnel`;
        const failedHttpLogOptions = setLog ? {
          service: WAREHOUSE_SERV_ID,
          action: "ENVOYER_PERSONNEL",
          payload: personnelIds
        } : null;
        await fetchPrivateRoute(url, personnel, failedHttpLogOptions);
      } else {
        const fields = [
          {
            label: 'anneeScolaire',
            value: 'anneeScolaire',
          },
          {
            label: 'codeEtab',
            value: 'codeEtab',
          },
          {
            label: 'idPersonnel',
            value: 'idPersonnel',
          },
          {
            label: 'nomPersonnel',
            value: (row, field) => row[field.label] || "NULL",
          },
          {
            label: 'prenomPersonnel',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'fonction',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'matriculePersonnel',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'sexe',
            value: 'sexe',
            default: 'NULL'
          },
          {
            label: 'phone1',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'phone2',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'dateNaissance',
            value: (row, field) => moment(row[field.label]).format("YYYY-MM-DD") || field.default,
            default: 'NULL'
          },
          {
            label: 'lieuNaissance',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },

          {
            label: 'libelleDiplome',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'residence',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'situationMatrimoniale',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'dateEmbauche',
            value: (row, field) => moment(row[field.label]).format("YYYY-MM-DD") || field.default,
            default: 'NULL'
          },
          {
            label: 'numeroCnps',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'nombreEnfant',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'corpsMetier',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'whatsApp',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'email',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'specialite',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
        ]
        const sessionID = uuid.v4()
        const url = `${WHSERVER_BASE_URL}/initialiser/personnel`;
        const zipName = `personnel_${anscol1}_${codeetab}_${sessionID}.zip`
        const fileName = `personnel.csv`;
        await sendZippedInitializeData(fields, personnel, url, zipName, fileName)
      }

      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};


/**
 * Modifier un ou plusieurs personnels chez differensts partenaires
 */
const updatePersonnel = (personnelId) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("🚀 ~ file: services.ts ~ line 1570 ~ updatePersonnel ~ personnelId+++", personnelId)
      const data = await sendPersonnel(personnelId);
      resolve(data);
    } catch (error) {
      Logger.error("Erreur modification personnel chez les patenaires");
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
      if (!personnelIds) {
        reject("Veuillez indiquer le personnel à supprimer");
      } else {
        if (personnelIds.length === 0) {
          reject("Veuillez indiquer le personnel à supprimer");
        } else {
          const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);
          const personnel: any[] = personnelIds.map((idPersonnel) => ({
            anneeScolaire: anscol1,
            codeEtab: codeetab,
            refPers: idPersonnel
          }));
          const url = `${WHSERVER_BASE_URL}/supprimer/personnel`;
          const failedHttpLogOptions = setLog ? {
            service: WAREHOUSE_SERV_ID,
            action: "SUPPRIMER_PERSONNEL",
            payload: personnelIds
          } : null;
          await fetchPrivateRoute(url, personnel, failedHttpLogOptions);

          resolve(true);
        }
      }
    } catch (error) {

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

      const fullEvalNotes = await functionsVba.fecthEvaluationNotes(evalIds);
      if (fullEvalNotes.length === 0) return resolve([]);

      if (evalIds) {
        const url = `${WHSERVER_BASE_URL}/ajouter/evalnote`;
        const failedHttpLogOptions = setLog ? {
          service: WAREHOUSE_SERV_ID,
          action: "ENVOYER_NOTES_EVALUATIONS",
          payload: evalIds
        } : null;
        await fetchPrivateRoute(url, fullEvalNotes, failedHttpLogOptions);
      } else {

        const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
        const { anscol1, codeetab } = paramObj;

        // json to csv
        const fields = [
          {
            label: 'anneeScolaire',
            value: 'anneeScolaire',
          },
          {
            label: 'codeEtab',
            value: 'codeEtab',
          },
          {
            label: 'idEvaluationProgrammation',
            value: 'idEvaluationProgrammation',
          },
          {
            label: 'idEleve',
            value: 'idEleve',
          },
          {
            label: 'noteEvaluation',
            value: (row, field) => row[field.label] || "NULL",
            default: '0'
          },
          {
            label: 'operateurSaisie',
            value: 'operateurSaisie',
            default: 'NULL'
          },
          {
            label: 'operateurModification',
            value: 'operateurModification',
            default: 'NULL'
          },
          {
            label: 'dateSaisie',
            value: (row, field) => moment(row[field.label]).format("YYYY-MM-DD") || field.default,
            default: 'NULL'
          },
          {
            label: 'dateModification',
            value: (row, field) => moment(row[field.label]).format("YYYY-MM-DD") || field.default,
            default: 'NULL'
          },
          {
            label: 'recup',
            value: (row, field) => 1,
          },
          {
            label: 'device',
            value: 'device',
            default: 'NULL'
          },
        ]
        const sessionID = uuid.v4()
        const url = `${WHSERVER_BASE_URL}/initialiser/evalnote`;
        const zipName = `evalnote_${anscol1}_${codeetab}_${sessionID}.zip`
        const fileName = `evalnote.csv`;
        await sendZippedInitializeData(fields, fullEvalNotes, url, zipName, fileName)
      }

      resolve(true);
    } catch (error) {

      Logger.error("Erreur lors de l'envoi notes evaluations");

      reject(error);
    }
  });
};


/**
 * modifier une ou plusieurs notes d'evaluations
 * @param evalIds les ids d'evaluations
 * @returns 
 */
const updateEvalNotes = (evalIds) => {
  return new Promise(async (resolve, reject) => {
    try {

      const data = await sendEvaluationNotes(evalIds);
      resolve(data);

    } catch (error) {
      console.log("🚀 ~ file: services.ts ~ line 1017 ~ returnnewPromise ~ error", error)
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

      if (!evalIds) {
        return reject("Veuillez indiquer les notes à supprimer");
      } else {
        if (evalIds.length === 0) {
          return reject("Veuillez indiquer les versements à supprimer");
        } else {
          const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);
          const evals: any[] = evalIds.map((idEval) => ({
            anneeScolaire: anscol1,
            codeEtab: codeetab,
            idEval,
          }));
          const url = `${WHSERVER_BASE_URL}/supprimer/evalnote`;
          const failedHttpLogOptions = setLog ? {
            service: WAREHOUSE_SERV_ID,
            action: "SUPPRIMER_NOTES_EVALUATIONS",
            payload: evalIds
          } : null;
          await fetchPrivateRoute(url, evals, failedHttpLogOptions);
          resolve(true);
        }
      }
    } catch (error) {
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


      const action = "ENVOYER_SALLE";
      const fullRooms: ISpiderSalleItem[] = await functionsVba.fecthSalles(
        roomIds
      );
      const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const { anscol1, codeetab } = paramObj;

      const rooms: IFocusEcoleSalleItem[] = fullRooms.map((item) => ({
        ...item,
        anneeScolaire: anscol1,
        codeEtab: codeetab,
      }));

      const url = `${WHSERVER_BASE_URL}/ajouter/salle`;
      const failedHttpLogOptions = setLog ? {
        service: WAREHOUSE_SERV_ID,
        action: "ENVOYER_SALLE",
        payload: roomIds
      } : null;
      const response: any = await fetchPrivateRoute(url, rooms, failedHttpLogOptions);


      resolve(response.data);
    } catch (error) {
      Logger.error("Erreur lors de l'envoi salles");
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


      const action = "SUPPRIMER_SALLE";
      if (!roomIds) {
        reject("Veuillez indiquer les salles à supprimer");
      } else {
        if (roomIds.length === 0) {
          reject("Veuillez indiquer les salles à supprimer");
        } else {
          const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);
          const rooms: any[] = roomIds.map((idRoom) => ({
            anneeScolaire: anscol1,
            codeEtab: codeetab,
            refSalle: idRoom,
          }));
          const url = `${WHSERVER_BASE_URL}/supprimer/rooms`;
          const failedHttpLogOptions = setLog ? {
            service: WAREHOUSE_SERV_ID,
            action: "SUPPRIMER_SALLE",
            payload: roomIds
          } : null;
          await fetchPrivateRoute(url, rooms, failedHttpLogOptions);

          resolve(true);
        }
      }
    } catch (error) {
      Logger.error("Erreur lors de la suppression salles chez focus ecole");

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


      const evalProgs = await functionsVba.fecthEvalProg(evalIds);

      if (evalProgs.length === 0) return resolve([])
      const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const { anscol1, codeetab } = paramObj;

      if (evalIds) {
        const url = `${WHSERVER_BASE_URL}/ajouter/evalprog`;
        const failedHttpLogOptions = setLog ? {
          service: WAREHOUSE_SERV_ID,
          action: "ENVOYER_PROGRAMATION_EVALUATIONS",
          payload: evalIds
        } : null;
        await fetchPrivateRoute(url, evalProgs, failedHttpLogOptions);

      } else {
        const fields = [
          {
            label: 'anneeScolaire',
            value: 'anneeScolaire',
          },
          {
            label: 'codeEtab',
            value: 'codeEtab',
          },
          {
            label: 'idEvaluationProgrammation',
            value: 'idEvaluationProgrammation',
          },
          {
            label: 'idClasse',
            value: 'idClasse',
          },
          {
            label: 'idMatiere',
            value: 'idMatiere',
            default: 'NULL'
          },
          {
            label: 'periodeEvaluation',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'numeroEvaluation',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'coefficientEvaluation',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'dateComposition',
            value: (row, field) => moment(row[field.label]).format("YYYY-MM-DD") || field.default,
            default: 'NULL'
          },
          {
            label: 'typeEvaluation',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          }
        ]
        const sessionID = uuid.v4()
        const url = `${WHSERVER_BASE_URL}/initialiser/evalprog`;
        const zipName = `evalprog_${anscol1}_${codeetab}_${sessionID}.zip`
        const fileName = `evalprog.csv`;
        await sendZippedInitializeData(fields, evalProgs, url, zipName, fileName)
      }
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};


const updateEvalProg = (evalIds) => {
  return new Promise(async (resolve, reject) => {
    try {

      const data = await sendEvalProg(evalIds);
      resolve(data);

    } catch (error) {
      reject(error);
    }
  });
};

/**
 * suprimer une ou plusieurs programmation
 * @param evalIds 
 * @returns 
 */
const deleteEvalProg = (
  evalIds: number[] | null = null,
  setLog = true
) => {
  return new Promise(async (resolve, reject) => {
    try {


      const action = "SUPPRIMER_PROGRAMATION_EVALUATIONS";
      if (!evalIds) {
        reject("Veuillez indiquer les programmations à supprimer");
      } else {
        if (evalIds.length === 0) {
          reject("Veuillez indiquer les programmations à supprimer");
        } else {
          const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);
          const evals: any[] = evalIds.map((idEval) => ({
            anneeScolaire: anscol1,
            codeEtab: codeetab,
            idEval,
          }));
          const url = `${WHSERVER_BASE_URL}/supprimer/evalprog`;
          const failedHttpLogOptions = setLog ? {
            service: WAREHOUSE_SERV_ID,
            action: "SUPPRIMER_PROGRAMATION_EVALUATIONS",
            payload: evalIds
          } : null;
          await fetchPrivateRoute(url, evals, failedHttpLogOptions);

          resolve(true);
        }
      }
    } catch (error) {

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


      const fullPlagesHoraires: ISpiderPlageHoraireItem[] = await functionsVba.fecthPlageHoraires();
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
      const url = `${WHSERVER_BASE_URL}/ajouter/plagehoraire`;
      const failedHttpLogOptions = setLog ? {
        service: WAREHOUSE_SERV_ID,
        action: "ENVOYER_PLAGE_HORAIRE",
        payload: null
      } : null;
      const response: any = await fetchPrivateRoute(url, plagesHoraires, failedHttpLogOptions);

      resolve(response.data);
    } catch (error) {
      Logger.error("Erreur lors d'envoi plage horaire focus ecole");

      reject(error);
    }
  });
};

/**
 * Envoyer les modeles de plages horraires 
 */
export const sendModelePlageHoraires = (setLog = true) => {
  return new Promise(async (resolve, reject) => {
    try {

      const horaires = await functionsVba.fecthModelePlageHoraires();
      // inserer un ou plusieurs paiement liés à un ou plusieurs versements
      const url = `${WHSERVER_BASE_URL}/ajouter/horaire`;
      const failedHttpLogOptions = setLog ? {
        service: WAREHOUSE_SERV_ID,
        action: "ENVOYER_MODELE_PLAGE_HORAIRE",
        payload: null
      } : null;
      const response: any = await fetchPrivateRoute(url, horaires, failedHttpLogOptions);

      resolve(response.data);
    } catch (error) {

      reject(error);
    }
  });
};

/**
 * envoyer horaire vers focus ecole
 * @param setLog 
 * @returns
 */
const sendHoraires = (setLog = true) => {
  return new Promise(async (resolve, reject) => {
    try {


      const horaires = await functionsVba.fecthHoraires();
      const action = "ENVOYER_HORAIRE";
      // inserer un ou plusieurs paiement liés à un ou plusieurs versements
      const url = `${WHSERVER_BASE_URL}/ajouter/horaire`;
      const failedHttpLogOptions = {
        service: WAREHOUSE_SERV_ID,
        action: "ENVOYER_HORAIRE",
        payload: null
      }
      const response: any = await fetchPrivateRoute(url, horaires, failedHttpLogOptions);

      resolve(response.data);
    } catch (error) {



      reject(error);
    }
  });
};



/**
 * envoyer la liste des profs par matiere et par classe
 * @param setLog
 * @returns
 */
const envoyerClassesMatiereProf = (classeIds: number[] | null = null, setLog = true) => {
  return new Promise(async (resolve, reject) => {
    try {


      const classesMatieresProfs = await functionsVba.fetchClassesMatieresProfs(classeIds);

      const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const { anscol1, codeetab } = paramObj;

      if (classeIds) {
        const url = `${WHSERVER_BASE_URL}/ajouter/classematiereprof`;
        const failedHttpLogOptions = setLog ? {
          service: WAREHOUSE_SERV_ID,
          action: "ENVOYER_CLASSE_MATIERE_PROF",
          payload: classeIds
        } : null;
        await fetchPrivateRoute(url, classesMatieresProfs, failedHttpLogOptions);
      } else {

        const fields = [
          {
            label: 'anneeScolaire',
            value: 'anneeScolaire',
          },
          {
            label: 'codeEtab',
            value: 'codeEtab',
          },
          {
            label: 'idClasse',
            value: 'idClasse',
          },
          {
            label: 'idPersonnel',
            value: 'idPersonnel',
          },
          {
            label: 'idSousMatiereOuMatiere',
            value: 'idSousMatiereOuMatiere',
          },
          {
            label: 'idTypeClasse',
            value: 'idTypeClasse',
          },
          {
            label: 'idMatiere',
            value: 'idMatiere',
          },
          {
            label: 'libelleClasseCourt',
            value: 'libelleClasseCourt',
          },
          {
            label: 'libelleClasseLong',
            value: 'libelleClasseLong',
          },
          {
            label: 'ordreClasse',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'libelleMatiereCourt',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'libelleMatiereLong',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'nomPersonnel',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'idSousMatiere',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'libelleSousMatiereCourt',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'libelleSousMatiereLong',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'coefMatiere',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'coefSousMatiere',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          }
        ]
        const sessionID = uuid.v4()
        const url = `${WHSERVER_BASE_URL}/initialiser/classematiereprof`;
        const zipName = `classematiereprof_${anscol1}_${codeetab}_${sessionID}.zip`
        const fileName = `classematiereprof.csv`;
        await sendZippedInitializeData(fields, classesMatieresProfs, url, zipName, fileName)
      }
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};



/**
 * renvoyer a nouveau les actions warehouse qui ont echoué
 * @param logIds 
 * @returns 
 */
// export const resendFailedAction = () => {
//   return new Promise(async (resolve, reject) => {
//     try {


//       const logs: any = await functions.fetchHttpFailsLogs();

//       if (logs.length === 0) {
//         return reject({ name: "NO_FAILED_ACTION", message: "Aucun logs n’a été trouvé" });
//       }

//       let successLogsIds = []; //pour stocker les id des logs qui ont été correctement renvoyé

//       await Promise.all(
//         logs.map(async (log) => {
//           //pour chaque log, determiner l'action a effectuer et executer la fonction cinetpay correspondante
//           const payload = JSON.parse(log.payload);
//           const action = log.action;
//           const logId = log.id;
//           switch (action) {
//             case "ENVOYER_PARAM_ETAB":
//               await envoyerParamEtab(payload, false);
//               successLogsIds = [...successLogsIds, logId];
//               break;
//             case "ENVOYER_ELEVE":
//               await envoyerEleves(payload, false);
//               successLogsIds = [...successLogsIds, logId];
//               break;
//             case "SUPPRIMER_ELEVE":
//               await supprimerEleves(payload, false);
//               successLogsIds = [...successLogsIds, logId];
//               break;
//             case "ENVOYER_VERSEMENT":
//               await envoyerVersement(payload, false);
//               successLogsIds = [...successLogsIds, logId];
//               break;
//             case "SUPPRIMER_VERSEMENT":
//               await supprimerVersement(payload, false);
//               successLogsIds = [...successLogsIds, logId];
//               break;
//             case "ENVOYER_CLASSE":
//               await envoyerClasses(payload, false);
//               successLogsIds = [...successLogsIds, logId];
//               break;
//             case "SUPPRIMER_CLASSE":
//               await supprimerClasses(payload, false);
//               successLogsIds = [...successLogsIds, logId];
//               break;
//             case "ENVOYER_CLASSE_MATIERE_PROF":
//               await envoyerClassesMatiereProf(payload, false);
//               successLogsIds = [...successLogsIds, logId];
//               break;
//             case "ENVOYER_PERSONNEL":
//               await sendPersonnel(payload, false);
//               successLogsIds = [...successLogsIds, logId];
//               break;
//             case "SUPPRIMER_PERSONNEL":
//               await deletePersonnel(payload, false);
//               successLogsIds = [...successLogsIds, logId];
//               break;
//             case "ENVOYER_PLANNING":
//               await sendPlanning(payload, false);
//               successLogsIds = [...successLogsIds, logId];
//               break;
//             case "ENVOYER_MATIERE":
//               await sendMatieres(payload, false);
//               successLogsIds = [...successLogsIds, logId];
//               break;

//             case "ENVOYER_PROGRAMATION_EVALUATIONS":
//               await sendEvalProg(payload, false);
//               successLogsIds = [...successLogsIds, logId];
//               break;
//             case "SUPPRIMER_PROGRAMATION_EVALUATIONS":
//               await deleteEvalProg(payload, false);
//               successLogsIds = [...successLogsIds, logId];
//               break;

//             case "ENVOYER_NOTES_EVALUATIONS":
//               await sendEvaluationNotes(payload, false);
//               successLogsIds = [...successLogsIds, logId];
//               break;
//             case "SUPPRIMER_NOTES_EVALUATIONS":
//               await deleteEvalNotes(payload, false);
//               successLogsIds = [...successLogsIds, logId];
//               break;
//             case "ENVOYER_ECHEANCIER_INDIVIDUEL":
//               await envoyerEcheancierIndividuel(payload, false);
//               successLogsIds = [...successLogsIds, logId];
//               break;
//             case "ENVOYER_VERSEMENT":
//               await envoyerVersement(payload, false);
//               successLogsIds = [...successLogsIds, logId];
//               break;
//             case "SUPPRIMER_VERSEMENT":
//               await supprimerVersement(payload, false);
//               successLogsIds = [...successLogsIds, logId];
//               break;
//           }

//         })
//       );

//       await functions.setHttpFailsLogsSuccess(successLogsIds);
//       resolve(true);
//     } catch (error) {
//       Logger.error("Une erreur s’est produite lors du renvoi des donnés logs");
//       reject(error);
//     }
//   });
// };




/**
 * recuperer tous les logs warehouses
 */
export const getLogs = () => {
  return new Promise(async (resolve, reject) => {
    try {

      const logs = await functions.fetchLogs();
      resolve(logs);
    } catch (error) {
      Logger.error("Erreur de la recuperation des logs gain technologie");
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

      const matieres: ISpiderMatiereItem[] = await functionsVba.fecthMatieres(matieresIds);
      console.log("🚀 ~ file: services.ts:2575 ~ returnnewPromise ~ matieres:", matieres.length)
      if (matieresIds) {
        const url = `${WHSERVER_BASE_URL}/ajouter/matiere`;
        const failedHttpLogOptions = {
          service: WAREHOUSE_SERV_ID,
          action: "ENVOYER_MATIERE",
          payload: matieresIds
        }
        await fetchPrivateRoute(url, matieres, failedHttpLogOptions);
      } else {
        const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);

        const fields = [
          {
            label: 'anneeScolaire',
            value: 'anneeScolaire',
          },
          {
            label: 'codeEtab',
            value: 'codeEtab',
          },
          {
            label: 'idMatiere',
            value: 'idMatiere',
          },
          {
            label: 'libelleMatiereCourt',
            value: (row, field) => row[field.label] || "NULL",
          },
          {
            label: 'libelleMatiereLong',
            value: (row, field) => row[field.label] || "NULL",
          },
          {
            label: 'libelleMatiereAbreger',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'ordreMatiere',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'couleurMatiere',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'general',
            value: (row, field) => row[field.label] ? 1 : 0,
            default: 1
          },
          {
            label: 'bilan',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          }
        ]

        const sessionID = uuid.v4()
        const url = `${WHSERVER_BASE_URL}/initialiser/matiere`;
        const zipName = `matiere_${anscol1}_${codeetab}_${sessionID}.zip`
        const fileName = `matiere.csv`;
        await sendZippedInitializeData(fields, matieres, url, zipName, fileName)
      }

      if (setLog) {
        const action = "ENVOYER_MATIERE";
        await functions.insertWhserverLog(action, matieresIds, 1);
      }
      resolve(true);
    } catch (error) {
      Logger.error("Erreur lors de l'envoi matieres en ligne");
      if (setLog) {
        const action = "ENVOYER_MATIERE";
        await functions.insertWhserverLog(action, matieresIds, 0);
      }
      reject(error);
    }
  });
};



/**
 * Envoyer le planning (emploi de temps) d'une ou plusieurs classes en ligne
 * @param setLog
 * @returns
 */
const sendPlanning = (classeIds: number[] | null = null, setLog = true) => {
  return new Promise(async (resolve, reject) => {
    try {

      const planning = await functionsVba.fecthPlannig(classeIds);
      console.log("🚀 ~ file: services.ts:2992 ~ returnnewPromise ~ planning:", planning.length)
      if (!planning.length) return resolve([]);
      const hasNullPlageHorraire = planning.some(item => item.plageHoraire === null);
      console.log("🚀 ~ file: services.ts:2996 ~ returnnewPromise ~ hasNullPlageHorraire:", hasNullPlageHorraire)

      if (hasNullPlageHorraire) return reject({ name: "PLAGEHORRAIRE_NULL", message: "L' emploi du temps contient des plages horraires null" })

      const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);

      if (classeIds) {
        // inserer un ou plusieurs paiement liés à un ou plusieurs versements
        const url = `${WHSERVER_BASE_URL}/ajouter/planning`;
        const failedHttpLogOptions = {
          service: WAREHOUSE_SERV_ID,
          action: "ENVOYER_PLANNING",
          payload: classeIds
        }
        await fetchPrivateRoute(url, planning, failedHttpLogOptions);

      } else {
        const fields = [
          {
            label: 'anneeScolaire',
            value: 'anneeScolaire',
          },
          {
            label: 'codeEtab',
            value: 'codeEtab',
          },
          {
            label: 'idHoraire',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'idClasse',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'idMatiere',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'idPersonnel',
            value: 'idPersonnel',
            default: 'NULL'
          },
          {
            label: 'idSeance',
            value: 'idSeance',
          },
          {
            label: 'idSalle',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'libelleClasseCourt',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'libelleHoraire',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'libelleMatiereCourt',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'libelleMatiereLong',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'nomPersonnel',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'prenomPersonnel',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'sexePersonnel',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'plageHoraire',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'libelleSalle',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          }
        ]

        const sessionID = uuid.v4()
        const url = `${WHSERVER_BASE_URL}/initialiser/planning`;
        const zipName = `planning_${anscol1}_${codeetab}_${sessionID}.zip`
        const fileName = `planning.csv`;
        await sendZippedInitializeData(fields, planning, url, zipName, fileName)
      }
      if (setLog) {
        const action = "ENVOYER_PLANNING";
        await functions.insertWhserverLog(action, classeIds, 1);
      }
      resolve((true))
    } catch (error) {
      Logger.error("Erreur lors de l'envoi planning en ligne");
      if (setLog) {
        const action = "ENVOYER_PLANNING";
        await functions.insertWhserverLog(action, classeIds, 0);
      }
      reject(error);
    }
  });
};


/**
 * Envoyer les seances des emploi de temps programmé en ligne
 * @param setLog 
 * @returns 
 */
const sendSeances = (seanceIds: number[] | null = null, setLog = true) => {
  return new Promise(async (resolve, reject) => {
    try {

      const seances = await functionsVba.fecthSeances(seanceIds);
      console.log("🚀 ~ file: services.ts ~ line 2596 ~ returnnewPromise ~ seances", seances)

      const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const action = "ENVOYER_SEANCE";

      if (seanceIds) {
        // inserer un ou plusieurs paiement liés à un ou plusieurs versements
        const url = `${WHSERVER_BASE_URL}/ajouter/seance`;
        const failedHttpLogOptions = setLog ? {
          service: WAREHOUSE_SERV_ID,
          action: "ENVOYER_SEANCE",
          payload: seanceIds
        } : null;
        await fetchPrivateRoute(url, seances, failedHttpLogOptions);
      } else {
        const fields = [
          {
            label: 'anneeScolaire',
            value: 'anneeScolaire',
          },
          {
            label: 'codeEtab',
            value: 'codeEtab',
          },
          {
            label: 'idSeance',
            value: 'idSeance',
          },
          {
            label: 'idSalle',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'idPersonnel',
            value: 'idPersonnel',
            default: 'NULL'
          },
          {
            label: 'idMatiere',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'idClasse',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'idHoraire',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          },
          {
            label: 'observation',
            value: (row, field) => row[field.label] || "NULL",
            default: 'NULL'
          }
        ]

        const sessionID = uuid.v4()
        const url = `${WHSERVER_BASE_URL}/initialiser/seance`;
        const zipName = `seance_${anscol1}_${codeetab}_${sessionID}.zip`
        const fileName = `seance.csv`;
        await sendZippedInitializeData(fields, seances, url, zipName, fileName)
      }

      resolve(true);
    } catch (error) {

      reject(error);
    }
  });
};

/**
 * Modifier les données d"une seance
 * @param seanceId 
 * @returns 
 */
const updateSeance = (seanceId: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await sendSeances([seanceId]);
      resolve(data);
    } catch (error) {
      Logger.error("Erreur modification personnel chez les patenaires");
      reject(error);
    }
  });
};

/**
 * supprimer un ou plusieurs seances (emploi du temps)
 * @param seanceIds 
 * @param setLog 
 * @returns 
 */
export const deleteSeance = (
  seanceIds: number[] | null = null,
  setLog = true
) => {
  return new Promise(async (resolve, reject) => {
    try {


      const action = "SUPPRIMER_SEANCE";
      const { anscol1, codeetab } = await paramEtabObjet([
        "Anscol1",
        "CodeEtab",
      ]);
      const seances: any[] = seanceIds.map((idPersonnel) => ({
        anneeScolaire: anscol1,
        codeEtab: codeetab,
        idSeance: idPersonnel
      }));
      const url = `${WHSERVER_BASE_URL}/supprimer/seance`;
      const failedHttpLogOptions = setLog ? {
        service: WAREHOUSE_SERV_ID,
        action: "SUPPRIMER_SEANCE",
        payload: seanceIds
      } : null;
      await fetchPrivateRoute(url, seances, failedHttpLogOptions);
      resolve(true);
    } catch (error) {
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

      const url = `${WHSERVER_BASE_URL}/ajouter/rubrique`;
      const response: any = await fetchPrivateRoute(url, rubriques);
      if (setLog) {
        await functions.insertWhserverLog(action, rubriqueIds, 1);
      }
      resolve(response.data);
    } catch (error) {

      Logger.error("Erreur lors de l'envoi rubrique vers focus ecole");
      if (setLog) {
        const action = "ENVOYER_RUBRIQUE";
        await functions.insertWhserverLog(action, rubriqueIds, 0);
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
      const url1 = `${WHSERVER_BASE_URL}/ajouter/optiontypeclasserubriqueobligatoire`;
      const url2 = `${WHSERVER_BASE_URL}/ajouter/typeclasserubriqueobligatoire`;
      const url3 = `${WHSERVER_BASE_URL}/ajouter/echeanciertypeclasserubriqueobligatoire`;
      await fetchPrivateRoute(url1, optionTypeClasseRubriqueObligatoire);
      await fetchPrivateRoute(url2, typeClasseRubriqueObligatoire);
      await fetchPrivateRoute(url3, echeancierTypeClasseRubriqueObligatoire);

      if (setLog) {
        await functions.insertWhserverLog(action, null, 1);
      }
      resolve(true);
    } catch (error) {
      if (setLog) {
        const action = "ENVOYER_ECHEANCIER_OPTIONNEL_GLOBAL";
        await functions.insertWhserverLog(action, null, 0);
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

      //envoyer les données rubriques personnalisé et echeances vers focus ecole
      const url1 = `${WHSERVER_BASE_URL}/ajouter/eleverubrique`;
      const url2 = `${WHSERVER_BASE_URL}/ajouter/echeancierpersonneleleverubrique`;
      await fetchPrivateRoute(url1, eleveRubriques);
      await fetchPrivateRoute(url2, echancePersonnelEleveRubriques);
      if (setLog) {
        await functions.insertWhserverLog(action, elevesIds, 1);
      }
      resolve(true);
    } catch (error) {
      if (setLog) {
        const action = "ENVOYER_ELEVE_RUBRIQUE_PERSONNEL";
        await functions.insertWhserverLog(action, elevesIds, 0);
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

      const url = `${WHSERVER_BASE_URL}/ajouter/souscriptionfraisrubriqueoptionnel`;
      const response = await fetchPrivateRoute(url, souscriptions);

      if (setLog) {
        await functions.insertWhserverLog(action, null, 1);
      }
      resolve(response);
    } catch (error) {

      Logger.error("Erreur lors de l'envoi echeancier global optionnnelle");
      if (setLog) {
        const action = "ENVOYER_SOUSCRIPTION_FRAIS_OPTIONNEL";
        await functions.insertWhserverLog(action, null, 0);
      }
      reject(error);
    }
  });
};



/**
 * envoyer les données d'initialisation zipper en ligne
 * @param fields 
 * @param data les données pour construire le zip
 * @param url l'url sur lequel envoyé le fichier zip
 * @param zipName le nom du fichier zipper
 * @param fileName le nom du fichier extrait zip 
 * @returns 
 */
export const sendZippedInitializeData = async (fields: any[], data: any[], url: string, zipName: string, fileName: string, additionalPayload: any = {}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const jsonParser = new Json2csvParser({ fields, header: false, quote: '', delimiter: ';', eol: '\r\n', defaultValue: "NULL" });
      const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab",]);

      //zipper evalnotes
      const csv_content = jsonParser.parse(data);

      // generate encrypted zipFile
      const output = fs.createWriteStream(`${downloadDir}/${zipName}`);
      // const archive = archiver.create('zip-encrypted', { zlib: { level: 8 }, encryptionMethod: 'aes256', password: zipPwd });
      const archive = archiver.create('zip', { zlib: { level: 8 } });
      archive.pipe(output);
      archive.append(csv_content, { name: fileName })
      archive.finalize();

      const form = new FormData();
      const path = `${downloadDir}/${zipName}`
      // const zipFile =  fs.createReadStream(path)
      form.append("zip_file", archive, zipName);
      form.append('anneeScolaire', anscol1);
      form.append('codeEtab', codeetab);
      form.append('additionalPayload', JSON.stringify(additionalPayload));

      // let data: any = new FormData();

      const response = await axios({
        method: "post",
        url,
        headers: {
          ...form.getHeaders(),
          "Content-Type": "multipart/form-data",
        },
        data: form,
      });

      // supprime le zip
      await fse.remove(path)
      resolve(response)
    } catch (error) {
      reject(error);
    }
  });
}

export const etatDonneesEnLigne = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const { anscol1, codeetab } = paramObj;
      const url = `${WHSERVER_BASE_URL}/etatdonneesenligne`;
      const response: any = await fetchPublicRoute(url, { anscol1, codeetab });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * envoyer les moyennes des eleves en lignes
 * @returns 
 */
export const envoyerMoyennes = (periodeEval: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab",]);

      //recuperer repartion_classe_matiere_prof du general 
      const classesMatieresProfsGeneral = await functionsVba.fetchClassesMatieresProfsGeneral();

      //recuperer promotion notes et t_notes
      const tNotes = await functionsVba.fetchTNotesGeneral(periodeEval);
      const notes = await functionsVba.fetchNotesGeneral(periodeEval);

      //merger les notes et t_notes (rang et moyenne)
      const noteTNotes =
        merge2ArraysOfObjects(
          tNotes,
          notes,
          "idEleve"
        );

      //tableaux pour recuillir les moyennes
      const moyennesMatieres: IMoyenneMatiere[] = [];
      const moyennesGeneral: IMoyenneGeneral[] = [];

      //parcourrir t_notes 
      noteTNotes.map(tNoteItem => {
        //recuperer et parcourir classe matiere de l'eleve
        let eleveClasseMatieres = classesMatieresProfsGeneral.filter(item => item.refClasse === tNoteItem.RefClasse);

        //enlever matiere lv2 que ne fait pas l'elève
        switch (tNoteItem.classeLV2) {
          case "Allemand":
            eleveClasseMatieres = eleveClasseMatieres.filter(item => item.matLong !== "Espagnol");
            break;
          case "Espagnol":
            eleveClasseMatieres = eleveClasseMatieres.filter(item => item.matLong !== "Allemand");
            break;
          case "Mixte":
            switch (tNoteItem.LV2) {
              case "Allemand":
                eleveClasseMatieres = eleveClasseMatieres.filter(item => item.matLong !== "Espagnol")
                break;
              case "Espagnol":
                eleveClasseMatieres = eleveClasseMatieres.filter(item => item.matLong !== "Allemand")
                break;
            }
            break
          default:
            break;
        }

        //enlever matiere artistique que ne fait pas l'elève
        const classeArtsUpperCase = tNoteItem.classeArts ? tNoteItem.classeArts.toUpperCase() : null;
        switch (classeArtsUpperCase) {
          case "MUS":
            eleveClasseMatieres = eleveClasseMatieres.filter(item => item.matCourt !== "AP")
            break;
          case "AP":
            eleveClasseMatieres = eleveClasseMatieres.filter(item => item.matCourt !== "MUS")
            break;
          case "MIXTE":
            switch (tNoteItem.Arts) {
              case "MUS":
                eleveClasseMatieres = eleveClasseMatieres.filter(item => item.matCourt !== "AP")
                break;
              case "AP":
                eleveClasseMatieres = eleveClasseMatieres.filter(item => item.matCourt !== "MUS")
                break;
            }
          default:
            break;
        }

        eleveClasseMatieres.map(matiereItem => {
          //créer dynamiquement les champs (notes et rangs) associé à la matiere et periode (eg:SVT1,MATH2)
          const nomChamp = getNomChampMatiere(matiereItem.idMatiere, matiereItem.matCourt)
          const champMoyenne = `${nomChamp}${periodeEval}`;
          const champRang = `Rang${nomChamp}${periodeEval}`;

          moyennesMatieres.push({
            anneeScolaire: anscol1,
            codeEtab: codeetab,
            idEleve: tNoteItem.idEleve,
            idMatiere: matiereItem.idMatiere,
            idMatiereParent: matiereItem.idMatiereParent,
            moyenne: tNoteItem[champMoyenne],
            rang: tNoteItem[champRang],
            periode: periodeEval
          })
        })

        //ajouter rang et moyenne français au premier cycle
        if (tNoteItem.RefTypeClasse < 5) {
          const champMoyenneFrancais = `FR${periodeEval}`;
          const champRangFrancais = `RangFR${periodeEval}`;
          moyennesMatieres.push({
            anneeScolaire: anscol1,
            codeEtab: codeetab,
            idEleve: tNoteItem.idEleve,
            idMatiere: 1,
            idMatiereParent: null,
            moyenne: tNoteItem[champMoyenneFrancais],
            rang: tNoteItem[champRangFrancais],
            periode: periodeEval
          })
        }

        //ajouter rang et moyenne general
        const champMoyenneGeneral = `MOYG${periodeEval}`;
        const champRangGeneral = `RangG${periodeEval}`;
        moyennesGeneral.push({
          anneeScolaire: anscol1,
          codeEtab: codeetab,
          idEleve: tNoteItem.idEleve,
          moyenne: tNoteItem[champMoyenneGeneral],
          rang: tNoteItem[champRangGeneral],
          periode: periodeEval
        })
      })

      await envoyerResultatScolaireTechGeneralEnLigne(moyennesMatieres, moyennesGeneral, periodeEval)
      resolve(true);
    } catch (error) {
      console.log("🚀 ~ returnnewPromise ~ error:", error)
      reject(error);
    }
  });
};


/**
 * construire les fichiers zip des moyennes par matieres et generale et envoyer en ligne
 * @param moyennesMatieres 
 * @param moyennesGeneral 
 * @param periodeEval 
 * @returns 
 */
const envoyerResultatScolaireTechGeneralEnLigne = (moyennesMatieres: IMoyenneMatiere[], moyennesGeneral: IMoyenneGeneral[], periodeEval) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab",]);
      const sessionID = uuid.v4()

      //envoyer rang et moyennes general en ligne
      const fieldsMoyenneGeneral = [
        {
          label: 'anneeScolaire',
          value: 'anneeScolaire',
        },
        {
          label: 'codeEtab',
          value: 'codeEtab',
        },
        {
          label: 'idEleve',
          value: 'idEleve',
        },
        {
          label: 'moyenne',
          value: (row, field) => row[field.label] || "NULL",
          default: 'NULL'
        },
        {
          label: 'rang',
          value: (row, field) => row[field.label] || "NULL",
          default: 'NULL'
        },
        {
          label: 'periode',
          value: 'periode',
        },
      ]
      const urlMoyenneGeneral = `${WHSERVER_BASE_URL}/initialiser-moyenne-general`;
      const zipNameMoyenneGeneral = `moyenne_general_${anscol1}_${codeetab}_${sessionID}.zip`
      const fileNameMoyenneGeneral = `moyenne_general.csv`;
      await sendZippedInitializeData(fieldsMoyenneGeneral, moyennesGeneral, urlMoyenneGeneral, zipNameMoyenneGeneral, fileNameMoyenneGeneral)

      // envoyer moyennes matières
      const fieldsMoyennesMatieres = [
        {
          label: 'anneeScolaire',
          value: 'anneeScolaire',
        },
        {
          label: 'codeEtab',
          value: 'codeEtab',
        },
        {
          label: 'idEleve',
          value: 'idEleve',
        },
        {
          label: 'idMatiere',
          value: 'idMatiere',
        },
        {
          label: 'idMatiereParent',
          value: (row, field) => row[field.label] || "NULL",
          default: 'NULL'
        },
        {
          label: 'moyenne',
          value: (row, field) => row[field.label] ?? "NULL",
          default: 'NULL'
        },
        {
          label: 'rang',
          value: (row, field) => row[field.label] || "NULL",
          default: 'NULL'
        },
        {
          label: 'periode',
          value: 'periode',
        },
      ]
      const url = `${WHSERVER_BASE_URL}/initialiser-moyenne-matiere`;
      const zipName = `moyenne_matiere_${anscol1}_${codeetab}_${sessionID}.zip`
      const fileName = `moyenne_matiere.csv`;
      await sendZippedInitializeData(fieldsMoyennesMatieres, moyennesMatieres, url, zipName, fileName, { periodeEval: periodeEval })


      resolve(true);
    } catch (error) {
      console.log("🚀 ~ returnnewPromise ~ error:", error)
      reject(error);
    }
  });
};



/**
 * obtenir le nom du champ de la matiere general dans spider vba
 */
function getNomChampMatiere(idMatiere: number, libelleMatiereCourt: string) {
  let nomChamp: string;
  switch (idMatiere) {
    case 5://allemand
    case 6://espagnol
      nomChamp = "LV2"
      break;
    case 10://AP
    case 11://musique
      nomChamp = "APMUS"
      break;
    case 8://physique chimie
      nomChamp = "SP"
      break;
    case 13://EDHC
      nomChamp = "ECM"
      break;
    case 24://MCA
      nomChamp = "MCA"
      break;
    case 25://MCB
      nomChamp = "MCB"
      break;
    case 200://MCC
      nomChamp = "MCC"
      break;
    case 201://MCD
      nomChamp = "MCD"
      break;
    default:
      nomChamp = libelleMatiereCourt
      break;
  }
  return nomChamp;
}

/**
 * envoyer les resultats scolaire du primaire en ligne
 * @returns 
 */
export const envoyerResultatScolairePrimaire = (compoIds: string[]) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab",]);

      //obtenir la liste de notes des matiere de chaque composition
      const notes = await functionsVba.compoMatieresNotes(compoIds);

      //envoyer rang et moyennes par matiere en lignes
      const fields = [
        {
          label: 'anneeScolaire',
          value: 'anneeScolaire',
        },
        {
          label: 'codeEtab',
          value: 'codeEtab',
        },
        {
          label: 'idCompo',
          value: 'idCompo',
        },
        {
          label: 'idEleve',
          value: 'idEleve',
        },
        {
          label: 'idMatiere',
          value: 'idMatiere',
        },
        {
          label: 'libelleMatiere',
          value: 'libelleMatiere',
        },
        {
          label: 'note',
          value: (row, field) => row[field.label] ?? "NULL",
          default: 'NULL'
        },
        {
          label: 'matiereNoteSur',
          value: (row, field) => row[field.label] ?? "NULL",
          default: 'NULL'
        },
        {
          label: 'rang',
          value: (row, field) => row[field.label] || "NULL",
          default: 'NULL'
        },
        {
          label: 'idMatiereParent',
          value: (row, field) => row[field.label] || "NULL",
          default: 'NULL'
        },
        {
          label: 'matiereParentNoteSur',
          value: (row, field) => row[field.label] ?? "NULL",
          default: 'NULL'
        }
      ]
      const sessionID = uuid.v4()
      const url = `${WHSERVER_BASE_URL}/envoyer-compo-matiere-note`;
      const zipName = `compo_matiere_note_${anscol1}_${codeetab}_${sessionID}.zip`
      const fileName = `compo_matiere_note.csv`;
      await sendZippedInitializeData(fields, notes, url, zipName, fileName, compoIds)

      //recupperer les moyennes obtenu pour chaque composition
      const moyennes = await functionsVba.compoMoyennes(compoIds);
      const fieldsMoy = [
        {
          label: 'anneeScolaire',
          value: 'anneeScolaire',
        },
        {
          label: 'codeEtab',
          value: 'codeEtab',
        },
        {
          label: 'idCompo',
          value: 'idCompo',
        },
        {
          label: 'idEleve',
          value: 'idEleve',
        },
        {
          label: 'libelle',
          value: 'libelle',
        },
        {
          label: 'compoOfficiel',
          value: (row, field) => row[field.label] ? 1 : 0,
          default: 1
        },
        {
          label: 'comptabilise',
          value: (row, field) => row[field.label] ? 1 : 0,
          default: 1
        },
        {
          label: 'moyenne',
          value: (row, field) => row[field.label] ?? "NULL",
          default: 'NULL'
        },
        {
          label: 'rang',
          value: (row, field) => row[field.label] || "NULL",
          default: 'NULL'
        },
        {
          label: 'moyenneSur',
          value: (row, field) => row[field.label] ?? "NULL",
          default: 'NULL'
        },
        {
          label: 'dateCompo',
          value: (row, field) => moment(row[field.label]).format("YYYY-MM-DD") !== "1970-01-01" ? moment(row[field.label]).format("YYYY-MM-DD") : "NULL",
          default: 'NULL'
        }
      ]
      const urlMoy = `${WHSERVER_BASE_URL}/envoyer-compo-moyenne`;
      const zipNameMoy = `compo_moyenne_${anscol1}_${codeetab}_${sessionID}.zip`
      const fileNameMoy = `compo_moyenne.csv`;
      await sendZippedInitializeData(fieldsMoy, moyennes, urlMoy, zipNameMoy, fileNameMoy, compoIds)
      resolve(true)
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * OBtenir la liste des compositions programmés pour le primaire
 * @returns 
 */
export const listeCompoPrimaire = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const compos = await functionsVba.getListeCompoPrimaire();
      // console.log("🚀 ~ returnnewPromise ~ compos:", compos)
      resolve(compos);
    } catch (error) {
      reject(error);
    }
  });
};



/**
 * Envoyer les resultats scolaire du technique en ligne
 * @param periodeEval 
 * @returns 
 */
export const envoyerResultatsScolaireTechnique = (periodeEval: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab",]);
      //recupperer les moyennes par martieres
      const moyennesMatieres = await functionsVba.getMoyennesMatieresTechnique(periodeEval);

      //recupperer les mooyennes generales
      const moyennesGenerales = await functionsVba.getMoyennesGeneralesTechnique(periodeEval);

      await envoyerResultatScolaireTechGeneralEnLigne(moyennesMatieres, moyennesGenerales, periodeEval)

      resolve(moyennesGenerales);
    } catch (error) {
      reject(error);
    }
  });
};


/**
 * Obtenir la liste des classes, matieres et profs d'un etablissement donné en fonction de l'année scolaire chargé 
 * @returns 
 */
export const getListeEvaluationsProgrammees = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const { anscol1, codeetab } = paramObj;
      const url = `${WHSERVER_BASE_URL}/liste-evaluations-programmation`;
      const response: any = await fetchPrivateRoute(url, { anscol1, codeetab });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const updateRecupInEvaluationnote = (data: { idsEvalProg: string[], recup: number }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const { anscol1, codeetab } = paramObj;
      const { idsEvalProg, recup } = data;
      const url = `${WHSERVER_BASE_URL}/updaterecupinevaluationnote`;
      const response: any = await fetchPrivateRoute(url, { anscol1, codeetab,idsEvalProg, recup});
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};


export default {
  initializeData,

  envoyerVersement,
  modifierVersement,
  supprimerVersement,
  envoyerEcheancierIndividuel,

  createStudent,
  envoyerEleves,
  modifierEleve,
  supprimerEleves,

  envoyerClasses,
  modifierClasse,
  supprimerClasses,

  getLogs,

  sendSeances,
  updateSeance,
  deleteSeance,

  sendPersonnel,
  updatePersonnel,
  deletePersonnel,
  envoyerClassesMatiereProf,

  envoyerMoyennes,
  sendEvaluationNotes,
  updateEvalNotes,
  deleteEvalNotes,
  sendEvalProg,
  updateEvalProg,
  deleteEvalProg,
  envoyerResultatScolairePrimaire,
  listeCompoPrimaire,
  envoyerResultatsScolaireTechnique,

  activateWarehouse,
  deactivateWarehouse,
  checkWarehouseActivatedAndAuthorizedHddSerialNumber,
  envoyerParamEtab,

  partnersList,
  sendSalles,
  deleteRooms,
  sendPlageHoraires,
  sendModelePlageHoraires,
  sendHoraires,
  sendPlanning,
  sendMatieres,

  etatDonneesEnLigne,

  getListeEvaluationsProgrammees,
  updateRecupInEvaluationnote

};
