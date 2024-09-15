
export interface IDevice {
    appID: string;
    appName?: string;
    userPhone?: string;
    userName?: string;
    modelName?: string;
    deviceName?: string;
    deviceType?: string;
    socketID?: string;
    connectedAt?: string;
}

export interface IUser {
    typeUtilisateur: string;
    idUtilisateur: string;
    nom: string;
    prenom: string;
    nomUtilisateur: string;
    motDePasseInitial: string;
    statusUtilisateur: number;
    dateExpiration: string;
}