import { paramEtabObjet } from "../databases/accessDB";
import redisFunctions from "../databases/redis/functions";
import { fetchPrivateRoute } from "../helpers/apiClient";
import { IWarehouseConfig } from "../helpers/interfaces";
import { WHSERVER_BASE_URL } from "./constants";

/**
 * Verifier si le service warehouse est activé et le numero disque dur est autorisé
 * @returns
 */
export const checkWarehouseActivatedAndAuthorizedHddSerialNumber = async (req, res, next): Promise<boolean> => {
  try {
    const currentPcHDDSerialNumber = await redisFunctions.getGlobalVariable("currentPcHDDSerialNumber");
    const warehouseConfig = await redisFunctions.getGlobalVariable("warehouseConfig") as IWarehouseConfig;

    //Check le status d'activation du warehouse en local
    if (!warehouseConfig) return res.status(500).send({ status: 0, error: { name: "WAREHOUSE_NOT_ACTIVATED", message: "web services non activé" } });
    if (warehouseConfig.hddserialnumber !== currentPcHDDSerialNumber) return res.status(500).send({ status: 0, error: { name: "WAREHOUSE_BAD_COMPUTER", message: "Opération non autorisée sur cet ordinateur" } });

    //Check le status d'activation du warehouse en ligne
    const whOnlineConfig = await getOnlineActivationStatus();
    if (whOnlineConfig.hddserialnumber !== currentPcHDDSerialNumber) return res.status(500).send({ status: 0, error: { name: "WAREHOUSE_BAD_COMPUTER", message: "Opération non autorisée sur cet ordinateur" } });
    next();
  } catch (error) {
    return res.status(400).send({ status: 0, error });
  }
};

/**
* Obtenir le warehouse config en ligne
* @returns 
*/
const getOnlineActivationStatus = () => {
  return new Promise<{ hddserialnumber: string }>(async (resolve, reject) => {
    try {
      
      const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const url = `${WHSERVER_BASE_URL}/warehouseserviceconfig`;
      const payload = { anneeScolaire: anscol1, codeEtab: codeetab }
      const response: any = await fetchPrivateRoute(url, payload)
      resolve(response.data)
    } catch (error) {
      return reject({ name: "ONLINE_ACTIVATION_STATUS_CHECK_ERROR", message: "Impossible de vérifier l'état d'activation en ligne. Veuillez vérifier votre connexion internet et réessayer" })
    }
  });
}