import express, { Router } from "express";
import controllers from "./controllers";
const priveMankonoRentreeRouter: Router = express.Router();

//route permettant de générer le rapport
priveMankonoRentreeRouter.get('/prive/secondairegeneral/mankono/rapportrentree/:id', controllers.rapport); 

export default priveMankonoRentreeRouter;

