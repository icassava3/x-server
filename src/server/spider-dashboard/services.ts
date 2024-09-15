import functions from "./functions"
import Logger from "../helpers/logger";
import { paramEtabObjet } from "../databases/accessDB";

export const statisticsData = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await functions.getStatisticsData()
      resolve(data)
    } catch (error) {
      Logger.error("Une erreur s'est produite lors de la recuperation donnee statistique");
      reject(error);
    }
  })
}

/**
 * Obtenir le nombre de photo prise 
 * @returns 
 */
export const statisticsPhoto = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const {codeetab, anscol1} = await paramEtabObjet(["CodeEtab",  "Anscol1"]);
      const data = await functions.getStatisticsPhoto(codeetab, anscol1)
      resolve(data[0])
    } catch (error) {
      Logger.error("Une erreur s'est produite lors de la recuperation donnee statistique");
      reject(error);
    }

  })
}


// const toggleShowStatistic = (key: string, etatStat: number) => {

//   return new Promise(async (resolve, reject) => {
//     try {
//     let configData = await functions.getXserverConfig();
   
//     if (configData.find(item => item.key === key)) {
//       //si une ligne config a pour key la cle envoye, alors Maj de sa valeur
//       await functions.updateConfigData(key, etatStat);
//       resolve({ key, etatStat });
//     } else {
//       await functions.addConfigData(key, etatStat);
//       resolve({ key, etatStat });
//     }

//     } catch (error) {
    
//       Logger.error("");
//       reject(error);
//     }
//   });
// };


const updateConfigData = (key: string, etatOnglet: number) => {

  return new Promise(async (resolve, reject) => {
    try {
    let configData = await functions.getXserverConfig();
   
    if (configData.find(item => item.key === key)) {
      //si une ligne config a pour key la cle envoye, alors Maj de sa valeur
      await functions.updateConfigData(key, etatOnglet);
      resolve({ key, etatOnglet });
    } else {
      await functions.addConfigData(key, etatOnglet);
      resolve({ key, etatOnglet });
    }

    } catch (error) {
    
      reject(error);
    }
  });
};

const getShowStatistic = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const configData = await functions.getXserverConfig();
      const showStatKey = ["maskStatGeneral", "maskStatPriseDeVue", "maskStatControlScolarite"];
      let statData = configData.filter((item) => showStatKey.includes(item.key));
      resolve(statData);
    } catch (error) {
      Logger.error("");
      reject(error);
    }
  });
};

const getShowTabs = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const configData = await functions.getXserverConfig();
      const showStatKey = ["maskTabDashbord", "maskTabJournal", "maskTabControleAcces","maskTabControleScolarite","maskTabPrisesDeVues"];
      let tabsData = configData.filter((item) => showStatKey.includes(item.key));
      resolve(tabsData);
    } catch (error) {
      Logger.error("");
      reject(error);
    }
  });
};


export default {
  statisticsData,
  statisticsPhoto,
  getShowStatistic,
  updateConfigData,
  getShowTabs,
  
}