import express, { Router } from "express";
import controllers from "./controllers";
const priveSanpedroTrim2Router: Router = express.Router();


//route permettant de générer le rapport
priveSanpedroTrim2Router.get('/prive/secondairegeneral/sanpedro/2trimestre/:id', controllers.rapport); 

export default priveSanpedroTrim2Router;

