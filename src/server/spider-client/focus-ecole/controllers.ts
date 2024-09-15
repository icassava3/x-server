import { Request, Response, Errback, NextFunction } from "express";
import services from "./services";

/**
 * Obtenir la liste des parents qui suivent des enfants (souscription focus ecole)
 * @param req 
 * @param res 
 */

 const focusEcoleSubscriber = (req: Request, res: Response, next:NextFunction ) => {
    services
        .focusEcoleSubscriber()
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch(next);
};

/**
 * Mettre a jour les config focus ecole pour un etablissement donné
 * @param req 
 * @param res 
 */
const focusEcoleUpdateConfig = (req: Request, res: Response, next:NextFunction) => {
    services
        .focusEcoleUpdateConfig(req.body)
        .then((result: any) => {
            (req as any).io.emit("focusEcoleUpdatedConfig", result );
            res.status(200).send({ status: 1, data: result });
        })
        .catch(next);
};

/**
 * Obtenir le config focus ecole pour l'etab
 * @param req 
 * @param res 
 */
const getEtabFocusEcoleConfig = (req: Request, res: Response, next:NextFunction) => {
    services
        .getEtabFocusEcoleConfig()
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch(next);
};

export default {
    focusEcoleSubscriber,
    focusEcoleUpdateConfig,
    getEtabFocusEcoleConfig
}
