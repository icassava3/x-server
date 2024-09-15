import { Request, Response, Errback } from "express";
import services from "./services";

// /**
//  * Récapitulatif des résultats des élèves par tranche de moyennes générales
//  * du premier trimestre et par sexe au général
//  * @param req 
//  * @param res 
//  */
const getElevesSecondaireGeneralRendementParTrancheMoyEtSexe = (req: Request, res: Response) => {
    services
        .getElevesSecondaireGeneralRendementParTrancheMoyEtSexe(req.body)
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.status(400).send({ status: 0, error }));
};

// /**
//  * Proportion des élèves n'ayant pas obtenus la moyenne au 1er trimestre
//  * par niveau et par discipline au secondaire général
//  * @param req 
//  * @param res 
//  */
// const getElevesSecondaireGeneralMoyennesParDiscipline
//     = (req: Request, res: Response) => {
//         services
//             .getElevesSecondaireGeneralMoyennesParDiscipline(req.body)
//             .then((result: any) => {
//                 res.status(200).send({ status: 1, data: result });
//             })
//             .catch((error: any) => res.status(400).send({ status: 0, error }));
//     };

/**
 * Générer la proportion des élèves n'ayant pas obtenus la moyenne au 1er trimestre
 * par niveau et par discipline au secondaire général et celle des élèves n'ayant 
 * pas obtenus la moyenne au 1er trimestre par niveau et par discipline au secondaire général
 * @param req 
 * @param res 
 */
const genererElevesSecondaireGeneralStatCioRendement
    = (req: Request, res: Response) => {
        const { trimestre } = req.body
        services
            .genererElevesSecondaireGeneralStatCioRendement(trimestre)
            .then((fileName: any) => {
                const serverUrl = `${req.protocol}://${req.get('host')}/download/${fileName}`
                res.status(200).send({ status: 1, link: serverUrl });
            })
            .catch((error: any) => res.status(400).send({ status: 0, error }));
    };

const genererElevesSecondaireGeneralStatCioRendementAnnuel
    = (req: Request, res: Response) => {
        // const { trimestre } = req.body
        services
            .genererElevesSecondaireGeneralStatCioRendementAnnuel()
            .then((fileName: any) => {
                const serverUrl = `${req.protocol}://${req.get('host')}/download/${fileName}`
                res.status(200).send({ status: 1, link: serverUrl });
            })
            .catch((error: any) => res.status(400).send({ status: 0, error }));
    };

const genererElevesSecondaireGeneralStatCioCollecteDeDonnes
    = (req: Request, res: Response) => {
        const { trimestre } = req.body
        services
            .genererElevesSecondaireGeneralStatCioCollecteDeDonnes(trimestre)
            .then((fileName: any) => {
                const serverUrl = `${req.protocol}://${req.get('host')}/download/${fileName}`
                res.status(200).send({ status: 1, link: serverUrl });
            })
            .catch((error: any) => res.status(400).send({ status: 0, error }));
    };

const genererElevesSecondaireGeneralRendementSyntheseRapport
    = (req: Request, res: Response) => {
        const { trimestre, zone } = req.body
        services
            .genererElevesSecondaireGeneralRendementSyntheseRapport(trimestre, zone)
            .then((fileName: any) => {
                const serverUrl = `${req.protocol}://${req.get('host')}/download/${fileName}`
                // res.status(200).send({ status: 1, fileName });
                res.status(200).send({ status: 1, link: serverUrl });
            })
            .catch((error: any) => res.status(400).send({ status: 0, error }));
    };




export default {
    genererElevesSecondaireGeneralStatCioRendement,
    genererElevesSecondaireGeneralStatCioRendementAnnuel,
    genererElevesSecondaireGeneralStatCioCollecteDeDonnes,
    genererElevesSecondaireGeneralRendementSyntheseRapport,
    getElevesSecondaireGeneralRendementParTrancheMoyEtSexe,
    // getElevesSecondaireGeneralMoyennesParDiscipline,
}
