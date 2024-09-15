import { _executeSql, _selectSql } from "../databases";
import { partenaireCampusFranceId, partenaireCinetPayId, partenaireEdiattahId, partenaireFocusEcoleId, partenaireGainId, partenaireMemoId, partenairesymtelId } from "./constants";
import { IPartner, IService } from "./interface";


/**
 * associé les patenaires et leurs differents services
 * @returns 
 */
export const getPartnersServices = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const config = {
                symtel: [],
                ediattah: [],
                gain: [],
                memo: [],
                campusFrance: [],
                cinetpay:[],
                focusEcole:[]
            }
            const sql = `SELECT * FROM services`;
            const services: IService[] = await _selectSql(sql, [])
            services.map((item: IService) => {
                item.config = JSON.parse(item.config)
                if (item.idPartenaire === partenairesymtelId) {
                    config.symtel.push(item)
                } else if (item.idPartenaire === partenaireEdiattahId) {
                    config.ediattah.push(item)
                } else if (item.idPartenaire === partenaireGainId) {
                    config.gain.push(item)
                } else if (item.idPartenaire === partenaireMemoId) {
                    config.memo.push(item)
                } else if (item.idPartenaire === partenaireCampusFranceId) {
                    config.campusFrance.push(item)
                } else if (item.idPartenaire === partenaireCinetPayId) {
                    config.cinetpay.push(item)
                }else if (item.idPartenaire === partenaireFocusEcoleId) {
                    config.focusEcole.push(item)
                }
            })
            resolve(config)
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * recupper la liste des partenaires
 * @returns 
 */
export const getPartnersList = (): (Promise<IPartner[]>) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT * FROM partenaires`
            const partners: IPartner[] = await _selectSql(sql, [])
            resolve(partners)
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * recuperer la liste des services d'un partenaire
 * @param partnerId 
 * @returns 
 */
export const getServices = (partnerId: string): Promise<IService[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT * FROM services WHERE idPartenaire = ?`
            const services: IService[] = await _selectSql(sql, [partnerId])
            resolve(services)
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * obtenir les données sur un service
 * @param serviceId 
 * @returns 
 */
export const getServiceData = (serviceId: string): Promise<IService> => {
    return new Promise(async (resolve, reject) => {
        console.log("🚀 ~ file: functions.ts ~ line 82 ~ serviceId", serviceId)
        try {
            const sql = `SELECT * FROM services WHERE idService = ?`
            const service: IService[] = await _selectSql(sql, [serviceId])
            console.log("🚀 ~ file: functions.ts ~ line 87 ~ returnnewPromise ~ service", service)
            if (service.length == 0) {
               return reject({ name: "SERVICE_NOT_FOUND", message: "Service non trouvé" } )
            }
            resolve(service[0])
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * activer ou desactiver un service d'un partenaire
 * @param data 
 * @returns 
 */
export const activateDeactivateService = (data: any): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("LA FONCTION S'EST ACTIVER DEACTIVER +++++++++")
            const { configService, serviceId, currentActivatedStatus,sendData,activated } = data
            const sql = `UPDATE services SET config = ?,activated=?,initialized=?,sendData=? WHERE idService = ?`
            await _executeSql(sql, [configService, activated, 0,sendData, serviceId])
            resolve(true);
        } catch (error) {
            reject(error)
        }
    })
}


/**
 * activer un service d'un partenaire
 * @param data 
 * @returns 
 */
export const initializeService = (serviceId: string): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `UPDATE services SET initialized = ? WHERE idService = ?`
            await _executeSql(sql, [1, serviceId])
            resolve(true);
        } catch (error) {
            reject(error)
        }
    })
}


export default {
    getPartnersList,
    getServices,
    getServiceData,
    activateDeactivateService,
    initializeService,
    getPartnersServices
}