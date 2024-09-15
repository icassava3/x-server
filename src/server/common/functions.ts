import { _selectSql, _executeSql } from './../databases/index';
/**
 * selectionner les action http qui ont echouée
 * @returns 
 */
export function fetchHttpFailsLogs<ILogItem>() {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT * FROM http_fails_logs WHERE statut=0`;
            const result: ILogItem[] = await _selectSql(sql, []);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

export const setHttpFailsLogsSuccess = (logIds: number[]): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            const dateNow = new Date().toLocaleString();
            const sql = `UPDATE http_fails_logs SET statut = ?,created_at=? WHERE id IN  (${logIds.join(
                ","
            )})`;
            await _executeSql(sql, [1, dateNow]);
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
};


export default {
    fetchHttpFailsLogs,
    setHttpFailsLogsSuccess
}