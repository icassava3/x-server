import { paramEtabObjet } from './../../../databases/accessDB';

import { _executeSql, _selectSql } from "../../../databases";
import { IModeleRapport, IPlanModeleRapportItem, IRapport } from "./interfaces";


/**
 * inserrer ou mettre a jour un ou plusieurs modele rapport
 */
const insertOrUpdateModeleRapport = (data: any[]): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            const fields = `idModeleRapport,libelleModeleRapport,planModeleRapport,revision,status`;
            let valuesPlaceholders = data.map(() => "(?, ?, ?, ?, ?)").join(', ');
            const sql = `REPLACE INTO _modele_rapport (${fields}) VALUES ${valuesPlaceholders}`;
            let values = [];
            data.forEach((arr) => { arr.forEach((item) => { values.push(item) }) });
            await _executeSql(sql, values);
            resolve(true)
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Obtenir la liste des modeles rapports
 * @param idModeleRapport 
 * @returns 
 */
const getModeleRapport = (
    idModeleRapport: string = null
): Promise<IModeleRapport | IModeleRapport[] | boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!idModeleRapport) {
                const sql = `SELECT * FROM _modele_rapport`;
                const res: IModeleRapport[] = await _selectSql(sql, []);
                resolve(res);
            } else {
                const sql = `SELECT * FROM _modele_rapport WHERE idModeleRapport = ?`;
                const res: IModeleRapport[] = await _selectSql(sql, [idModeleRapport]);
                res.length === 1
                    ? resolve(res[0])
                    : reject({ name: "RAPPORT_ERROR", message: "Aucun modèle trouvé" });
            }
        } catch (error) {
            console.log(
                "🚀 ~ file: functions.ts ~ line 33 ~ returnnewPromise ~ error",
                error
            );
            reject(error);
        }
    });
};



/**
 * inserer les données du rapport
 * @returns 
 */
const insertRapport = (data: IRapport): Promise<number> => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("🚀 ~ file: functions.ts:67 ~ insertRapport ~ data", data)
            const { anscol1, codeetab } = await paramEtabObjet([
                "Anscol1",
                "CodeEtab",
            ]);
            const anneeScolaire = anscol1;
            const codeEtab = codeetab;
            const { idModeleRapport, libelleRapport, planModeleRapport, revisionModeleRapport } = data;

            const rapportStringify = JSON.stringify(planModeleRapport)
            const values = [
                anneeScolaire,
                codeEtab,
                idModeleRapport,
                revisionModeleRapport,
                rapportStringify,
                libelleRapport
            ]
            const sql = `INSERT INTO rapport (anneeScolaire,codeEtab,idModeleRapport,revisionModeleRapport, rapportData, libelleRapport) VALUES (?,?,?,?,?,?)`;
            const rapportInserted: any = await _executeSql(sql, [...values])
            resolve(rapportInserted.lastID)
        } catch (error) {
            console.log("🚀 ~ file: functions.ts:80 ~ returnnewPromise ~ error", error)

            reject(error);
        }
    });
};

/**
 * fetcher un ou plusieurs rapports
 * @returns 
 */

const getRapport = (idRapport: number = null): Promise<IRapport | IRapport[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const { anscol1, codeetab } = await paramEtabObjet([
                "Anscol1",
                "CodeEtab",
            ]);
            // Définir la requête SQL et les paramètres
            const sql = idRapport
                ? `SELECT * FROM rapport WHERE idRapport = ? AND codeEtab = ? AND anneeScolaire = ?`
                : `SELECT * FROM rapport WHERE codeEtab = ? AND anneeScolaire = ? ORDER BY idRapport DESC`;
            const params = idRapport ? [idRapport, codeetab, anscol1] : [codeetab, anscol1];
            // Exécuter la requête SQL
            const res = await _selectSql(sql, params);
           
            resolve(idRapport ? res[0] : res)
        } catch (error) {
            reject(error);
        }
    });
};



/**
 * fetcher un rapport data
 * @param idRapport 
 * @returns 
 */
const getRapportData = (idRapport: number): Promise<IPlanModeleRapportItem[]> => {
    return new Promise(async (resolve, reject) => {

        const sql = `SELECT rapportData FROM rapport WHERE idRapport = ?`;
        const res: IPlanModeleRapportItem[] = await _selectSql(sql, [idRapport]);
        if (!res.length) return reject({ name: "RAPPORT_ERROR", message: "Aucun rapport trouvé" })
        const dataParse = JSON.parse(res[0]["rapportData"])
        resolve(dataParse)
    }
    )
}

/**
 * mettre a jour le data du rapport
 * @param data 
 * @returns 
 */
const updateRapportData = (idRapport: number, rapportData: IPlanModeleRapportItem[]): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {

            const rapportStringify = JSON.stringify(rapportData)
            const sql = `UPDATE rapport SET rapportData=? WHERE idRapport=?`;
            await _executeSql(sql, [rapportStringify, idRapport]);
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * modifier le libellé du rapport
 */

const updateLibelleRapport = (idRapport: number, libelleRapport: string): Promise<number> => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `UPDATE rapport SET libelleRapport=? WHERE idRapport=?`;
            const result: any = await _executeSql(sql, [libelleRapport, idRapport]);
            if (result.affectedRows !== 1) return reject({ name: "RAPPORT_ERROR", message: "l'id du rapport n'est pas exacte." })
            resolve(idRapport);
        } catch (error) {
            reject(error);
        }

    })

}


/**
 * Supprimer un rapport 
 */
const deleteRapportData = (idRapport: number, idModeleRapport: string): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `DELETE FROM rapport WHERE idRapport = ? AND idModeleRapport = ?`
            const result: any = await _executeSql(sql, [idRapport, idModeleRapport]);
            if (result.affectedRows !== 1) return reject({ name: "RAPPORT_ERROR", message: "Suppression impossible." })
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
}

export default {
    insertOrUpdateModeleRapport,
    getModeleRapport,
    insertRapport,
    getRapport,
    updateRapportData,
    getRapportData,
    updateLibelleRapport,
    deleteRapportData
}
