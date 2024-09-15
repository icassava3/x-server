import express from 'express';
import rapportDataRouter from './editeur/routes';
import genererRapportRouter from './spider-rapport/routes';

const moduleRapport = express.Router();
moduleRapport.use("/", rapportDataRouter);
moduleRapport.use("/", genererRapportRouter);
export default moduleRapport;