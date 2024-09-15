import express, { Router } from "express";
import controllers from "./controllers";
import privateFunctions from "./privateFunctions";
import { checkWarehouseActivatedAndAuthorizedHddSerialNumber } from "./middlewares";

const whserverRouter: Router = express.Router();

//activer le warehouse
whserverRouter.post("/activatewarehouse", /*activateServiceValidator(),*/ controllers.activateWarehouse);

//middleware pour verifier si les warehouse sont activé et si ce poste est autorisé a envoyé les données en ligne
whserverRouter.use(checkWarehouseActivatedAndAuthorizedHddSerialNumber);

//desactiver un service
whserverRouter.post("/deactivatewarehouse", /*ajvValidator(deactivateServiceSchema),*/ controllers.deactivateWarehouse);

//liste partenaires
whserverRouter.get("/list", controllers.partnersList);
whserverRouter.post("/updateparametab", controllers.updateParamEtab);

whserverRouter.get("/getlogs", controllers.getLogs);

//checker le status du warehouse 
whserverRouter.get("/checkwhactivationstatus", controllers.checkWarehouseStatus);

//initialiser les donnnées vers le warehouse
whserverRouter.post("/initializedata", controllers.initializeData);

//eleves routes
whserverRouter.post("/createstudent", controllers.createStudent);
whserverRouter.post("/newstudent", controllers.envoyerEleves);
whserverRouter.post("/updatestudent", controllers.modifierEleve);
whserverRouter.post("/deletestudent", controllers.supprimerEleve);

//echeanciers routes
whserverRouter.post("/echeanchierindividuel", controllers.envoyerEcheancierIndividuel);

//paiement routes
whserverRouter.post("/insertpayments", controllers.envoyerVersement);
whserverRouter.post("/updatepayments", controllers.modifierVersement);
whserverRouter.post("/deletepayments", controllers.supprimerVersement);

//classes routes
whserverRouter.post("/createclasse", controllers.envoyerClasses);
whserverRouter.post("/updateclasse", controllers.modifierClasse);
whserverRouter.post("/deleteclasse", controllers.supprimerClasse);

//classe matiere profs
whserverRouter.post("/sendclassesmatiereprof", controllers.envoyerClassesMatiereProf);

//echeanciers routes 
// whserverRouter.get("/echeanchierglobal", controllers.echeanchierGlobal);

//personnel routes
whserverRouter.post("/insertpersonnel", controllers.insertPersonnel);
whserverRouter.post("/updatepersonnel", controllers.updatePersonnel);
whserverRouter.post("/deletepersonnel", controllers.deletePersonnel);

//evaluations notes
whserverRouter.post("/sendevalnotes", controllers.sendEvalNotes);
whserverRouter.post("/updateevalnotes", controllers.updateEvalNotes);
whserverRouter.post("/deleteevalnotes", controllers.deleteEvalNotes);

//envoyer les resultas scolaires en lignes
whserverRouter.post("/envoyer-moyennes", controllers.envoyerMoyennes);
whserverRouter.post("/envoyer-resultats-scolaire-technique", controllers.envoyerResultatsScolaireTechnique);
whserverRouter.post("/envoyer-resultats-scolaire-primaire", controllers.envoyerResultatScolairePrimaire);
whserverRouter.get("/liste-compo-primaire", controllers.listeCompoPrimaire);


//programmation evaluation
whserverRouter.post("/sendevalprog", controllers.sendEvalProg);
whserverRouter.post("/updateevalprog", controllers.updateEvalProg);
whserverRouter.post("/deleteevalprog", controllers.deleteEvalProg);

//horaires
whserverRouter.post("/sendplagehoraires", controllers.sendPlageHoraires);
whserverRouter.post("/sendmodeleplagehoraires", controllers.sendModelePlageHoraires);
whserverRouter.post("/sendhoraires", controllers.sendHoraires);

//seances (emploi du temps)
whserverRouter.post("/sendseance", controllers.sendSeance);
whserverRouter.post("/updateseance", controllers.updateSeance);
whserverRouter.post("/deleteseance", controllers.deleteSeance);

whserverRouter.get("/etatdonneesenligne", controllers.etatDonneesEnLigne);

whserverRouter.post("/createservicekey", (req, res) => {
  const { serviceName, codeEtab, anneeScolaire } = req.body;
  const keyByType = privateFunctions.getKeyByType(
    serviceName,
    codeEtab,
    anneeScolaire
    );
    res.status(200).send({ status: 1, data: keyByType });
  });
  
  
  //Enlever le verouillage sur la modification des notes en ligne
  whserverRouter.get("/liste-evaluations-programmation", controllers.getListeEvaluationsProgrammees);
  whserverRouter.post("/updaterecupinevaluationnote", controllers.updateRecupInEvaluationnote);
export default whserverRouter;
