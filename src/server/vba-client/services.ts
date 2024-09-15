import { resendHttpFailedAction } from "../common/services";
import { cinetpayNotRecoveredTransaction } from "../spider-partenaires/cinetpay/services";
import { recupererAppelAssiduiteNonSynchronise } from './../spider-prof-expert/services';

/**
 * recupperer 
 * l'etat des services des partenaires
 *  les transactions cinetpay non encore recupperé par spider , 
 * les souscriptions aux rubriques optionnelle nons recupperé par spider
 * @returns 
 */
const vbaClientLogin = () => {
    return new Promise(async (resolve, reject) => {
        try {

            // fetch les paiments cinetpay en attente d'etre deversé dans spider vba 
            let cinetpayXserver: any = [];
            let cinetpayApp: any = [];
            const checkNotRecoveredTransaction = async () => {
                try {
                    //temporaire retourne le versement qui vient d'etre inserrer
                    const data: any = await cinetpayNotRecoveredTransaction()
                    cinetpayXserver = data.filter(item => item.app === "X-SERV") //transaction cinetpay effectué a partir de spider
                    cinetpayApp = data.filter(item => item.app !== "X-SERV") //transaction cinetpay effectué a partir de frais scolaire et focus ecole
                } catch (error) {
                    console.log(":fusée: ~ file: services.ts ~ line 37 ~ returnnewPromise ~ error", error)
                }
            }
            await checkNotRecoveredTransaction();


            //obtenir la liste des assiduites eleves en lignes pas encore synchroniser en local 
            const appelAssiduiteNonSynchronise = async () => {
                try {
                    await recupererAppelAssiduiteNonSynchronise()
                } catch (error) {
                     console.log("🚀 ~ file: services.ts ~ line 56 ~ appelAssiduiteNonSynchronise ~ error", error)
                }
            }
            appelAssiduiteNonSynchronise();

            // renvoyer a nouveau les actions http qui ont echoué
            const resendFailedAction = async () => {
                try {
                    await resendHttpFailedAction()
                } catch (error) {
                    // console.log(":fusée: ~ file: services.ts ~ line 37 ~ returnnewPromise ~ error", error)
                }
            }
            resendFailedAction();

            //les donnnes à retouner
            const dataToReturn = {
                services: [],
                cinetpay: cinetpayApp,
                cinetpayXserver
            }
            resolve(dataToReturn)
        } catch (error) {
            reject(error);
        }
    });
};

export default {
    vbaClientLogin
}