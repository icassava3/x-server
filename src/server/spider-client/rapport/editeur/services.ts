import { fetchPublicRoute } from '../../../helpers/apiClient';
import { WHSERVER_BASE_URL } from '../../../spider-whserver/constants';
import { paramEtabObjet } from "../../../databases/accessDB";

import functions from "./functions";
import { IModeleRapport, IPlanModeleRapportItem, IRapport } from "./interfaces";
const fs = require("fs/promises");
const path2 = require("path");


/**
 * mettre le modele rapport depuis en ligne
 * si une erreur s'est produite, mettre a jour depuis la base local sqlite db
 * @returns 
 */
const upateModeleRapport = () => {
  return new Promise(async (resolve, reject) => {
    try {
      //recupprer la liste des modeles rapports en ligne et mettre a jour les modeles rapport en local
      const url = `${WHSERVER_BASE_URL}/listemodelerapport`;
      const apiPayload = null;
      const result: any = await fetchPublicRoute(url, apiPayload);
      const modeles = result.data;
      const modelesArray = modeles.map(item => {
        return [item.idModeleRapport, item.libelleModeleRapport, item.planModeleRapport, item.revision, item.status]
      })
      //update les modeles rapport en local
      await functions.insertOrUpdateModeleRapport(modelesArray);
      resolve(modeles);
    } catch (error) {
      //chemin du fichier modeles_rapport.json
      const modelesRapportPath = process.env.NODE_ENV === "production"
        //@ts-ignore
        ? require("path").resolve(process?.resourcesPath, 'templates', 'modeles_rapport.json')
        : process.argv.slice(2)[0] === 'sqlite' //si le projet est lancé avec "yarn start-server"
          ? require("path").resolve(__dirname, '..', '..', '..', '..', '..', 'templates', 'modeles_rapport.json')
          : require("path").resolve('./', 'templates', 'modeles_rapport.json')

      const modelesRapport: any = await fs.readFile(modelesRapportPath);
      const parsedModelesRapport = JSON.parse(modelesRapport);
      const localModelesRapport: any = await listemodeleRapport();

      const modeles = await Promise.all(parsedModelesRapport.map(async (modeleItem: any) => {
        const localModeleItem = localModelesRapport.find((elt: any) => elt.idModeleRapport === modeleItem.idModeleRapport)
        //si le modele _rapport n'existe pas deja en ligne ou sil existe mais la revision est inferieur a son equivalent en ligne
        if (!localModeleItem || (localModeleItem && modeleItem.revision > localModeleItem?.revision)) return modeleItem
      }))

      const modelesArray = modeles.map(item => {
        return [item.idModeleRapport, item.libelleModeleRapport, item.planModeleRapport, item.revision, item.status]
      })
      try {
        //update les modeles rapport en local
        await functions.insertOrUpdateModeleRapport(modelesArray);
        resolve(true);
      } catch (error) {
        reject(error);
      }

    }
  });
};


/**
 * Obtenir la liste des modeles rapports
 * @param data
 * @returns
 */
const listemodeleRapport = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const modeles = await functions.getModeleRapport();
      resolve(modeles);

    } catch (error) {
      reject(error);
    }
  });
};


/**
 * Obtenir la liste des rapports
 * @param data
 * @returns
 */
const listeRapport = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const rapports = await functions.getRapport();
      resolve(rapports);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Enregidtrer un nouveau rapport
 * @param data
 * @returns
 */
const nouveauRapport = (data: IRapport): Promise<IRapport | IRapport[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("🚀 ~ file: services.ts:72 ~ nouveauRapport ~ data", data)
      const rapportInsererLastID: number = await functions.insertRapport(data);
      //obtenir et retourner le rapport inserer
      const rapportInserer = await functions.getRapport(rapportInsererLastID);
      resolve(rapportInserer);
    } catch (error) {
      console.log("🚀 ~ file: services.ts:93 ~ returnnewPromise ~ error", error)
      reject(error);
    }
  });
};

/**
 * mettre a jour le data du rapport
 */

const modifierRapportData = (data: {
  idRapport: number;
  rapportDataItem: IPlanModeleRapportItem;
}): Promise<{
  idRapport: number;
  rapportDataItem: IPlanModeleRapportItem;

}> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { idRapport, rapportDataItem } = data;
      const rapportData = await functions.getRapportData(idRapport);
      const rapportDataIndex = rapportData.findIndex((x) => x.index === rapportDataItem.index);
      const newRapportData = [
        ...rapportData.slice(0, rapportDataIndex),
        data.rapportDataItem,
        ...rapportData.slice(rapportDataIndex + 1),
      ];
      await functions.updateRapportData(data.idRapport, newRapportData);
      resolve({
        idRapport: idRapport,
        rapportDataItem: rapportDataItem
      });

    } catch (error) {
      reject(error);
    }
  });
};

/**
 * mettre a jour le libellé du rapport
 */

const modifierLibelleRapport = (data: {
  idRapport: number;
  libelleRapport: string;
}): Promise<IRapport | IRapport[] | boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const rapportId: number = await functions.updateLibelleRapport(
        data.idRapport,
        data.libelleRapport
      );
      console.log("🚀 ~ file: services.ts ~ line 96 ~ returnnewPromise ~ rapportId", rapportId)
      const rapport = await functions.getRapport(rapportId);
      resolve(rapport);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 *  Supprimer le data d'un  rapport
 */

const supprimerRapportData = (data: {
  idRapport: number;
  idModeleRapport: string;
}): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      await functions.deleteRapportData(data.idRapport, data.idModeleRapport);
      resolve({ idRapport: data.idRapport });
    } catch (error) {
      reject(error);
    }
  });
};



/**
     * mettre a jour les modeles rapports a partir du fichier json
     * @returns 
     */
// const updateMolelesRapportFromJsonFile = async () => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       try {
//         await upateModeleRapport();
//       } catch (error) {

//         const modelesRapportPath = process.env.NODE_ENV === "production"
//           //@ts-ignore
//           ? require("path").resolve(process.resourcesPath, 'templates', 'modeles_rapport.json')
//           : process.argv.slice(2)[0] === 'sqlite' //si le projet est lancé avec "yarn start-server"
//             ? require("path").resolve(__dirname, '..', '..', '..', 'templates', 'modeles_rapport.json')
//             : require("path").resolve('./', 'templates', 'modeles_rapport.json')

//         const modelesRapport: any = await fs.readFile(modelesRapportPath);
//         const parsedModelesRapport = JSON.parse(modelesRapport);
//         const localModelesRapport: any = await listemodeleRapport();

//         const modeles = await Promise.all(parsedModelesRapport.map(async (modeleItem: any) => {
//           const localModeleItem = localModelesRapport.find((elt: any) => elt.idModeleRapport === modeleItem.idModeleRapport)
//           //si le modele _rapport n'existe pas deja en ligne ou sil existe mais la revision est inferieur a son equivalent en ligne
//           if (!localModeleItem || (localModeleItem && modeleItem.revision > localModeleItem?.revision)) return modeleItem
//         }))

//         const modelesArray = modeles.map(item => {
//           return [item.idModeleRapport, item.libelleModeleRapport, item.planModeleRapport, item.revision, item.status]
//         })
//         //update les modeles rapport en local
//         await functions.insertOrUpdateModeleRapport(modelesArray);

//       }
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

export default {
  listemodeleRapport,
  nouveauRapport,
  modifierRapportData,
  listeRapport,
  modifierLibelleRapport,
  supprimerRapportData,
  upateModeleRapport,
};
