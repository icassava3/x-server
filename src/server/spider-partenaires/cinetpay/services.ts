import { checkWarehouseActivatedAndAuthorizedHddSerialNumber } from './../../spider-whserver/services';
import { paramEtabObjet } from './../../databases/accessDB';
import Logger from "../../helpers/logger";
import functions from "./functions";
import {
  IActivateService,
  ICheckPaymentStatusPayload,
  ICredentialItem,
  IPaymentData,
} from "./interfaces";
import { GLOBAL_API_BASE_URL } from "../../helpers/constants";


import { CINETPAY_SERVER_BASE_URL, CINETPAY_SERV_ID } from "./constants";
import { fetchPrivateRoute } from '../../helpers/apiClient';
import privateFunctions from "../privateFunctions";
import redisFunctions from "../../databases/redis/functions";
import { IGlobalApiServerUser } from '../../helpers/interfaces';

/**
 * Activer ou desactiver le service cinetpay en ligne
 * @returns 
 */

export const activateDeactivateService = (apikey: string, site_id: number, spiderKey: string, action: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const keyByType = privateFunctions.getKeyByType("cinetpay", codeetab, anscol1);
      const currentPcHDDSerialNumber = await redisFunctions.getGlobalVariable("currentPcHDDSerialNumber");
      if (keyByType !== spiderKey) {
       
        reject({ name: "SPIDER_KEY_ERROR", message: "La clé spider fournit est incorrect" });
        return false;
      }
      //Activer le service cinetpay sur la base en ligne
      const apiPayload = { codeEtab: codeetab, anneeScolaire: anscol1, apikey, site_id, action, hddserialnumber: currentPcHDDSerialNumber }
      const apiUrl = `${CINETPAY_SERVER_BASE_URL}/schoolfees/activatedeactivateservice`;
      const result: any = await fetchPrivateRoute(apiUrl, apiPayload)

      if (result.status === 1) {
        resolve(result.data)
      } else {
        reject(result.errors);
      }
    } catch (error) {
      console.log("🚀 ~ file: services.ts:47 ~ returnnewPromise ~ error:", error)
      reject(error);
    }
  });
};


/**
 * obtenir un l'url à partir de spider-cinetpay-server.
 * On reçoit en body paymentData, et on ajoute userData
 * ici pour construire apiPayload
 * @param paymentData 
 * @returns 
 */
const getPaymentUrl = (paymentData: IPaymentData) => {
  return new Promise(async (resolve, reject) => {
    try {

      await checkServiceCinetpayActivatedAndAuthorizedHddSerialNumber()  //verifier le service cinetay activé
     // await checkWarehouseActivatedAndAuthorizedHddSerialNumber(); // verifier webservice activé sur ce post
      // const globalApiServerCredentials = await redisFunctions.getGlobalVariable("globalApiServerCredentials") as IGlobalApiServerUser;
      const globalApiServerCredentials = await redisFunctions.getSecureData("globalApiServerCredentials") as IGlobalApiServerUser;
      const { appID, userPhone, password, token } = globalApiServerCredentials
      const userData = { appID, userPhone, password, token }
      const apiPayload = { userData, paymentData }

      const apiUrl = `${CINETPAY_SERVER_BASE_URL}/schoolfees/getPaymentUrl`;

      //la route pour obtenir un url de payment est une route protegé chez cinetpay server
      const result: any = await fetchPrivateRoute(apiUrl, apiPayload)
      if (result.data.hasOwnProperty("paymentUrl") && result.data.hasOwnProperty("transaction_id")) {
        resolve(result.data);
      } else {
        reject(result.data.description);
      }
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * obtenir l'apiKey et le siteId d'un etablissement 
 * depuis la base centrale en ligne
 * @param codeEtab
 * @returns
 */
const getCredentials = () => {
  return new Promise(async (resolve, reject) => {
    try {

      await checkServiceCinetpayActivatedAndAuthorizedHddSerialNumber() //verifier le service cinetay activé

      const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);

      //obtenir les credentials cinetpay de cet etablissement depuis cinetpay server
      const apiPayload = { codeEtab: codeetab, anneeScolaire: anscol1 }
      const apiUrl = `${CINETPAY_SERVER_BASE_URL}/schoolfees/getcredentials`;

      const result: any = await fetchPrivateRoute(apiUrl, apiPayload)
      if (result.status === 1) {
        resolve(result.data);
      } else {
        throw "School credentials not found";
      }
    } catch (error) {
      console.log("🚀 ~ file: services.ts ~ line 155 ~ returnnewPromise ~ error", error)
      reject(error);
    }
  });
};

/**
 * Obtenir le status d'une transaction cinetpay
 * @param apiPayload 
 * @returns 
 */
const checkPaymentStatus = (data: ICheckPaymentStatusPayload) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkServiceCinetpayActivatedAndAuthorizedHddSerialNumber() //verifier le service cinetay activé
      const apiUrl = `${CINETPAY_SERVER_BASE_URL}/schoolfees/checkpaymentstatus`;
      const { anscol1, codeetab } = await paramEtabObjet([
        "Anscol1",
        "CodeEtab",
      ]);

      const apiPayload = {
        codeEtab: codeetab,
        transaction_id: data.transaction_id,
        anneeScolaire: anscol1
      }
      const result: any = await fetchPrivateRoute(apiUrl, apiPayload)
      if (result.status === 1) {
        resolve(result.data);
      } else {
        reject(result.data.description);
      }

    } catch (error) {
      reject(error);
    }
  });
};

/**
 * synchroniser le numero versement spider et l'id de la transaction
 * @param versement_id 
 * @param transaction_id 
 * @returns 
 */
const syncPaymentId = (versement_id: number, transaction_id: string, setLog = true) => {
  return new Promise(async (resolve, reject) => {
    try {
      //verifier le service cinetay activé
      await checkServiceCinetpayActivatedAndAuthorizedHddSerialNumber()
      const apiUrl = `${CINETPAY_SERVER_BASE_URL}/schoolfees/syncpaymentid`;
      const apiPayload = {
        transaction_id,
        versement_id
      }
      const result: any = await fetchPrivateRoute(apiUrl, apiPayload)
      const action = "SYNC_TRANSACTION_VERSEMENT";
      if (result.status === 1) {
        if (setLog) {
          await functions.setCinetPayHistoric(action, apiPayload, 1)
        }
        resolve(result.data);
      } else {
        if (setLog) {
          await functions.setCinetPayHistoric(action, apiPayload, 0)
        }
        reject("Une erreur s'est produite lors de la synchronisation versement spider et transaction cinetpay");
      }
    } catch (error) {
      if (setLog) {
        const action = "SYNC_TRANSACTION_VERSEMENT";
        const apiPayload = { transaction_id, versement_id }
        await functions.setCinetPayHistoric(action, apiPayload, 0)
      }
      reject(error);
    }
  });
};

/**
 * recupperer l'historique des logs cinetpay
 * @returns 
 */
export const getLogs = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkServiceCinetpayActivatedAndAuthorizedHddSerialNumber() //verifier le service cinetay activé
      const logs = await functions.fetchLogs();
      resolve(logs);
    } catch (error) {
      Logger.error("Erreur de la recuperation des logs cinetpay");
      reject(error);
    }
  });
};

/**
 * recuperer et retourner les transaction succès cinetpay pour paiement de frais scolaire  (effectué depuis App focus scolaire et web Frais scolaire) qui ne sont pas encore synchroniseé dans spider
 */
export const cinetpayNotRecoveredTransaction = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkServiceCinetpayActivatedAndAuthorizedHddSerialNumber() //verifier le service cinetay activé
     // await checkWarehouseActivatedAndAuthorizedHddSerialNumber(); // verifier webservice activé sur ce post
      const { anscol1, codeetab } = await paramEtabObjet([
        "Anscol1",
        "CodeEtab",
      ]);
      const apiPayload = { anneeScolaire: anscol1, codeEtab: codeetab } //donnee etablissement
      const apiUrl = `${CINETPAY_SERVER_BASE_URL}/schoolfees/spidernotrecoveredtransaction`;
      const result: any = await fetchPrivateRoute(apiUrl, apiPayload)
      if (result.status === 1) {
        resolve(result.data)
      } else {
        reject(false)
      }
      resolve(result.data)
    } catch (error) {
      console.log("🚀 ~ file: services.ts ~ line 292 ~ returnnewPromise ~ error", error)
      Logger.error("Erreur de la recuperation transaction cinetpay");
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
      await checkServiceCinetpayActivatedAndAuthorizedHddSerialNumber() //verifier le service cinetay activé
     // await checkWarehouseActivatedAndAuthorizedHddSerialNumber(); // verifier webservice activé sur ce post
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
            case "SYNC_TRANSACTION_VERSEMENT":
              const { versement_id, transaction_id } = payload
              await syncPaymentId(versement_id, transaction_id, false);
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
 * verifier le service cinetpay activé er ce pc est autorisé a faire les operations
 * @returns 
 */
export const checkServiceCinetpayActivatedAndAuthorizedHddSerialNumber = () => {
  return new Promise(async (resolve, reject) => {
    try {
     // await checkWarehouseActivatedAndAuthorizedHddSerialNumber(); // verifier webservice activé sur ce post
      const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const cinetpayService = await redisFunctions.getGlobalVariable("cinetpayService") as any;
      const cinetpayConfig = cinetpayService.config.find(item => item.anneeScolaire === anscol1 && item.codeEtab === codeetab)
      const currentPcHDDSerialNumber = await redisFunctions.getGlobalVariable("currentPcHDDSerialNumber");

      if (!cinetpayConfig) {
        return reject({ name: "CINETPAY_NOT_ACTIVATED", message: "Le service cinetpay n'est pas activé" })
      }

      if (cinetpayConfig.hddSerialNumber !== currentPcHDDSerialNumber) return reject({ name: "CINETPAY_BAD_COMPUTER", message: "Opération non autorisée sur cet ordinateur" })

      const url = `${CINETPAY_SERVER_BASE_URL}/schoolfees/cinetpayserviceconfig`;
      const payload = { anneeScolaire: anscol1, codeEtab: codeetab }
      const response: any = await fetchPrivateRoute(url, payload)
      const cinetPayOnlineConfig = response.data
      if (!cinetPayOnlineConfig) return reject({ name: "CINETPAY_NOT_ACTIVATED_ONLINE", message: "Le service cinetpay n'est pas activé en ligne" })
      resolve(true)
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  activateDeactivateService,
  getPaymentUrl,
  getCredentials,
  checkPaymentStatus,
  syncPaymentId,
  getLogs,
  resendFailedAction,
  cinetpayNotRecoveredTransaction,
  checkServiceCinetpayActivatedAndAuthorizedHddSerialNumber
};
