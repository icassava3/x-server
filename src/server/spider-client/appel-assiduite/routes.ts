import express, { Router } from "express";
import controllers from "./controllers";


const appelEtAssiduite: Router = express.Router();

appelEtAssiduite.post("/pointageelevecantine", controllers.pointageEleveCantine);
appelEtAssiduite.get("/listeappels", controllers.getAppels);
appelEtAssiduite.get("/listeassiduites", controllers.getAssiduiteEleves);
appelEtAssiduite.get("/datesappels", controllers.getDatesAppels);
appelEtAssiduite.get("/plageshorairesappels", controllers.getPlagesHorairesAppels);
appelEtAssiduite.get("/matieresappels", controllers.getMatieresAppels);
appelEtAssiduite.get("/professeursappels", controllers.getProfesseursAppels);
appelEtAssiduite.get("/paramsetab", controllers.getParamsEtab);
appelEtAssiduite.get("/classes", controllers.getClasses);
appelEtAssiduite.post("/eleves", controllers.getEleves);

appelEtAssiduite.post("/classeassiduite", controllers.getClasseElevesAssiduite);
appelEtAssiduite.post("/justifierassiduite", controllers.justifierAbsenceRetard);
appelEtAssiduite.get("/eleveslesplusabsents", controllers.getElevesLesPlusAbsents);
appelEtAssiduite.get("/classesavecleplusabsents", controllers.getClasseAvecLePlusDeAbsents);
appelEtAssiduite.get("/matieresavecleplusabsents", controllers.getMatieresAvecLePlusDeAbsents);
appelEtAssiduite.get("/absencesretardsjustifications", controllers.getNombreRetardsAbsencesJustifications);
appelEtAssiduite.get("/smsenvoyeounon", controllers.getNombreSmsEnvoyeOuNon);
appelEtAssiduite.get("/listedesprofaffecteauneclasse",controllers.getProfAffecteClasse);
appelEtAssiduite.post("/etatappel",controllers.getEtatAppel);
appelEtAssiduite.get("/planningtotaleclasse", controllers.GetPlanningClasse);


export default appelEtAssiduite;

