import express, { Router } from "express";
import controllers from "./controllers";
const priveSanpedroTrim3Router: Router = express.Router();


//route permettant de générer le rapport
priveSanpedroTrim3Router.get('/prive/secondairegeneral/sanpedro/3trimestre/:id', controllers.rapport); 

export default priveSanpedroTrim3Router;

