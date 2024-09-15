import express, { Router } from "express";
import controllers from "./controllers";


const projectNameRouter: Router = express.Router();
projectNameRouter.get("/focus-ecole-souscripteur", controllers.focusEcoleSubscriber);
projectNameRouter.post("/focus-ecole-update-config", controllers.focusEcoleUpdateConfig);
projectNameRouter.get("/get-focus-ecole-config", controllers.getEtabFocusEcoleConfig);

export default projectNameRouter;