import express, { Router } from "express";
import  { getAllpointage, addPointage, getAllPointageWithActitvite } from "./controllers";
const pointageRouter: Router = express.Router();
import Logger from "../helpers/logger";



pointageRouter.get("/all", getAllpointage)
pointageRouter.post("/new", addPointage)
pointageRouter.post("/allpointagecontrolewithactivity", getAllPointageWithActitvite)





export default pointageRouter;


