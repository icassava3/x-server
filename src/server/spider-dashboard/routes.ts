import express, { Router } from "express";
import controllers from "./controllers";

const dashboardRouter: Router = express.Router();

dashboardRouter.get("/statistics", controllers.statistics);
dashboardRouter.get("/statistics/photos", controllers.statisticsPhoto);
dashboardRouter.post("/toggleshowstatistic", controllers.toggleShowStatistic);
dashboardRouter.post("/toggleshowstabs", controllers.toggleShowTabs);
dashboardRouter.get("/getshowstatistic", controllers.getShowStatistic);
dashboardRouter.get("/getshowstabs", controllers.getShowTabs);
export default dashboardRouter;
