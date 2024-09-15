import { IAppState, IConnectionInfos, IStatConfig, ListItemDonneesFocusEcole } from "./interfaces";

const dataConfig: IStatConfig[] = [
    {
        key: "maskStatGeneral",
        libelle: "Masquer les statistiques générales",
        value: false,
    },
    {
        key: "maskStatPriseDeVue",
        libelle: "Masquer les statistiques de prises de vues",
        value: false,
    },
    {
        key: "maskStatControlScolarite",
        libelle: "Masquer les statistiques de contrôle de scolarité",
        value: false,
    },
];

const dataOngletConfig: IStatConfig[] = [
    {
        key: "maskTabDashbord",
        libelle: "Tableau de bord",
        value: true,
    },
    {
        key: "maskTabJournal",
        libelle: "Journal",
        value: false,
    },
    {
        key: "maskTabControleAcces",
        libelle: "Contrôle d'accès",
        value: false,
    },

    {
        key: "maskTabControleScolarite",
        libelle: "Contrôle scolarité",
        value: false,
    },
    {
        key: "maskTabPrisesDeVues",
        libelle: "Prises de vues",
        value: false,
    },
];

export const initialCnxInfos: IConnectionInfos = {
    ip: "",
    port: 0,
    tunnel: "",
    socketID: "",
    tunnelStatus: "",
};

export const data: ListItemDonneesFocusEcole[] = [
    { id: '1', libelle: "Paramètres de l'établissement", section: "parametab", checked: false },
    { id: '2', libelle: "Classes", section: "classe", checked: false },
    { id: '4', libelle: "Elèves", section: "eleve", checked: false },
    { id: '5', libelle: "Matières", section: "matiere", checked: false },
    { id: '6', libelle: "Répartition de professeurs par classe", section: "classematiereprof", checked: false },
    { id: '7', libelle: "Emplois du temps", section: "plagehoraire horaire seance", checked: false },
    { id: '8', libelle: "Evaluations", section: "evalprog evalnote", checked: false },
    { id: '9', libelle: "Rubriques", section: "rubrique", checked: false },
    { id: '10', libelle: "Echéancier des frais scolaires", section: "echindividuel echobligatoireglobal echoptionnelglobal souscriptionfraisoptionel", checked: false },
    { id: '11', libelle: "Paiement des frais scolaires", section: "versement", checked: false },
    { id: '12', libelle: "Personnel", section: "personnel", checked: false },
]

export const initialState: IAppState = {
    sidebarCollapsed: false,
    useDarkMode: false,
    hideSideBar: false,
    allStatEtab: {
        statEtab: {
            series: [0, 0, 0, 0, 0],
            stat: {
                effectifEleves: 0,
                elevesAffectes: 0,
                elevesNonAffectes: 0,
                nbClasses: 0,
                personnelAdmin: 0,
                personnelEns: 0,
            }
        },
        studentPhotoCountInBD: 0,
        studentPhotoCountInFolder: 0
    },
    connectionInfos: initialCnxInfos,
    devices: [],
    lastStudentId: 0,
    httpIn: false,
    httpOut: null,
    paramEtab: {
        codeetab: "",
        nomcompletetab: "",
        anscol1: ""
    },
    showPanel: false,
    recentActivity: [],
    dashboardStatus: {
        globalApi: false,
        warehouse: false,
        profExpert: false,
        focusEcole: false,
        cinetpay: false,
        redis: 0,
        msAccess: 0,
        sqlite: 0,
        serverStatus: false,
        onlineHddSerial: "",
        localHddSerial: "",
        currentPcHDDSerial: "",
        isInternetAvailable: false,
        sireneStatus: false,
        schoolControl: false,
        schoolControlConfig: [],
        accessDbPath: "",
        cinetpayServer: false,
        priseDeVue: false,
        studentPhotoCount: 0,
        compteSms: {
            defaultAccount: {
                codeEtab: "",
                providerId: 0,
                login: "",
                password: "",
                sender: "",
                price: 0,
                sendSmsAppel: 0,
                id: 0,
                libelle: "",
                defaultAccount: 0,
                creditSms: {
                    amount: 0,
                    price: 0,
                    smsCount: 0
                }
            },
            compteAppelNumerique: {
                codeEtab: "",
                providerId: 0,
                login: "",
                password: "",
                sender: "",
                price: 0,
                sendSmsAppel: 0,
                id: 0,
                libelle: "",
                defaultAccount: 0,
                creditSms: {
                    amount: 0,
                    price: 0,
                    smsCount: 0
                }
            },
            compteSmsStatus: false,

        }
    }

}