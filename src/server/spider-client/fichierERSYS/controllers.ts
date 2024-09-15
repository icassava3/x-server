import { Request, Response, Errback } from "express";
import services from "./services";



const genererFichierERSYS
    = (req: Request, res: Response) => {
        const {idPeriode} = req.body
        services
            .genererFichierERSYS(idPeriode)
            .then((fileName: any) => {
                const serverUrl = `${req.protocol}://${req.get('host')}/download/${fileName}`
                res.status(200).send({ status: 1, data: serverUrl });
            })
            .catch((error: any) => res.status(400).send({ status: 0, error }));
    };


export default {
    genererFichierERSYS,
}
