import {NextFunction, Request, Response} from "express";
import multer from 'multer'

export const multerMiddleware = (req: Request,
                          res: Response,
                          next: NextFunction) => {

    const uploadDir = './upload/'

    const storage = multer.diskStorage({
        destination:  (req: Request,  file: Express.Multer.File, cb: Function)=> {
            cb(null, uploadDir)
        },
        filename: function (req: Request, file: Express.Multer.File, cb: Function) {
            cb(null, file.originalname)
        }
    })
    return  multer({storage: storage});

}
