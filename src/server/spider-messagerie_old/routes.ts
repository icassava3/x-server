import express, { Router } from "express";
import controllers from "./controllers";
import validators from "./validators";
import { checkWarehouseActivatedAndAuthorizedHddSerialNumber } from "../spider-whserver/middlewares";



const messagerieRouter: Router = express.Router();

messagerieRouter.get("/etabcreditsms/:providerId", controllers.creditSms);

//middleware pour checker warehouse est activé
messagerieRouter.use(checkWarehouseActivatedAndAuthorizedHddSerialNumber);

//route pour gerer messagerie spider-vba
messagerieRouter.post("/newsmsaccount", validators.providerValidator(), controllers.createOrUpdateSmsAccount);
messagerieRouter.post("/sendsms", validators.sendSmsVbaValidator(), controllers.sendSmsVba);
messagerieRouter.post("/inserer-sms-boite-envoie", validators.vbaSmsToSendBoxValidator(), controllers.vbaSmsToSendBox);

//route pour gerer messagerie focus ecoles et prof expert
messagerieRouter.get("/liste-personnel", controllers.getPersonnel);
messagerieRouter.get("/eleves", controllers.getEleves);


messagerieRouter.post("/focus-envoyer-messages-groupe", validators.insererMessageGroupeBoiteEnvoiValidator(), controllers.insererMessageGroupeBoiteEnvoi);
messagerieRouter.post("/envoyer-messages", validators.sessionIdsValidator(), controllers.envoyerMessage);
messagerieRouter.get("/focus-boite-envoie", controllers.messageBoiteEnvoie);
messagerieRouter.post("/envoyer-messages-assiduite", validators.envoyerMessagesAssiduiteValidator(), controllers.envoyerMessagesAssiduite);
messagerieRouter.post("/archiver-messages", validators.sessionIdsValidator(), controllers.archiverMessages);
messagerieRouter.post("/supprimer-messages", validators.sessionIdsValidator(), controllers.supprimerMessages);
//route pour gerer sms
messagerieRouter.post("/envoyer-sms-boite-envoi", validators.envoyerSmsBoiteEnvoiValidator(), controllers.envoyerSmsBoiteEnvoi);
messagerieRouter.post("/envoyer-sms", validators.insererSmsBoiteEnvoie(), controllers.insererSmsBoiteEnvoie);
messagerieRouter.get("/sms-boite-envoie", controllers.messageSmsBoiteEnvoie);
messagerieRouter.post("/supprimer-sms", validators.sessionIdsValidator(), controllers.supprimerSms);
messagerieRouter.post("/archiver-sms", validators.sessionIdsValidator(), controllers.archiverSms);
messagerieRouter.post("/envoyer-sms-assiduite", validators.envoyerSmsAssiduiteValidator(), controllers.envoyerSmsAssiduite);
messagerieRouter.get("/liste-compte-sms", controllers.listeCompteSms);
messagerieRouter.get("/liste-providers", controllers.listeProviders);
messagerieRouter.post("/changer-compte-sms", controllers.changeDefaultSmsAccount);

//route pour fournisseur
messagerieRouter.get("/liste-fournisseur", controllers.listeFournisseurs);
messagerieRouter.post("/update-fournisseur", validators.addOrUpdateFournisseurValidator(), controllers.addOrUpdateFournisseur);
messagerieRouter.post("/delete-fournisseur", validators.deleteFournisseurValidator(), controllers.deleteFournisseur);

// Resultats scolaires
messagerieRouter.get("/eleves-moyennes/:periodeEval", controllers.recupMoyennesEleve);
messagerieRouter.post("/eleves-moyennes-primaire", controllers.fetchElevesMoyennesPrimaire);
messagerieRouter.get("/liste-compo-primaire", controllers.getListeCompoPrimaire);
messagerieRouter.get("/eleves-evals-notes", controllers.fetchStudentsEvalNotes);
messagerieRouter.get("/evals-progs", controllers.fetchEvalProgs);
messagerieRouter.get("/liste-top-jury-resultats", controllers.fetchTopJuryResultats);
messagerieRouter.get("/liste-top-jury-sessions", controllers.fetchTopJurySession);
messagerieRouter.post("/envoyer-sms-resultat-scolaire", /* validators.envoyerSmsResultatScolaireValidator(), */ controllers.envoyerSmsResultatScolaire);
messagerieRouter.post("/envoyer-notification-resultat-scolaire", /* validators.envoyerNotificationResultatsScolairesValidator() */ controllers.envoyerNotificationResultatsScolaires);
export default messagerieRouter;