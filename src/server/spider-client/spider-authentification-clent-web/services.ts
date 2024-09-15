import { paramEtabObjet } from "../../databases/accessDB";
import { IVbaCredentials } from "../../vba-client/interfaces";
import redisFunctions from "./../../databases/redis/functions";
import { IUser } from './../../spider-school-control/interfaces';
import functions from "./functions";

/**
 * web client login
 * @param data 
 * @returns 
 */
export const webclientlogin = (data: { userLogin: string, userPassword: string }): Promise<IUser> => {
    return new Promise(async (resolve, reject) => {
        try {
            const userLogin = data.userLogin.toLowerCase();
            const userPassword = data.userPassword;

            const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);
            const vbaCredentials = await redisFunctions.getSecureData("vbaCredentials") as IVbaCredentials | string;
            if (vbaCredentials === "") return reject({ name: "SPIDER_NOT_LAUNCHED", message: "Veuillez vous connecter dans l'application Spider" })

            const spiderAgents = (vbaCredentials as IVbaCredentials).spiderAgents;

            const vbaUsers = (vbaCredentials as IVbaCredentials).users.find(item => item.anneeScolaire === anscol1 && item.codeEtab === codeetab)
            const spiderSuperAdmins = vbaUsers.spiderSuperAdmins;

            const spiderUsers = vbaUsers.spiderUsers;
            let user: IUser;

            //rechercher user parmi les super admins
            console.log("🚀 ~ file: services.ts:46 ~ returnnewPromise ~ spiderSuperAdmins:", spiderSuperAdmins)
            user = spiderSuperAdmins.find(spiderUserItem => spiderUserItem.username.toLowerCase() === userLogin && spiderUserItem.password === userPassword)
            if (user) return resolve({ ...user, userType: "admin" });

            //rechercher user parmi les spider agents
            user = spiderAgents.find(spiderAgtItem => spiderAgtItem.username.toLowerCase() === userLogin && spiderAgtItem.password === userPassword)
            if (user) return resolve({ ...user, userType: "spiderAgent" });

            //rechercher user parmi les simple utilisateur
            user = spiderUsers.find(spiderUsItem => spiderUsItem.username.toLowerCase() === userLogin && spiderUsItem.password === userPassword)
            if (user) {
                console.log("🚀 ~ file: services.ts:42 ~ returnnewPromise ~ user:", user)
                //recupperer ses droits
                const userRights = await functions.getUserRights(user.username)
                return resolve({ ...user, userRights, userType: "user" });
            }
            reject({ name: "USER_NOT_FOUND", message: "Login ou mot de passe incorrect." });
        } catch (error) {
            console.log(":fusée: ~ file: services.ts:51 ~ returnnewPromise ~ error", error)
            reject(error);
        }
    });
};

export default {
    webclientlogin,
};
