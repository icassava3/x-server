import { encryptPayload, decryptPayload } from "../../helpers/function";
import { redisClient } from ".";
import { REDIS_ENCRYPT_KEY } from "../../helpers/constants";



/**
 * ajouter une variable global
 * @param key 
 * @param value 
 * @returns 
 */
export const addGlobalVariable = (key: string, value: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const valueStringify = value ? JSON.stringify(value) : null;
            redisClient.hset("globalVariables", key, valueStringify, (err, reply) => {
                if (err) reject(err)
                resolve(true);
            });
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * recupperer la valeur d'une variable global
 * @param key 
 * @returns 
 */
export const getGlobalVariable = (key: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            redisClient.hget("globalVariables", key, (err, reply) => {
                if (err) reject(err)
                resolve(reply ? JSON.parse(reply) : null);
            });
        } catch (error) {
            console.log("🚀 ~ file: functions.ts:121 ~ returnnewPromise ~ error", error)
            reject(error);
        }
    });
};

export const hSetJsonData = (key: string, field: string, value: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const stringifyData = JSON.stringify(value);
            await redisClient.hset(key, field, stringifyData);
            resolve(true)
        } catch (error) {
            console.log("🚀 ~ file: functions.ts:163 ~ returnnewPromise ~ error", error)
            reject(error);
        }
    });
};

export const hGetJsonData = (key: string, field:string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await redisClient.hget(key,field);
            const parsedData = JSON.parse(data)
            resolve(parsedData);
        } catch (error) {
            console.log("🚀 ~ file: functions.ts:163 ~ returnnewPromise ~ error", error)
            reject(error);
        }
    });
};


/**
 * Save encrypted data to the redis database
 * @param key key of the redis database
 * @param data json data or null value
 * @returns 
 */
export const setSecureData = (key: string, data: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const value = !data ? '' : encryptPayload(data, /* process.env. */REDIS_ENCRYPT_KEY)
            await redisClient.set(key, value)
            resolve(true);
        } catch (error) {
            console.log("🚀 ~ file: functions.ts:163 ~ returnnewPromise ~ error", error)
            reject(error);
        }
    });
};

/**
 * Retrieve decrypted data from the redis database
 * @param key key of the redis database
 * @returns json data or null value
 */
export const getSecureData = (key: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await redisClient.get(key)
            const value = !data ? '' : decryptPayload(data, /* process.env. */REDIS_ENCRYPT_KEY)
            resolve(value)
        } catch (error) {
            console.log("🚀 ~ file: functions.ts:163 ~ returnnewPromise ~ error", error)
            reject(error);
        }
    });
};


export default {
    addGlobalVariable,
    getGlobalVariable,
    hSetJsonData,
    hGetJsonData,
    setSecureData,
    getSecureData
}