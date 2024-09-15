export interface IAppState {
    hideSideBar: boolean;
    useDarkMode: boolean;
    lastStudentId: number;
    connectionInfos: IConnectionInfos | null;
    devices: IDevice[];
    paramEtab: IParamEtab;
    showPanel: boolean;
    sidebarCollapsed: boolean;
    dashboardStatus: IDashboardStatus;
    httpIn: boolean;
    httpOut: boolean | null;
    recentActivity: IRecentActivity[];
    allStatEtab: IAllStatEtab
}


export interface IAllStatEtab {
    statEtab: IStatEtab;
    studentPhotoCountInBD: number;
    studentPhotoCountInFolder: number;
}
export interface IStatEtab {
    series: any[];
    stat: IStat;
}

export interface IStat {
    effectifEleves: number;
    elevesAffectes: number;
    elevesNonAffectes: number;
    nbClasses: number;
    personnelAdmin: number;
    personnelEns: number;
}
export interface IStatConfig {
    key: string;
    value: boolean;
    libelle: string;
}
export interface IDataLogs {
    id: number;
    date: string;
    action: string;
    statut: number;
}

export interface IParamEtab {
    codeetab: string;
    nomcompletetab: string;
    anscol1: string;
}

export interface IDevice {
    socketID: string;
    deviceType: "Desktop" | "Phone" | "Tablet" | undefined;
    modelName: string | undefined;
    connectedAt: string;
    appID: string;
    appName: string;
    userPhone: string;
    userName: string;
    deviceName: string;
}

export interface IConnectionInfos {
    ip: string;
    port: number;
    socketID?: string;
    tunnel: string;
    tunnelStatus?: string;
    readonly serverUrl?: string;
}

export interface IServicePartenaire {
    idService: string;
    idPartenaire: string;
    libelle: string;
    description: string;
    neededKey: number;
    config: string;
    activated: number;
    initialized: number;
    sendData: number;
}

export interface IPartenaire {
    idPartenaire: string;
    libelle: string;
    services: IServicePartenaire[];
}

export interface IUser {
    username: string;
    password: string;
}

export interface IUsers {
    spiderAgents: IUser[];
    spiderUsers: IUser[];
}

export interface IServiceMessage {
    message: string;
    status: number;
}
export interface ListItemDonneesFocusEcole {
    id: string;
    libelle: string;
    section: string;
    checked: boolean;
}

export interface IUser {
    userId: string,
    userName: string,
    deviceName: string,
    modelName: string | undefined,
    deviceType: "Phone" | "Tablet" | undefined,
    status: boolean,
    createdAt: Date,
    createdBy: string
}

export interface IConfig {
    params: IParamPlageHorraire[] | [],
    users: IUser[]
}

export interface ISchoolControlActivitiesConfig {
    codeEtab: string,
    anneeScolaire: string,
    idActivite: string,
    activiteStatus: boolean,
    libelleActivite: string,
    config: IConfig
}

export interface IParamPlageHorraire {
    idPlage: number;
    heureDebut: string;
    heureFin: string;
}


export interface IDashboardStatus {
    globalApi: boolean;
    profExpert: boolean;
    focusEcole: boolean;
    warehouse: boolean;
    cinetpay: boolean;
    redis: number; // Correspond à
    msAccess: number;
    sqlite: number;
    serverStatus: boolean;
    onlineHddSerial: string;
    localHddSerial: string;
    currentPcHDDSerial: string;
    isInternetAvailable: boolean;
    sireneStatus: boolean;
    schoolControl: boolean;
    schoolControlConfig: ISchoolControlActivitiesConfig[];
    compteSms: ICompteSms;
    accessDbPath: string;
    cinetpayServer: boolean;
    priseDeVue: boolean;
    studentPhotoCount: number;
}

export interface ICompteSms {
    defaultAccount: ISmsAccount | null,
    compteAppelNumerique: ISmsAccount | null,
    compteSmsStatus: boolean
}

export interface ISmsAccount {
    codeEtab: string;
    providerId: number;
    login: string;
    password: string;
    sender: string;
    price: number;
    sendSmsAppel: number;
    id: number;
    libelle: string;
    creditSms: ICreditSms | null,
    defaultAccount: number;
    sendSmsAfterControl?: number;
}


export interface ICreditSms {
    amount: number;
    price: number;
    smsCount: number;
}

export interface IRecentActivity {
    id: number;
    userName: string;
    action: string;
    status: boolean;
    appName: string;
    dateTime: string;
}