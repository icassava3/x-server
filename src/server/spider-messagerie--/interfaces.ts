export interface IPayloadNewSmsAccount {
    providerId: number;
    login: string;
    password: string;
    sender: string;
    price: number;
    sendSmsAppel: number;
    sendSmsAfterControl: number;
    // schoolControlSmsAccount: number;
}

export interface ISmsProvider {
    providerId: number;
    login: string;
    password: string;
    sender: string;
    price: number;
    sendSmsAppel: number;
}

export interface ITblSmsSpider {
    RefMsg: number;
    RefElève: number;
    DateCreationMsg: string;
    NumTel: string;
    Expediteur: string | null;
    LibMsg: string;
    MsgSend: boolean
    DateEnvoi: string;
    CodeOp: string | null,
    SelectMsg: boolean,
    MsgPriority: number;
    MsgLocked: boolean
    TransactionID: string | null,
    TypeSMS: number;
};

export interface ISmsSpider {
    anneeScolaire: string;
    codeEtab: string;
    providerId: string;
    idMessage: number;
    idEleve: number;
    dateCreationMessage: string;
    numeroTelephone: string;
    expediteur: string;
    libelleMessage: string;
    messageSend: boolean;
    dateEnvoi: string;
    codeOp: null;
    selectMessage: boolean;
    messagePriority: number;
    messageLocked: boolean;
    transactionId: null;
    typeSms: number;
}



export interface ISmsAccount {
    codeEtab: string;
    providerId: number;
    login: string;
    password: string;
    sender: string;
}

export interface IParentContact {
    anneeScolaire?: string;
    codeEtab?: string;
    numeroCellulaire: string;
    idEleve: number;
    filiation: string;
    nomPrenomParent?: string;
    professionParent?: string;
    residenceParent?: string;
    emailParent?: string;
}

export interface IPayloadMessageGroupe {
    targetAppId: string; // sms, notification, email
    idEleves: number[];
    messageTitle: string;
    messageContent: string;
    sendNow: boolean;
    alertLevel: "Info" | "Success" | "Warning" | "Danger";
}

export interface IEtabElevesSelected {

    idEleve: number;
    idClasse: number;
    nomPrenomEleve: string;
    matriculeEleve: string;
    sexe: number;
    noteEval?: any;
    dateSaisie: string;
    dateModif: string;
    periodeEval: number;
    evaluation: string;
    evaluations: string[];
    numEval: number;
    coefEval: number;
    dateCompo: string;
    typeEval: string;
    libelleMatiereCourt: string;
    libelleMatiereLong: string;
    MatLong: string;
    OrdreClasse: number;
    libelleClasseCourt: string;
    ClasseLong: string;
    nomPrenomTuteur: string;
    cellulaireTuteur: string;
    checked: boolean;
    MOYG?: number;
    MOYG2?: number;
    MOYG3?: number;
    MOYG4?: number;
    RangG?: string;
    idTypeClasse?: number;
    MOYGRangG?: string;
    MOYG2RangG2?: string;
    MOYG3RangG3?: string;
    MOYG4RangG4?: string;
    dfa: string;
    decision?: string;
    nomPrenomCandidat?: string;
    nomExam?: string;
    pointCommun?: number;
    libelle?: string;
    compositions?: string[];
    moyenne?: string;
    rang?: string;
}
export interface IPayloadEnvoyerSmsResultatScolaire {
    sendNow: boolean;
    providerId: number;
    smsDestinataireKey: string;
    etabElevesSelected: IEtabElevesSelected[];
    typesResultatsSelectedId: string;
    dateDebut?: string;
    dateFin?: string;
    periodeSelectionne?: number;
    footerMessage?: string;
}



export interface ISendBoxMessages {
    anneeScolaire: string;
    codeEtab: string;
    messageId: number;
    studentId: number;
    targetAppId: string;
    phone: string;
    messageTitle: string;
    messageContent: string;
    alertLevel: string;
    messageSent: number;
    messageLocked: number;
    transactionId: null;
    fcmMessageId: null;
    sentAt: null;
    createdAt: number;
}


export interface IMessageFocusServer {
    anneeScolaire: string;
    codeEtab: string;
    sessionId: string;
    messageId: number;
    studentId: number;
    sender: string;
    phone: string;
    messageTitle: string;
    messageContent: string;
    alertLevel: string;
    favori: number;
    deleted: number;
    fcmMessageId: null;
    readAt: null;
    sentAt: string;
    sendBoxCreatedAt: string;
}

export interface ISendBoxSms {
    anneeScolaire: string;
    codeEtab: string;
    smsId: number;
    sessionId: number;
    idPersonne?: string;
    smsDestinataireKey: string;
    providerId: string;
    transactionId: string;
    phone: string;
    smsContent: string;
    smsLocked: number;
    smsArchived: number;
    smsDeleted: number;
    sentAt: string;
    createdAt?: null;
    sendBoxCreatedAt?: null;
}

export interface IMessageSmsServer {
    anneeScolaire: string;
    codeEtab: string;
    smsId: number;
    sessionId: number;
    studentId: string;
    providerId: string;
    transactionId: string;
    sms_messageId: null;
    phone: string;
    smsContent: number;
    sentAt: string;
    sendBoxCreatedAt: null;
}

export interface IPayloadEnvoyerMessagesAssiduite {
    idEleves: number[];
    sendNow: boolean;
    seance: {
        dateDebut: string;
        dateFin: string;
    };
}

export interface IPayloadEnvoyerNotificationResultatsScolaires {
    sendNow: boolean;
    // notifTitle: string;
    etabElevesSelected: IEtabElevesSelected[];
    typesResultatsSelectedId: string;
    dateDebut?: string;
    dateFin?: string;
    periodeSelectionne?: number;
    footerMessage?: string;
}

export interface IPayloadEnvoyerSmsAssiduite {
    providerId: number;
    idEleves: number[];
    sendNow: boolean;
    seance: {
        dateDebut: string;
        dateFin: string;
    };
    smsDestinataireKey: string
}


export interface IAssiduite {
    anneeScolaire: string;
    codeEtab: string;
    idEleve: number;
    idSeance: number;
    dateAppel: string;
    plageHoraire: string;
    libelleMatiereCourt: string;
    libelleMatiereLong: string;
    status: number; //0=present 1=absent 2=retard
    dateSaisie: string | null;
    operateurSaisie: string | null;
    dateModif: string;
    operateurModif: string | null;
    recup: number;
    device: string;
    idClasse: number;
    idPersonnel: number;
    motif: string;
    justifie: number;
    fcm_messageId: string;
    fcm_send_status: number;
    fcm_date_lecture: Date | string
    sms_messageId: string;
    sms_send_status: number,
    createdAt?: string;
    updatedAt?: string;
}

export interface IEleveWithClasseItem {
    idEleve: number;
    matricule: string;
    nomEleve: string;
    prenomEleve: string;
    libelleClasseCourt: string;
    libelleClasseLong: string;
}

export interface IPointAssiduitesEleves {
    idEleve: number;
    absence: number;
    retard: number;
    justifie: number;
    nonJustifie: number;
}

export interface IParentContact {
    anneeScolaire?: string;
    codeEtab?: string;
    numeroCellulaire: string;
    idEleve: number;
    filiation: string;
    nomPrenomParent?: string;
    professionParent?: string;
    residenceParent?: string;
    emailParent?: string;
    matriculeEleve?: string;
    cellulaireTuteur?: string;
}

export interface IPayloadInsererSmsBoiteEnvoi {
    providerId: number;
    idPersonnes: number[];
    smsContent: string;
    sendNow: boolean;
    smsDestinataireKey: string
}

export interface IPayloadVbaSmsToSendBox {
    phone: string[];
    smsContent: string;
}

// export interface ICompteSms {
//     codeEtab: string;
//     providerId: number;
//     login: string;
//     password: string;
//     sender: string;
//     price: number;
//     sendSmsAppel: number;
//     defaultAccount: number;
//     id: number;
//     libelle: string;
//   }


export interface IFournisseur {
    idFournisseur: string;
    nomPrenomFournisseur: string;
    fonctionFournisseur: string;
    cellulaireFournisseur: string;
}


export interface IMembrePersonnel {
    anneeScolaire: string;
    codeEtab: string;
    whatsApp: string;
    email: string;
    idPersonne: number;
    idPersonnel: number;
    nomPrenomPersonnel: string;
    fonction: string;
    matriculePersonnel?: any;
    sexe: string;
    phone1: string;
    phone2: string;
    dateNaissance: string;
    lieuNaissance: string;
    libelleDiplome: string;
    residence?: any;
    situationMatrimoniale: string;
    dateEmbauche: string;
    numeroCnps?: any;
    nombreEnfant?: any;
    corpsMetier: number;
}

export interface IMatiere {
    idMatiere: number;
    libelleMatiereCourt: string;
    libelleMatiereLong: string;
}

export interface IEleveMoyenne {
    idEleve: number;
    CF: number;
    OG: number;
    EO: number;
    FR: number;
    PHILO?: any;
    HG: number;
    AN: number;
    LV2?: any;
    MATH: number;
    SP: number;
    SVT: number;
    EPS: number;
    APMUS: number;
    ECM: number;
    COND: number;
    MOYG: number;
    MOYG2?: any;
    MOYG3?: any;
    MOYG4?: any;
    MCA?: any;
    MCB: number;
    Info: number;
    TM: number;
    MCC: number;
    MCD: number;
    RangCF: string;
    RangOG: string;
    RangEO: string;
    RangFR: string;
    RangPHILO?: any;
    RangHG: string;
    RangAN: string;
    RangLV2?: any;
    RangMATH: string;
    RangSP: string;
    RangSVT: string;
    RangEPS: string;
    RangAPMUS: string;
    RangECM: string;
    RangMCA?: any;
    RangMCB: string;
    RangInfo: string;
    RangMCC: string;
    RangMCD: string;
    RangG: string;
    nomEleve: string;
    prenomEleve: string;
    nomPrenomEleve: string;
    matriculeEleve: string;
    libelleClasseCourt: string;
    libelleClasseLong: string;
    cellulaireTuteur: string;
    serie?: any;
    idNiveau: number;
    libelleOrdreEnseignement: string;
    libelleNiveauCourt: string;
    libelleNiveauParSerie: string;
}


export interface IPayloadMoyenne {
    compoId: string;
    idClasse?: number;
    idNiveau?: number;
}