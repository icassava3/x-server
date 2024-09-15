import express, { Router } from "express";
import controllers from "./controllers";


const bossBoardRouter: Router = express.Router();
bossBoardRouter.get("/etab-data", controllers.getEtabFullData);

export default bossBoardRouter;