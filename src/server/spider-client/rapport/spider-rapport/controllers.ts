import { Request, Response, Errback } from "express";
import services from "./services";

const genererRapport = (req: Request, res: Response) => {
  services
    .genererRapport(req.body)
    .then((result: any) => { 
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
  };

export default {
  genererRapport,
};
