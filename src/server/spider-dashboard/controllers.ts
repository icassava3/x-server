import { Request, Response } from "express";
import services from "./services"

const statistics = (req: Request, res: Response) => {
  //ajv validate req body
  services
    .statisticsData()
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const statisticsPhoto = (req: Request, res: Response) => {
  //ajv validate req body
  services
    .statisticsPhoto()
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};


/**
 * Afficher ou caher les statistique de l'onglet tableau de bord (x-server-client)
 * @param req 
 * @param res 
 */
 const toggleShowStatistic = (req: Request, res: Response) => {
  //ajv validate req body
  const { key, etatStat } = req.body;
  console.log("🚀 ~ file: controllers.ts ~ line 18 ~ toggleShowStatistic ~ key,etatStat ", key, etatStat)
  services
    .updateConfigData(key, etatStat)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

/**
 * Afficher ou cacher un onglet (x-server-client)
 * @param req 
 * @param res 
 */
const toggleShowTabs = (req: Request, res: Response) => {
  //ajv validate req body
  const { key, etatOnglet } = req.body;
  services
    .updateConfigData(key, etatOnglet)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const getShowStatistic = (req: Request, res: Response) => {
  //ajv validate req body

  services
    .getShowStatistic()
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};


const getShowTabs = (req: Request, res: Response) => {
  //ajv validate req body
  services
    .getShowTabs()
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};


export default {
    statistics,
    statisticsPhoto,
    getShowStatistic,
    toggleShowStatistic,
    toggleShowTabs,
    getShowTabs
}