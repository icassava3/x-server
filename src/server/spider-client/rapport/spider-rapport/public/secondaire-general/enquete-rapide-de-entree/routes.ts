import express, { Router } from "express";
import controllers from "./controllers";
const publicSecondaireGeneralEnqueteRentreeRouter: Router = express.Router();

//route permettant de générer le rapport
publicSecondaireGeneralEnqueteRentreeRouter.get('/public/secondairegeneral/enqueterentree/:id', controllers.rapport); 

export default publicSecondaireGeneralEnqueteRentreeRouter;

