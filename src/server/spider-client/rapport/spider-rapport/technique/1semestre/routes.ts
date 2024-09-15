import express, { Router } from "express";
import controllers from "./controllers";
const technique1semestreRouter: Router = express.Router();

//route permettant de générer le rapport
technique1semestreRouter.get('/technique/1semestre/:id', controllers.rapport); 

export default technique1semestreRouter;

