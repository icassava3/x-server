import axios from "axios";
import express, { Router } from "express";
import {
  appCnx,
  appCnxString,
  dataCnx,
  executeToMsAccess,
  fetchFromMsAccess,
  paramEtabObjet,
} from "../databases/accessDB";
import redisFunctions, { addGlobalVariable } from "../databases/redis/functions";
import controllers from "./controllers";
import validators from "./validators";
import { fetchEcheancierIndividuel } from "../spider-whserver/functions-vba";
import { _selectSql } from "../databases";
const https = require('https');

const agent = new https.Agent({
  rejectUnauthorized: false,
  minVersion: 'TLSv1',
});

const commonRouter: Router = express.Router();

/**
 * Verifier le server (x-server) a bien demarré
 */
// commonRouter.get("/", function (_: any, res: any) {
//   const PORT = 1970;
//   const IP = require("ip").address();
//   const msg = `Le serveur tourne bien sur le port ${PORT}!`;
//   res.status(201).send({
//     status: 1,
//     data: {
//       message: msg,
//       ip: IP,
//       port: PORT,
//     },
//   });
// });


commonRouter.get("/testredisjson", async (req: any, res: any) => {
  try {
    console.log("testredisjson ++++++++")
    let results = null;
    let isCached = false;
    const cacheResults = await redisFunctions.getGlobalVariable('ech')
    console.log("🚀 ~ file: routes.ts:48 ~ commonRouter.get ~ cacheResults", cacheResults)
    if (cacheResults) {
      isCached = true;
      results = cacheResults
    } else {
      results = await fetchEcheancierIndividuel(null);
      await redisFunctions.addGlobalVariable('ech', results)

    }


    //results = await fetchEcheancierIndividuel(null);

    res.send({ status: 1, isCached, data: results });


  } catch (error) {
    console.log("🚀 ~ file: routes.ts ~ line 51 ~ commonRouter.get ~ error", error);
    res.send({ status: 0, error: error });
  }
});


/**
 * tester la recup de data depuis la base vba client config
 */
commonRouter.get("/testparametab", function (_: any, res: any) {
  const paramObj = paramEtabObjet(["Anscol1", "CodeEtab", "AnScol2", "BPEtab", "DRENComplet",
    "DRENouDDEN", "DREN", "Fondateur", "NomChefEtab", "NomCompletEtab", "NomEtabAbr", "TélChefEtab", "TélCorrespondant", "TelEtab", "TélFondateur", "method_calc_eval", "DecoupSemestres"]);;

  // const { anscol1, codeetab } = paramObj;
  res.status(201).send({
    status: 1,
    data: paramObj,
  });
});

commonRouter.get("/testurl", async (req: any, res: any) => {
  try {
   
    // const url = `https://www.symtel.biz/fr/index.php?mod=cgibin&page=2&title=ANADOR&user=ANADORSMS&code=1059cb34220edc58ba59c06ac1e158c5&phone=2250707405931&content=test message 151222`;
    // const response = await axios.get(url, { httpsAgent: agent });
    // const regOk = /OK/
    // const matchOk = regOk.exec(response.data)
    // console.log("🚀 ~ file: routes.ts ~ line 54 ~ commonRouter.get ~ matchOk", matchOk[0])
    // const reg = /[^{]+(?=[}])/
    // const match = reg.exec(response.data)
    // console.log("🚀 ~ file: routes.ts ~ line 54 ~ commonRouter.get ~ match", match[0])
    // const smsResponse = {
    //   sms_messageId: match[0],
    //   sms_send_status: matchOk[0] ? 1 : 0
    // }

    // res.send({ status: 1, data: smsResponse });


    const url3 = `https://websms.spider-ci.com/api/api_http.php?username=GSMANGO-SAK&password=gsmango_010439&sender=GSMANGO-SAK&to=2250150412149&text=${encodeURIComponent("test msg 014039")}&type=text`;
    const res3 = await axios.get(url3);
    console.log("🚀 ~ file: services.ts:1005 ~ returnnewPromise ~ res3.data:", res3.data)

    // res3.data = "OK: fe164bf7-975e-11ed-8f9a-0cc47a018caf"
    const resSplit = res3.data.split(' ');
    const messageId = resSplit[1];
    console.log("🚀 ~ file: services.ts:1008 ~ returnnewPromise ~ messageId:", messageId)
    res.send({
      sms_messageId: messageId,
      sms_send_status: messageId ? 1 : 0,
    });

  } catch (error) {
    console.log("🚀 ~ file: routes.ts ~ line 51 ~ commonRouter.get ~ error", error);
    res.send({ status: 0, error: error });
  }
});


commonRouter.get("/testsqlite", async (req: any, res: any) => {
  try {
    // const matricOrMatricProv = await redisFunctions.getGlobalVariable("matricOrMatricProv");
    const sql = `SELECT * FROM xserver_config`
    const result = await _selectSql(sql, []);

    res.send({ status: 1, data: result });
  } catch (error) {
    console.log("🚀 ~ file: routes.ts:133 ~ commonRouter.get ~ error:", error)
    res.send({ status: 0, error: error });
  }
});

/**
 * Tester une requete access
 */
commonRouter.get("/testaccesssql", async (req: any, res: any) => {
  try {
    console.log("testaccesssql+++++++")
    // const matricOrMatricProv = await redisFunctions.getGlobalVariable("matricOrMatricProv");
    const userName = "COMPTABLE"
    const sql = `SELECT nom_form_ou_proc FROM UsysDroits WHERE user="${userName}";`
    const result = await fetchFromMsAccess(sql, dataCnx);

    res.send({ status: 1, data: result });
  } catch (error) {
    console.log("🚀 ~ file: routes.ts ~ line 51 ~ commonRouter.get ~ error", error);
    res.send({ status: 0, error: error });
  }
});

commonRouter.get("/parametab", controllers.paramEtab);
commonRouter.post("/authentification", validators.authentification(), controllers.authentification);

export default commonRouter;
