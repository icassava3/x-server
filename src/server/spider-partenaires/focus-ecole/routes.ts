import express, { Router } from "express";
import controllers from "./controllers";

const router: Router = express.Router();

// router.post("/initializeservice", controllers.initializeService);
router.get("/getlogs", controllers.getLogs);
router.post("/echeanchierindividuel", controllers.sendIndividualEcheanciers);
router.post("/fetchstudentsecheanchiers", controllers.fetchStudentsEcheanchiers);
router.post("/resendfailedaction", controllers.resendFailedAction);
router.post("/sendmessages", controllers.sendMessages);

//Routes pour récupérer les souscriptions rubrique optionnelle non synchronisé ainsi que les échéances
export default router;
