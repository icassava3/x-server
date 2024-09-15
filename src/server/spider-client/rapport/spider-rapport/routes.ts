import express, { Router } from "express";

import publicSecondaireGeneral1trimestreRouter from "./public/secondaire-general/rapport-1trimestre/routes";
import publicSecondaireGeneral2trimestreRouter from "./public/secondaire-general/rapport-2trimestre/routes";
import publicSecondaireGeneral3trimestreRouter from "./public/secondaire-general/rapport-3trimestre/routes";

import priveKorhogoTrim1Router from "./prive/secondaire-general/korhogo/rapport-1trimestre/routes";
import priveAbidjan3Trim1Router from "./prive/secondaire-general/abidjan3/rapport-1trimestre/routes";
import priveAbidjan3Trim2Router from "./prive/secondaire-general/abidjan3/rapport-2trimestre/routes";
import priveAbidjan3Trim3Router from "./prive/secondaire-general/abidjan3/rapport-3trimestre/routes";
import publicSecondaireGeneralEnqueteRentreeRouter from "./public/secondaire-general/enquete-rapide-de-entree/routes";
import publicSecondaireGeneralRapportRentreeRouter from "./public/secondaire-general/rapport-de-entree/routes";
import technique1semestreRouter from "./technique/1semestre/routes";
import technique2semestreRouter from "./technique/2semestre/routes";
import priveBouake2Trim1Router from "./prive/secondaire-general/bouake2/rapport-1trimestre/routes";
import priveBouake2Trim2Router from "./prive/secondaire-general/bouake2/rapport-2trimestre/routes";
import priveBouake2Trim3Router from "./prive/secondaire-general/bouake2/rapport-3trimestre/routes";
import priveYakroTrim2Router from "./prive/secondaire-general/yakro/rapport-2trimestre/routes";
import privebouake1Trim1Router from "./prive/secondaire-general/bouake1/rapport-1trimestre/routes";
import privebouake1Trim2Router from "./prive/secondaire-general/bouake1/rapport-2trimestre/routes";
import priveSanpedroTrim3Router from "./prive/secondaire-general/sanpedro/rapport-3trimestre/routes";
import priveIssia1Trim1Router from "./prive/secondaire-general/issia/rapport-1trimestre/routes";
import priveIssiaRentreeRouter from "./prive/secondaire-general/issia/rapport-rentree/routes";
import priveIssia2Trim2Router from "./prive/secondaire-general/issia/rapport-2trimestre/routes";
import priveAbidjan3RentreeRouter from "./prive/secondaire-general/abidjan3/rapport-rentree/routes";
import priveMankonoRentreeRouter from "./prive/secondaire-general/mankono/rapport-rentree/routes";
import priveSanpedroTrim1Router from "./prive/secondaire-general/sanpedro/rapport-1trimestre/routes";
import priveYakroTrim1Router from "./prive/secondaire-general/yakro/rapport-1trimestre/routes";
import profesionnelle1semestreRouter from "./professionnelle/1semestre/routes";
import priveSanpedroTrim2Router from "./prive/secondaire-general/sanpedro/rapport-2trimestre/routes";
import priveKorhogoTrim2Router from "./prive/secondaire-general/korhogo/rapport-2trimestre/routes";
import privegagnoaRouter from "./prive/secondaire-general/gagnoa/routes";
import privebouake1Trim3Router from "./prive/secondaire-general/bouake1/rapport-3trimestre/routes";
import priveYakroTrim3Router from "./prive/secondaire-general/yakro/rapport-3trimestre/routes";
import priveKorhogoTrim3Router from "./prive/secondaire-general/korhogo/rapport-3trimestre/routes";

const genererRapportRouter: Router = express.Router();

//route permettant de générer le rapport
genererRapportRouter.use(publicSecondaireGeneralRapportRentreeRouter);
genererRapportRouter.use(publicSecondaireGeneralEnqueteRentreeRouter);
genererRapportRouter.use(publicSecondaireGeneral1trimestreRouter);
genererRapportRouter.use(publicSecondaireGeneral2trimestreRouter);
genererRapportRouter.use(publicSecondaireGeneral3trimestreRouter);

//Prive

// Abidjan 3
genererRapportRouter.use(priveAbidjan3RentreeRouter);
genererRapportRouter.use(priveAbidjan3Trim1Router);
genererRapportRouter.use(priveAbidjan3Trim2Router);
genererRapportRouter.use(priveAbidjan3Trim3Router);

//  Korhogo
genererRapportRouter.use(priveKorhogoTrim1Router);
genererRapportRouter.use(priveKorhogoTrim2Router);
genererRapportRouter.use(priveKorhogoTrim3Router);

// Bouaké1
genererRapportRouter.use(privebouake1Trim1Router);
genererRapportRouter.use(privebouake1Trim2Router);
genererRapportRouter.use(privebouake1Trim3Router);

// Bouaké2
genererRapportRouter.use(priveBouake2Trim1Router);
genererRapportRouter.use(priveBouake2Trim2Router);
genererRapportRouter.use(priveBouake2Trim3Router);

// Yamoussokro
genererRapportRouter.use(priveYakroTrim1Router);
genererRapportRouter.use(priveYakroTrim2Router);
genererRapportRouter.use(priveYakroTrim3Router);

// San pedro
genererRapportRouter.use(priveSanpedroTrim1Router);
genererRapportRouter.use(priveSanpedroTrim2Router);
genererRapportRouter.use(priveSanpedroTrim3Router);

//Technique
genererRapportRouter.use(technique1semestreRouter);
genererRapportRouter.use(technique2semestreRouter);

//Professionnelle
genererRapportRouter.use(profesionnelle1semestreRouter);

// DREN Issia
genererRapportRouter.use(priveIssia1Trim1Router);
genererRapportRouter.use(priveIssia2Trim2Router);
genererRapportRouter.use(priveIssiaRentreeRouter);

// DREN MANKONO
genererRapportRouter.use(priveMankonoRentreeRouter);

// Gagnoa en excell
genererRapportRouter.use(privegagnoaRouter);



export default genererRapportRouter;

