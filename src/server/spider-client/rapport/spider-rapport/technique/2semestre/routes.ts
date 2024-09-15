import express, { Router } from "express";
import controllers from "./controllers";
const technique2semestreRouter: Router = express.Router();

//route permettant de générer le rapport
technique2semestreRouter.get('/technique/2semestre/:id', controllers.rapport); 

export default technique2semestreRouter;

