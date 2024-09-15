import Redis from "ioredis";
import Logger from '../../helpers/logger';
import { REDIS_PWD } from "../../helpers/constants";
const {  execFile } = require('child_process');

let redisClient: Redis
// const PWD = process.env.REDIS_PWD
// const USR = process.env.REDIS_USER

// const PWD = '@rEDis2023'
// const USR = 'xsrv'
const PORT = 6379
const processName = 'redis-server.exe';
const redisPath = process.env.NODE_ENV === "production"
  //@ts-ignore
  ? `${process.resourcesPath}/bin`
  : process.argv.slice(2)[0] === 'sqlite' //si le projet est lancé avec "yarn start-server"
    ? require("path").resolve(__dirname, '..', '..', '..', '..', 'bin')
    : require("path").resolve('./', 'bin')

const link = `${redisPath}\\${processName}`



const processArgs = [
  '--requirepass', REDIS_PWD,
  '--port', PORT,
  // '--loadmodule', 'rejson.dll'
]



/**
 * lance la connexion du client redis
 */
const connectClient = (): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    try {
      redisClient = new Redis({
        host: "127.0.0.1",
        port: PORT, //, 6379
        // username: USR, //
        password: REDIS_PWD
      });
      redisClient.on("error", function (err) {
        Logger.error(`redis client connection failed: ${err}`)
        // reject(err)
      });
      redisClient.on("connect", function (err) {
        Logger.info(`redis client successfully Connected`)
        // resolve(true)
      });
       resolve(true)
    } catch (error) {
      console.log("🚀 ~ file: index.ts:51 ~ returnnewPromise ~ error:", error)
      reject(error)
    }
  })
}


/**
 * lance redis-server.exe en l'attachant à x-server
 * la fermeture de x-server entraine celle de redis-server
 * @returns 
 */
const launchRedisServer = (): Promise<number> => {
  return new Promise<number>((resolve, reject) => {
    try {
      const redisServer = execFile(link, processArgs, { cwd: `${redisPath}` });
      redisServer.stdout.on('data', function (data) {
        console.log('data' + data);
      });
      redisServer.on('close', (code: number) => {
        Logger.error(`redisServer closed with code ${code}`)
      });
      Logger.info(`${processName} successfully launched with PID ${redisServer.pid}`)
      resolve(redisServer.pid);
    } catch (error) {
      Logger.error(`redisServer.ts:33 launchRedisServer ~ error:${error}`)
      reject(error)
    }
  })
};


export const ensureRedisServerIsRunning = (): Promise<number> => {
  return new Promise<number>(async (resolve, reject) => {
    try {
      let pid: number
      pid = await launchRedisServer()
      await connectClient()
      resolve(pid);
    } catch (error) {
      Logger.error(`index.ts:85 ~ ensureRedisServerIsRunning ~ error:${error}`)
      reject(error)
    }
  })
};

export { redisClient };



