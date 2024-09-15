import express from 'express';
import moduleAppelAssiduiteRouter from './appel-assiduite/routes';
import moduleRapportRouter from './rapport';
import statsCioRendementRouter from './statsCioRendement/routes';
import bossBoardRouter from './boss-board/routes';
import focusEcoleRouter from './focus-ecole/routes';
import fichierERSYSRouter from './fichierERSYS/routes';

const spiderClientRouter = express.Router();
spiderClientRouter.use("/", moduleAppelAssiduiteRouter);
spiderClientRouter.use("/", moduleRapportRouter);
spiderClientRouter.use("/", statsCioRendementRouter);
spiderClientRouter.use("/", bossBoardRouter);
spiderClientRouter.use("/", focusEcoleRouter);
spiderClientRouter.use("/", fichierERSYSRouter);

export default spiderClientRouter;