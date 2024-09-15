import { Request, Response } from "express";
import { paramEtabObjet } from "../databases/accessDB";
import { redisClient } from "../databases/redis";
import redisFunctions from "../databases/redis/functions";
import { REDIS_ENCRYPT_KEY } from "../helpers/constants";
import { encryptPayload } from "../helpers/function";
import { updateVbaCredentials } from "./functions";
import { IVbaCredentials } from "./interfaces";
import services from "./services";


/**
 * s'execute a chaque connexion de spider access a x-sever
 * @param req 
 * @param res 
 */
const vbaClientLogin = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const io = (req as any).io;
        io.to(globalThis.serverFrontEndSocketId).emit("new vba device", data);
        const { spiderSuperAdmins, spiderUsers, spiderAgents } = data;
       
        const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);

        //fetch cle vbaCredentials
        const vbaCredentials = await redisClient.get("vbaCredentials");

        let encryptedCredentials = null;
        //si cle vbaCredentiels vide, la toute premiers fois, construire data
        if (!vbaCredentials.length) {
            const credentialsData = {
                spiderAgents,
                users: [
                    {
                        anneeScolaire: anscol1,
                        codeEtab: codeetab,
                        spiderUsers,
                        spiderSuperAdmins
                    }
                ]
            }
            encryptedCredentials = encryptPayload(credentialsData, /*process.env.*/ REDIS_ENCRYPT_KEY)

        } else {//sinon decrypter vbaCredentiels et checker l'existence data pour l'anneeScolaire et codeEtab
            const decryptedCredentials = await redisFunctions.getSecureData("vbaCredentials") as IVbaCredentials
            const oldUsers = decryptedCredentials.users;
            const newUsers = {
                anneeScolaire: anscol1,
                codeEtab: codeetab,
                spiderUsers,
                spiderSuperAdmins
            }
            //ajouter newUsers ou remplacer si existe deja
            const index = oldUsers.findIndex(item => item.anneeScolaire === anscol1 && item.codeEtab === codeetab)
            if (index > -1) {
                oldUsers.splice(index, 1, newUsers)
            } else {
                oldUsers.push(newUsers);
            }
            const credentialsData = {
                spiderAgents,
                users: oldUsers
            }
            encryptedCredentials = encryptPayload(credentialsData, /*process.env.*/ REDIS_ENCRYPT_KEY)
        }

        await updateVbaCredentials(encryptedCredentials);
        await redisClient.set("vbaCredentials", encryptedCredentials);

        services
            .vbaClientLogin()
            .then((result: any) => {
                // io.emit("versements", result.versementInserted);
                res.status(200).send({ status: 1, data: result });
            })
            .catch((error: any) => res.send({ status: 0, error }));
    } catch (error) {
        console.log("🚀 ~ file: controllers.ts:31 ~ vbaClientLogin ~ error:", error)
    }
};


/**
 *  s'execute a chaque deconnexion de spider access a x-sever
 * @param req 
 * @param res 
 */
const vbaClientLogout = (req: Request, res: Response) => {
    const data = req.body;
    const io = (req as any).io;
    io.to(globalThis.serverFrontEndSocketId).emit("vba device logout", data);
    res.status(200).send({
        status: 1,
        message: "Connecté avec succès au serveur local",
    });

};

/**
 * simule l'ajout d'un elève pour provoquer le render de Dashboard
 * @param req 
 * @param res 
 */
const vbaRefreshStat = (req: Request, res: Response) => {
    const data = req.body;
    console.log("data ++++", data)
    const io = (req as any).io;
    io.to(globalThis.serverFrontEndSocketId).emit("new student", data);
    res.status(200).send({
        status: 1,
        data: data,
    });

};


export default {
    vbaClientLogin,
    vbaClientLogout,
    vbaRefreshStat
}