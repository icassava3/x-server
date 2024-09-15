// import { DB_PWD } from "../helpers/constants";
import { DB_PWD } from "../helpers/constants";
import { IAccessConfig } from "../helpers/interfaces";
import { IParamEtabItem } from "../spider-photo-app/interfaces";
import redisFunctions from "./redis/functions";
const ini = require("ini");
const path = require("path");
const ADODB = require("node-adodb");
const _ = require('lodash');
export let appCnxString = ""
export let dataCnxString = ""
export let appCnx: any;
export let dataCnx: any;


export const initialize = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const accessConfig = await redisFunctions.getGlobalVariable("accessConfig") as IAccessConfig;
      appCnxString = `Provider=Microsoft.ACE.OLEDB.12.0;Data Source=${accessConfig.appPath};Jet OLEDB:Database Password=;`;
      dataCnxString = `Provider=Microsoft.ACE.OLEDB.12.0;Data Source=${accessConfig.dbPath};Jet OLEDB:Database Password=${/* process.env. */DB_PWD};`;
      appCnx = ADODB.open(appCnxString);
      dataCnx = ADODB.open(dataCnxString);
      resolve(true)
    } catch (error) {
      console.log("🚀 ~ file: accessDB.ts ~ line 26 ~ returnnewPromise ~ error", error)
      reject(error)
    }
  })
}

/**
 * fonction generique pour fetcher des données dans les bases access
 * @param sql la requete sql
 * @param cnx la connection au fichier access
 * @returns
 */
export function fetchFromMsAccess<T>(sql: string, cnx: any): Promise<T> {
  return new Promise(async (resolve, reject) => {
    try {
      const resultArray = await cnx.query(sql);
      resolve(resultArray);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

/**
 * fonction generique pour executer les requetes actions (insert,update,delete)
 * @param sql la requete sql
 * @param cnx la connection au fichier access
 * @returns
 */
export function executeToMsAccess(sql: string, cnx: any): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const resultArray = await cnx.execute(sql);
      resolve(resultArray);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

/**
 * retourner des données de la table params_etab_js sous forme d'objet
 * @param paramName tableau des parametres à retourner
 * @returns objet (toutes les propriétés en miniscule)
 */
// "Anscol1", "CodeEtab", "AnScol2", "BPEtab", "DRENComplet",
//   "DRENouDDEN", "DREN", "Fondateur", "NomChefEtab", "NomCompletEtab", "NomEtabAbr", "TélChefEtab", "TélCorrespondant", "TelEtab", "TélFondateur", "modeCalc", "DecoupSemestres"

export const paramEtabObjet = async (paramName: string[]): Promise<any> => {
  const paramEtab = await redisFunctions.getGlobalVariable("paramEtab");
 
  const params = paramName.map(item => item.toLowerCase()
    .normalize("NFD")
    // @ts-ignore
    .replace(/\p{Diacritic}/gu, "")
    .replace(/ /g, ""))
  const paramObj: any = _.pick(paramEtab, params);
  return paramObj;
};

/**
 * retourne la valeur d'un parametre depuis la table params_etab_js
 * @param paramName le nom du parametre
 * @returns string
 */

// export const paramEtab = async (paramName: string) => {
//   const paramSql = `SELECT * FROM params_etab_js WHERE param_name="${paramName}"`;
//   const paramEtab = await fetchFromMsAccess<IParamEtabItem[]>(paramSql, dataCnx);
//   return paramEtab[0].param_value;
// };
