import express, { Router } from "express";
import controllers from "./controllers";
const publicSecondaireGeneral3trimestreRouter: Router = express.Router();

//route permettant de générer le rapport
publicSecondaireGeneral3trimestreRouter.get('/public/secondairegeneral/3trimestre/:id', controllers.rapport); 

export default publicSecondaireGeneral3trimestreRouter;

