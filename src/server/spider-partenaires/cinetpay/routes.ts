import express, { Router } from "express";
import controllers from "./controllers";

const router: Router = express.Router();


//obtenir un lien de paiment cinetpay
router.post("/getpaymenturl", controllers.getPaymentUrl);
router.get("/getcredentials", controllers.getCredentials);

//verifier le status d'un paiement
router.post("/checkpaymentstatus", controllers.checkPaymentStatus);
router.post("/syncpaymentid", controllers.syncPaymentId);
router.get("/getlogs", controllers.getLogs);
router.post("/resendfailedaction", controllers.resendFailedAction);
router.get("/focusnotrecoveredtransaction", controllers.cinetpayNotRecoveredTransaction);
// router.get("spidercinetpaynotrecoveredtransaction", controllers.spiderCinetpayNotRecoveredTransaction);

export default router;
