import express, { Router } from "express";
import controllers from "./controllers";
const priveSanpedroTrim1Router: Router = express.Router();


//route permettant de générer le rapport
priveSanpedroTrim1Router.get('/prive/secondairegeneral/sanpedro/1trimestre/:id', controllers.rapport); 

export default priveSanpedroTrim1Router;

