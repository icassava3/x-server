import express, { Router } from "express";
import controllers from "./controllers";
const profesionnelle1semestreRouter: Router = express.Router();

//route permettant de générer le rapport
profesionnelle1semestreRouter.get('/professionnelle/1semestre/:id', controllers.rapport); 

export default profesionnelle1semestreRouter;

