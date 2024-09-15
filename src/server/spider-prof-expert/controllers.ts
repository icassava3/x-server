
import { Request, Response, Errback } from "express";
import services from "./services";


/**
 * Obtenir tous les donnees relatif a un prof
 * @param req 
 * @param res 
 */
const getProfData = (req: Request, res: Response) => {
    const socketData = "test";
    const io = (req as any).io;
    io.emit("assiduite_appel", socketData);
    console.log("🚀 ~ file: controllers.ts ~ line 13 ~ getProfData ~ req.body", req.body)
    const data = req.body
    services
        .getProfData(data)
        .then((result: any) => {
            console.log("🚀 ~ file: controllers.ts ~ line 17 ~ .then ~ result", result.assiduite)
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.send({ status: 0, error }));
};


/**
 * Obtenir les données mise a jour d'un professeur dans un ou plusieur etablissement
 * @param req 
 * @param res 
 */
const getUpdatedProfData = (req: Request, res: Response) => {
    const data = req.body
    services
        .getUpdatedProfData(data)
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.send({ status: 0, error }));
};

/**
 * ajouter un appel effectué par un professeur 
 */
const ajouterAppel = (req: Request, res: Response) => {
    console.log("🚀 ~ file: controllers.ts:55 ~ ajouterAppel ~ req.body", req.body)
    const io = (req as any).io;
    services
        .ajouterAppel(req.body, io)
        .then((result: any) => {
            console.log("🚀 ~ file: controllers.ts ~ line 61 ~ .then ~ result", result)
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.send({ status: 0, error }));
};

/**
 * obtenir les appels et assiduite pour les eleves d'un prof
 * @param req 
 * @param res 
 */
const getProfEleveAppelAssiduite = (req: Request, res: Response) => {
    services
        .getProfEleveAppelAssiduite(req.body)
        .then((result: any) => {
            // console.log("🚀 ~ file: controllers.ts ~ line 61 ~ .then ~ result", result)
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.send({ status: 0, error }));
};

/**
 * Recupérer les évaluations et les programmations depuis PROF-EXPERT-SERVER et en faire des fichiers csv
 * et retourner leurs chemins
 * @param req 
 * @param res 
 */
const getEvalsAndProgs = (req: Request, res: Response) => {

    services
        .getEvalsAndProgs(req.body)
        .then((zipName: any) => {
            const serverUrl = `${req.protocol}://${req.get('host')}/download/${zipName}`
            console.log("🚀 ~ file: controllers.ts:84 ~ .then ~ serverUrl", serverUrl)
            // const newResult={progsPath:`${serverUrl}/${result.progsPath}`,notesPath:`${serverUrl}/${result.notesPath}`}

            res.status(200).send({ status: 1, link: serverUrl });
        })
        .catch((error: any) => res.send({ status: 0, error }));
};



/**
 * récuperer tous les eleves d'un professeur
 * @param req 
 * @param res 
 */
const getProfEleves = (req: Request, res: Response) => {
    services
        .getProfEleves(req.body)
        .then((result: any) => {
            console.log("🚀 ~ file: controllers.ts ~ line 20 ~ getProfData ~ end", new Date())
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.send({ status: 0, error }));
};

/**
 * récuperer toutes les classes d'un professeur
 * @param req 
 * @param res 
 */
const getProfClasses = (req: Request, res: Response) => {
    console.log("🚀 ~ file: controllers.ts ~ line 20 ~ getProfData ~ start", new Date())
    services
        .getProfClasses(req.body)
        .then((result: any) => {
            console.log("🚀 ~ file: controllers.ts ~ line 20 ~ getProfData ~ end", new Date())
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.send({ status: 0, error }));
};

/**
 * récuperer tous les evaluations (notes et programmations) d'un professeur
 * @param req 
 * @param res 
 */
const getProfEvalsAndProgs = (req: Request, res: Response) => {
    console.log("🚀 ~ file: controllers.ts ~ line 20 ~ getProfData ~ start", new Date())
    services
        .getProfEvalsAndProgs(req.body)
        .then((result: any) => {
            console.log("🚀 ~ file: controllers.ts ~ line 20 ~ getProfData ~ end", new Date())
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.send({ status: 0, error }));
};

/**
 * récuperer le planning professeur
 * @param req 
 * @param res 
 */
const getProfPlanning = (req: Request, res: Response) => {
    console.log("🚀 ~ file: controllers.ts ~ line 20 ~ getProfData ~ start", new Date())
    services
        .getProfPlanning(req.body)
        .then((result: any) => {
            console.log("🚀 ~ file: controllers.ts ~ line 20 ~ getProfData ~ end", new Date())
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.send({ status: 0, error }));
};

/**
 * La liste des prof qui font l'appel et l'envoi des notes en ligne
 * @param req 
 * @param res 
 */
const checkProfEnvoiAppelNote = (req: Request, res: Response) => {
    services
        .checkProfEnvoiAppelNote()
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.send({ status: 0, error }));
};

/**
 * Retirer des comptes prof expert
 * @param req 
 * @param res 
 */
const removeAccounts = (req: Request, res: Response) => {
    const { phones, userName } = req.body
    services
        .removeAccounts(phones, userName)
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.send({ status: 0, error }));
};

const getPersonnelAssignedToMatiere = (req: Request, res: Response) => {
    services
        .getPersonnelAssignedToMatiere()
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.send({ status: 0, error }));
};

const genererProfDatabase = (req: Request, res: Response) => {
    const socketData = "test";
    const io = (req as any).io;
    io.emit("generer_prof_database", socketData);
    const data = req.body
    services
        .generetEachProfDatabaseByUserphone(data)
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.send({ status: 0, error }));
};

/**
 * Obtenir les utilisateurs d'un etablissement pour l'année en cours
 * @param req 
 * @param res 
 */
const getUtilisateursProfExpert = (req: Request, res: Response) => {
    services
        .getUtilisateursProfExpert()
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.send({ status: 0, error }));
};

/**
 * 
 * @param req 
 * @param res 
 */
const getEvaluationsProgs = (req: Request, res: Response) => {
    services
        .getEvaluationsProgs()
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.send({ status: 0, error }));
};

export default {
    getProfData,
    getUpdatedProfData,
    ajouterAppel,
    getProfEleveAppelAssiduite,
    getEvalsAndProgs,
    getProfEleves,
    getProfClasses,
    getProfEvalsAndProgs,
    getProfPlanning,
    checkProfEnvoiAppelNote,
    removeAccounts,
    getPersonnelAssignedToMatiere,
    genererProfDatabase,
    getUtilisateursProfExpert,
    getEvaluationsProgs
}