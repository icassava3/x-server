import functions from "./functions";
import { fetchPublicRoute } from "../../helpers/apiClient";
import { paramEtabObjet } from "../../databases/accessDB";
import { FOCUS_ECOLE_BASE_URL } from "../../helpers/constants";
import { IConfigItem, IFocusEcoleConfig } from "./interfaces";
import redisFunctions from "../../databases/redis/functions";
import { checkWarehouseActivatedAndAuthorizedHddSerialNumber } from "../../spider-whserver/services";

/**
 * Obtenir la liste des parents qui suivent des enfants (souscription focus ecole)
 * @returns 
 */
const focusEcoleSubscriber = () => {
    return new Promise(async (resolve, reject) => {
        try {
            //recuperer anneescolaire et codeEtab
            const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);
            const url = `${FOCUS_ECOLE_BASE_URL}/focus-ecole-souscripteur`;
            const res = await fetchPublicRoute(url, { anneeScolaire: anscol1, codeEtab: codeetab }) as any;
            console.log("🚀 ~ returnnewPromise ~ res:", res)
            resolve(res.data)
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Mettre a jour les config focus ecole pour un etablissement donné
 * @returns 
 */
const focusEcoleUpdateConfig = (config: IConfigItem) => {
    return new Promise(async (resolve, reject) => {
        try {
            await checkWarehouseActivatedAndAuthorizedHddSerialNumber()
            //recupperer anneescolaire et codeEtab
            const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);

            //mettre a jour en ligne
            const url = `${FOCUS_ECOLE_BASE_URL}/update-focus-ecole-config`;
            const res = await fetchPublicRoute(url, { anneeScolaire: anscol1, codeEtab: codeetab, config }) as any;
          
            //mettre a jour en local
            //recuperer donne config existant depuis redis et mettre a jour 
            const focusEcoleConfig = await redisFunctions.getGlobalVariable("focusEcoleConfig") as IFocusEcoleConfig;
            const existingConfig = (focusEcoleConfig && focusEcoleConfig.config)? focusEcoleConfig.config:{"showPhoto": false, "showContact": false};
            const focusEcoleNewConfig:IFocusEcoleConfig = {anneeScolaire:anscol1,codeEtab:codeetab,config:{ ...existingConfig, ...config }}
            const currentAllFocusEcoleConfig= await redisFunctions.getGlobalVariable("allFocusEcoleConfig") as IFocusEcoleConfig[];
            const index = currentAllFocusEcoleConfig.findIndex(item => item.anneeScolaire === anscol1 && item.codeEtab === codeetab);
            if (index > -1) {
                currentAllFocusEcoleConfig.splice(index, 1, focusEcoleNewConfig)
            } else {
                currentAllFocusEcoleConfig.push(focusEcoleNewConfig)
            }
            
            //mettre a jour config dans redis
            await redisFunctions.addGlobalVariable("focusEcoleConfig", focusEcoleNewConfig);
            await redisFunctions.addGlobalVariable("allFocusEcoleConfig", currentAllFocusEcoleConfig);
      
            //mettre a jour dans sqlite
            await functions.updateFocusEcoleConfig(currentAllFocusEcoleConfig)

            resolve(config)
        } catch (error) {
            console.log("🚀 ~ file: services.ts:64 ~ returnnewPromise ~ error:", error)
            reject(error);
        }
    });
};

/**
 * Obtenir le config focus ecole pour l'etab
 * @returns 
 */
const getEtabFocusEcoleConfig = () => {
    return new Promise(async (resolve, reject) => {
        try {
            await checkWarehouseActivatedAndAuthorizedHddSerialNumber()
            const focusEcoleConfig = await redisFunctions.getGlobalVariable("focusEcoleConfig") as IFocusEcoleConfig;
            resolve(focusEcoleConfig)
        } catch (error) {
            reject(error);
        }
    });
};

export default {
    focusEcoleSubscriber,
    focusEcoleUpdateConfig,
    getEtabFocusEcoleConfig
}

