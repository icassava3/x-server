import express, { Router } from "express";
import controllers from "./controllers";


const statsCioRendementRouter: Router = express.Router();

// statsCioRendementRouter.post("/statscio", controllers.getElevesSecondaireGeneralRendementParTrancheMoyEtSexe);
// statsCioRendementRouter.post("/elevessecondairegeneralmoyennespardiscipline", controllers.getElevesSecondaireGeneralMoyennesParDiscipline);
// statsCioRendementRouter.post("/genererelevessecondairesgeneralmoyennepardiscipline", controllers.genererElevesSecondaireGeneralMoyennesParDiscipline);
statsCioRendementRouter.post("/statsciorendement", controllers.genererElevesSecondaireGeneralStatCioRendement);
statsCioRendementRouter.get("/statsciorendementannuel", controllers.genererElevesSecondaireGeneralStatCioRendementAnnuel);
statsCioRendementRouter.post("/statsciocollectedonnees", controllers.genererElevesSecondaireGeneralStatCioCollecteDeDonnes);
statsCioRendementRouter.post("/syntheserapport", controllers.genererElevesSecondaireGeneralRendementSyntheseRapport);

export default statsCioRendementRouter;
