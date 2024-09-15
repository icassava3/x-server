import express, { Router } from "express";
import controllers from "./controllers";
const priveIssiaRentreeRouter: Router = express.Router();

//route permettant de générer le rapport
priveIssiaRentreeRouter.get('/prive/secondairegeneral/issia/rentree/:id', controllers.rapport); 

export default priveIssiaRentreeRouter;

