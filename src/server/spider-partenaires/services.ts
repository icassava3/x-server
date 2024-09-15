import Logger from "../helpers/logger";
import servicesGain from "./gain-technologie/services";
import servicesMemo from "./memo/services";
import servicesFocusEcole from "./focus-ecole/services";
import servicesCinetPay from "./cinetpay/services";
import servicesPhotoApp from "../spider-photo-app/services";

import functions from "./functions";
import { IActivateDeactivateService, IPartner, IService } from "./interface";
import { MEMO_SERV_ID } from "./memo/constants";
import { GAIN_SERV_VIE_ECOLE_ID } from "./gain-technologie/constants";
import privateFunctions from "./privateFunctions";
import { paramEtabObjet } from "../databases/accessDB";
// import { getAccessConfig } from "../helpers/function";
import axios from "axios";
import { servicesConfig } from "../globalVariables";
import { SPIDER_GAIN_API_ID } from "../helpers/constants";
import { CINETPAY_SERV_ID, CINETPAY_SERVER_BASE_URL } from "./cinetpay/constants";
import { FOCUS_ECOLE_SERV_ID, FOCUS_ECOLE_SERVER_BASE_URL } from "./focus-ecole/constants";
import { fetchPrivateRoute } from '../helpers/apiClient';
import { getHDDSerialNumber } from "../helpers/function";
import redisFunctions from '../databases/redis/functions';
import { IAccessConfig } from "../helpers/interfaces";
import { SCHOOL_CONTROL_SERV_ID } from "./constants";
import { checkWarehouseActivatedAndAuthorizedHddSerialNumber } from "../spider-whserver/services";

var fs = require("fs");

/**
 * activer un service d'un partenaire
 * @param data le payload envoyer par le client
 * @returns
 */
const activateService = (data: IActivateDeactivateService) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("🚀 ~ file: services.ts:35 ~ activateService ~ data:", data)

      const { spiderKey, partnerKey, serviceId, methode } = data;
      const serviceData = await functions.getServiceData(serviceId);

      // old check service activated
      //if (serviceData.activated === 1) {

      //   reject({ name: "SERVICE_ALREADY_ACTIVATED", message: "Ce service est déjà activé" });
      //   return false;
      // }

      const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const currentPcHDDSerialNumber = await redisFunctions.getGlobalVariable("currentPcHDDSerialNumber");
      let configService = {};
      if (serviceData.neededKey === 1) { //les services dont l'activation requiert une cle d'activation spider

        if (!spiderKey) {  //si cle activation spider requis
          reject("La clé d’activation est requise");
          return false;
        }

        if (serviceId === GAIN_SERV_VIE_ECOLE_ID) {//activation du service GAIN
          const keyByType = privateFunctions.getKeyByType(
            "gain",
            codeetab,
            anscol1
          );

          if (keyByType !== spiderKey) {
            reject("La clé spider fournit est incorrecte");
            return false;
          }

          //crypter la cle du partner gain afin d'obtenir le token a stocker
          const fullPartnerKey = `${SPIDER_GAIN_API_ID}${partnerKey}`;

          const sha512 = require("js-sha512");
          const token = sha512(fullPartnerKey);
          //mettre ajour config service
          configService = { token };


          //test token gain valide
          const testToken = async () => {
            try {
              await servicesGain.testGainToken(token);
              return true;
            } catch (error) {
              return false;
            }
          };
          const testGainTokenSuccess = await testToken();
          if (!testGainTokenSuccess) {
            return reject(
              "Clé d'activation Gain invalide - Veuillez réessayer!"
            );
          }
        } else if (serviceId === MEMO_SERV_ID) { //activation du service memo
          const keyByType = privateFunctions.getKeyByType(
            "memo",
            codeetab,
            anscol1
          );

          if (keyByType !== spiderKey) {
            reject("La clé spider fournit est incorrecte");
            return false;
          }
        } else if (serviceId == CINETPAY_SERV_ID) {//activation du service cinetpay
          const cinetpayService = await redisFunctions.getGlobalVariable("cinetpayService") as any;

          if (cinetpayService.config.find(item => item.anneeScolaire === anscol1 && item.codeEtab === codeetab)) return reject({ name: "CINETPAY_ALREADY_ACTIVATED", message: "Le service cinetpay est déjà activé" })

          const { apikey, site_id } = data
          configService = [...cinetpayService.config, { anneeScolaire: anscol1, codeEtab: codeetab, apikey, site_id, hddSerialNumber: currentPcHDDSerialNumber }];

          const action = "activate"
          await servicesCinetPay.activateDeactivateService(apikey, site_id, spiderKey, action)
        } else if (serviceId === SCHOOL_CONTROL_SERV_ID) { //activation du service school control
         // await checkWarehouseActivatedAndAuthorizedHddSerialNumber();

          const keyByType = privateFunctions.getKeyByType(
            "schoolcontrol",
            codeetab,
            anscol1
          );

          configService = [{ anneeScolaire: anscol1, codeEtab: codeetab, hddSerialNumber: currentPcHDDSerialNumber,spiderKey }];

          if (keyByType !== spiderKey) {
            reject("La clé spider fournit est incorrecte");
            return false;
          }
          console.log("ici++++++++++++")
        }
      } else {//Les services qui n'ont pas besoin de cle d'activation spider

        switch (serviceId) {
          case FOCUS_ECOLE_SERV_ID:

            configService = { hddSerialNumber: currentPcHDDSerialNumber };
            const action = "activate"
            console.log("🚀 ~ file: services.ts ~ line 110 ~ returnnewPromise ~ action", action)
            await servicesFocusEcole.activateDeactivateService(action)
            await servicesFocusEcole.sendParamEtab()
            break;

          default:
            break;
        }

      }

      configService = JSON.stringify(configService);
      const sendData = parseInt(methode);
      const activatedData = {
        configService,
        serviceId,
        activated:1,
        sendData: sendData,
      };

      //activer le service en local
      await functions.activateDeactivateService(activatedData);
      const serviceDataUpdated = {
        ...serviceData,
        config: configService,
        activated: 1,
        sendData: sendData,
      };
      await servicesConfig(); //Mettre a jour les données dans globalVariables
      resolve(serviceDataUpdated);
    } catch (error) {
      console.log("🚀 ~ file: services.ts ~ line 136 ~ returnnewPromise ~ error", error)
      Logger.error(
        "Une erreur s'est produite lors de l'activation d'un service chez un partenaire"
      );
      reject(error);
    }
  });
};

/**
 * desactiver un service
 * @param serviceId
 * @returns
 */
const deactivateService = (data: IActivateDeactivateService) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { serviceId, spiderKey } = data
      const serviceData = await functions.getServiceData(serviceId);
      console.log("🚀 ~ file: services.ts:190 ~ returnnewPromise ~ serviceData:", serviceData)

      //si service est cinetpay, desactiver premierement en ligne 
      // if (serviceData.activated === 0) {
      //   reject("Ce service est déjà desactivé");
      //   return false;
      // }
      const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      let configService = [];
      if (serviceId == CINETPAY_SERV_ID) {//desactivation du service cinetpay
        const cinetpayService = await redisFunctions.getGlobalVariable("cinetpayService") as any;
        await servicesCinetPay.checkServiceCinetpayActivatedAndAuthorizedHddSerialNumber()
        const { apikey, site_id, spiderKey } = data
        const action = "deactivate"
        await servicesCinetPay.activateDeactivateService(apikey, site_id, spiderKey, action)
        configService = cinetpayService.config.filter(item => (item.anneeScolaire !== anscol1 && item.codeEtab !== codeetab))
        await redisFunctions.addGlobalVariable("cinetpayService", cinetpayService);
      }

      if (serviceId == SCHOOL_CONTROL_SERV_ID) {//desactivation du service school control
       // await checkWarehouseActivatedAndAuthorizedHddSerialNumber();

        const keyByType = privateFunctions.getKeyByType(
          "schoolcontrol",
          codeetab,
          anscol1
        );
        if (keyByType !== spiderKey) {
          reject("La clé spider fournit est incorrecte");
          return false;
        }
      }

      if (serviceId == FOCUS_ECOLE_SERV_ID) {//desactivation du service cinetpay
        const action = "deactivate"
        console.log("🚀 ~ file: services.ts ~ line 176 ~ returnnewPromise ~ action", action)
        await servicesFocusEcole.activateDeactivateService(action)
      }
      const configServiceStringify = JSON.stringify(configService);

      const activatedData = {
        configService: configServiceStringify,
        serviceId,
        activated:0,
        sendData: 0,
      };
      await functions.activateDeactivateService(activatedData);
      const serviceDataUpdated = {
        ...serviceData,
        config: configService,
        activated: 0,
        sendData: 0,
      };

      await servicesConfig(); //Mettre a jour les données dans globalVariables
      resolve(serviceDataUpdated);
    } catch (error) {
      Logger.error(
        "Une erreur s'est produite lors de la desactivation d'un service"
      );
      reject(error);
    }
  });
};

/**
 * initialiser ou reinitialiser un service
 * @returns
 */
const initializeService = (serviceId: string, io: any, sections: string[]) => {
  return new Promise(async (resolve, reject) => {
    try {
      const serviceData: IService = await functions.getServiceData(serviceId);

      if (serviceData.activated !== 1) {
        return reject("Ce service n'est pas encore activé");
      }
      if (serviceId === MEMO_SERV_ID) {
        await servicesMemo.initializeService(io);
      } else if (serviceId == GAIN_SERV_VIE_ECOLE_ID) {
        await servicesGain.initializeService(io, sections);
      } else if (serviceId === FOCUS_ECOLE_SERV_ID) {
        await servicesFocusEcole.initializeService(io, sections);

      }
      //marque le service comme initilaisé
      await functions.initializeService(serviceId);
      const serviceDataUpdated = { ...serviceData, initialized: 1 };
      resolve(serviceDataUpdated);
    } catch (error) {
      Logger.error(
        "Une erreur s'est produite lors de l'initialisation du service - Veuillez réessayer!"
      );
      reject(error);
    }
  });
};

/**
 * envoyer l'ensemble des photos eleves au format zip a un gain technologie (SERVICE API_VIE_ECOLE)
 */
const sendPhotosZip = () => {
  return new Promise(async (resolve, reject) => {
    try {

      //envoi photo zip si le services est gain technologie
      const serviceMatch = globalThis.gainService;
      const serviceData = serviceMatch[0];
      if (serviceData.activated !== 1) {
        return reject("Ce service n'est pas encore activé");
      }
      if (serviceData.initialized !== 1) {
        return reject("Veuillez premièrement initialiser cet service");
      }
      //recupperer zipper les photos eleves et stocker
      const { anscol1 } = await paramEtabObjet(["Anscol1"]);
      const AdmZip = require("adm-zip");
      const zip = new AdmZip();
      // const config = getAccessConfig();
      const config = await redisFunctions.getGlobalVariable("accessConfig") as IAccessConfig;
      const photoDir = config.studentsPhotoDir;
      const zipName = `photos_eleves_${anscol1}.zip`;
      const zipPath = `${photoDir}${zipName}`;
      const GAIN_URL = "";
      zip.addLocalFolder(photoDir);
      zip.writeZip(zipPath);

      //envoyer les photos zippé a gain technologies
      let data: any = new FormData();
      data.append("photos", fs.createReadStream(zipName));
      const apiConfig: any = {
        method: "post",
        url: `${GAIN_URL}/envoiphotozip`,
        headers: {
          "Content-Type": `multipart/form-data; boundary=${data.boundary}`,
        },
        data: data,
      };

      await axios(apiConfig);

      resolve(true);
    } catch (error) {
      Logger.error(
        "Une erreur s'est produite lors de l'initialisation de la liste des partenaires"
      );
      reject(error);
    }
  });
};

/**
 * retourner tous les logs de gains
 * @returns
 */
const getGainLogs = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let dataGain: any = false;
      const excecuteGain = async () => {
        try {
          //si ce service gain autorise l'envoi des données spider
          dataGain = await servicesGain.getGainLogs();

        } catch (error) {
          console.log({ error });
        }
      };
      await excecuteGain();

      const data = { dataGain };
      resolve(data);
    } catch (error) {
      Logger.error("Erreur lors de la recuperation des logs de Gain");
      reject(error);
    }
  });
};

/**
 * Envoyer a nouveau une plusieurs action gain qui a (ont) echoué(és) auparavant
 * @params logIds
 */
const resendGainAction = (logIds: number[]) => {
  return new Promise(async (resolve, reject) => {
    try {
      let dataGain: any = false;
      const excecuteGain = async () => {
        try {
          if (globalThis.gainService[0].sendData === 1) {
            //si ce service gain autorise l'envoi des données spider
            dataGain = await servicesGain.resendGainAction(logIds);
          }
        } catch (error) {
          console.log({ error });
        }
      };
      await excecuteGain();

      const data = { dataGain };
      resolve(data);
    } catch (error) {
      Logger.error("Erreur creation classe chez les patenaires");
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
 * ajouter un eleves chez les differents partenaires
 * @param studentId
 * @returns
 */
const studentAdd = (studentIds: number[] | null) => {
  return new Promise(async (resolve, reject) => {
    try {
      //ajouter eleve chez gain technologie
      let dataGain: any = false;
      const excecuteGain = async () => {
        try {
          dataGain = await servicesGain.ajouterEleves(studentIds);
        } catch (error) {
          console.log("🚀 ~ file: services.ts ~ line 61 ~ excecuteGain ~ error", error);
        }
      };
      await excecuteGain();

      //ajouter eleve chez memo
      let dataMemo: any = false;
      const excecuteMemo = async () => {
        try {
          dataMemo = await servicesMemo.ajouterEleves(studentIds);
        } catch (error) {
          console.log("🚀 ~ file: services.ts ~ line 437 ~ excecuteMemo ~ error", error)

        }
      };
      await excecuteMemo();

      //ajouter eleve chez focus ecole 
      let dataFocusEcole: any = false;
      const excecuteFocusEcole = async () => {
        try {
          dataFocusEcole = await servicesFocusEcole.sendStudents(studentIds);
          //envoyer l'echeancier de l'eleve qui viend d'etre ajouté
          await servicesFocusEcole.sendIndividualEcheanciers(studentIds);
        } catch (error) {
          console.log("🚀 ~ file: services.ts ~ line 437 ~ excecuteFocusEcole ~ error", error)

        }
      };
      await excecuteFocusEcole();

      //retourner les eleves pour l"appli spider photosApp
      const dataPhotoApp = await servicesPhotoApp.fetchStudents(studentIds);
      const photoResult = { status: true, data: dataPhotoApp };

      const data = { dataGain, dataMemo, dataFocusEcole, photoResult };
      resolve(data);
    } catch (error) {
      Logger.error("Erreur de l'ajout d'un élève chez les patenaires");
      reject(error);
    }
  });
};

/**
 * Mettre a jour les données d'un etudiant ches tous les patenaires
 * @param studentId
 * @returns
 */
const studentUpdate = (studentId: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      //modifier eleve chez gain technologie
      let dataGain: any = false;
      const excecuteGain = async () => {
        try {
          dataGain = await servicesGain.modifierEleve(studentId);
        } catch (error) {
          console.log({ error });
        }
      };
      await excecuteGain();

      //modifier eleve chez memo
      let dataMemo: any = false;
      const excecuteMemo = async () => {
        try {
          if (globalThis.focusEcoleService[0].sendData === 1) {
            dataMemo = await servicesMemo.modifierEleve(studentId);
          }
        } catch (error) {
          console.log({ error });
        }
      };
      await excecuteMemo();

      //modifier eleve chez focus ecole
      let dataFocusEcole: any = false;
      const excecuteFocusEcole = async () => {
        try {
          let studentIds = [studentId] // on formate vu la la fonction sendStudents attend un tableau de number ou null
          dataFocusEcole = await servicesFocusEcole.sendStudents(studentIds);
        } catch (error) {
          console.log({ error });
        }
      };
      await excecuteFocusEcole();

      const data = { dataGain, dataMemo, dataFocusEcole };
      console.log("🚀 ~ file: services.ts ~ line 513 ~ returnnewPromise ~ data", data)

      resolve(data);
    } catch (error) {
      Logger.error("Erreur lors de la modification eleve chez les partenaires");
      reject(error);
    }
  });
};

/**
 * supprimer un etudiant ches tous les patenaires
 * @param studentId
 * @returns
 */
const studentDelete = (studentIds: number[] | null) => {
  return new Promise(async (resolve, reject) => {
    try {
      //supprimer un eleve chez gain technologie
      let dataGain: any = false;
      const excecuteGain = async () => {
        try {
          dataGain = await servicesGain.supprimerEleve(studentIds);
        } catch (error) {
          console.log({ error });
        }
      };
      await excecuteGain();

      //supprimer eleve chez memo
      let dataMemo: any = false;
      const excecuteMemo = async () => {
        try {
          dataMemo = await servicesMemo.supprimerEleves(studentIds);
        } catch (error) {
          console.log({ error });
        }
      };
      await excecuteMemo();

      let dataFocusEcole: any = false;
      const excecuteFocusEcole = async () => {
        try {
          dataFocusEcole = await servicesFocusEcole.deleteStudents(studentIds);
        } catch (error) {
          console.log({ error });
        }
      };
      await excecuteFocusEcole();

      const data = { dataGain, dataMemo, dataFocusEcole };



      resolve(data);
    } catch (error) {
      Logger.error("Erreur lors de la suppression eleve chez les partenaires");
      reject(error);
    }
  });
};

/**
 * Synchroniser les identifiants eleves chez Gain et spider
 */
const synchroniserIdentifiant = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // creer une classe chez gain technologie
      let dataGain: any = false;
      const excecuteGain = async () => {
        try {
          if (globalThis.gainService[0].sendData === 0) {
            // methode ne recoit pas les données de spider
            dataGain = await servicesGain.synchroniserIdentifiant();
          }
        } catch (error) {
          console.log({ error });
        }
      };
      await excecuteGain();

      const data = { dataGain };
      resolve(data);
    } catch (error) {
      Logger.error("Erreur creation classe chez les patenaires");
      reject(error);
    }
  });
};
/**
 * communiqué (envoyé) les données de paiement pour un ou plusieurs versement
 * @param versementId
 * @returns
 */
const insertPayments = (versementIds: number[] | null = null) => {
  return new Promise(async (resolve, reject) => {
    try {
      //inserer les paiement suivant un ou plusieurs versement chez gain technologie
      let dataGain: any = false;
      const excecuteGain = async () => {
        try {
          if (globalThis.gainService[0].sendData === 1) {
            dataGain = await servicesGain.insererPaiement(versementIds);
          }
        } catch (error) {
          console.log({ error });
        }
      };
      await excecuteGain();

      //inserer paiements chez memo
      let dataMemo: any = false;
      const excecuteMemo = async () => {
        try {
          dataMemo = await servicesMemo.insererModifierPaiements(versementIds);
        } catch (error) {
          console.log({ error });
        }
      };
      await excecuteMemo();

      //inserer paiement chez focus ecole
      let dataFocusEcole: any = false;
      const excecuteFocusEcole = async () => {
        try {
          dataFocusEcole = await servicesFocusEcole.sendPayments(versementIds);
        } catch (error) {
          console.log({ error });
        }
      };
      await excecuteFocusEcole();

      const data = { dataGain, dataMemo, dataFocusEcole };
      resolve(data);
    } catch (error) {
      Logger.error("Erreur d'insetion paiements chez les patenaires");
      reject(error);
    }
  });
};

/**
 * mettre ajour les donnees de paiements pour un versement
 * @param versementId
 * @returns
 */
const updatePayments = (versementIds: number[] | null = null) => {
  return new Promise(async (resolve, reject) => {
    try {
      //modifier plusieurs paiement lié a un versement chez gain technologie
      let dataGain: any = false;
      const excecuteGain = async () => {
        try {
          if (globalThis.gainService[0].sendData === 1) {
            dataGain = await servicesGain.modifierPaiements(versementIds);
          }
        } catch (error) {
          console.log({ error });
        }
      };
      await excecuteGain();

      //modifier paiement chez memo
      let dataMemo: any = false;
      const excecuteMemo = async () => {
        try {
          dataMemo = await servicesMemo.insererModifierPaiements(versementIds);
        } catch (error) {
          console.log({ error });
        }
      };
      await excecuteMemo();

      //modifier paiement chez focus ecole
      let dataFocusEcole: any = false;
      const excecuteFocusEcole = async () => {
        try {
          dataFocusEcole = await servicesFocusEcole.sendPayments(versementIds);
        } catch (error) {
          console.log({ error });
        }
      };
      await excecuteFocusEcole();

      const data = { dataGain, dataMemo, dataFocusEcole };
      resolve(data);
    } catch (error) {
      Logger.error("Erreur lors mofication paiements chez les patenaires");
      reject(error);
    }
  });
};

/**
 * supprimer les données de paiements pour un versement
 * @param versementId
 * @returns
 */
const deletePayments = (versementIds: number[] | null = null) => {
  return new Promise(async (resolve, reject) => {
    try {
      //supprimer plusieurs paiement lié a un versement chez gain technologie

      let dataGain: any = false;
      const excecuteGain = async () => {
        try {
          if (globalThis.gainService[0].sendData === 1) {
            dataGain = await servicesGain.supprimerPaiements(versementIds);
          }
        } catch (error) {
          console.log({ error });
        }
      };
      await excecuteGain();

      let dataMemo: any = false;
      const excecuteMemo = async () => {
        try {
          dataMemo = await servicesMemo.supprimerPaiements(versementIds);
        } catch (error) {
          console.log({ error });
        }
      };
      await excecuteMemo();

      let dataFocusEcole: any = false;
      const excecuteFocusEcole = async () => {
        try {
          dataFocusEcole = await servicesFocusEcole.deletePayments(versementIds);
        } catch (error) {
          console.log({ error });
        }
      };
      await excecuteFocusEcole();


      const data = { dataGain, dataMemo, dataFocusEcole };
      resolve(data);
    } catch (error) {
      Logger.error("Erreur suppression paiements chez les patenaires");
      reject(error);
    }
  });
};

/**
 * creer une classe chez les differents pattenaires
 * @param classeId
 * @returns
 */
const classeCreate = (classeIds: number[] | null = null) => {
  return new Promise(async (resolve, reject) => {
    try {
      // creer une classe chez gain technologie
      let dataGain: any = false;
      const excecuteGain = async () => {
        try {

          dataGain = await servicesGain.creerClasses(classeIds);

        } catch (error) {
          console.log({ error });
        }
      };
      await excecuteGain();

      //creer une classe chez focus
      let dataFocusEcole: any = false;
      const excecuteFocusEcole = async () => {
        try {

          dataFocusEcole = await servicesFocusEcole.sendClasses(classeIds);

        } catch (error) {
          console.log({ error });
        }
      };
      await excecuteFocusEcole();

      const data = { dataGain, dataFocusEcole };
      resolve(data);
    } catch (error) {
      Logger.error("Erreur creation classe chez les patenaires");
      reject(error);
    }
  });
};

/**
 * modifier une classe deja existante chez les differentes patenaires
 * @param classeId
 * @returns
 */
const classeUpdate = (classeIds: number[] | null = null) => {
  return new Promise(async (resolve, reject) => {
    try {
      //Modifier une classe chez gain technologie
      let dataGain: any = false;
      const excecuteGain = async () => {
        try {
          dataGain = await servicesGain.modifierClasse(classeIds);

        } catch (error) {
          console.log({ error });
        }
      };
      await excecuteGain();

      //Envoyer les classes vers focus ecoles
      let dataFocusEcole: any = false;
      const excecuteFocusEcole = async () => {
        try {
          dataFocusEcole = await servicesFocusEcole.sendClasses(classeIds);
        } catch (error) {
          console.log({ error });
        }
      };
      await excecuteFocusEcole();
      const data = { dataGain, dataFocusEcole };
      resolve(data);
    } catch (error) {
      Logger.error("Erreur modification classe chez les patenaires");
      reject(error);
    }
  });
};

/**
 * Supprimer une classe existante chez les differents patenaires
 * @param classeId
 * @returns
 */
const classeDelete = (classeIds: number[] | null = null) => {
  return new Promise(async (resolve, reject) => {
    try {
      //Suppimer  une ou plusieur classe chez gain technologie
      let dataGain: any = false;
      const excecuteGain = async () => {
        try {
          dataGain = await servicesGain.supprimerClasse(classeIds);
        } catch (error) {
          console.log({ error });
        }
      };
      await excecuteGain();
      //Suppimer  une ou plusieur classe chez focus ecole
      let dataFocusEcole: any = false;
      const excecuteFocusEcole = async () => {
        try {
          dataFocusEcole = await servicesFocusEcole.deleteClasse(classeIds);
        } catch (error) {
          console.log({ error });
        }
      };
      await excecuteFocusEcole();

      const data = { dataGain, dataFocusEcole };
      resolve(data);
    } catch (error) {
      Logger.error("Erreur modification classe chez les patenaires");
      reject(error);
    }
  });
};

/**
 * inserer un ou plusieurs echeanciers globales ches les partenaires
 * @returns
 */
const globalTimeLineCreate = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // creer  echeanciers global ches gain technologie
      let dataGain: any = false;
      const excecuteGain = async () => {
        try {
          if (globalThis.gainService[0].sendData === 1) {
            dataGain = await servicesGain.creerEcheancierGlobal();
          }
        } catch (error) {
          console.log({ error });
        }
      };
      await excecuteGain();
      const data = { dataGain };
      resolve(data);
    } catch (error) {
      Logger.error(
        "Erreur de l'insertion echeancier global chez les patenaires"
      );
      reject(error);
    }
  });
};

/**
 * inserer un ou plusieurs echeanciers personnalisé pour un eleves chez les partenaires
 * @param elevesIds
 * @returns
 */
const persoTimeLineCreate = (elevesIds: number[] | null = null) => {
  return new Promise(async (resolve, reject) => {
    try {
      // creer echeancier personnalisé pour un eleve chez gain technologie
      let dataGain: any = false;
      const excecuteGain = async () => {
        try {
          if (globalThis.gainService[0].sendData === 1) {
            dataGain = await servicesGain.creerEcheancierPerso(elevesIds);
          }
        } catch (error) {
          console.log({ error });
        }
      };
      await excecuteGain();
      const data = { dataGain };
      resolve(data);
    } catch (error) {
      Logger.error(
        "Erreur de l'insertion echeancier personnalisé chez les patenaires"
      );
      reject(error);
    }
  });
};

/**
 * envoyer les echeanciers individual chez les partenaires
 * @param studentIds
 * @returns
 */
const fetchEcheancierIndividuel = (studentIds: number[] | null = null) => {
  return new Promise(async (resolve, reject) => {
    try {
      // envoyer les echeanciers individual chez gain
      let dataGain: any = false;
      const excecuteGain = async () => {
        try {
          if (globalThis.gainService[0].sendData === 1) {
            dataGain = await servicesGain.fetchEcheancierIndividuel(studentIds);
          }
        } catch (error) {
          console.log({ error });
        }
      };
      await excecuteGain();

      //envoyer les echeanciers individuel ches focus ecole
      let dataFocusEcole: any = false;
      const excecuteFocusEcole = async () => {
        try {
          dataFocusEcole = await servicesFocusEcole.sendIndividualEcheanciers(studentIds);
        } catch (error) {
          console.log({ error });
        }
      };
      await excecuteFocusEcole();

      const data = { dataGain, dataFocusEcole };
      resolve(data);
    } catch (error) {
      Logger.error("Erreur creation classe chez les patenaires");
      reject(error);
    }
  });
};

const fetchEcheancierGlobal = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // creer une classe chez gain technologie
      let dataGain: any = false;
      const excecuteGain = async () => {
        try {
          if (globalThis.gainService[0].sendData === 1) {
            dataGain = await servicesGain.fetchEcheancierGlobal();
          }
        } catch (error) {
          console.log({ error });
        }
      };
      await excecuteGain();

      const data = { dataGain };
      resolve(data);
    } catch (error) {
      Logger.error("Erreur creation classe chez les patenaires");
      reject(error);
    }
  });
};

/**
 * inserer un ou plusieurs personnel chez les differents partenaires
 * @param personnelIds 
 */
const insertPersonnel = (personnelIds) => {
  return new Promise(async (resolve, reject) => {
    try {
      let dataFocusEcole: any = false;
      const excecuteFocusEcole = async () => {
        try {
          dataFocusEcole = await servicesFocusEcole.sendPersonnel(personnelIds);
        } catch (error) {
          console.log({ error });
        }
      };
      await excecuteFocusEcole();
      const data = { dataFocusEcole };
      resolve(data);

    } catch (error) {
      console.log("🚀 ~ file: services.ts ~ line 1017 ~ returnnewPromise ~ error", error)
      reject(error);
    }
  });
};

/**
 * Modifier un ou plusieurs personnels chez differensts partenaires
 */
const updatePersonnel = (personnelIds) => {
  return new Promise(async (resolve, reject) => {
    try {
      let dataFocusEcole: any = false;
      const excecuteFocusEcole = async () => {
        try {
          dataFocusEcole = await servicesFocusEcole.sendPersonnel(personnelIds);
        } catch (error) {
          console.log({ error });
        }
      };
      await excecuteFocusEcole();
      const data = { dataFocusEcole };
      resolve(data);

    } catch (error) {
      Logger.error("Erreur modification personnel chez les patenaires");
      reject(error);
    }
  });
};

/**
 * Supprimer un ou plusieurs personnels chez differensts partenaires
 * @param personnelIds 
 * @returns 
 */
const deletePersonnel = (personnelIds) => {
  return new Promise(async (resolve, reject) => {
    try {
      let dataFocusEcole: any = false;
      const excecuteFocusEcole = async () => {
        try {
          dataFocusEcole = await servicesFocusEcole.deletePersonnel(personnelIds);
        } catch (error) {
          console.log({ error });
        }
      };
      await excecuteFocusEcole();
      const data = { dataFocusEcole };
      resolve(data);
    } catch (error) {
      Logger.error("Erreur modification personnel chez les patenaires");
      reject(error);
    }
  });
};


/**
 * envoyer les notes d'evaluations vers les partenaires
 * @param evalIds l'id des evaluations 
 * @returns 
 */
const sendEvaluationNotes = (evalIds) => {
  return new Promise(async (resolve, reject) => {
    try {
      let dataFocusEcole: any = false;
      const excecuteFocusEcole = async () => {
        try {
          dataFocusEcole = await servicesFocusEcole.sendEvaluationNotes(evalIds);
        } catch (error) {
          console.log({ error });
        }
      };
      await excecuteFocusEcole();
      const data = { dataFocusEcole };
      resolve(data);

    } catch (error) {
      console.log("🚀 ~ file: services.ts ~ line 1017 ~ returnnewPromise ~ error", error)
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
      let dataFocusEcole: any = false;
      const excecuteFocusEcole = async () => {
        try {
          dataFocusEcole = await servicesFocusEcole.sendEvaluationNotes(evalIds);
        } catch (error) {
          console.log({ error });
        }
      };
      await excecuteFocusEcole();
      const data = { dataFocusEcole };
      resolve(data);

    } catch (error) {
      console.log("🚀 ~ file: services.ts ~ line 1017 ~ returnnewPromise ~ error", error)
      reject(error);
    }
  });
};

/**
 * Supprimer une ou plusieurs notes d'evalutains
 * @param evalIds 
 * @returns 
 */
const deleteEvalNotes = (evalIds) => {
  return new Promise(async (resolve, reject) => {
    try {
      let dataFocusEcole: any = false;
      const excecuteFocusEcole = async () => {
        try {
          dataFocusEcole = await servicesFocusEcole.deleteEvalNotes(evalIds);
        } catch (error) {
          console.log({ error });
        }
      };
      await excecuteFocusEcole();
      const data = { dataFocusEcole };
      resolve(data);

    } catch (error) {
      console.log("🚀 ~ file: services.ts ~ line 1017 ~ returnnewPromise ~ error", error)
      reject(error);
    }
  });
};

/**
 * Envoyer les salles
 * @param roomIds 
 * @returns 
 */
const sendSalles = (roomIds) => {
  return new Promise(async (resolve, reject) => {
    try {
      let dataFocusEcole: any = false;
      const excecuteFocusEcole = async () => {
        try {
          dataFocusEcole = await servicesFocusEcole.sendSalles(roomIds);
        } catch (error) {
          console.log({ error });
        }
      };
      await excecuteFocusEcole();
      const data = { dataFocusEcole };
      resolve(data);
    } catch (error) {
      console.log("🚀 ~ file: services.ts ~ line 1017 ~ returnnewPromise ~ error", error)
      reject(error);
    }
  });
};

/**
 * Supprimer une ou plusieurs salles
 * @param roomIds 
 * @returns 
 */
const deleteRooms = (roomIds) => {
  return new Promise(async (resolve, reject) => {
    try {
      let dataFocusEcole: any = false;
      const excecuteFocusEcole = async () => {
        try {
          dataFocusEcole = await servicesFocusEcole.deleteRooms(roomIds);
        } catch (error) {
          console.log({ error });
        }
      };
      await excecuteFocusEcole();
      const data = { dataFocusEcole };
      resolve(data);

    } catch (error) {
      console.log("🚀 ~ file: services.ts ~ line 1017 ~ returnnewPromise ~ error", error)
      reject(error);
    }
  });
};

/**
 * Envoyer la programmation des evaluations vers les partenaires
 * @param evalIds 
 * @returns 
 */
const sendEvalProg = (evalIds) => {
  return new Promise(async (resolve, reject) => {
    try {
      let dataFocusEcole: any = false;
      const excecuteFocusEcole = async () => {
        try {
          dataFocusEcole = await servicesFocusEcole.sendEvalProg(evalIds);
        } catch (error) {
          console.log({ error });
        }
      };
      await excecuteFocusEcole();
      const data = { dataFocusEcole };
      resolve(data);

    } catch (error) {
      reject(error);
    }
  });
};


const updateEvalProg = (evalIds) => {
  return new Promise(async (resolve, reject) => {
    try {
      let dataFocusEcole: any = false;
      const excecuteFocusEcole = async () => {
        try {
          dataFocusEcole = await servicesFocusEcole.sendEvalProg(evalIds);
        } catch (error) {
          console.log({ error });
        }
      };
      await excecuteFocusEcole();
      const data = { dataFocusEcole };
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
const deleteEvalProg = (evalIds) => {
  return new Promise(async (resolve, reject) => {
    try {
      let dataFocusEcole: any = false;
      const excecuteFocusEcole = async () => {
        try {
          dataFocusEcole = await servicesFocusEcole.deleteEvalProg(evalIds);
        } catch (error) {
          console.log({ error });
        }
      };
      await excecuteFocusEcole();
      const data = { dataFocusEcole };
      resolve(data);

    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Envoyer les plages horraires ves les partenaires 
 */
const sendPlageHoraires = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let dataFocusEcole: any = false;
      const excecuteFocusEcole = async () => {
        try {
          dataFocusEcole = await servicesFocusEcole.sendPlageHoraires();
        } catch (error) {
          console.log({ error });
        }
      };
      await excecuteFocusEcole();
      const data = { dataFocusEcole };
      resolve(data);

    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Envoyer les horaires vers les partenaires
 * @returns 
 */
const sendHoraires = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let dataFocusEcole: any = false;
      const excecuteFocusEcole = async () => {
        try {
          dataFocusEcole = await servicesFocusEcole.sendHoraires();
        } catch (error) {
          console.log({ error });
        }
      };
      await excecuteFocusEcole();
      const data = { dataFocusEcole };
      resolve(data);

    } catch (error) {
      reject(error);
    }
  });
};

/**
 *  envoyer la liste des profs par matiere et par classe
 */
const sendClassesMatiereProf = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let dataFocusEcole: any = false;
      const excecuteFocusEcole = async () => {
        try {
          dataFocusEcole = await servicesFocusEcole.sendClassesMatiereProf();
        } catch (error) {
          console.log({ error });
        }
      };
      await excecuteFocusEcole();
      const data = { dataFocusEcole };
      resolve(data);

    } catch (error) {
      reject(error);
    }
  });
};

export default {
  studentAdd,
  studentUpdate,
  studentDelete,
  classeCreate,
  classeUpdate,
  classeDelete,
  synchroniserIdentifiant,
  insertPayments,
  updatePayments,
  deletePayments,
  globalTimeLineCreate,
  persoTimeLineCreate,
  partnersList,
  activateService,
  deactivateService,
  initializeService,
  sendPhotosZip,
  getGainLogs,
  resendGainAction,
  fetchEcheancierIndividuel,
  fetchEcheancierGlobal,
  insertPersonnel,
  updatePersonnel,
  deletePersonnel,
  sendEvaluationNotes,
  updateEvalNotes,
  deleteEvalNotes,
  sendSalles,
  deleteRooms,
  sendEvalProg,
  updateEvalProg,
  deleteEvalProg,
  sendPlageHoraires,
  sendHoraires,
  sendClassesMatiereProf
};
