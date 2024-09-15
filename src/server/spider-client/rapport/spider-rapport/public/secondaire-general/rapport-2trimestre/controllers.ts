import { Request, Response, Errback } from "express";
import services from "./services";
import functions from "../../../utils";

const rapport = (req: Request, res: Response) => {
  services
    .rapport(req.params)
    .then((result: any) => {
      const serverUrl = functions.serverUrl(req, result);
      res.status(200).send({ status: 1, data: serverUrl });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};


export default {
  rapport
};
