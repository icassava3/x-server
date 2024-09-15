import { Request, Response, Errback } from "express";
import services from "./services";
import { encryptPayload } from "../helpers/function";

/**
 * obtenit le nombre de sms restant pour un etablissement 
 * @param req 
 * @param res 
 */

const creditSms = (req: Request, res: Response) => {
    const { providerId } = req.params
    services
        .creditSms(providerId)
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.send({ status: 0, error }));
};

/**
 *creer un nouveau compte sms 
 * @param req 
 * @param res 
 */
const createOrUpdateSmsAccount = (req: Request, res: Response) => {
    const io = (req as any).io;
    services
        .createOrUpdateSmsAccount(io, req.body)
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.send({ status: 0, error }));
};

/**
 * envoyer sms depuis spider vba
 * @param req 
 * @param res 
 */
const sendSmsVba = (req: Request, res: Response) => {
    const { providerId } = req.body
    services
        .sendSmsVba(providerId)
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.send({ status: 0, error }));

};

/**
 * nregistrer les sms vba dans la boite d'envoi sqlite
 * @param req 
 * @param res 
 */
const vbaSmsToSendBox = (req: Request, res: Response) => {
    services
        .vbaSmsToSendBox(req.body)
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.send({ status: 0, error }));

};

const getClasses = (req: Request, res: Response) => {

    services
        .getClasses()
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });

        })
        .catch((error: any) => res.send({ status: 0, error }))
}

const getEleves = (req: Request, res: Response) => {
    services
        .getEleves()
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });

        })
        .catch((error: any) => res.send({ status: 0, error }))
}

const fetchStudentsEvalNotes = (req: Request, res: Response) => {
    services
        .fetchStudentsEvalNotes()
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });

        })
        .catch((error: any) => res.send({ status: 0, error }))
}

const fetchEvalProgs = (req: Request, res: Response) => {
    services
        .fetchEvalProgs()
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });

        })
        .catch((error: any) => res.send({ status: 0, error }))
}

const getPersonnel = (req: Request, res: Response) => {
    services
        .getPersonnel()
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });

        })
        .catch((error: any) => res.send({ status: 0, error }))
}


const getNiveaux = (req: Request, res: Response) => {
    services
        .getNiveaux()
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });

        })
        .catch((error: any) => res.send({ status: 0, error }))
}

const insererMessageGroupeBoiteEnvoi = (req: Request, res: Response) => {
    const io = (req as any).io;
    services
        .insererMessageGroupeBoiteEnvoi(req.body, io)
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.send({ status: 0, error }))
}

const envoyerMessage = (req: Request, res: Response) => {
    const io = (req as any).io;
    const { sessionIds } = req.body;
    services
        .envoyerMessage(io, sessionIds)
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.send({ status: 0, error }))
}

const messageBoiteEnvoie = (req: Request, res: Response) => {
    services
        .messageBoiteEnvoie()
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.send({ status: 0, error }))
}

const messageSmsBoiteEnvoie = (req: Request, res: Response) => {
    services
        .messageSmsBoiteEnvoie()
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.send({ status: 0, error }))
}


const envoyerMessagesAssiduite = (req: Request, res: Response) => {
    const io = (req as any).io;
    services
        .envoyerMessagesAssiduite(req.body, io)
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.send({ status: 0, error }))
}

const envoyerNotificationResultatsScolaires = (req: Request, res: Response) => {
    const io = (req as any).io;
    services
        .envoyerNotificationResultatsScolaires(req.body, io)
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.send({ status: 0, error }))
}

const envoyerSmsResultatScolaire = (req: Request, res: Response) => {
    const io = (req as any).io;
    services
        .envoyerSmsResultatScolaire(req.body, io)
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.send({ status: 0, error }))
}

const archiverMessages = (req: Request, res: Response) => {
    const io = (req as any).io;
    const { sessionIds } = req.body;
    services
        .archiverMessages(io, sessionIds)
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.send({ status: 0, error }))
}

const supprimerMessages = (req: Request, res: Response) => {
    const io = (req as any).io;
    const { sessionIds } = req.body;
    services
        .supprimerMessages(io, sessionIds)
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.send({ status: 0, error }))
}

const insererSmsBoiteEnvoie = (req: Request, res: Response) => {
    const io = (req as any).io;
    services
        .insererSmsBoiteEnvoie(req.body, io)
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.send({ status: 0, error }))
}

const envoyerSmsBoiteEnvoi = (req: Request, res: Response) => {
    const io = (req as any).io;
    const { providerId, sessionIds } = req.body
    services
        .envoyerSmsFromXServer(io, providerId, sessionIds)
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.send({ status: 0, error }))
}


const supprimerSms = (req: Request, res: Response) => {
    const io = (req as any).io;
    const { sessionIds } = req.body;
    services
        .supprimerSms(io, sessionIds)
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.send({ status: 0, error }))
}


const archiverSms = (req: Request, res: Response) => {
    const io = (req as any).io;
    const { sessionIds } = req.body;
    services
        .archiverSms(io, sessionIds)
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.send({ status: 0, error }))
}

const envoyerSmsAssiduite = (req: Request, res: Response) => {
    const io = (req as any).io;
    services
        .envoyerSmsAssiduite(req.body, io)
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.send({ status: 0, error }))
}

const listeCompteSms = (req: Request, res: Response) => {
    services
        .listeCompteSms()
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.send({ status: 0, error }))
}

const listeProviders = (req: Request, res: Response) => {
    services
        .listeProviders()
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.send({ status: 0, error }))
}

/**
 * changer le compte d'envoi sms
 * @param req 
 * @param res 
 */
const changeDefaultSmsAccount = (req: Request, res: Response) => {
    const { providerId } = req.body;
    services
        .changeDefaultSmsAccount(providerId)
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.send({ status: 0, error }))
}


const listeFournisseurs = (req: Request, res: Response) => {
    services
        .listeFournisseurs()
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
            // res.status(200).send({ status: 1, data: useEncryption ? encryptPayload(result, req.session.id) : result });

        })
        .catch((error: any) => res.send({ status: 0, error }))
}

const addOrUpdateFournisseur = (req: Request, res: Response) => {
    const data = req.body;
    const io = (req as any).io;
    services
        .addOrUpdateFournisseur(data)
        .then((result: any) => {
            io.emit("update_fournisseur", result);
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.send({ status: 0, error }))
}

const deleteFournisseur = (req: Request, res: Response) => {
    const { idFournisseur } = req.body;
    const io = (req as any).io;
    services
        .deleteFournisseur(idFournisseur)
        .then((result: any) => {
            io.emit("delete_fournisseur", result);
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.send({ status: 0, error }))
}

const recupMoyennesEleve = (req: Request, res: Response) => {
    const { periodeEval } = req.params;
    const periode = parseInt(periodeEval)
    services
        .recupMoyennesEleve(periode)
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.send({ status: 0, error }))
}

const fetchTopJuryResultats = (req: Request, res: Response) => {
    services
        .fetchTopJuryResultats()
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.send({ status: 0, error }))
}

const fetchTopJurySession = (req: Request, res: Response) => {
    services
        .fetchTopJurySession()
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.send({ status: 0, error }))
}

const fetchElevesMoyennesPrimaire = (req: Request, res: Response) => {
    const data = req.body;
    services
        .fetchElevesMoyennesPrimaire(data)
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.send({ status: 0, error }))
}

const getListeCompoPrimaire = (req: Request, res: Response) => {
    services
        .getListeCompoPrimaire()
        .then((result: any) => {
            res.status(200).send({ status: 1, data: result });
        })
        .catch((error: any) => res.send({ status: 0, error }))
}

export default {
    creditSms,
    createOrUpdateSmsAccount,
    sendSmsVba,
    getClasses,
    getEleves,
    getPersonnel,
    getNiveaux,
    insererMessageGroupeBoiteEnvoi,
    envoyerMessage,
    messageBoiteEnvoie,
    envoyerMessagesAssiduite,
    archiverMessages,
    supprimerMessages,
    insererSmsBoiteEnvoie,
    envoyerSmsBoiteEnvoi,
    messageSmsBoiteEnvoie,
    supprimerSms,
    archiverSms,
    envoyerSmsAssiduite,
    listeCompteSms,
    changeDefaultSmsAccount,
    listeProviders,
    vbaSmsToSendBox,
    listeFournisseurs,
    addOrUpdateFournisseur,
    deleteFournisseur,
    fetchStudentsEvalNotes,
    fetchEvalProgs,
    envoyerSmsResultatScolaire,
    envoyerNotificationResultatsScolaires,
    recupMoyennesEleve,
    fetchTopJuryResultats,
    fetchTopJurySession,
    fetchElevesMoyennesPrimaire,
    getListeCompoPrimaire
}
