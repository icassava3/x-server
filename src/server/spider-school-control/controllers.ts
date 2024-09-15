import { Request, Response } from "express";
import services from "./services";

const historiquePointage = (req: Request, res: Response) => {

    services
        .historiquePointage(req.body)
        .then((result: any) => {
            (req as any).io.emit("httpIn", "httpIn")

            // console.log("🚀 ~ file: controllers.ts ~ line 31 ~ .then ~ result", result)
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => {
            res.send({ status: 0, error })
        })
}

const listeactivites = (req: Request, res: Response) => {
    services
        .listeactivites(req?.params)
        .then((result: any) => {
            // console.log("🚀 ~ file: controllers.ts ~ line 31 ~ .then ~ result", result)
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => {
            res.send({ status: 0, error })
        })
}

const controleFraisScolaire = (req: Request, res: Response) => {
    services
        .controleFraisScolaire(req.body)
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => {
            res.send({ status: 0, error })
        })
}


const listeControles = (req: Request, res: Response) => {
    services
        .listeControles()
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => {
            res.send({ status: 0, error })
        })
}

const fetchSchoolControlSendBoxSms = (req: Request, res: Response) => {
    services
        .fetchSchoolControlSendBoxSms()
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => {
            res.send({ status: 0, error })
        })
}

const listePointages = (req: Request, res: Response) => {
    services
        .listePointages()
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => {
            res.send({ status: 0, error })
        })
}

const updateSchoolControlActivitiesParams = (req: Request, res: Response) => {
    services
        .updateSchoolControlActivitiesParams(req.body)
        .then((result: any) => {
            (req as any).io.emit("updateDashboard", { schoolControlConfig: result });
            (req as any).io.emit("activities_params", { status: 1, data: result });
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => {
            res.send({ status: 0, error })
        })
}

const updateUserActivitiesInSchoolControlConfig = (req: Request, res: Response) => {
    services
        .updateUserActivitiesInSchoolControlConfig(req.body)
        .then((result: any) => {
            (req as any).io.emit("updateDashboard", { schoolControlConfig: result });
            (req as any).io.emit("inserer_activites_user", { status: 1, data: result });
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => {
            res.send({ status: 0, error })
        })
}

const toggleSchoolControlActivityStatus = (req: Request, res: Response) => {
    services
        .toggleSchoolControlActivityStatus(req.body)
        .then((result: any) => {
            (req as any).io.emit("updateDashboard", { schoolControlConfig: result });
            (req as any).io.emit("activite_status", { status: 1, data: result });
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => {
            res.send({ status: 0, error })
        })
}

const toggleSchoolControlActivitiesUserStatus = (req: Request, res: Response) => {
    services
        .toggleSchoolControlActivitiesUserStatus(req.body)
        .then((result: any) => {
            (req as any).io.emit("updateDashboard", { schoolControlConfig: result });
            (req as any).io.emit("user_status", { status: 1, data: result });
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => {
            res.send({ status: 0, error })
        })
}

const updateSchoolControlActivityConfig = (req: Request, res: Response) => {
    services
        .updateSchoolControlActivityConfig(req.body)
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => {
            res.send({ status: 0, error })
        })
}

const insererPointage = (req: Request, res: Response) => {
    services
        .effectuerPointage(req.body)
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => {
            res.send({ status: 0, error })
        })
}

const getSchoolControlActivitiesConfig = (req: Request, res: Response) => {
    const { codeEtab, anneeScolaire, idActiviteSchoolControl } = req.body
    services
        .getSchoolControlActivitiesConfig(codeEtab, anneeScolaire, idActiviteSchoolControl)
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => {
            res.send({ status: 0, error })
        })
}

const getAllSchoolControlActivitiesConfig = (req: Request, res: Response) => {
    services
        .getAllSchoolControlActivitiesConfig()
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => {
            res.send({ status: 0, error })
        })
}

//Obtenir les credentials d'activaion school control
const getCredentials = (req: Request, res: Response) => {
    const { anneeScolaire, codeEtab } = req.body
    services
        .getCredentials(anneeScolaire, codeEtab)
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.send({ status: 0, error }));
};

const getPersonnlAdministrative = (req: Request, res: Response) => {
    services
        .getPersonnlAdministrative()
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.status(400).send({ status: 0, error }))
}

export default {
    historiquePointage,
    listeactivites,
    controleFraisScolaire,
    updateUserActivitiesInSchoolControlConfig,
    updateSchoolControlActivitiesParams,
    getSchoolControlActivitiesConfig,
    insererPointage,
    updateSchoolControlActivityConfig,
    getCredentials,
    toggleSchoolControlActivityStatus,
    toggleSchoolControlActivitiesUserStatus,
    getAllSchoolControlActivitiesConfig,
    listeControles,
    listePointages,
    getPersonnlAdministrative,
    fetchSchoolControlSendBoxSms
}