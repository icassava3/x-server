import { SQLITE_PWD } from "../helpers/constants";
import Logger from "../helpers/logger";
const sqlite3 = require("@journeyapps/sqlcipher").verbose();


//DB SOURCE pour cas sqlite dans :c/SPIDER/sqlite_db
const DBSOURCE = `C:/SPIDER/server-data/spider-data-v2.db`;
let sqliteDB: any = null;
module.exports = {
  initialize: async () => {
    return new Promise(async (resolve, reject) => {
      try {
        sqliteDB = new sqlite3.Database(DBSOURCE, (err: any) => {
          Logger.info("sqlite DB start")
          if (err) {
            Logger.error(err.message);
            return reject(err)
          }
          sqliteDB.serialize(async function () {
            // This is the default, but it is good to specify explicitly:
            //  sqliteDB.run("PRAGMA cipher_compatibility = 4");
            sqliteDB.run(`PRAGMA key = ${/* process.env. */SQLITE_PWD}`);
          });
          Logger.info("Sucessfully connected to the SQlite database v2!");
        });
       await require("./sqliteDb_update").sqliteDbUpdate(sqliteDB);

        resolve(sqliteDB)
      } catch (error) {
        console.log("🚀 ~ file: sqliteDb.ts ~ line 20 ~ returnnewPromise ~ error", error)
        reject(error)
      }
    })

  },
  sqliteDB: sqliteDB,
};

// export const initialize = async (ip, port) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const getSqliteDB = () => {
//         return new Promise(async (resolve, reject) => {
//           const sqliteDB = new sqlite3.Database(DBSOURCE, async (err: any) => {
//             Logger.info("sqlite DB start")
//             if (err) {
//               Logger.error(err.message);
//               return reject(err)
//             }
//             sqliteDB.serialize( function () {
//               sqliteDB.run(`PRAGMA key = ${SQLITE_PWD}`);
//               console.log("111111111111111111111")
//             });
//             await require("./sqliteDb_update").sqliteDbUpdate(sqliteDB);
//             resolve(sqliteDB);
//             Logger.info("Sucessfully connected to the SQlite database v2!");
//           });
//         })
//       }

//       const db = await getSqliteDB();
//       console.log("2222222222")

//       resolve(db)

//     } catch (error) {
//       console.log("🚀 ~ file: sqliteConfigDb.ts ~ line 17 ~ returnnewPromise ~ error", error)
//       reject(error)
//     }

//   })
// }

