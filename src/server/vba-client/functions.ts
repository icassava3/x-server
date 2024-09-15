import { _executeSql } from "../databases";

/**
 * maj vba credentials
 * @param data 
 * @returns 
 */
export const updateVbaCredentials = (data:string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const key = "vbaCredentials";
            const sql = `UPDATE xserver_config SET value =? WHERE key =?`;
            await _executeSql(sql, [data,key]);
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
};
