import { Request, Response, Errback } from "express";
import services from "./services";

/**
 * initialiser le service focus ecole
 * @param req
 * @param res
 */
const initializeService = (req: Request, res: Response) => {
  const {sections } = req.body;
  const io = (req as any).io;
  services
    .initializeService(io,sections)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) =>
      res.status(400).send({
        status: 0,
        error: [
          {
            message: error,
          },
        ],
      })
    );
};

/**
 * Obtenir les logs sqlite relatifs a focus ecole
 * @param req 
 * @param res 
 */
const getLogs = (req: Request, res: Response) => {
  services
    .getLogs()
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) =>
      res.status(400).send({
        status: 0,
        error: [
          {
            message: error,
          },
        ],
      })
    );
};

/**
 * Envoyer l'echeancier individuel pour un ou plusieurs eleves vers focus ecole
 * @param req 
 * @param res 
 */
const sendIndividualEcheanciers = (req: Request, res: Response) => {
  const { studentIds } = req.body;
  services.sendIndividualEcheanciers(studentIds)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

/**
 * Fetcher les echeranciers individuel d'un ou plusieurs eleves
 * @param req 
 * @param res 
 */
const fetchStudentsEcheanchiers = (req: Request, res: Response) => {
  const { studentIds } = req.body;
  services.fetchStudentsEcheanchiers(studentIds)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

const resendFailedAction = (req: Request, res: Response) => {
  const {logIds} = req.body
  services
    .resendFailedAction(logIds)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

/**
 * envoyer messages aux parents d'eleves 
 * @param req 
 * @param res 
 */
const sendMessages = (req: Request, res: Response) => {
  const data = req.body
  services
    .sendMessages(data)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

export default {
  initializeService,
  getLogs,
  sendIndividualEcheanciers,
  fetchStudentsEcheanchiers,
  resendFailedAction,
  sendMessages
};
