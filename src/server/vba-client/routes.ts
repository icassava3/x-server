import express, { Router } from "express";
import controllers from "./controllers";
import validators from "./validators";

const vbaRouter: Router = express.Router();

vbaRouter.post("/vbaclientlogin" , validators.vbaclientLogin() , controllers.vbaClientLogin);
vbaRouter.post("/vbaclientlogout", controllers.vbaClientLogout);
vbaRouter.post("/refreshStat", controllers.vbaRefreshStat);

export default vbaRouter;
