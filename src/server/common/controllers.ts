
import { Request, Response, Errback } from "express";
import services from "./services";

const paramEtab = (req: Request, res: Response) => {
    services
        .paramEtab()
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.status(400).send({ status: 0, error }));
};

/**
 * connexion d'un utiisateur
 * @param req 
 * @param res 
 */

const authentification = (req: Request, res: Response) => {
    services
        .authentification(req.body)
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });

        })
        .catch((error: any) => {
            res.status(400).send({ status: 0, error })
        })
}


export default ({
    paramEtab,
    authentification
})