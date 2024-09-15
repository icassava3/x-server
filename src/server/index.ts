import { ensureRedisServerIsRunning, redisClient } from "./databases/redis";
import Logger from "./helpers/logger";
const PORT = 49500;
const IP = require("ip").address();

const startServer = async () => {
    try {
        //1. lancement du serveur redis
        await ensureRedisServerIsRunning()
        
        //2. initialisation des bases de données
        await require('./databases').initializeDatabases(IP, PORT)
        Logger.info(`databases initialization complete`)

        //3. mise en cache des données dans redis
         await require('./globalVariables').initializeGlobalVariables()
         Logger.info(`mise en cache des données dans redis complete`)

        // lancement du serveur express
        await require("./app")
    } catch (error) {
        Logger.error("🚀 ~ file: index.ts:30 ~ startServer ~ error:", error)
    }
}

startServer()