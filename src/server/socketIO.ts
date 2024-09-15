import { Socket } from "socket.io";
// import { IDevice } from "../client/store/appSlice";
import { paramEtabObjet } from "./databases/accessDB";
import servicesSchoolControl, { sendSchoolControlSms } from "./spider-school-control/services";
import { handshakeQueryValidate } from "./vba-client/validators";
import { redisClient } from "./databases/redis";
import Logger from "./helpers/logger";
import { getDashboardStatus } from "./dashboardStatus";
import { IDevice } from "../client/store/interfaces";
import { IControleDecisionAccepte, IControleFraisScolairePayload, IPointagePayload } from "./spider-school-control/interfaces";


// array des devices et postes clients connectés
const devices: IDevice[] = [];

/**
 * Actualise la liste des utilisateurs connectées à x-server.
 * @param myNewDevice 
 */
const addDevice = async (myNewDevice: IDevice) => {
    try {
        const index = devices.findIndex(
            (item: any) =>
                item.appID === myNewDevice.appID &&
                item.deviceName === myNewDevice.deviceName &&
                item.appName === myNewDevice.appName
        );

        if (index === -1) {
            devices.push(myNewDevice);
        } else {
            devices.splice(index, 1, myNewDevice);
        }
    } catch (error) {
        console.log("🚀 ~ file: socketIO.ts:26 ~ addDevice ~ error", error);
    }
};


export const initializeSocket = (io, cnxInfos): Promise<boolean> => {
    return new Promise<boolean>(async (resolve, reject) => {
        try {
            io.on("connection", async (socket: Socket) => {
                /**
                 * Toutes les applications qui vont se connecter au serveur
                 * doivent fournir un objet contenant des informations sur
                 * le device, l'application, l'utilisateur... lors de  l'initialisation
                 * de leur socket.io-client.
                 * Ces informations sont récupérée ici avec socket.handshake.query
                 */

                //le socket provient de x-server client (interface graphique de x-server)
                if (socket.handshake.query.type && socket.handshake.query.type === 'ServerFrontEnd') {
                    // redisClient.get("tunnelUrl", (err, reply) => {
                    //     if (err) console.log("tunnelUrl socket error", err)
                    //     io.emit("tunnel url", reply || 'non configuré');
                    //     io.emit("updateDashboard", { redis: 1 });
                    // });
                    getDashboardStatus(io)
                    globalThis.serverFrontEndSocketId = socket.id
                    // io.to(globalThis.serverFrontEndSocketId).emit("updateDashboard", 
                    // {

                    // });


                    paramEtabObjet(["CodeEtab", "NomCompletEtab", "Anscol1"])
                        .then(paramObj => io.to(socket.id).emit("school params", paramObj))

                } else if (socket.handshake.query.type && socket.handshake.query.type === 'webClient') { // cas des clients web
                    socket.join("dashboard");

                } else { // autres applications à afficher sur le gui de x-server
                    if (!handshakeQueryValidate(socket.handshake.query)) {
                        socket.disconnect()
                        return
                    }

                    const myNewDevice: any = {
                        socketID: socket.id,
                        appID: socket.handshake.query.appID,
                        appName: socket.handshake.query.appName,
                        userPhone: socket.handshake.query.userPhone,
                        userName: socket.handshake.query.userName,
                        modelName: socket.handshake.query.modelName,
                        deviceName: socket.handshake.query.deviceName,
                        deviceType: socket.handshake.query.deviceType,
                        connectedAt: new Date().toISOString(),
                    }
                    addDevice(myNewDevice)
                        .then(() => {
                            // envoi un signal au gui de x-server
                            io.to(globalThis.serverFrontEndSocketId).emit("devices changed", devices);
                        })
                }
                const socketCnxInfos = {
                    ...cnxInfos,
                    socketID: socket.id,
                };

                io.to(socket.id).emit("connected", socketCnxInfos);

                socket.on("redirect vba device", (data: any) => {
                    if (!handshakeQueryValidate(data)) return
                    const myNewDevice: IDevice = {
                        socketID: socket.id,
                        ...data,
                        connectedAt: new Date().toISOString(),
                    }
                    addDevice(myNewDevice)
                        .then(() => {
                            // envoi un signal au gui de x-server
                            io.to(globalThis.serverFrontEndSocketId).emit("devices changed", devices);
                        })
                });

                socket.on('redirect vba device logout', (data: IDevice) => {
                    const index = devices.findIndex(
                        (item: any) =>
                            (item.appID === data.appID) &&
                            (item.deviceName === data.deviceName) &&
                            (item.appName === data.appName));
                    if (index > -1) devices.splice(index, 1);
                    io.to(globalThis.serverFrontEndSocketId).emit("devices changed", devices);
                })


                /** DEBUT SOCKET SCHOOL CONTROL */
                /**
                 * C'est un ecouteur qui permet de recuperer les informations de l'élève et de l'ajouter dans la base de données
                 */
                socket.on('inserer_pointage', (data: IPointagePayload) => {
                    servicesSchoolControl.effectuerPointage(data)
                        .then(result => {
                            // console.log("🚀 ~ file: socketIO.ts ~ line 96 ~ socket.on ~ result", result)
                            const data = { ...result, idEleve: result.idPersonne }
                            io.to(socket.id).emit('resultat_pointage', { status: 1, data })
                            io.emit('webclient_resultat_pointage', { status: 1, data });

                            // io.to("dashboard").emit('resultat_pointage', { status: 1, data: result })
                        }).catch(error => {
                            // console.log("🚀 ~ file: socketIO.ts:129 ~ socket.on ~ error", error)
                            io.to(socket.id).emit('resultat_pointage', { status: 0, error });
                            io.emit('webclient_resultat_pointage', { status: 0, error });
                        })
                })

                //effectuer un controle de frais scolaire pour un eleve
                socket.on('effectuer_controle', (data: IControleFraisScolairePayload) => {
                    servicesSchoolControl.controleFraisScolaire(data)
                        .then(result => {
                            const data = { ...result, idEleve: result.idPersonne }
                            io.to(socket.id).emit('resultat_controle', { status: 1, data });
                            io.emit('webclient_resultat_controle', { status: 1, data });
                            // sendSchoolControlSms(typeSmsId, data?.idPersonne)
                            //     .then(res => {
                            //         console.log("🚀 ~ file: socketIO.ts:180 ~ socket.on ~ res:", res)
                            //     }).catch(error => {
                            //         console.log("🚀 ~ file: socketIO.ts:172 ~ socket.on ~ error:", error)
                            //     })
                        }).catch(error => {
                            io.to(socket.id).emit('resultat_controle', { status: 0, error })
                            io.emit('webclient_resultat_controle', { status: 0, error })
                        })
                })
                // data idControle: number, decision: number, idPersonne: number, telephoneTuteur: string, nomPrenomEleve: string, resteAPayer: number, idActivite: string
                //autoriser un eleve apres controle
                socket.on('controle_decision', (data: IControleDecisionAccepte) => {
                    // decision: 1 --> accepté ; 0 --> refusé
                    const { idControle, decision, idPersonne, telephoneTuteur, nomPrenomEleve, resteAPayer, idActivite } = data
                    servicesSchoolControl.controleDecision(idControle, decision)
                        .then(result => {
                            io.to(socket.id).emit('resultat_controle_decision', { status: 1, data: true })
                            io.emit('webclient_resultat_controle_decision', { status: 1, data: { idControle: result, decision } })
                            sendSchoolControlSms(decision, idPersonne, telephoneTuteur, nomPrenomEleve, resteAPayer, idActivite, idControle)
                                .then(res => {
                                    console.log("🚀 ~ file: socketIO.ts:180 ~ socket.on ~ res:", res)
                                    io.emit("sendSchoolControlSms", { ...res, accepte: decision })
                                }).catch(error => {
                                    console.log("🚀 ~ file: socketIO.ts:172 ~ socket.on ~ error:", error)
                                })
                        }).catch(error => {
                            console.log("🚀 ~ file: socketIO.ts:171 ~ socket.on ~ error:", error)
                            io.to(socket.id).emit('resultat_controle_decision_accepte', { status: 0, error })
                            io.emit('webclient_resultat_controle_decision_accepte', { status: 0, error })
                        })
                })



                /** FIN SOCKET SCHOOL CONTROL */



                socket.on('disconnect', () => {
                    console.log("SOCKET DISONNCET+++")
                    const index = devices.findIndex((item: IDevice) => item.socketID === socket.id);
                    if (index > -1) devices.splice(index, 1);

                    // màj front-end
                    io.to(globalThis.serverFrontEndSocketId).emit('devices changed', devices)

                    // pour l'application spider-client
                    const msg = `l'utilisateur ${socket.id} s'est deconnecté`;
                    io.emit("user disconnected", msg);
                })
            });

            resolve(true);
        } catch (error) {
            Logger.error("🚀 ~ file: socketIO.ts:163 ~ returnnewPromise<boolean> ~ error:", error)
            reject(error)
        }
    });
};






// module.exports = (io, cnxInfos) => {
//     console.log('Initialisation du socket')

//     io.on("connection", async (socket: Socket) => {
//         /**
//          * Toutes les applications qui vont se connecter au serveur
//          * doivent fournir un objet contenant des informations sur
//          * le device, l'application, l'utilisateur... lors de  l'initialisation
//          * de leur socket.io-client.
//          * Ces informations sont récupérée ici avec socket.handshake.query
//          */

//         //le socket provient de x-server client (interface graphique de x-server)
//         if (socket.handshake.query.type && socket.handshake.query.type === 'ServerFrontEnd') {

//             globalThis.serverFrontEndSocketId = socket.id
//             paramEtabObjet(["CodeEtab", "NomCompletEtab", "Anscol1"])
//                 .then(paramObj => io.to(globalThis.serverFrontEndSocketId).emit("school params", paramObj))

//         } else if (socket.handshake.query.type && socket.handshake.query.type === 'webClient') { // cas des clients web
//             socket.join("dashboard");

//         } else { // autres applications à afficher sur le gui de x-server
//             if (!handshakeQueryValidate(socket.handshake.query)) {
//                 socket.disconnect()
//                 return
//             }

//             const myNewDevice: any = {
//                 socketID: socket.id,
//                 appID: socket.handshake.query.appID,
//                 appName: socket.handshake.query.appName,
//                 userPhone: socket.handshake.query.userPhone,
//                 userName: socket.handshake.query.userName,
//                 modelName: socket.handshake.query.modelName,
//                 deviceName: socket.handshake.query.deviceName,
//                 deviceType: socket.handshake.query.deviceType,
//                 connectedAt: new Date().toISOString(),
//             }

//             addDevice(myNewDevice)
//                 .then(() => {
//                     // envoi un signal au gui de x-server
//                     io.to(globalThis.serverFrontEndSocketId).emit("devices changed", devices);
//                 })
//         }
//         const socketCnxInfos = {
//             ...cnxInfos,
//             socketID: socket.id,
//         };

//         io.to(socket.id).emit("connected", socketCnxInfos);

//         socket.on("redirect vba device", (data: any) => {
//             if (!handshakeQueryValidate(data)) return

//             const myNewDevice: IDevice = {
//                 socketID: socket.id,
//                 ...data,
//                 connectedAt: new Date().toISOString(),
//             }
//             addDevice(myNewDevice)
//                 .then(() => {
//                     // envoi un signal au gui de x-server
//                     io.to(globalThis.serverFrontEndSocketId).emit("devices changed", devices);
//                 })
//         });

//         socket.on('redirect vba device logout', (data: IDevice) => {
//             const index = devices.findIndex(
//                 (item: any) =>
//                     (item.appID === data.appID) &&
//                     (item.deviceName === data.deviceName) &&
//                     (item.appName === data.appName));
//             if (index > -1) devices.splice(index, 1);
//             io.to(globalThis.serverFrontEndSocketId).emit("devices changed", devices);
//         })


//         /** DEBUT SOCKET SCHOOL CONTROL */
//         /**
//          * C'est un ecouteur qui permet de recuperer les informations de l'élève et de l'ajouter dans la base de données
//          */
//         socket.on('inserer_pointage', (data: any) => {
//             servicesSchoolControl.pointageEleve(data)
//                 .then(result => {
//                     console.log("🚀 ~ file: socketIO.ts:127 ~ socket.on ~ result", result)
//                     // console.log("🚀 ~ file: socketIO.ts ~ line 96 ~ socket.on ~ result", result)
//                     io.to(socket.id).emit('resultat_pointage', { status: 1, data: result })
//                     io.to("dashboard").emit('resultat_pointage', { status: 1, data: result })
//                 }).catch(error => {
//                     // console.log("🚀 ~ file: socketIO.ts:129 ~ socket.on ~ error", error)
//                     io.to(socket.id).emit('resultat_pointage', { status: 0, error })
//                 })
//         })

//         socket.on('controle_scolarite', (data: any) => {
//             servicesSchoolControl.controleFraisScolaire(data)
//                 .then(result => {
//                     io.to(socket.id).emit('resultat_controle_scolarite', { status: 1, data: result })
//                 }).catch(error => {
//                     io.to(socket.id).emit('resultat_controle_scolarite', { status: 0, error })
//                 })
//         })

//         /** FIN SOCKET SCHOOL CONTROL */



//         socket.on('disconnect', () => {
//             console.log("SOCKET DISONNCET+++")
//             const index = devices.findIndex((item: IDevice) => item.socketID === socket.id);
//             if (index > -1) devices.splice(index, 1);

//             // màj front-end
//             io.to(globalThis.serverFrontEndSocketId).emit('devices changed', devices)

//             // pour l'application spider-client
//             const msg = `l'utilisateur ${socket.id} s'est deconnecté`;
//             io.emit("user disconnected", msg);
//         })
//     });
// }