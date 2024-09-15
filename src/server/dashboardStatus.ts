import { ISchoolControlActivitiesConfig } from "../client/store/interfaces";
import { paramEtabObjet } from "./databases/accessDB";
import { redisClient } from "./databases/redis";
import redisFunctions from "./databases/redis/functions";
import { getAllStatEtab } from "./helpers/function";
import { IAccessConfig, IWarehouseConfig } from "./helpers/interfaces";
import { checkMsAccesDatabasesStatus, checkSqliteDatabaseStatus } from "./spider-client/appel-assiduite/functions";
import { IService } from "./spider-whserver/interfaces";
import { checkWarehouseActivatedAndAuthorizedHddSerialNumber, getOnlineWhConfig } from "./spider-whserver/services";
import { openTunnel } from "./tunnel";
const axios = require('axios');


const ping = require('ping');
const cron = require('node-cron');

const getServerStatus = (io: any, url: string, libelle: string) => {
    ping.sys.probe(url, (isAlive: boolean) => {
        io.emit("updateDashboard", { [libelle]: isAlive })
        // si l'url contient 'loca.lt' et que isAlive===faux, on relance le tunnel
        if (url.includes('loca.lt') && !isAlive) {
            openTunnel(io)
        }
    });
}

// const getServerStatus = async (io: any, url: string, libelle: string) => {
//     try {
//         const response = await axios.head(url);
//         const isAlive = response.status >= 200 && response.status < 300
//         io.emit("updateDashboard", { [libelle]: isAlive });
//         // si l'url contient 'loca.lt' et que isAlive===faux, on relance le tunnel
//         if (url.includes('loca.lt') && !isAlive) {
//             openTunnel(io)
//         }
//     } catch (error) {
//         io.emit("updateDashboard", { [libelle]: false });
//     }
// };

export const getDashboardStatus = async (io: any) => {

    try {
        // Si on arrive à lire dans redis, on renvoie le tunnel et le status de redis
        redisClient.get("tunnelUrl", (err, reply) => {
            if (err) console.log("tunnelUrl socket error", err)
            io.emit("tunnel url", reply || 'non configuré');
            io.emit("updateDashboard", { redis: 1 });
        });



        const { codeetab, code_cert_etab } = await paramEtabObjet(["CodeEtab", "code_cert_etab"]);

        // Récuperer le chémin de la bd access
        const accessConfig = await redisFunctions.getGlobalVariable("accessConfig") as IAccessConfig;
        io.emit("updateDashboard", { accessDbPath: accessConfig?.dbPath })

        // Obtenir toutes les stats de l'établissement
        getAllStatEtab(accessConfig?.studentsPhotoDir, io)

        // Prises de vues
        io.emit("updateDashboard", { priseDeVue: (code_cert_etab?.length) })
        // Ms access
        const checkAcces = async () => {
            try {
                const accessData: any = await checkMsAccesDatabasesStatus()
                const status = accessData.length > 0 ? 1 : 0
                io.emit("updateDashboard", { msAccess: status });

            } catch (error) {
                io.emit("updateDashboard", { msAccess: 2 });
            }
        }
        checkAcces()

        // Sqlite
        checkSqliteDatabaseStatus()
            .then(() => io.emit("updateDashboard", { sqlite: 1 }))
            .catch(() => io.emit("updateDashboard", { sqlite: 0 }))

        // Verifier si le serveur est activé
        checkWarehouseActivatedAndAuthorizedHddSerialNumber()
            .then(() => io.emit("updateDashboard", { serverStatus: true }))
            .catch(() => io.emit("updateDashboard", { serverStatus: false }))

        // Initialiser les HddSerial à vide
        io.emit("updateDashboard", { onlineHddSerial: '', currentPcHDDSerial: '', localHddSerial: '' })

        // Le numero du disque en ligne
        const checkOnlineWhConfig = () => {
            getOnlineWhConfig()
                .then((reply) => io.emit("updateDashboard", { onlineHddSerial: reply?.hddserialnumber }))
                .catch(error => io.emit("updateDashboard", { onlineHddSerial: '?', }))
        }
        checkOnlineWhConfig()
        // Le numero du disque en local
        const warehouseConfig = await redisFunctions.getGlobalVariable("warehouseConfig") as IWarehouseConfig;
        io.emit("updateDashboard", { localHddSerial: warehouseConfig?.hddserialnumber || '' })

        // Le numero du disque de la machine
        const currentPcHDDSerialNumber = await redisFunctions.getGlobalVariable("currentPcHDDSerialNumber");
        io.emit("updateDashboard", { currentPcHDDSerial: currentPcHDDSerialNumber || '' })

        // On effectue un ping pour connaitre l'état des serveurs
        // const site = [
        //     { url: "https://global.spider-api.com/v1/test", libelle: "globalApi" },
        //     { url: "https://wh.spider-api.com/v1/test", libelle: "warehouse" },
        //     { url: "https://profexpert.spider-api.com/v2/test", libelle: "profExpert" },
        //     { url: "https://focusecole.spider-api.com/v1/test", libelle: "focusEcole" },
        //     { url: "https://google.com", libelle: "isInternetAvailable" },
        //     { url: "https://cinetpay.spider-api.com/v1/test", libelle: "cinetpayServer" },
        //     { url: "http://192.168.1.195", libelle: "sireneStatus" },
        //     { url: `https://${codeEtab}.loca.lt`, libelle: "tunnel" },
        // ]

        const site = [
            { url: "global.spider-api.com", libelle: "globalApi" },
            { url: "wh.spider-api.com", libelle: "warehouse" },
            { url: "profexpert.spider-api.com", libelle: "profExpert" },
            { url: "focusecole.spider-api.com", libelle: "focusEcole" },
            { url: "google.com", libelle: "isInternetAvailable" },
            { url: "cinetpay.spider-api.com", libelle: "cinetpayServer" },
            { url: "192.168.1.195", libelle: "sireneStatus" },
            { url: `${codeetab}.loca.lt`, libelle: "tunnel" },
        ]

        // L'initialisation
        site.forEach(item => {
            getServerStatus(io, item.url, item.libelle)
        });

        // Faire un Ping sur google chaque 5 secondes pour vérifier si il y'a internet
        const task = cron.schedule('*/60 * * * * *', async () => {
            site.forEach(item => {
                getServerStatus(io, item.url, item.libelle)
            });
            // checkOnlineWhConfig()
            // const compteSms = await compteSmsCredit()
            // io.emit("updateDashboard", { compteSms })
        });
        task.start()

        // Vérifier si le service school control est activé
        const schoolControlService = await redisFunctions.getGlobalVariable("schoolControlService") as IService;
        io.emit("updateDashboard", { schoolControl: schoolControlService?.activated === 0 ? false : true })

        // Recuperer les configurations de school control
        const schoolControlConfig = await redisFunctions.getGlobalVariable("schoolControlConfig") as ISchoolControlActivitiesConfig;
        io.emit("updateDashboard", { schoolControlConfig })

        // Vérifier si le service cinetpay est activé
        const cinetpayService = await redisFunctions.getGlobalVariable("cinetpayService") as IService;
        io.emit("updateDashboard", { cinetpay: cinetpayService?.activated === 0 ? false : true })

        // Récuperer le compte sms
        const compteSms = await redisFunctions.getGlobalVariable("compteSms");
        io.emit("updateDashboard", { compteSms })

        // Récuperer la liste des activités récentes
        // const recentActivitiesList = await getListRecentActivity()
        // io.emit("recentActivitiesList",  recentActivitiesList )



    } catch (error) {
        console.log("🚀 ~ file: dashboardStatus.ts:117 ~ getDashboardStatus ~ error:", error)
    }
}
























