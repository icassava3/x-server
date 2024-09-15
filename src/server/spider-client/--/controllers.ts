import { Request, Response, Errback } from "express";
import services from "./services";

/**
 * obtenir la liste des modules, 
 * @param req 
 * @param res 
 */

 const _controllerName = (req: Request, res: Response) => {
    services
        ._serviceName()
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.status(400).send({ status: 0, error }));
};

export default {
    _controllerName,
}
