import express, { Router } from "express";
import controllers from "./controllers";
const publicSecondaireGeneralRapportRentreeRouter: Router = express.Router();

//route permettant de générer le rapport
publicSecondaireGeneralRapportRentreeRouter.get('/public/secondairegeneral/rapportrentree/:id', controllers.rapport); 

export default publicSecondaireGeneralRapportRentreeRouter;

