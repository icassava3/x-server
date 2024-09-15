import express, { Router } from "express";
import controllers from "./controllers";
import validators from "./validators";


const schoolControlRouter: Router = express.Router();

schoolControlRouter.post("/getcredentials", validators.getCredentialsValidator(), controllers.getCredentials);
schoolControlRouter.post("/insererpointage", controllers.insererPointage);
schoolControlRouter.post("/historiquepointage", validators.historiquePointage(), controllers.historiquePointage);
schoolControlRouter.post("/controle-frais-scolaire", controllers.controleFraisScolaire);
schoolControlRouter.get("/listeactivites/:idTypeActiviteSchoolControl?", controllers.listeactivites);

schoolControlRouter.post("/insereactiviteparams", validators.updateSchoolControlActivitiesParams(), controllers.updateSchoolControlActivitiesParams);
schoolControlRouter.post("/insereractivitesuser", validators.updateUserActivitiesInSchoolControlConfig(), controllers.updateUserActivitiesInSchoolControlConfig);
schoolControlRouter.post("/activeroudesactiveractivite", validators.toggleSchoolControlActivityStatus(), controllers.toggleSchoolControlActivityStatus);
schoolControlRouter.post("/activeroudesactiveruser", validators.toggleSchoolControlActivitiesUserStatus(), controllers.toggleSchoolControlActivitiesUserStatus);
schoolControlRouter.get("/etabschoolcontrolconfig", controllers.getAllSchoolControlActivitiesConfig);
schoolControlRouter.get("/liste-controles", controllers.listeControles);
schoolControlRouter.get("/liste-pointages", controllers.listePointages);
schoolControlRouter.get("/schoolControlSendBoxSms", controllers.fetchSchoolControlSendBoxSms);
schoolControlRouter.get("/liste-personnel-admin", controllers.getPersonnlAdministrative);
export default schoolControlRouter;