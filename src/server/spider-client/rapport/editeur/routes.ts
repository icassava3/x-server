import express, { Router } from "express";
import controllers from "./controllers";
import validator from "./validator"

const rapportDataRouter: Router = express.Router();
rapportDataRouter.get("/listemodelerapport", controllers.listemodeleRapport);
rapportDataRouter.get("/upatemodelerapport", controllers.upateModeleRapport);
rapportDataRouter.post("/ajouterrapport", validator.nouveauRapportValidator(), controllers.nouveauRapport);
rapportDataRouter.get("/listerapport" ,controllers.listeRapport);
rapportDataRouter.post("/modifierrapportdata", validator.modifierRapportDataValidator(), controllers.modifierRapportData);
rapportDataRouter.post("/modifierlibellerapport", validator.modifierLibelleRapportValidator() ,controllers.modifierLibelleRapport);
rapportDataRouter.post("/deleterapportdata", controllers.supprimerRapportData)

export default rapportDataRouter;