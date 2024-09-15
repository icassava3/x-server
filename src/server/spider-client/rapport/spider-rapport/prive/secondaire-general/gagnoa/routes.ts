import express, { Router } from "express";
import controllers from "./controllers";

const privegagnoaRouter: Router = express.Router();

// privegagnoaRouter.get("/prive/secondairegeneral/gagnoa/3trimestre/:id", controllers.genererElevesSecondaireGeneralRendement);
privegagnoaRouter.get("/prive/secondairegeneral/gagnoa/3trimestre", controllers.genererRapport);

export default privegagnoaRouter;
