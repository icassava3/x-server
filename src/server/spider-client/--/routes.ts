import express, { Router } from "express";
import controllers from "./controllers";


const projectNameRouter: Router = express.Router();
projectNameRouter.post("/url", controllers._controllerName);

export default projectNameRouter;