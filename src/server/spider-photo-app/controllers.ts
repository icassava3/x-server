import axios from "axios";
import { Request, Response, Errback } from "express";
import { resolve } from "path";
import { PHOTOSHARE_BASE_URL } from "../helpers/constants";


import { IClasseItem, IEmployeesPhotoUploadPayload, IPhotoUploadPayload, IReqQueryProgInfos, IStudentPhotoForMobileApp } from "./interfaces";
import * as services from "./services";
import { paramEtabObjet } from "./../databases/accessDB";
import photoshareService from "../spider-photo-share/services";
import { countJPGFiles, getAllStatEtab } from "../helpers/function";
import { IAccessConfig } from "../helpers/interfaces";
import redisFunctions from "../databases/redis/functions";

const FormData = require("form-data");
var fs = require("fs");


export const uploadPhotosZipJson = (req: Request, res: Response) => {
  const io = (req as any).io;
  services
    .uploadPhotosZipJson(req)
    .then((result) => res.send({ status: 1, data: result }))
    .catch((error: any) => {
      console.log("🚀 ~ file: controllers.ts:25 ~ uploadPhotosZipJson ~ error:", error)
      res.send({ status: 0, error }
      )
    });
};

export const bulkUploadStudentsPhoto = (req: Request, res: Response) => {
  const io = (req as any).io;
  const data = req.body as IPhotoUploadPayload;
  const { socketId } = data;
  services
    .bulkUploadStudentsPhoto(data)
    .then(async (studentsData) => {
      io.to(socketId).emit("new photo", studentsData);
      const accessConfig = await redisFunctions.getGlobalVariable("accessConfig") as IAccessConfig;
      // Obtenir toutes les stats de l'établissement
      getAllStatEtab(accessConfig?.studentsPhotoDir, io);
      res.send({ status: 1, data: studentsData });
    })
    .catch((error) => {
      io.to(socketId).emit("new photo failed", error);
      res.send({ status: 0, error: error });
    });
};

export const bulkUploadEmployeesPhoto = (req: Request, res: Response) => {
  const io = (req as any).io;
  const data = req.body as IEmployeesPhotoUploadPayload;
  const { socketId } = data;
  services
    .bulkUploadEmployeesPhoto(data)
    .then(async (studentsData) => {
      io.to(socketId).emit("new photo", studentsData);
      const accessConfig = await redisFunctions.getGlobalVariable("accessConfig") as IAccessConfig;
      // Obtenir toutes les stats de l'établissement
      getAllStatEtab(accessConfig?.studentsPhotoDir, io);
      res.send({ status: 1, data: studentsData });
    })
    .catch((error) => {
      io.to(socketId).emit("new photo failed", error);
      res.send({ status: 0, error: error });
    });
};

export const uploadStudentPhoto = (req: Request, res: Response) => {
  const io = (req as any).io;
  services
    .uploadStudentPhoto(io,req.body)
    .then((result) => res.send({ status: 1, data: result }))
    .catch((error: any) => {
      console.log("🚀 ~ file: controllers.ts:66 ~ uploadStudentPhoto ~ error:", error)
      res.send({ status: 0, error }
      )
    });
};

export const uploadStudentPhotoZip = (req: Request, res: Response) => {
  res.status(200).send("DONE !");
};

export const getAllPhoto = (req: Request, res: Response) => {
  services
    .fetchAllPhoto()
    .then((result) => res.send({ status: 1, data: result }))
    .catch((error) => res.send({ status: 0, error: error }));
};

export const getStudentPhotoInfosById = (req: Request, res: Response) => {
  services
    .getStudentPhotoInfosById(req)
    .then((result) => res.send({ status: 1, data: result }))
    .catch((error) => {
      console.log("🚀 ~ file: controllers.ts:118 ~ getStudentPhotoInfosById ~ error:", error)
      res.send({ status: 0, error: error })
    });
};

/*
export const getProgData = (req: Request, res: Response) => {
  const getData = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const prog = await services.getProgInfos(req.query)
        const eleves = await services.fetchAllStudents()
        const classes = await services.fetchAllClasses()
        const personnel = await services.fetchAllPers()
        resolve({ prog, eleves, classes, personnel })
      } catch (error) {
        console.log("🚀 ~ file: controllers.ts ~ line 166 ~ returnnewPromise ~ error", error)
        reject(error)
      }
    })
  }
  getData()
    .then(result => res.send({ status: 1, data: result }))
    .catch((error: any) => res.send({ status: 0, error: error }))
};
*/

/**
 * Récupération des infos,classes et elèves pour l'appli des photographes
 * @param req 
 * @param res 
 */
const getProgData = (req: Request, res: Response) => {
  services
    .getProgData(req.query)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => {
      console.log("🚀 ~ file: controllers.ts:157 ~ getProgData ~ error:", error)
      res.send({ status: 0, error }
      )
    });
};

export default {
  uploadStudentPhoto,
  getAllPhoto,
  getStudentPhotoInfosById,
  getProgData,
  uploadStudentPhotoZip,
  bulkUploadStudentsPhoto,
  uploadPhotosZipJson,
  bulkUploadEmployeesPhoto
};
