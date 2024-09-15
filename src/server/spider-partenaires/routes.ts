import express, { Router } from "express";
import controllers from "./controllers";
import { ajvValidator } from "../middlewares/ajvValidator";
import {
  activateServiceValidator,
  deactivateServiceSchema,
  initializeServiceSchema,
} from "./validatorSchemas";
import privateFunctions from "./privateFunctions";
import cinetpayRouter from "./cinetpay/routes";
import focusEcoleRouter from "./focus-ecole/routes";

const partenairesRouter: Router = express.Router();

partenairesRouter.use("/cinetpay", cinetpayRouter);//charger les routes specifique cinetpay
// partenairesRouter.use("/focusecole", focusEcoleRouter);//charger les routes specifique  focusecole 

//liste partenaires
partenairesRouter.get("/list", controllers.partnersList);

//activer un service
partenairesRouter.post("/activateservice",activateServiceValidator(), controllers.activateService);
//desactiver un service
partenairesRouter.post("/deactivateservice", activateServiceValidator(),controllers.deactivateService
);

//initialiser un service
partenairesRouter.post("/initializeservice", controllers.initializeService);

//envoyer les photos eleves
partenairesRouter.get("/sendphotoszip", controllers.sendPhotosZip);

//eleves routes
partenairesRouter.post("/deletestudent", controllers.studentDelete);
partenairesRouter.post("/newstudent", controllers.studentAdd);
partenairesRouter.post("/updatestudent", controllers.studentUpdate);

//paiement routes
partenairesRouter.post("/insertpayments", controllers.insertPayments);
partenairesRouter.post("/updatepayments", controllers.updatePayments);
partenairesRouter.post("/deletepayments", controllers.deletePayments);

//classes routes
partenairesRouter.post("/createclasse", controllers.classeCreate);
partenairesRouter.post("/updateclasse", controllers.classeUpdate);
partenairesRouter.post("/deleteclasse", controllers.classeDelete);
partenairesRouter.post("/sendclassesmatiereProf", controllers.sendClassesMatiereProf);

//echeanciers routes
partenairesRouter.post("/echeanchierindividuel", controllers.echeanchierIndividuel);
partenairesRouter.get("/echeanchierglobal", controllers.echeanchierGlobal);

//personnel routes
partenairesRouter.post("/insertpersonnel", controllers.insertPersonnel);
partenairesRouter.post("/updatepersonnel", controllers.updatePersonnel);
partenairesRouter.post("/deletepersonnel", controllers.deletePersonnel);

//evaluations notes
partenairesRouter.post("/sendevalnotes", controllers.sendEvalNotes);
partenairesRouter.post("/updateevalnotes", controllers.updateEvalNotes);
partenairesRouter.post("/deleteevalnotes", controllers.deleteEvalNotes);

//programmation evaluation
partenairesRouter.post("/sendevalprog", controllers.sendEvalProg);
partenairesRouter.post("/updateevalprog", controllers.updateEvalProg);
partenairesRouter.post("/deleteevalprog", controllers.deleteEvalProg);

//horaires
partenairesRouter.post("/sendplagehoraires", controllers.sendPlageHoraires);
partenairesRouter.post("/sendhoraires", controllers.sendHoraires);



/** DEBUT SPECIFIQUE A GAIN DOIT ETRE DEPLACEE **/
partenairesRouter.post("/fetchmoyennewithparams",controllers.fetchMoyenneWithParams);//fetch moyenne
partenairesRouter.post("/fetchmarkwithparams", controllers.fetchMarkWithParams);//fetch notes
partenairesRouter.post("/fetchratingswithparams",controllers.fetchRatingWithParams);//fetch evaluations
partenairesRouter.get("/fetchsubjects", controllers.fetchSubjects);//fetch matieres
partenairesRouter.get("/synchroniseridentifiant", controllers.synchroniserIdentifiant);
partenairesRouter.get("/resendmissingstudents", controllers.resendMissingStudents);
partenairesRouter.get("/fetchgainstudents", controllers.fetchGainStudents);
partenairesRouter.get("/fetchgainclasses", controllers.fetchGainClasses);
partenairesRouter.get("/getgainlogs", controllers.getGainLogs);//obenir les logs (actions) effectué vers Gain
partenairesRouter.post("/resendgainfailedaction", controllers.resendGainAction);//Ramener les actions gains qui ont echoué
/** FIN SPECIFIQUE A GAIN DOIT ETRE DEPLACEE **/

partenairesRouter.post("/createservicekey", (req, res) => {
  
  const { serviceName, codeEtab, anneeScolaire } = req.body;
  const keyByType = privateFunctions.getKeyByType(
    serviceName,
    codeEtab,
    anneeScolaire
  );
  res.status(200).send({ status: 1, data: keyByType });
});

export default partenairesRouter;
