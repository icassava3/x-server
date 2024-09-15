import { AnyArray } from "immer/dist/internal";
import Logger from "../helpers/logger";
import { redisClient } from "./redis";


const DATABASE_MODE: string = process.argv.slice(2)[0] || "sqlite";
let db: any = null;
let selectCmd: any = null;
let execCmd: any = null;
let accessConfig: any = null;

export const initializeDatabases = (ip, port): Promise<{ configObject: any; redisClient: any }> => {
  return new Promise<{ configObject: any; redisClient: any }>(async (resolve, reject) => {
    try {
      Logger.info("initializeDatabases start")

      //Initialiser globalVariable paramEtab et globalVariable accessConfig a partir de la table vba_client_config
      const { configObject } = await require("./sqliteVbaConfigDb").initialize(ip, port)
      accessConfig = configObject
      Logger.info("sqliteVbaConfigDb initialize ok")
      
      //Initialiser la connexion a access vba
      await require("./accessDB").initialize();
      Logger.info("accessDB initialize ok")

      // Initialiser la connexion a la base sqlite et effectuer ses mise a jour
      const sqliteDB = await require("./sqliteDb").initialize()
      Logger.info("sqliteDb initialize ok")

      //configurer la variable db sur sqlite ou mysql selon les arguments de la ligne commande de demarage x-server
      db = DATABASE_MODE === "sqlite" ? sqliteDB : require("./mysqlDb");
      selectCmd = DATABASE_MODE === "mysql" ? db.query.bind(db) : sqliteDB.all.bind(db);
      execCmd = DATABASE_MODE === "mysql" ? db.query.bind(db) : sqliteDB.run.bind(db);
      //initialiser les autres variables globales
      // await require('../globalVariables').initializeGlobalVariables()
      // Logger.info("globalVariables initialize ok")

      resolve({ configObject, redisClient })
    } catch (error) {
      console.log("🚀 ~ file: index.ts ~ line 23 ~ initialize ~ error", error)
      reject(error)
    }
  })
}

export const _executeSql = (sql: string, param: any) => {
  return new Promise((resolve, reject) => {
    try {
      execCmd(
        sql,
        param,
        function (this: any, error: any, result: AnyArray) {
          if (error) {

            return reject(error);
          }
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

export const _selectSql: any = (sql: string, param: (string | number)[]) => {
  return new Promise((resolve, reject) => {
    try {
      selectCmd(sql, param, (error: any, rows: any) => {
        if (error) return reject(error);
        resolve(rows);
      });
    } catch (err) {
      Logger.error(err);
      reject(err);
    }
  });
};



// export default db;
export {db,accessConfig};
