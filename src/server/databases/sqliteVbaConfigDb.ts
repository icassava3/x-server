import { IAccessConfig } from "../helpers/interfaces";
import Logger from "../helpers/logger";
import redisFunctions from "./redis/functions";
const sqlite3 = require("@journeyapps/sqlcipher").verbose();
const DBSOURCE = `C:/SPIDER/Ressources/config.db`;

let vbaConfigDB = null;
export const initialize = async (ip, port) => {
  return new Promise((resolve, reject) => {
    try {
     
      vbaConfigDB = new sqlite3.Database(DBSOURCE, async (err: any) => {
        Logger.info("sqliteVbaConfig DB start")
        if (err) return Logger.error(err.message);
        const { configObject, paramEtabObject } = await getConfig() as any
    
        await redisFunctions.addGlobalVariable("accessConfig", configObject);
        await redisFunctions.addGlobalVariable("paramEtab", paramEtabObject);

        //ecrire l'addresse ip de x-server dans vba_client_config
        vbaConfigDB.run(
          `REPLACE INTO vba_client_config (param,value) VALUES (?,?)`,
          ["xServerIp", `http://${ip}:${port}`],
          function (this: any, error: any, result: any) {
            if (error) return reject(error);
            resolve(
              result === undefined ? { affectedRows: this.changes, lastID: this.lastID } : result
            );
          }
        );
        Logger.info("Sucessfully connected to the SQlite config database!");
        resolve({ configObject, paramEtabObject })
      });
    } catch (error) {
      console.log("🚀 ~ file: sqliteConfigDb.ts ~ line 17 ~ returnnewPromise ~ error", error)
      reject(error)
    }

  })
}

/**
 * Obtenir les param de configuration vba
 * @returns 
 */
export const getConfig = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const sqlconfig = `SELECT * FROM vba_client_config`
      vbaConfigDB.all(sqlconfig, [], (error: any, rows) => {
        if (error) return reject(error);
        const config = rows.find(item => item.param === "config")
        const configObject = JSON.parse(config.value)
        const persPhotoDir = configObject.studentsPhotoDir.replace("PhotosElèves","PhotosPers")
        configObject.persPhotoDir = persPhotoDir;
        const paramEtab = rows.find(item => item.param === "params")
        const paramEtabObject = JSON.parse(paramEtab.value)

        resolve({ configObject, paramEtabObject });
      })
    } catch (error) {
      console.log("🚀 ~ file: globalVariables.ts ~ line 39 ~ vbaConfigDB.all ~ error", error)
    }
  })
};

export const _configSelectSql: any = (sql: string, param: (string | number)[]) => {
  return new Promise((resolve, reject) => {
    try {
      vbaConfigDB.all(sql, param, (error: any, rows: any) => {
        if (error) return reject(error);
        resolve(rows);
      });
    } catch (err) {
      Logger.error(err);
      reject(err);
    }
  });
};

export const _configExecuteSql = (sql: string, param: any) => {
  return new Promise((resolve, reject) => {
    try {
      vbaConfigDB.run(
        sql,
        param,
        function (this: any, error: any, result: any) {
          if (error) return reject(error);
          resolve(
            result === undefined ? { affectedRows: this.changes, lastID: this.lastID } : result
          );
        }
      );
    } catch (err) {
      console.log("🚀 ~ file: index.ts ~ line 26 ~ returnnewPromise ~ err", err)
      reject(err);
    }
  });
};

export default vbaConfigDB