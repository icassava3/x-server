import { Request, Response, Errback } from "express";
import { ICheckPaymentStatusPayload } from "./interfaces";
import services from "./services";

/**
 * Obtenir un lien de paiment cinetpay
 * @param req
 * @param res
 */
const getPaymentUrl = (req: Request, res: Response) => {
  services
    .getPaymentUrl(req.body)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

const checkPaymentStatus = async (req: Request, res: Response) => {
  try {
    const result = await services.checkPaymentStatus(req.body);
    res.status(200).send({ status: 1, data: result });
  } catch (error) {
    console.log(
      "🚀 ~ file: controllers.ts ~ line 29 ~ checkPaymentStatus ~ error",
      error
    );
    res.status(400).send({ status: 0, error });
  }
};

/**
 *  synchroniser le numero versement spider et l'id de la transaction
 * @param req 
 * @param res 
 */
const syncPaymentId = (req: Request, res: Response) => {
  const {versement_id,transaction_id} = req.body
  console.log("🚀 ~ file: controllers.ts ~ line 34 ~ syncPaymentId ~ versement_id,transaction_id", versement_id,transaction_id)
  services
    .syncPaymentId(versement_id,transaction_id)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

/**
 * oibtenir l'historique des logs cinetpays
 */
const getLogs = (req: Request, res: Response) => {
  services
    .getLogs()
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) =>
      res.status(400).send({
        status: 0,
        error: [
          {
            message: error,
          },
        ],
      })
    );
};

/** envoyer a nouveau les actions cinetpay qui ont echoué */
const resendFailedAction = (req: Request, res: Response) => {
  const {logIds} = req.body
  services
    .resendFailedAction(logIds)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

/**
 * PS : Fonctionnalité abandonnée (donc a supprimer) car l'action (traitement) s'eefectue dans spider access
 *  obtenir les transaction cinetpay succès qui ne sont pas encore recuperer par spider access
 * effectuer les versements dans spider local et synchroniser en ligne
 * @param req 
 * @param res 
 */
//  const processFocusTransaction = (req: Request, res: Response) => {
//   services
//     .processFocusTransaction()
//     .then((result: any) => {
//       res.status(200).send({ status: 1, data: result });
//     })
//     .catch((error: any) => res.status(400).send({ status: 0, error }));
// };

/**
 * recuperer et retourner les transaction succès cinetpay pour paiement de frais scolaire  (effectué depuis App focus scolaire et web Frais scolaire) qui ne sont pas encore synchroniseé dans spider
 * @param req 
 * @param res 
 */
const cinetpayNotRecoveredTransaction = (req: Request, res: Response) => {
  services
    .cinetpayNotRecoveredTransaction()
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

/**
 * recuperer et retourner les transaction succès cinetpay pour paiement de frais scolaire  effectué  apartir de spider vba qui ne sont pas encore synchroniseé dans spider
 * @param req 
 * @param res 
 */
const spiderCinetpayNotRecoveredTransaction = (req: Request, res: Response) => {
  services
    .cinetpayNotRecoveredTransaction()
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};


const getCredentials = (req: Request, res: Response) => {
  services
    .getCredentials()
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

export default {
  getPaymentUrl,
  checkPaymentStatus,
  syncPaymentId,
  getLogs,
  resendFailedAction,
  cinetpayNotRecoveredTransaction,
  getCredentials,
  spiderCinetpayNotRecoveredTransaction
};
