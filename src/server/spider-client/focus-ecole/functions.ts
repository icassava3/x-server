import { _executeSql } from "../../databases";

/**
 * recupperer config focus ecole
 * @returns 
 */
const getFocusEcoleConfig = () => {
    return new Promise(async (resolve, reject) => {
        try {
           resolve(true)
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * mettre a jour les config de focus ecole dans sqlite
 * @param focusEcoleConfig 
 * @returns 
 */
const updateFocusEcoleConfig = (focusEcoleConfig) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `UPDATE xserver_config SET value= ? WHERE key = ?`;
            const payloadStringify = JSON.stringify(focusEcoleConfig);
            const sqlParams = [payloadStringify, "focusEcoleConfig"];
            await _executeSql(sql, sqlParams);
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
};

export default {
    getFocusEcoleConfig,
    updateFocusEcoleConfig
}
