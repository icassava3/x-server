import { _executeSql, _selectSql } from "../../databases";
import {
    appCnx,
    executeToMsAccess,
    fetchFromMsAccess,
} from "../../databases/accessDB";

/**
 * Obtenir la liste des classes
 */
const getClassesList = (): Promise<(any)> => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT * FROM Classes;`
            const result = await fetchFromMsAccess<any>(sql, appCnx);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Obtenir la liste des eleves
 */
const getStudentsList = (): Promise<(any)> => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT * FROM Elèves;`
            const result = await fetchFromMsAccess<any>(sql, appCnx);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Obtenir la liste personnels
 */
const getPersonnelsList = (): Promise<(any)> => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT * FROM Personnel;`
            const result = await fetchFromMsAccess<any>(sql, appCnx);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Obtenir la liste des ordre enseignements
 */
const getOrdreEnseignement = (): Promise<(any)> => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT * FROM ordre_enseig;`
            const result = await fetchFromMsAccess<any>(sql, appCnx);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Obtenir la liste des echeanciers
 */
const echeanciers = (): Promise<(any)> => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT * FROM echeancier;`
            const result = await fetchFromMsAccess<any>(sql, appCnx);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * obtenir la liste des versments
 * @returns 
 */
const versements = (): Promise<(any)> => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT * FROM versements;`
            const result = await fetchFromMsAccess<any>(sql, appCnx);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

export default {
    getClassesList,
    getStudentsList,
    getPersonnelsList,
    getOrdreEnseignement,
    echeanciers,
    versements
}
