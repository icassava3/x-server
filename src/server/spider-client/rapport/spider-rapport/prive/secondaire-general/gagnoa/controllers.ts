import { Request, Response, Errback } from "express";
import services from "./services";
import functions from "../../../utils";

/**
 * Générer la proportion des élèves n'ayant pas obtenus la moyenne au 1er trimestre
 * par niveau et par discipline au secondaire général et celle des élèves n'ayant 
 * pas obtenus la moyenne au 1er trimestre par niveau et par discipline au secondaire général
 * @param req 
 * @param res 
 */
//  const  genererElevesSecondaireGeneralRendement = (req: Request, res: Response) => {
//     const {id}=req.params
//      services
//      .genererElevesSecondaireGeneralRendement(parseInt(id))
//      .then((fileName: any) => {
//          console.log("🚀 ~ genererElevesSecondaireGeneralRendement ~ req.body:", req.body)
//             // const serverUrl = `${req.protocol}://${req.get('host')}/download/${fileName}`
//             const serverUrl = functions.serverUrl(req, fileName);
//             res.status(200).send({ status: 1, data: serverUrl });
//             console.log("🚀 ~ .then ~ serverUrl:", serverUrl)
//         })
//         .catch((error: any) => res.status(400).send({ status: 0, error }));
// };

 const  genererRapport = (req: Request, res: Response) => {
    // const {id}=req.params
     services
     .genererRapport()
     .then((fileName: any) => {
         console.log("🚀 ~ genererRapport ~ req.body:",  fileName)
            const serverUrl = functions.serverUrl(req, fileName);
            res.status(200).send({ status: 1, data: serverUrl });
            console.log("🚀 ~ .then ~ serverUrl:", serverUrl)
        })
        .catch((error: any) => res.status(400).send({ status: 0, error }));
};

export default {
    // genererElevesSecondaireGeneralRendement,
    genererRapport
}
