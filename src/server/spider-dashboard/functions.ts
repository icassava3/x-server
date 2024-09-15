import { appCnx, fetchFromMsAccess } from "../databases/accessDB";
import Logger from "../helpers/logger";
import { _executeSql, _selectSql } from "../databases";

// const getStatisticsData = () => {
//     return new Promise(async (resolve, reject) => {
//         try {

//             const sql1 = `SELECT DISTINCT 
//         (SELECT COUNT(*) FROM Elèves WHERE sexe=2) AS filles, 
//         (SELECT COUNT(*) FROM Elèves WHERE sexe is null or sexe=1) AS garcons, 
//         (SELECT COUNT(*) FROM Elèves WHERE Elèves.statutElève=1) AS aff, 
//         (SELECT COUNT(*) FROM Elèves WHERE Elèves.statutElève is null or Elèves.statutElève<>1) AS naff, 
//         (SELECT COUNT(*) FROM Elèves WHERE redoub=yes) AS redoublants
//         FROM Classes;`;
//             const data1 = await fetchFromMsAccess(sql1, appCnx)

//             const obj = data1[0] || {
//                 filles: 0,
//                 garcons: 0,
//                 aff: 0,
//                 naff: 0,
//                 redoublants: 0,
//             }
//             const chartArray = Object.keys(obj).map(key => obj[key])

//             const sql2 = `SELECT DISTINCT 
//         (SELECT COUNT(*) FROM Elèves) AS effectifEleves, 
//         (SELECT COUNT(*) FROM Elèves WHERE Elèves.statutElève=1) AS elevesAffectes, 
//         (SELECT COUNT(*) FROM Elèves WHERE Elèves.statutElève is null or Elèves.statutElève<>1) AS elevesNonAffectes, 
//         (SELECT COUNT(*) FROM Classes) AS nbClasses, 
//         (SELECT COUNT(*) FROM Personnel WHERE fonction<>6) AS personnelAdmin, 
//         (SELECT COUNT(*) FROM Personnel WHERE fonction=6) AS personnelEns
//         FROM Classes;`;
//             const data2 = await fetchFromMsAccess(sql2, appCnx)
//             const stat = data2[0] || {
//                 effectifEleves: 0,
//                 elevesAffectes: 0,
//                 elevesNonAffectes: 0,
//                 nbClasses: 0,
//                 personnelAdmin: 0,
//                 personnelEns: 0,
//             }
//             const result = { series: chartArray, stat }
//             resolve(result)
//         } catch (error) {
//             Logger.error("Une erreur s'est produite lors de la recuperation donnee statistique");
//             reject(error);
//         }

//     })
// }

const getStatisticsData = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql1 = `SELECT DISTINCT
        (SELECT COUNT(*) FROM Elèves WHERE sexe=2 AND inscrit=yes) AS filles,
        (SELECT COUNT(*) FROM Elèves WHERE (sexe is null or sexe=1)  AND inscrit=yes) AS garcons,
        (SELECT COUNT(*) FROM Elèves WHERE Elèves.statutElève=1  AND inscrit=yes) AS aff,
        (SELECT COUNT(*) FROM Elèves WHERE (Elèves.statutElève is null or Elèves.statutElève<>1)  AND inscrit=yes) AS naff,
        (SELECT COUNT(*) FROM Elèves WHERE redoub=yes  AND inscrit=yes) AS redoublants
        FROM Classes;`;
            const data1 = await fetchFromMsAccess(sql1, appCnx)
            const obj = data1[0] || {
                filles: 0,
                garcons: 0,
                aff: 0,
                naff: 0,
                redoublants: 0,
            }
            const chartArray = Object.keys(obj).map(key => obj[key])
            const sql2 = `SELECT DISTINCT
        (SELECT COUNT(*) FROM Elèves WHERE inscrit=yes) AS effectifEleves,
        (SELECT COUNT(*) FROM Elèves WHERE Elèves.statutElève=1 AND inscrit=yes) AS elevesAffectes,
        (SELECT COUNT(*) FROM Elèves WHERE (Elèves.statutElève is null or Elèves.statutElève<>1) AND inscrit=yes) AS elevesNonAffectes,
        (SELECT COUNT(*) FROM Classes) AS nbClasses,
        (SELECT COUNT(*) FROM Personnel WHERE fonction<>6) AS personnelAdmin,
        (SELECT COUNT(*) FROM Personnel WHERE fonction=6) AS personnelEns
        FROM Classes;`;
            const data2 = await fetchFromMsAccess(sql2, appCnx)
            const stat = data2[0] || {
                effectifEleves: 0,
                elevesAffectes: 0,
                elevesNonAffectes: 0,
                nbClasses: 0,
                personnelAdmin: 0,
                personnelEns: 0,
            }
            const result = { series: chartArray, stat }
            resolve(result)
        } catch (error) {
            Logger.error("Une erreur s'est produite lors de la recuperation donnee statistique");
            reject(error);
        }
    })
}

const getStatisticsPhoto = (codeEtab: string, anScol: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `
                SELECT COUNT(*) AS totalPhotos FROM (SELECT DISTINCT studentId FROM photo WHERE codeEtab=? AND anneeScolaire=?)  
            `
            const result = await _selectSql(sql, [codeEtab, anScol])
            resolve(result)
        } catch (error) {
            Logger.error("Une erreur s'est produite lors de la recuperation donnee statistique");
            reject(error);
        }
    })
}

/**
 * Mettre a jour un ligne de config
 */
const updateConfigData = (key, newValue): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `UPDATE xserver_config SET value= ? WHERE key= ?`;
            await _executeSql(sql, [newValue, key]);
            resolve(true);
        } catch (error) {
            Logger.error(
                "Une erreur s’est produite lors de la récupération super admin"
            );
            reject(error);
        }
    });
};

/**
 *
 * @param key la cle a inserer
 * @param newValue la valeur de la cle
 * @returns
 */
const addConfigData = (key, newValue): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `INSERT INTO xserver_config (key,value) VALUES (?,?)`;
            await _executeSql(sql, [key, newValue]);
            resolve(true);
        } catch (error) {
            Logger.error(
                "Une erreur s’est produite lors de la récupération super admin"
            );
            reject(error);
        }
    });
};

const getXserverConfig = (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT * FROM xserver_config`;
            const result = await _selectSql(sql, []);
            resolve(result);
        } catch (error) {
            Logger.error(
                ""
            );
            reject(error);
        }
    });
};

export default {
    getStatisticsData,
    getStatisticsPhoto,
    updateConfigData,
    addConfigData,
    getXserverConfig
}