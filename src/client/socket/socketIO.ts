import { io, Socket } from "socket.io-client";
import { API_URL } from "../helpers/apiClient";
import { addRecentActivity, setAllStatEtab, setConnectionInfos, setDashboardStatus, setDevices, setHttpIn, setHttpOut, setLastStudentId, setParamEtab, setRecentActivitiesList } from "../store/appSlice";
import { IAllStatEtab, IConnectionInfos, IDashboardStatus, IDevice, IRecentActivity } from "../store/interfaces";
import {
  updateListePresence
} from "../store/ListePresenceSlice";
import { updateListePhoto } from "../store/photoSlice";
import store from "../store/store";

const socketIO = {
  /**
   * Initialise le socket avec l'url récupérée dans le store
   * et l'ajoute dans la variable globale window
   * @param url   optional
   * @returns
   */
  initialize: () => {
    const url: string = API_URL;
    const socket: Socket = io(url, {
      transports: ["websocket"],
      query: { 
        modelName: "Asus-SAMLOBA-PC",
        type: "ServerFrontEnd",
      },
    });

    // à la connexion
    socket.on("connected", (cnxInfos: IConnectionInfos) => {
      console.log("🚀 ~ file: socketIO.ts ~ line 43 ~ socket.on ~ cnxInfos", cnxInfos)
      store.dispatch(setConnectionInfos({ ...cnxInfos }));
    });

    // redirection de la connexion de vba spider
    socket.on("new vba device", (data: any) => {
      socket.emit("redirect vba device", data.device);
    });

    // redirection de la deconnexion de vba spider
    socket.on("vba device logout", (data: any) => {
      socket.emit("redirect vba device logout", data);
    });


    //reçoit et met en store tous les devices connectés
    socket.on("devices changed", (devices: IDevice[]) => {
      store.dispatch(setDevices(devices));
    });




    // à la connexion au tunnel
    socket.on("tunnel url", (url: string) => {
      const cnxInfos = store.getState().application.connectionInfos
      store.dispatch(setConnectionInfos({ ...cnxInfos, tunnel: url }));
    });

    // à la connexion au tunnel
    socket.on("tunnel status", (status: string) => {
      const cnxInfos = store.getState().application.connectionInfos
      store.dispatch(setConnectionInfos({ ...cnxInfos, tunnelStatus: status }));
    });

    // interception des params etab
    socket.on("school params", (paramObj) => {
      store.dispatch(setParamEtab(paramObj));
    });


    // à la déconnexion
    socket.on("disconnect", () => {
      store.dispatch(setConnectionInfos(null));
    });

    // lorsqu'un utilisateur est modifié
    socket.on("users updated", (data: any) => {
      // const users = formatUser(data);
      // console.log("data...", data)
      // store.dispatch(setSouscriptionUtilisateurs(data));
    });

    // lors d'un nouveau pointage
    socket.on("new pointage", (data: any) => {
      store.dispatch(updateListePresence(data));
    });

    // lors de l'ajout d'une photo
    socket.on("new photo", (data: any) => {
      console.log("🚀 ~ file: socketIO.ts ~ line 76 ~ socket.on ~ data", data)
      store.dispatch(updateListePhoto(data));
    });

    socket.on("updateDashboard", (data: Partial<IDashboardStatus>) => {
      store.dispatch(setDashboardStatus(data));
    });

    socket.on("new student", (data: any) => {
      const studentId = data[0]._id;
      store.dispatch(setLastStudentId(studentId));
    });

    socket.on("httpIn", (data: boolean) => {
      store.dispatch(setHttpIn(data));
    });

    socket.on("httpOut", (data: boolean) => {
      store.dispatch(setHttpOut(data));
    });

    socket.on("recentActivitiesList", (data: IRecentActivity[]) => {
      store.dispatch(setRecentActivitiesList(data));
    });

    socket.on("addRecentActivity", (data: IRecentActivity) => {
      store.dispatch(addRecentActivity(data));
    });
    
    socket.on("allStatEtab", (data: IAllStatEtab) => {
      store.dispatch(setAllStatEtab(data));
      console.log("nnnnnnnnnnn", data)
    });
    
    socket.on("etab_credit_sms", (data: any) => {

      // store.dispatch(setAllStatEtab(data));
    });


            


    /* integration à la variable globale window */
    (window as any).socket = socket;
  },
};

export default socketIO;
