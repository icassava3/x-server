import { Request, Response, Errback } from "express";
import { fetcAllPointageWithActitvite, fetchAllPointage, insertNewPointage } from "./services";


export const getAllpointage = (req: Request, res: Response) => {
  fetchAllPointage()
    .then(result => res.send({ status: 1, data: result }))
    .catch(error => res.send({ status: 0, error: error }))
}

export const addPointage
  = (req: Request, res: Response) => {
    insertNewPointage(req, res)
      .then(result => {
        (req as any).io.emit("new pointage", result);
        res.status(200).send({ status: 1, data: result })
      })
      .catch(error => res.send({ status: 0, error: error }))
  }

  export const getAllPointageWithActitvite = (req: Request, res: Response) => {
    fetcAllPointageWithActitvite(req.body)
      .then(result => res.send({ status: 1, data: result }))
      .catch(error => res.send({ status: 0, error: error }))
  }
