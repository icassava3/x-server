
const { _executeSql, _selectSql } = require("../databases");
import { paramEtabObjet } from './../databases/accessDB';
import axios from "axios";
import { GLOBAL_API_BASE_URL } from "./constants";
import { IGlobalApiServerUser } from "./interfaces";
import redisFunctions from '../databases/redis/functions';

export interface IFailedHttpLogOptions {
    service: string;
    action: string;
    payload: any;
}

export const fetchPrivateRoute = (url: string, apiPayload: any, logOnFailOptions: IFailedHttpLogOptions | undefined = undefined) => {
    return new Promise(async (resolve, reject) => {
        try {
            // console.log('\n\n', '------------------------------fetchPrivateRoute START --------------------------------------')

            let credentials = await redisFunctions.getSecureData("globalApiServerCredentials") as IGlobalApiServerUser;
            if (!credentials) {
                await registerXServer();
                credentials = await redisFunctions.getSecureData("globalApiServerCredentials") as IGlobalApiServerUser;
            }
            
            const { token, refreshToken } = credentials
            
            //1.Faire le fecth normal 
            const headers = {
                authorization: `Bearer ${token}`,
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }

            const result1 = await axios.post(url, apiPayload, { headers });

            if (result1.data.status === 1 && !result1.data.data.hasOwnProperty('error')) {
               // console.log('resolving in step 1...', result1.data)
                resolve(result1.data);

            } else if (result1.data.error.name && result1.data.error.name === 'TokenExpiredError') {
                console.log('else if ----------------------')
                //2. si le token a expiré, on lance le end-point sur le serveur global pour le renouveler
                const result2 = await axios.post('https://global.spider-api.com/v1/auth/refreshToken', { refreshToken })
                // console.log('result2:...', result2.data)

                if (result2.data.status === 1) {

                    //on met à jour la base de données et la variable global store 
                    const saveTokenAndRefreshToken = async () => {
                        const { token, refreshToken, avatar64 } = result2.data
                        credentials.token = token
                        credentials.refreshToken = refreshToken
                        // await redisFunctions.addGlobalVariable("globalApiServerCredentials", credentials);
                        await redisFunctions.setSecureData("globalApiServerCredentials", credentials);
                        await _executeSql('UPDATE xserver_config SET value=? WHERE key=?', [JSON.stringify(credentials), "globalApiServerCredentials"])
                        headers.authorization = `Bearer ${token}`
                    }
                    await saveTokenAndRefreshToken()

                    //3. on relance le fetch avec le nouveau token
                    const result3 = await axios.post(url, apiPayload, { headers });
                    // console.log('result3:...', result3.data)

                    if (result3.data.status === 1) {
                        console.log('resolving in step 3...')
                        resolve(result3.data);
                    } else {
                        reject(result3.data.error || 'error')
                    }

                } else {

                    if (result2?.data?.error?.code === 'refreshExpired') {
                        console.log('token and refreshToken expired, trying to refresh registration')
                        const registrationRefreshResult = await axios.post('https://global.spider-api.com/v1/auth/refreshRegistration', credentials)
                        // console.log('registrationRefreshResult:...', registrationRefreshResult)

                        if (registrationRefreshResult.data.status === 1) {

                            //on met à jour la base locale et le store 
                            const saveRefreshRegistration = async () => {
                                const { token, refreshToken } = registrationRefreshResult.data.user
                                credentials.token = token
                                credentials.refreshToken = refreshToken
                                // await redisFunctions.addGlobalVariable("globalApiServerCredentials", credentials);
                                await redisFunctions.setSecureData("globalApiServerCredentials", credentials);
                                await _executeSql('UPDATE xserver_config SET value=? WHERE key=?', [JSON.stringify(credentials), "globalApiServerCredentials"])
                                headers.authorization = `Bearer ${token}`
                            }
                            await saveRefreshRegistration()

                            // redo the normal fetch
                            const result4 = await axios.post(url, apiPayload, { headers })
                            // console.log('result1:...', result4.data)

                            if (result4.data.status === 1) {
                                console.log('resolving in step 4...')
                                resolve(result4.data);
                            } else {
                                reject(result4.data.error || 'error')
                            }

                        } else {
                            reject(registrationRefreshResult.data.error || 'error')
                        }


                    } else {
                        reject(result2.data.error)
                    }
                }

            } else {
                reject(result1.data.error)
            }
        } catch (error) {
            if (logOnFailOptions) logHttpFailedRequest(logOnFailOptions);
            reject(error)
        } finally {
            // console.log('------------------------------fetchPrivateRoute END --------------------------------------', '\n\n')
        }
    })
}


export const fetchPublicRoute = (url: string, apiPayload: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            // console.log('\n\n', '------------------------------fetchPublicRoute START --------------------------------------')
            const result = await axios.post(url, apiPayload)
            if (result.data.status) {      //si le status est positif -> succès
                resolve(result.data);
            } else {
                reject(result.data.error)
            }
        } catch (error) {
            console.log("fetchPublicRoute catch error ---------------");
            reject(error)
        } finally {
            // console.log('------------------------------fetchPublicRoute END --------------------------------------', '\n\n')
        }
    })
}


export const registerXServer = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const currentPcHDDSerialNumber = await redisFunctions.getGlobalVariable("currentPcHDDSerialNumber");
            const url = `${GLOBAL_API_BASE_URL}/auth/register`;
            const apiPayload = {
                appID: "X-SERV",
                userPhone: currentPcHDDSerialNumber,
                password: currentPcHDDSerialNumber,
                profile: {}
            }

            const result: any = await fetchPublicRoute(url, apiPayload);

            if (result.status) {
                
                const credentials = { ...result.user, password: currentPcHDDSerialNumber };

                await _executeSql('REPLACE INTO xserver_config(key,value) VALUES(?,?)', ["globalApiServerCredentials", JSON.stringify(credentials)]);

                await redisFunctions.setSecureData("globalApiServerCredentials", credentials);
                resolve(true);
            } else {
                await redisFunctions.setSecureData("globalApiServerCredentials", null);
                reject({ name: "AUTH_NOT_CREATED", message: "Le compte api xserver n'a pu être créé" });
            }

        } catch (error) {
            console.log("🚀 ~ file: apiClient.ts:169 ~ returnnewPromise ~ error", error)
            reject(error)
        } finally {
            console.log('------------------------------fetchPublicRoute END --------------------------------------', '\n\n')
        }
    })
}

/**
 * Logguer en local une requête http ayant échoué pour raison
 * de connexion ('Network request failed')
 * @param action
 * @param payload
 * @param statut
 * @returns
 */
export const logHttpFailedRequest = (logHttpFailedRequest: IFailedHttpLogOptions) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { anscol1, codeetab } = await paramEtabObjet([
                "Anscol1",
                "CodeEtab",
            ]);
            const { service, action, payload } = logHttpFailedRequest;
            const sql = `INSERT INTO http_fails_logs (anneeScolaire, codeEtab, service, action, payload, statut) VALUES (?,?,?,?,?,?)`;
            await _executeSql(sql, [anscol1, codeetab, service, action, JSON.stringify(payload), 0]);
            resolve(true);
        } catch (error) {
            console.log("🚀 ~ file: apiClient.ts:192 ~ returnnewPromise ~ error", error)
            reject(error);
        }
    });
};

