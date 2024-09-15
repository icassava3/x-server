import { Request, Response, Errback } from "express";
import services, { getOnlineWhConfig } from "./services";
import { IWarehouseConfig } from "../helpers/interfaces";
import redisFunctions from "../databases/redis/functions";


/**
 * obtenir l'etat du service warehouse 
 * @param req 
 * @param res 
 */
const checkWarehouseStatus = (req: Request, res: Response) => {
  services
    .checkWarehouseActivatedAndAuthorizedHddSerialNumber()
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) =>
      res.send({ status: 0, error })
    );
};

const partnersList = (req: Request, res: Response) => {
  //validator classeId required
  services
    .partnersList()
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) =>
      res.send({ status: 0, error })
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
      res.send({ status: 0, error })
    );
};


/**
 * activer le warehouse
 */
const activateWarehouse = (req: Request, res: Response) => {
  const io = (req as any).io
  services
    .activateWarehouse(io)
    .then(async (result: any) => {
      io.emit("updateDashboard", { serverStatus: true })
      // Le numero du disque en ligne
      const checkOnlineWhConfig = () => {
        getOnlineWhConfig()
          .then((reply) => io.emit("updateDashboard", { onlineHddSerial: reply?.hddserialnumber }))
          .catch(error => io.emit("updateDashboard", { onlineHddSerial: '?', }))
      }
      checkOnlineWhConfig()
      // Le numero du disque en local
      const warehouseConfig = await redisFunctions.getGlobalVariable("warehouseConfig") as IWarehouseConfig;
      io.emit("updateDashboard", { localHddSerial: warehouseConfig?.hddserialnumber || '' })

      // Le numero du disque de la machine
      const currentPcHDDSerialNumber = await redisFunctions.getGlobalVariable("currentPcHDDSerialNumber");
      io.emit("updateDashboard", { currentPcHDDSerial: currentPcHDDSerialNumber || '' })
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) =>
      res.send({ status: 0, error })
    );
};

const deactivateWarehouse = (req: Request, res: Response) => {
  //ajv validate req body
  console.log("deactivateWarehouse")
  const io = (req as any).io
  services
    .deactivateWarehouse()
    .then(async (result: any) => {
      io.emit("updateDashboard", { serverStatus: false })
      // Le numero du disque en ligne
      const checkOnlineWhConfig = () => {
        getOnlineWhConfig()
          .then((reply) => io.emit("updateDashboard", { onlineHddSerial: reply?.hddserialnumber }))
          .catch(error => io.emit("updateDashboard", { onlineHddSerial: '?', }))
      }
      checkOnlineWhConfig()
      // Le numero du disque en local
      const warehouseConfig = await redisFunctions.getGlobalVariable("warehouseConfig") as IWarehouseConfig;
      io.emit("updateDashboard", { localHddSerial: warehouseConfig?.hddserialnumber || '' })

      // Le numero du disque de la machine
      const currentPcHDDSerialNumber = await redisFunctions.getGlobalVariable("currentPcHDDSerialNumber");
      io.emit("updateDashboard", { currentPcHDDSerial: currentPcHDDSerialNumber || '' })
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) =>
      res.send({ status: 0, error })
    );
};



const initializeData = (req: Request, res: Response) => {
  //ajv validate req body
  const { sections } = req.body;
  const io = (req as any).io
  services
    .initializeData(io, sections)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) =>
      res.status(400).send({ status: 0, error })
    );
};


const createStudent = (req: Request, res: Response) => {
  const { studentId } = req.body;
  services
    .createStudent(studentId)
    .then((result: any) => {
      res
        .status(200)
        .send({
          status: 1,
          data: result
        });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const envoyerEleves = (req: Request, res: Response) => {
  const { studentIds } = req.body;
  console.log("🚀 ~ file: controllers.ts:144 ~ envoyerEleves ~ studentIds:", studentIds)
  services
    .envoyerEleves(studentIds)
    .then((result: any) => {
      console.log("🚀 ~ file: controllers.ts:147 ~ .then ~ result:", result)
      // (req as any).io.emit("new student", result.photoResult.data);
      res
        .status(200)
        .send({
          status: 1,
          data: result
          // data: { ...result, photoResult: result.photoResult.status },
        });
    })
    .catch((error: any) => {
      console.log("🚀 ~ file: controllers.ts:158 ~ envoyerEleves ~ error:", error)
      res.status(400).send({ status: 0, error })
    });
};

const modifierEleve = (req: Request, res: Response) => {
  //validator student id required
  const { studentId } = req.body;
  services
    .modifierEleve(studentId)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};


const supprimerEleve = (req: Request, res: Response) => {
  const { studentIds } = req.body;
  services
    .supprimerEleves(studentIds)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const modifierVersement = (req: Request, res: Response) => {
  //validator versementId required
  const { versementId } = req.body;

  services
    .modifierVersement(versementId)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const supprimerVersement = (req: Request, res: Response) => {
  //validator versementId required
  const { versementIds } = req.body;
  services
    .supprimerVersement(versementIds)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const envoyerVersement = (req: Request, res: Response) => {
  const { versementIds } = req.body;
  services
    .envoyerVersement(versementIds)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const envoyerClasses = (req: Request, res: Response) => {
  //validator classeId required
  const { classeIds } = req.body;

  services
    .envoyerClasses(classeIds)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const modifierClasse = (req: Request, res: Response) => {
  //validator classeId required

  const { classeId } = req.body;
  console.log("🚀 ~ file: controllers.ts ~ line 218 ~ modifierClasse ~ classeId", classeId)

  services
    .modifierClasse(classeId)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const supprimerClasse = (req: Request, res: Response) => {
  const { classeIds } = req.body;
  services
    .supprimerClasses(classeIds)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

// const globalTimeLineCreate = (req: Request, res: Response) => {
//   services
//     .globalTimeLineCreate()
//     .then((result: any) => {
//       res.status(200).send({ status: 1, data: result });
//     })
//     .catch((error: any) => res.send({ status: 0, error }));
// };

// const persoTimeLineCreate = (req: Request, res: Response) => {
//   const { studentIds } = req.body;

//   services
//     .persoTimeLineCreate(studentIds)
//     .then((result: any) => {
//       res.status(200).send({ status: 1, data: result });
//     })
//     .catch((error: any) => res.send({ status: 0, error }));
// };


const echeanchierIndividuel = (req: Request, res: Response) => {
  const { studentIds } = req.body;
  services.envoyerEcheancierIndividuel(studentIds)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

// const echeanchierGlobal = (req: Request, res: Response) => {
//   services.fetchEcheancierGlobal()
//     .then((result: any) => {
//       res.status(200).send({ status: 1, data: result });
//     })
//     .catch((error: any) => res.send({ status: 0, error }));
// };


/**
 * inserer un ou plusieurs personnel chez les differents partenaires
 * @param req 
 * @param res 
 */
const insertPersonnel = (req: Request, res: Response) => {
  const { personnelIds } = req.body;
  services.sendPersonnel(personnelIds)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const updatePersonnel = (req: Request, res: Response) => {
  const { personnelId } = req.body;
  services.sendPersonnel([personnelId])
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

const sendModelePlageHoraires = (req: Request, res: Response) => {
  services.sendModelePlageHoraires()
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

const envoyerClassesMatiereProf = (req: Request, res: Response) => {
  const { classeIds } = req.body;
  services.envoyerClassesMatiereProf(classeIds)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const envoyerMatieres = (req: Request, res: Response) => {
  const { matieresIds } = req.body;
  services.sendMatieres(matieresIds)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const envoyerEcheancierIndividuel = (req: Request, res: Response) => {
  const { studentIds } = req.body;
  services.envoyerEcheancierIndividuel(studentIds)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const sendSeance = (req: Request, res: Response) => {
  const { seanceIds } = req.body;
  console.log("🚀 ~ file: controllers.ts ~ line 435 ~ sendSeance ~ seanceIds", seanceIds)
  services.sendSeances(seanceIds)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const updateSeance = (req: Request, res: Response) => {
  const { seanceId } = req.body;
  services.updateSeance(seanceId)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};


const deleteSeance = (req: Request, res: Response) => {
  const { seanceIds } = req.body;
  console.log("🚀 ~ file: controllers.ts ~ line 433 ~ deleteSeance ~ seanceIds", seanceIds)
  services.deleteSeance(seanceIds)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

/**
 * param etab a ete mise a jour, raffraichir  globalVariable paramEtab
 * @param req 
 * @param res 
 */
const updateParamEtab = (req: Request, res: Response) => {
  const { param } = req.body;
  services.envoyerParamEtab(param)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const etatDonneesEnLigne = (req: Request, res: Response) => {
  services.etatDonneesEnLigne()
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const envoyerMoyennes = (req: Request, res: Response) => {
  const { periodeEval } = req.body;
  services.envoyerMoyennes(periodeEval)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const envoyerResultatScolairePrimaire = (req: Request, res: Response) => {
  const { compoIds } = req.body;
  services.envoyerResultatScolairePrimaire(compoIds)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const envoyerResultatsScolaireTechnique = (req: Request, res: Response) => {
  const { periodeEval } = req.body;

  services.envoyerResultatsScolaireTechnique(periodeEval)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};




const listeCompoPrimaire = (req: Request, res: Response) => {
  services.listeCompoPrimaire()
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const getListeEvaluationsProgrammees = (req: Request, res: Response) => {
  services.getListeEvaluationsProgrammees()
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const updateRecupInEvaluationnote = (req: Request, res: Response) => {
  const io = (req as any).io
  services.updateRecupInEvaluationnote(req.body)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
      io.emit("update_recup_in_evaluationnote", result)
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

export default {
  initializeData,
  getLogs,

  partnersList,
  echeanchierIndividuel,

  createStudent,
  envoyerEleves,
  modifierEleve,
  supprimerEleve,

  envoyerVersement,
  modifierVersement,
  supprimerVersement,
  envoyerEcheancierIndividuel,

  envoyerClasses,
  modifierClasse,
  supprimerClasse,

  insertPersonnel,
  updatePersonnel,
  deletePersonnel,
  envoyerClassesMatiereProf,

  sendEvalNotes,
  updateEvalNotes,
  deleteEvalNotes,
  envoyerMoyennes,
  envoyerResultatScolairePrimaire,
  envoyerResultatsScolaireTechnique,

  sendEvalProg,
  updateEvalProg,
  deleteEvalProg,

  sendPlageHoraires,
  sendModelePlageHoraires,
  sendHoraires,

  activateWarehouse,
  deactivateWarehouse,
  checkWarehouseStatus,

  sendSeance,
  updateSeance,
  deleteSeance,

  updateParamEtab,
  envoyerMatieres,
  etatDonneesEnLigne,
  listeCompoPrimaire,

  getListeEvaluationsProgrammees,
  updateRecupInEvaluationnote
};
