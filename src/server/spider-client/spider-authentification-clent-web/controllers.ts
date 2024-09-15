import { Request, Response } from "express";
import { decryptPayload, encryptPayload } from "../../helpers/function";
import services from "./services";
const uuid = require("uuid")
//
const useEncryption: boolean = process.env.NODE_ENV === "production"
  ? true
  : true // variable à modifier si on veut travailler avec un payload crypté ou en clair
/**
 * @param req
 * @param res
 */
// const webclientlogin = (req: Request, res: Response) => {
//   // const data = useEncryption ? decryptPayload(req.body.data, req.session.id) : req.body
//   services
//     .webclientlogin(req.body)
//     .then((result: any) => {
//       const sess: any = req.session;
//       const { username, password } = result;
//       sess.username = username;
//       sess.password = password
//       res.cookie(
//         "authId",
//         uuid.v4(),
//         {
//           encode: (v) => v,//sinon la valeur sera urlEncoded
//         }
//       );
//       res.status(200).send({ status: 1, data: result });
//     })
//     .catch((error: any) => res.status(400).send({ status: 0, error }));
// };
const webclientlogin = (req: Request, res: Response) => {
  // const data = useEncryption ? decryptPayload(req.body.data, req.session.id) : req.body
  services
    .webclientlogin(req.body)
    .then((result: any) => {
      const sess: any = req.session;
      const { username, password } = result;
      sess.username = username;
      sess.password = password
      res.cookie(
        "authId",
        uuid.v4(),
        {
          encode: (v) => v,//sinon la valeur sera urlEncoded
        }
      );
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};
export default {
  webclientlogin,
};
