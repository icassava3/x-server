import { Request, Response, Errback } from "express";
import services from "./services";

const sendStudentsPhotos = (req: Request, res: Response) => {
  services
    .sendStudentsPhotos()
    .then((result: any) => { 
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
  };

export default {
  sendStudentsPhotos,
};
