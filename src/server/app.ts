
import { redisClient } from "./databases/redis";
import express, { NextFunction, Request, Response } from "express";
import morganMiddleware from "./middlewares/morgan";
const qrcode = require('qrcode-terminal');
const connectRedis = require("connect-redis");
const cors = require("cors");
const path = require("path");
const chalk = require("chalk");
const compression = require("compression");
const pkgJson = require('../../package.json')
// import { SESSION_SECRET } from "./helpers/constants";
import Logger from "./helpers/logger";
import { setSecureData } from "./databases/redis/functions";
// import { addRecentActivity, getListRecentActivity } from "./helpers/function";

require('dotenv').config()

// constantes
const PORT = 49500;
const IP = require("ip").address();
console.log("🚀 ~ file: app.ts:22 ~ IP:", IP)
const DATABASE_MODE = process.argv.slice(2)[0] || "sqlite";

import { accessConfig } from "./databases"

Logger.info("Express server is starting...")

/**
 * ------------------------------------------
 * desactiver les console log en production
 */
if (process.env.NODE_ENV === "production") {
  console.log = () => { };
}


import errorHandler from "./middlewares/errorHandler";

// =================================== APP CONFIG =========================================================
const app = express();
const httpServer = require("http").createServer(app);
// ========================================================================================================

// =================================== MIDDLEWARES =========================================================
app.use(express.urlencoded({ limit: '300mb', extended: true, }));
app.use(express.json({ limit: '300mb' }));
app.use(cors({ credentials: true, optionsSuccessStatus: 200, origin: true }));
app.use(compression());
app.use(morganMiddleware);

// ========================================================================================================

/**
 * Intercepte tous les trafics sortants et envoie un signal au led
 * @param req 
 * @param res 
 * @param next 
 */
const httpTrafficOutMiddleware = (req, res, next) => {
  const originalJson = res.json;
  res.json = function (data) {
    // Vérifiez si la réponse est un objet JSON
    if (typeof data === 'object' && data.status) {
      req.io.emit("httpOut", true)
    } else {
      req.io.emit("httpOut", false)
    }
    originalJson.call(this, data);
  };
  next();
};
app.use(httpTrafficOutMiddleware);


//Décrypter les payloads et encrypter les reponses
const decryptPayloadAndEncryptWebCliResponseMiddleware = (req, res, next) => {
  const reqOrigin = req.headers['request-origin'];
  if (reqOrigin === 'web-client' && Object.keys(req.body).length) {
    // Décrypter le payload
    const dataDecrypt = decryptPayload(req.body.data, req.session.id);
    // Stocker les données décryptées dans l'objet req.body
    req.body = dataDecrypt;
  }

  // Sauvegarder la fonction originale res.send
  const originalSend = res.send;

  // Redéfinir res.send pour chiffrer les données avant de les envoyer
  res.send = function (body) {
    res.send = originalSend; // Restaurer la fonction originale après la première exécution
    if (reqOrigin === 'web-client') {
      //chiffrement des réponses de l'API
      const encryptedData = encryptPayload(body.data, req.session.id);
      return originalSend.call(this, { ...body, data: encryptedData });
    } else {
      return originalSend.call(this, body);
    }
  };

  next();
};


// ==================================== API ROUTES IMPORTS  =================================================
import profExpertRouter from "./spider-prof-expert/routes";
import photoRouter from "./spider-photo-app/routes";
import pointageRouter from "./spider-pointage-deep/routes";
import schoolControlRouter from "./spider-school-control/routes";
import partenairesRouter from "./spider-partenaires/routes";
import whserverRouter from "./spider-whserver/routes";
import dashboardRouter from "./spider-dashboard/routes";
import messagerieRouter from "./spider-messagerie/routes";
import photoShareRouter from "./spider-photo-share/routes";
import vbaRouter from "./vba-client/routes";
import commonRouter from "./common/routes";
import spiderClientRouter from "./spider-client";
import { checkUserHasRight } from "./common/services";
import webclientlogin from "./spider-client/spider-authentification-clent-web/routes";
import genererRapportRouter from "./spider-client/rapport/spider-rapport/routes";
import { IRecentActivity } from "../client/store/interfaces";
import { profDataDir } from "./spider-prof-expert/constants";
import { SESSION_SECRET } from "./helpers/constants";
import { decryptPayload, encryptPayload } from "./helpers/function";
// =========================================================================================================

// ============================= DEBUT DOSSIERS STATIQUES =============================================================
//  "public"
const publicDir = process.env.NODE_ENV === "production"
  //@ts-ignore
  ? `${process.resourcesPath}/public`
  : process.argv.slice(2)[0] === 'sqlite' //si le projet est lancé avec "yarn start-server"
    ? path.resolve(__dirname, '..', '..', 'public')
    : path.resolve('./', 'public')
app.use(express.static(publicDir));

//  "views"
const htmlPath = process.env.NODE_ENV === "production"
  //@ts-ignore
  ? `${process.resourcesPath}/views`
  : process.argv.slice(2)[0] === 'sqlite' //si le projet est lancé avec "yarn start-server"
    ? path.resolve(__dirname, '..', '..', 'views')
    : path.resolve('./', 'views')

const spiderPath = `${htmlPath}/spider`

// "download"
const downloadDir = "C:/SPIDER/spd_save_tmp"
app.use('/download', express.static(downloadDir));

// "/spider/images"
app.use('/spider/images', express.static(path.join(__dirname, '..', '..', 'views/images')));

app.use('/photosEleves', express.static(accessConfig.studentsPhotoDir));
app.use('/photosPers', express.static(accessConfig.persPhotoDir));
app.use("/avatars", express.static(__dirname + "/upload/images/avatars"));
app.use("/prof-expert-data", express.static(profDataDir));
// ======================================== FIN DOSSIERS STATIQUES==============================================================


// ============================== SOCKET.IO CONFIGURATION ==============================================
const options = {
  transports: ["websocket"],
  pingTimeout: 2500,
  pingInterval: 5000,
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
};
const io = require("socket.io")(httpServer, options);
const ioMiddleware = (req: any, res: Response, next: NextFunction) => {

  req.io = io;
  next();
};
app.use(ioMiddleware);
const cnxInfos = { ip: IP, port: PORT, tunnel: 'non configuré' };
require("./socketIO").initializeSocket(io, cnxInfos)
  .then(() => {
    Logger.info(`socket.io successfully initialized`)

    // ============================= TUNNEL INITIALIZATION ============================================= 
    require("./tunnel").openTunnel(io, PORT)
      .then((remoteHostname) => { })
      .catch((error) => {
        Logger.error(`app.ts:125 ~ openTunnel ~ error:", ${error}`)
      })
    // =================================================================================================
  })
  .catch((error) => { console.log("tunnel error", error); Logger.error(`app.ts:125 ~ initializeSocket ~ error:", ${error}`) });
// =================================================================================================

const httpTraficInMiddleware = (req, res, next) => {
  io.emit("httpIn", true)
  next()
}
app.use(httpTraficInMiddleware)

// ================================= REDIS STORE ===================================================
const session = require("express-session");
const RedisStore = connectRedis(session);

const configureSession = async (): Promise<void> => {
  try {
    app.set("trust proxy", 1); // enable this if you run behind a proxy (e.g. nginx)
    app.use(
      session({
        store: new RedisStore({ client: redisClient }),
        secret: /* process.env. */SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        rolling: true, // Actualise l'heure d'expiration de la session à chaque requête
        cookie: {
          secure: false, // if true only transmit cookie over https
          httpOnly: false, // if true prevent client side JS from reading the cookie
          maxAge: 1000 * 60 * 10, // session max age in miliseconds
        },
      })
    );
  } catch (error) {
    console.log("🚀 ~ file: app.ts:178 ~ configureSession ~ error:", error)
  }
}

configureSession()
// ================================================================================================


// ----------------------------------------------------------
app.use(decryptPayloadAndEncryptWebCliResponseMiddleware)
// ----------------------------------------------------------


// ============================= SERVER LANDING PAGE ===============================================
app.set('view engine', 'pug')
// Désactive le cache du navigateur
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});
app.get('/', async (req, res) => {
  const xserverLandingPagePath = `${htmlPath}/xserver-landing-page`;
  app.use(express.static(xserverLandingPagePath));
  const reply = await redisClient.hget("globalVariables", 'paramEtab')
  const paramEtab = reply ? JSON.parse(reply) : null;
  const remoteAddress = await redisClient.get('tunnelUrl')
  res.render(`${xserverLandingPagePath}/index`, {
    codeEtab: paramEtab.codeetab,
    libelleEtab: paramEtab.nomcompletetab || '',
    anneeScolaire: paramEtab.anscol1 || '',
    localAddress: `http://${IP}:${PORT}/spider`,
    remoteAddress: remoteAddress ? `${remoteAddress}/spider` : null
  })
});

// =================================================================================================


// =========================================== WEB CLIENT =========================================
// Middleware personnalisé qui définit un cookie
const setSpiderCookie = (req, res, next) => {
  const serverUrl = `${req.protocol}://${req.get('host')}`
  res.cookie(
    "serverUrl",
    `${serverUrl}`,
    {
      encode: (v) => v,//sinon la valeur sera urlEncoded
      // maxAge: 1000
    }
  );
  next();
};



app.use(setSpiderCookie); // utilise le middleware personnalisé qui définit le cookie
app.use('/spider', express.static(spiderPath));
app.get("/spider/*", function (req, res) {
  res.sendFile(`${spiderPath}/index.html`);
});

app.use("/", webclientlogin);

app.get("/logout", (req, res, next) => {
  const oldSessionId = req.session.id
  res.clearCookie('authId');
  const sess: any = req.session;
  sess.username = null;
  sess.password = null
  req.session.save(function (err) {
    if (err) next(err)
    req.session.regenerate(function (err) {
      if (err) next(err)
      res.send({ status: 1, data: "ok" });
    })
  })
})
// ======================================================================================================

// ================================== API ROUTES =========================================================
app.use("/profexpert", profExpertRouter);
app.use(commonRouter);
app.use(vbaRouter);
app.use("/client", spiderClientRouter);
app.use("/partenaires", partenairesRouter);
app.use("/pointage", pointageRouter);
app.use("/photo", photoRouter);
app.use("/dashboard", dashboardRouter);
app.use("/photoshare", photoShareRouter);
app.use("/whserver", whserverRouter);
app.use("/messagerie", messagerieRouter);
app.use("/schoolcontrol", schoolControlRouter);
app.use("/rapport", genererRapportRouter);

app.use(errorHandler)

// app.post("/addrecentactivity", async (req, res) => {
//   console.log("🚀 ~ file: app.ts:248 ~ app.post ~ req:", req.body)
//   const payload = req.body as IRecentActivity
//   const data = await addRecentActivity(payload) as IRecentActivity[];
//   (req as any).io.emit("addRecentActivity", data[0])
//   res.send(data)
//   // next()
// });

// app.get("/listrecentactivities", async (req, res) => {
//   const data = await getListRecentActivity()
//   res.send(data)
//   // next()
// });


// =======================================================================================================


//Lancement du server
const welcomeMsg = `
    ============================
    SPIDER-LOCAL-SERVER v ${pkgJson.version}
    Port: ${PORT}
    Ip: ${IP}
    Start: ${new Date().toLocaleString("fr-FR")}
    Working Dir: ${process.cwd()}
    Database mode: ${DATABASE_MODE}
    ============================
`;




httpServer.listen(PORT, () => {
  console.log(chalk.cyan(welcomeMsg));
});

const qrValue = {
  wifi: `http://${IP}:${PORT}`,
  tunnel: 'non configuré',
}
qrcode.generate(JSON.stringify(qrValue));


