import express, { Router } from "express";
import controllers from "./controllers";
import validators from "./validators";

const profExpertRouter: Router = express.Router();
profExpertRouter.post("/getprofdata", validators.getProfData(), controllers.getProfData);
profExpertRouter.post("/getupdatedprofdata", validators.getProfData(), controllers.getUpdatedProfData);
profExpertRouter.post("/ajouterappel", validators.ajouterAppel(), controllers.ajouterAppel);
profExpertRouter.post("/getevalsandprogs", validators.getEvalAndProgValidator(), controllers.getEvalsAndProgs);

profExpertRouter.post("/getprofeleveappelassiduite", validators.getProfData(), controllers.getProfEleveAppelAssiduite);
profExpertRouter.post('/getprofeleves', validators.getProfData(), controllers.getProfEleves);
profExpertRouter.post('/getprofclasses', validators.getProfData(), controllers.getProfClasses);
profExpertRouter.post('/getprofplanning', validators.getProfData(), controllers.getProfPlanning);
profExpertRouter.post('/getprofevalsandprogs', validators.getProfData(), controllers.getProfEvalsAndProgs);

profExpertRouter.post("/remove-accounts", controllers.removeAccounts);
profExpertRouter.get('/getprofassignedtomatiere',  controllers.getPersonnelAssignedToMatiere);
profExpertRouter.post("/genererprofdatabase", /* validators.genererProfDatabase(), */ controllers.genererProfDatabase);

profExpertRouter.get("/getutilisateursprofexpert", controllers.getUtilisateursProfExpert);
profExpertRouter.get("/getevaluationsprogs", controllers.getEvaluationsProgs);

export default profExpertRouter;