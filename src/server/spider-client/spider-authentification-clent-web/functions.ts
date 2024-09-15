
import { appCnx, dataCnx, fetchFromMsAccess, paramEtabObjet } from "../../databases/accessDB";


/**
 * Fonction quiretourne les droits de l'utilisateur passé en paramètre
 * @param userName
 * @returns
 */
const getUserRights = (userName: string): Promise<string[]> => {
    return new Promise<string[]>(async (resolve, reject) => {
        try {
            interface IRightsResult {
                nom_form_ou_proc: string
            }
            const sql = `SELECT nom_form_ou_proc FROM UsysDroits WHERE user="${userName}";`
            const result = await fetchFromMsAccess<IRightsResult[]>(sql, dataCnx)
            const rights = result.map((item) => item.nom_form_ou_proc)
            resolve(rights)
        } catch (error) {
            console.log(":fusée: ~ file: services.ts:61 ~ returnnewPromise ~ error:", error)
            reject(error)
        }
    })
}
export default {getUserRights}