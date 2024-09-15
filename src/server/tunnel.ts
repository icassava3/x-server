import redisFunctions from './databases/redis/functions';
import { paramEtabObjet } from "./databases/accessDB";
import { redisClient } from "./databases/redis";
import Logger from "./helpers/logger";
const localtunnel = require('../spd-localtunnel/localtunnel.js');

const host = "https://tunnel.demo-server-spider.com"


/**
 * Ouvre un tunnel sur le serveur pour utiliser spider via internet.
 * La vérification de la validité de la machine va se faire coté serveur
 * par comparaison du numéro de série du disque avec celui de l'activation
 * des web services.
 * @param io 
 * @param xserverPort 
 * @returns 
 */
export const openTunnel = (io, xserverPort: number = 49500): Promise<string> => {
  return new Promise<string>(async (resolve, reject) => {
    try {

      // await checkWarehouseActivatedAndAuthorizedHddSerialNumber();
      const paramEtab: any = await paramEtabObjet(["CodeEtab", "anscol1"])

      const port = xserverPort
      const subdomain = paramEtab.codeetab
      // const hddSerial = '0025_38DB_11C6_C3F0.'
      const hddSerial =await redisFunctions.getGlobalVariable('currentPcHDDSerialNumber')
      const anneeScolaire = paramEtab.anscol1

      const tunnel = await localtunnel({ host, port, subdomain, anneeScolaire, hddSerial });

      console.log('tunnel.url: ', tunnel.url);

      tunnel.on('request', (data) => {
        console.log('tunnel requests: ', data);
      });

      tunnel.on('error', (data) => {
        console.log('tunnels error', data);
        io.emit("tunnel url", "erreur");
      });

      tunnel.on('close', () => {
        console.log('tunnels are closed');
        redisClient.del("tunnelUrl", (err, reply) => { });
        io.emit("tunnel url", "déconnecté");
        Logger.error("tunnel closed");
      });

      const url = `https://${paramEtab.codeetab}.tunnel.demo-server-spider.com`

      if (tunnel.url === url) {
        await redisClient.set("tunnelUrl", url)
        Logger.info(`Tunnel successfuly opened with url: ${url}`)
        io.emit("tunnel url", url);
        resolve(url);
      } else {
        io.emit("tunnel url", 'non configuré');
        reject('errincompatible u')
      }

    } catch (error) {
      console.log("🚀 ~ file: localtunnel.js:21 ~ openTunnel ~ error:", error)
    }
  })
}




