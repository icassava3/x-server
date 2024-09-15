import { Request, Response, Errback } from "express";
import services from "./services";

/**
 * Obtenir la liste des modeles rapports
 * @param req 
 * @param res 
 */
const listemodeleRapport = (req: Request, res: Response) => {
    services
        .listemodeleRapport()
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((errors: any) => res.status(400).send({ status: 0, errors }));
};
/**
 * mettre à jour la table modele-rapport de la bd sqlite server-data
 * @param req 
 * @param res 
 */
const upateModeleRapport = (req: Request, res: Response) => {
    services
        .upateModeleRapport()
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((errors: any) => res.status(400).send({ status: 0, errors }));
};


/**
 * ajouter un nouveau rapport, 
 * @param req 
 * @param res 
 */

 const nouveauRapport = (req: Request, res: Response) => {
    const io = (req as any).io;
     console.log("🚀 ~ file: controllers.ts:48 ~ nouveauRapport ~ req.body", req.body)
        services
        .nouveauRapport(req.body)
        .then((result: any) => {
            io.emit("inserted_rapport_item", result);
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.status(400).send({ status: 0, error }));
};

/**
 * mettre a jour le data du rapport
 * @param req 
 * @param res 
 */
 const modifierRapportData = (req: Request, res: Response) => {
    const io = (req as any).io;

    services
        .modifierRapportData(req.body)
        .then((result: any) => {
            console.log("🚀 ~ file: controllers.ts:47 ~ .then ~ result", result)
            io.emit("updated_rapport_item", result);
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.status(400).send({ status: 0, error }));
};

/**
 * Obtenir la liste des rapports
 * @param req 
 * @param res 
 */
 const listeRapport = (req: Request, res: Response) => {
    services
        .listeRapport()
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.status(400).send({ status: 0, error }));
};

/**
 * Mettre a jour le libellé du rapport
 */
 const modifierLibelleRapport = (req: Request, res: Response) => {
    const io = (req as any).io;
    services
        .modifierLibelleRapport(req.body)
        .then((result: any) => {
            io.emit("rapport", result);
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.status(400).send({ status: 0, error }));
};


/**
 * Supprimer un rapport
 */

const supprimerRapportData = (req: Request, res: Response) => {
    services.supprimerRapportData(req.body)
    .then((result:any) => {
        res.status(200).send({ status: 1, data: result });

    })
    .catch((error: any) => res.status(400).send({ status: 0, error }))
}

export default {
    listemodeleRapport,
    nouveauRapport,
    modifierRapportData,
    listeRapport,
    modifierLibelleRapport,
    supprimerRapportData,
    upateModeleRapport
}
