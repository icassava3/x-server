import { Request, Response, Errback } from "express";
import services from "./services";
import servicesGain from "./gain-technologie/services";
import { updateDashboardServiceStatus } from "../helpers/function";

const resendGainAction = (req: Request, res: Response) => {
  const { logIds } = req.body
  services
    .resendGainAction(logIds)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const getGainLogs = (req: Request, res: Response) => {
  services
    .getGainLogs()
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const sendPhotosZip = (req: Request, res: Response) => {
  services
    .sendPhotosZip()
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const activateService = (req: Request, res: Response) => {
  //ajv validate req body
  const io = (req as any).io
  services
    .activateService(req.body)
    .then((result: any) => {
      if (req.body.serviceId === "SERV_SCHOOL_CONTROL") {
        io.emit("school_control_activated", { activated: 1 })
      }
      
      updateDashboardServiceStatus(io, req.body.serviceId, true)
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const deactivateService = (req: Request, res: Response) => {
  //ajv validate req body
  const io = (req as any).io

  services
    .deactivateService(req.body)
    .then((result: any) => {
      if (req.body.serviceId === "SERV_SCHOOL_CONTROL") {
        io.emit("school_control_activated", { activated: 0 })
      }
      updateDashboardServiceStatus(io, req.body.serviceId, false)
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const initializeService = (req: Request, res: Response) => {
  //ajv validate req body
  const { serviceId, sections } = req.body;
  const io = (req as any).io
  services
    .initializeService(serviceId, io, sections)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const partnersList = (req: Request, res: Response) => {
  //validator classeId required
  services
    .partnersList()
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const studentAdd = (req: Request, res: Response) => {
  //validator classeId required

  const { studentIds } = req.body;
  services
    .studentAdd(studentIds)
    .then((result: any) => {
      (req as any).io.emit("new student", result.photoResult.data);
      res
        .status(200)
        .send({
          status: 1,
          data: { ...result, photoResult: result.photoResult.status },
        });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const studentUpdate = (req: Request, res: Response) => {
  //validator student id required

  const { studentId } = req.body;
  console.log(
    "🚀 ~ file: controllers.ts ~ line 55 ~ studentUpdate ~ studentId",
    studentId
  );

  services
    .studentUpdate(studentId)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const synchroniserIdentifiant = (req: Request, res: Response) => {
  //validator student id required
  services
    .synchroniserIdentifiant()
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const studentDelete = (req: Request, res: Response) => {
  //validator student id required

  const { studentIds } = req.body;
  console.log("🚀 ~ file: controllers.ts ~ line 161 ~ studentDelete ~ req.body", req.body)

  services
    .studentDelete(studentIds)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const updatePayments = (req: Request, res: Response) => {
  //validator versementId required

  const { versementIds } = req.body;
  services
    .updatePayments(versementIds)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const deletePayments = (req: Request, res: Response) => {
  //validator versementId required

  const { versementIds } = req.body;
  services
    .deletePayments(versementIds)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const insertPayments = (req: Request, res: Response) => {
  const { versementIds } = req.body;
  services
    .insertPayments(versementIds)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const classeCreate = (req: Request, res: Response) => {
  //validator classeId required

  const { classeIds } = req.body;

  services
    .classeCreate(classeIds)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const classeUpdate = (req: Request, res: Response) => {
  //validator classeId required

  const { classeIds } = req.body;

  services
    .classeUpdate(classeIds)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const classeDelete = (req: Request, res: Response) => {
  //validator classeId required

  const { classeIds } = req.body;

  services
    .classeDelete(classeIds)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const globalTimeLineCreate = (req: Request, res: Response) => {
  services
    .globalTimeLineCreate()
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const persoTimeLineCreate = (req: Request, res: Response) => {
  const { studentIds } = req.body;

  services
    .persoTimeLineCreate(studentIds)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};


const echeanchierIndividuel = (req: Request, res: Response) => {
  const { studentIds } = req.body;
  services.fetchEcheancierIndividuel(studentIds)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const echeanchierGlobal = (req: Request, res: Response) => {
  services.fetchEcheancierGlobal()
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const resendMissingStudents = (req: Request, res: Response) => {
  servicesGain.resendMissingStudents()
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const fetchGainStudents = (req: Request, res: Response) => {
  servicesGain.fetchGainStudents()
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const fetchGainClasses = (req: Request, res: Response) => {
  servicesGain.fetchGainClasses()
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const fetchMoyenneWithParams = (req: Request, res: Response) => {
  const { periode, classe, matiere } = req.body
  servicesGain.fetchMoyenneWithParams(periode, classe, matiere)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};


const fetchMarkWithParams = (req: Request, res: Response) => {
  const { periode, classe, matiere, eleve } = req.body
  servicesGain.fetchMarkWithParams(periode, classe, matiere, eleve)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const fetchRatingWithParams = (req: Request, res: Response) => {
  const { periode, classe, matiere } = req.body
  servicesGain.fetchRatingWithParams(periode, classe, matiere)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const fetchSubjects = (req: Request, res: Response) => {
  //const {periode,classe,matiere} = req.body
  servicesGain.fetchSubjects()
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

/**
 * inserer un ou plusieurs personnel chez les differents partenaires
 * @param req 
 * @param res 
 */
const insertPersonnel = (req: Request, res: Response) => {
  const { personnelIds } = req.body;
  services.insertPersonnel(personnelIds)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const updatePersonnel = (req: Request, res: Response) => {
  const { personnelIds } = req.body;
  services.insertPersonnel(personnelIds)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const deletePersonnel = (req: Request, res: Response) => {
  const { personnelIds } = req.body;
  services.deletePersonnel(personnelIds)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};


const sendEvalNotes = (req: Request, res: Response) => {
  const { evalIds } = req.body;

  services.sendEvaluationNotes(evalIds)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};


const updateEvalNotes = (req: Request, res: Response) => {
  const { evalIds } = req.body;
  // console.log("🚀 ~ file: controllers.ts ~ line 388 ~ updateEvalNotes ~ req.body", req.body)
  // return false
  services.updateEvalNotes(evalIds)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const deleteEvalNotes = (req: Request, res: Response) => {
  const { evalIds } = req.body;
  services.deleteEvalNotes(evalIds)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const sendEvalProg = (req: Request, res: Response) => {
  const { evalIds } = req.body;
  services.sendEvalProg(evalIds)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};
const updateEvalProg = (req: Request, res: Response) => {
  const { evalIds } = req.body;
  services.updateEvalProg(evalIds)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const deleteEvalProg = (req: Request, res: Response) => {
  const { evalIds } = req.body;
  services.deleteEvalProg(evalIds)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const sendPlageHoraires = (req: Request, res: Response) => {
  services.sendPlageHoraires()
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const sendHoraires = (req: Request, res: Response) => {
  services.sendHoraires()
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const sendClassesMatiereProf = (req: Request, res: Response) => {
  services.sendClassesMatiereProf()
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};


export default {
  echeanchierIndividuel,
  echeanchierGlobal,
  studentAdd,
  studentUpdate,
  synchroniserIdentifiant,
  studentDelete,
  insertPayments,
  updatePayments,
  deletePayments,
  classeCreate,
  classeUpdate,
  classeDelete,
  globalTimeLineCreate,
  persoTimeLineCreate,
  partnersList,
  activateService,
  deactivateService,
  initializeService,
  sendPhotosZip,
  getGainLogs,
  resendGainAction,
  resendMissingStudents,
  fetchMoyenneWithParams,
  fetchRatingWithParams,
  fetchMarkWithParams,
  fetchGainStudents,
  fetchGainClasses,
  fetchSubjects,
  insertPersonnel,
  updatePersonnel,
  deletePersonnel,
  sendEvalNotes,
  updateEvalNotes,
  deleteEvalNotes,
  sendEvalProg,
  updateEvalProg,
  deleteEvalProg,
  sendPlageHoraires,
  sendHoraires,
  sendClassesMatiereProf
};
