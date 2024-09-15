import { Request, Response, Errback } from "express";
import services from "./services";


/**
 * Enregistrement 'un eleve qui vient manger
 * @param req 
 * @param res 
 */

const pointageEleveCantine = (req: Request, res: Response) => {
    const data = req.body
    services
        .pointageEleveCantine(data)
        .then((result: any) => {
            (req as any).io.to(globalThis.serverFrontEndSocketId).emit("pointage_Eleve_Cantine_ajoute", result)
            res.status(200).send({ status: 1, data: result });

        })
        .catch((error: any) => res.status(400).send({ status: 0, error }))
}

const getAppels = (req: Request, res: Response) => {

    services
        .getAppels()
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });

        })
        .catch((error: any) => res.status(400).send({ status: 0, error }))
}


const getAssiduiteEleves = (req: Request, res: Response) => {

    services
        .getAssiduiteEleves()
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });

        })
        .catch((error: any) => res.status(400).send({ status: 0, error }))
}

const getDatesAppels = (req: Request, res: Response) => {

    services
        .getDatesAppels()
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });

        })
        .catch((error: any) => res.status(400).send({ status: 0, error }))
}

const getPlagesHorairesAppels = (req: Request, res: Response) => {

    services
        .getPlagesHorairesAppels()
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });

        })
        .catch((error: any) => res.status(400).send({ status: 0, error }))
}


const getMatieresAppels = (req: Request, res: Response) => {

    services
        .getMatieresAppels()
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });

        })
        .catch((error: any) => res.status(400).send({ status: 0, error }))
}

const getProfesseursAppels = (req: Request, res: Response) => {

    services
        .getProfesseursAppels()
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });

        })
        .catch((error: any) => res.status(400).send({ status: 0, error }))
}

const getParamsEtab = (req: Request, res: Response) => {

    services
        .getParamsEtab()
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });

        })
        .catch((error: any) => res.status(400).send({ status: 0, error }))
}

const getClasses = (req: Request, res: Response) => {

    services
        .getClasses()
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });

        })
        .catch((error: any) => res.status(400).send({ status: 0, error }))
}

const getEleves = (req: Request, res: Response) => {
    const data=req.body
    services
        .getEleves(data)
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });

        })
        .catch((error: any) => res.status(400).send({ status: 0, error }))
}

/**
 * Obtenir les assiduité des eleves d'une ou plusieurs classe
 * @param req 
 * @param res 
 */
const getClasseElevesAssiduite = (req: Request, res: Response) => {
    const data = req.body
    services
        .getClasseElevesAssiduite(data)
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });

        })
        .catch((error: any) => res.status(400).send({ status: 0, error }))
}

/**
 * Justifié l'absence ou le retard d'un eleve
 * @param req 
 * @param res 
 */
const justifierAbsenceRetard = (req: Request, res: Response) => {
    const data = req.body
    services
        .justifierAbsenceRetard(data)
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });

        })
        .catch((error: any) => res.status(400).send({ status: 0, error }))
}

/**
 * Obtenir la liste des dix élèves les plus absents
 * @param data 
 * @returns 
 */
const getElevesLesPlusAbsents = (req: Request, res: Response) => {
    services
        .getElevesLesPlusAbsents()
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });

        })
        .catch((error: any) => res.status(400).send({ status: 0, error }))
};

/**
 * Obtenir la liste des dix classes avec le plus d'absences
 * @param data 
 * @returns 
 */
const getClasseAvecLePlusDeAbsents = (req: Request, res: Response) => {
    services
        .getClasseAvecLePlusDeAbsents()
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.status(400).send({ status: 0, error }))
};

/**
 * Obtenir les matières avec le plus d'absents
 * @param data 
 * @returns 
 */

const getMatieresAvecLePlusDeAbsents = (req: Request, res: Response) => {
    services
    .getMatieresAvecLePlusDeAbsents()
    .then((result: any) => {
        res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }))
};

/**
 * Obtenir le nombre de rétards, d'absences et justification
 * @param data 
 * @returns 
 */

const getNombreRetardsAbsencesJustifications = (req: Request, res: Response) => {
  
    services
        .getNombreRetardsAbsencesJustifications()
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.status(400).send({ status: 0, error }))
}

/**
 * Obtenir le nombre de sms envoyé ou non par jour et en tout
 * @param data 
 * @returns 
 */

const getNombreSmsEnvoyeOuNon = (req: Request, res: Response) => {
    services
    .getNombreSmsEnvoyeOuNon()
    .then((result: any) => {
        res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }))
}

/**
 * Obtenir la liste des professeurs affectés à une classe
 * @param req 
 * @param res 
 */
const getProfAffecteClasse = (req: Request, res: Response) => {
    services
        .getProfAffecteClasse()
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.status(400).send({ status: 0, error }))
}

/**
 * Obtenir l'état des appels
 * @returns 
 */

const getEtatAppel = (req: Request, res: Response) => {
    const {idClasse, dateAppel} = req.body
    services
        .getEtatAppel(dateAppel,idClasse)
        .then((result: any) => {
            // (req as any).io.emit("etat_appel", result)
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.status(400).send({ status: 0, error }))
}

const GetPlanningClasse = (req: Request, res: Response) => {
    services
        .GetPlanningClasse()
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });

        })
        .catch((error: any) => res.status(400).send({ status: 0, error }))
}

export default {
    pointageEleveCantine,
    getAppels,
    getAssiduiteEleves,
    getDatesAppels,
    getPlagesHorairesAppels,
    getMatieresAppels,
    getProfesseursAppels,
    getParamsEtab,
    getClasses,
    getEleves,
    getClasseElevesAssiduite,
    justifierAbsenceRetard,
    getMatieresAvecLePlusDeAbsents,
    getNombreSmsEnvoyeOuNon,
    getNombreRetardsAbsencesJustifications,
    getClasseAvecLePlusDeAbsents,
    getElevesLesPlusAbsents,
    getProfAffecteClasse,
    getEtatAppel,
    GetPlanningClasse
}