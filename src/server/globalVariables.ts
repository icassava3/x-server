import { registerXServer } from './helpers/apiClient';
import { paramEtabObjet } from './databases/accessDB';
import redisFunctions from './databases/redis/functions';
import { ISchoolControlActivitiesConfig } from './spider-school-control/interfaces';
import { getAllSchoolControlActivitiesConfig, getListeActivites } from './spider-school-control/functions';
import { merge2ArraysOfObjects } from './helpers/function';
import { IPayloadNewSmsAccount } from './spider-messagerie/interfaces';
import { creditSms, listeCompteSms } from './spider-messagerie/services';
import { ICompteSms, ICreditSms, ISmsAccount } from '../client/store/interfaces';
import { redisClient } from './databases/redis';
import { redisInitSchoolControl } from './spider-school-control/services';
import focusEcoleFunctions from '../server/spider-client/focus-ecole/functions';

var hddserial = require('hddserial');


//Obtenir et stocker le numero de serie du premier disque dur du present ordinateur 
const getHDDSerialNumber = () => {
  try {
    hddserial.first(function (err, serial) {
      redisFunctions.addGlobalVariable("currentPcHDDSerialNumber", serial);
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: function.ts ~ line 25 ~ getAccessConfig ~ error",
      error
    );
  }
};


// Mémorisation des services des partenaires depuis sqlite
export const servicesConfig = async () => {
  const { getPartnersServices } = require("./spider-whserver/functions")
  const services: any = await getPartnersServices();
  await redisFunctions.addGlobalVariable("cinetpayService", services.cinetpay);
  await redisFunctions.addGlobalVariable("schoolControlService", services.schoolControl);
}


/**
 * recupprer tous le contenu de la la tb x_server_config
 */
const getXserverConfig = async () => {
  try {
    const { _selectSql } = require("./databases");
    const result = await _selectSql('SELECT * FROM xserver_config')
    if (result.length) {

      const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);

      //obtenir les config focus ecole et enregistrer dans redis
      const allFocusEcoleConfig = result.find(item => item.key === "focusEcoleConfig")
      const allFocusEcoleConfigValue = JSON.parse(allFocusEcoleConfig.value);
      let focusEcoleConfig = allFocusEcoleConfigValue.find(item => item.anneeScolaire === anscol1 && item.codeEtab === codeetab);
      if (!focusEcoleConfig) {
        focusEcoleConfig = { anneeScolaire: anscol1, codeEtab: codeetab, config: { showPhoto: false, showContact: false } }
        allFocusEcoleConfigValue.push(focusEcoleConfig)
        //mettre a jour dans sqlite
        await focusEcoleFunctions.updateFocusEcoleConfig(allFocusEcoleConfigValue);
      }
      await redisFunctions.addGlobalVariable("focusEcoleConfig", focusEcoleConfig);
      await redisFunctions.addGlobalVariable("allFocusEcoleConfig", allFocusEcoleConfigValue);

      //obtenir les config warehouse et enregister
      const allWarehouseConfig = result.find(item => item.key === "warehouseConfig")
      const allWarehouseConfigValue = JSON.parse(allWarehouseConfig.value);
      const warehouseConfig = allWarehouseConfigValue.find(item => item.anneeScolaire === anscol1 && item.codeEtab === codeetab);
      await redisFunctions.addGlobalVariable("allWarehouseConfig", allWarehouseConfigValue);
      await redisFunctions.addGlobalVariable("warehouseConfig", warehouseConfig);
      //obtenir les utilisateurs spiders depuis sqlite et les mettre dans redis
      const vbaCredentials = result.find(item => item.key === "vbaCredentials");
      await redisClient.set("vbaCredentials", vbaCredentials.value);

      // const spiderUsers = result.find(item => item.key === "spiderUsersCredentials");
      // console.log("🚀 ~ file: globalVariables.ts:57 ~ getXserverConfig ~ spiderUsers:", spiderUsers)
      // const spiderUsersCredentials = JSON.parse(spiderUsers.value);
      // console.log("🚀 ~ file: globalVariables.ts:58 ~ getXserverConfig ~ spiderUsersCredentials:", spiderUsersCredentials)
      // if (spiderUsersCredentials.hasOwnProperty("spiderSuperAdmins") &&
      //   spiderUsersCredentials.hasOwnProperty("spiderUsers") &&
      //   spiderUsersCredentials.hasOwnProperty("spiderAgents")) {
      //   await redisClient.set("spiderSuperAdmins", spiderUsersCredentials.spiderSuperAdmins);
      //   await redisClient.set("spiderUsers", spiderUsersCredentials.spiderUsers);
      //   await redisClient.set("spiderAgents", spiderUsersCredentials.spiderAgents);
      // }

      // obtenir global Api credential ou créer si exite pas
      try {
        const globalApiServerCredentials = result.find(item => item.key === "globalApiServerCredentials");
        if (!globalApiServerCredentials) {
          await registerXServer();
        } else {
          redisFunctions.setSecureData('globalApiServerCredentials', JSON.parse(globalApiServerCredentials.value))
        }
      } catch (error) {
        redisFunctions.setSecureData("globalApiServerCredentials", '');
      }
    }
  } catch (error) {
    console.log("🚀 ~ file: globalVariables.ts:77 ~ getXserverConfig ~ error:", error)
  }
}

const schoolControlActivitiesConfig = async () => {
  try {
    const schoolControlConfig: ISchoolControlActivitiesConfig[] = await getAllSchoolControlActivitiesConfig();
    const listeActivites = await getListeActivites();
    const mergeData = merge2ArraysOfObjects(schoolControlConfig, listeActivites, "idActivite")
    await redisFunctions.addGlobalVariable("schoolControlConfig", mergeData);
  } catch (error) {
    console.log("🚀 ~ file: globalVariables.ts:79 ~ schoolControlActivitiesConfig ~ error:", error)
  }
}

export const compteSmsCredit = async (): Promise<ICompteSms> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { code_web_sms } = await paramEtabObjet(["code_web_sms"]);
      const compteSmsStatus: boolean = code_web_sms && code_web_sms.length > 0
      const listeCompte = compteSmsStatus ? await listeCompteSms() as ISmsAccount[] : [];
      const data = { defaultAccount: null, compteAppelNumerique: null, compteSmsStatus }
      if (!listeCompte.length) {
        await redisFunctions.addGlobalVariable("compteSms", data);
        return resolve(data)
      }
      const defaultAccount = listeCompte.find((item) => item.defaultAccount === 1)
      let defaultAccountCredit: ICreditSms | null = null
      let compteAppelNumeriqueCredit: ICreditSms | null = null
      const compteAppelNumerique = listeCompte.find((item) => item.sendSmsAppel === 1)
      try {
        defaultAccountCredit = await creditSms(`${defaultAccount?.providerId}`) as ICreditSms
        compteAppelNumeriqueCredit = await creditSms(`${compteAppelNumerique?.providerId}`) as ICreditSms
      } catch (error) {

      }
      const newData = {
        defaultAccount: !defaultAccount ? null : {
          ...defaultAccount, creditSms: defaultAccountCredit
        },
        compteAppelNumerique: !compteAppelNumerique ? null : { ...compteAppelNumerique, creditSms: compteAppelNumeriqueCredit },
        compteSmsStatus: compteSmsStatus
      }
      await redisFunctions.addGlobalVariable("compteSms", newData);
      resolve(newData)
    } catch (error) {
      console.log("🚀 ~ file: globalVariables.ts:118 ~ returnnewPromise ~ error:", error)
      reject(error)
    }
  })
}


export const initializeGlobalVariables = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // pour eviter les repetitions de remplacement du MatriculeNational/matric_prov_dsps dans le sql de spider
      const matricOrMatricProv = `IIf(Elèves.[matriculeNational] is null AND Elèves.[matric_prov_dsps] is null,"", IIf(Elèves.[matriculeNational] is null,Elèves.[matric_prov_dsps],Elèves.[matriculeNational])) AS matricule`
      redisFunctions.addGlobalVariable("matricOrMatricProv", matricOrMatricProv);
      await getHDDSerialNumber()

      await servicesConfig()
      await getXserverConfig()
      await schoolControlActivitiesConfig()
      await compteSmsCredit()
      redisInitSchoolControl()
      resolve(true)
    } catch (error) {
      console.log("🚀 ~ file: globalVariables.ts ~ line 115 ~ returnnewPromise ~ error", error)
      reject(error)
    }
  })
}