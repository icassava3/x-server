import express, { Router } from "express";
import controllers from "./controllers";

const webclientlogin: Router = express.Router();

webclientlogin.post("/webclientlogin", controllers.webclientlogin);

export default webclientlogin;
