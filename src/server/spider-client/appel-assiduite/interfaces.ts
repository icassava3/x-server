export interface ISpiderPersonnelItem {
    idPersonnel: number;
    nomPersonnel: string;
    prenomPersonnel: string;
    fonction: string;
    matriculePersonnel: string;
    sexe: string;
    phone1: string;
    phone2: string;
    dateNaissance: string;
    lieuNaissance: string;
    idDiplome: string;
    residence: string;
    situationMatrimoniale: string;
    dateEmbauche: string;
    numeroCnps: number;
    corpsMetier: number;
    numeroWhatsApp: string;
    email: string;
}

export interface IUtilisateurItem {
    idUtilisateur: string;
    idTypeUtilisateur: number;
    idPersonnel: number;
    nomUtilisateur: string;
    motDePasse: string;
    motDePasseInitial: string;
    nomInvite: string;
    prenomInvite: string;
    contactInvite: string;
    sexeInvite: string;
    statusUtilisateur: number,
    dateExpiration: string | Date
}

export interface IPontageEleve {
    idEleve: number;
    codeEtab: string;
    anneeScolaire: string;
    datePointage?: string;
}


export interface IAppelItem {
    statusAssiduite: number;
    anneeScolaire: string;
    codeEtab: string;
    idEleve: number;
    idSeance: number;
    dateAppel: string;
    plageHoraire: string;
    libelleMatiereCourt: string;
    libelleMatiereLong: string;
    status: string;
    dateSaisie: string;
    operateurSaisie: string;
    dateModif: string;
    operateurModif: string;
    recup: number;
    device: string;
    idClasse: number;
    idPersonnel: number;
    motif?: any;
    justifie?: any;
    fcm_messageId?: any;
    fcm_send_status?: any;
    fcm_date_lecture?: any;
    sms_messageId?: any;
    sms_send_status?: any;
    idMatiere: number;
    libelleClasseCourt: string;
    libelleClasseLong: string;
    idTypeClasse: number;
    ordreClasse: number;
    nomPersonnel: string;
    idSousMatiere?: any;
    libelleSousMatiereCourt?: any;
    libelleSousMatiereLong?: any;
}

export interface assiduiteEleveItem {
    anneeScolaire: string;
    codeEtab: string;
    idEleve: number;
    idSeance: number;
    dateAppel: string;
    plageHoraire: string;
    libelleMatiereCourt: string;
    libelleMatiereLong: string;
    status: number;
    dateSaisie: string;
    operateurSaisie: string;
    dateModif: string;
    operateurModif: string;
    recup: number;
    device: string;
    idClasse: number;
    idPersonnel: number;
    motif?: any;
    justifie?: any;
    fcm_messageId?: any;
    fcm_send_status?: any;
    fcm_date_lecture?: any;
    sms_messageId?: any;
    sms_send_status?: any;
    libelleClasseLong: string;
    libelleClasseCourt: string;
    nomEleve: string;
    prenomEleve: string;
    sexe: string;
}


export interface IAppelsFilterPayload {
    libelleClasse?: string;
    libelleMatiere?: string;
    seance?: string;
    professeur?: string;
    dateDebut?: string;
    dateFin?: string;
}


export interface IJustifierAssiduitePayload {
    idEleve: number;
    dateAppel: string;
    idSeance: string;
    motif: string
}

export interface IAppelNoneFormatedItem {
    anneeScolaire: string;
    codeEtab: string;
    idSeance: number;
    dateAppel: string;
    idClasse: number;
    idPersonnel: number;
    plageHoraire: string;
    libelleMatiereCourt: string;
    libelleMatiereLong: string;
    dateSaisie: string;
    operateurSaisie: string;
    device: string;
    recup: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    libelleClasseLong: string;
    libelleClasseCourt: string;
}

export interface IAssiduiteNoneFormatedItem {
    anneeScolaire: string;
    codeEtab: string;
    idEleve: number;
    idSeance: number;
    dateAppel: string;
    plageHoraire: string;
    libelleMatiereCourt: string;
    libelleMatiereLong: string;
    status: number;
    dateSaisie: string;
    operateurSaisie: string;
    dateModif: string;
    operateurModif: string;
    recup: number;
    device: string;
    idClasse: number;
    idPersonnel: number;
    motif?: any;
    justifie?: any;
    fcm_messageId?: any;
    fcm_send_status?: any;
    fcm_date_lecture?: any;
    sms_messageId: string;
    sms_send_status: number;
}

export interface classesAbsences {
    libelleClasseCourt: string;
    libelleClasseLong: string;
    idClasse: number;
    nombreAbsences: number;
}

export interface absencesRetardsJustifications {
    nombresAbsences: number;
    nombresRetards: number;
    nombresJustifications: number;

}

export interface IEleveClasse {
    idEleve: number;
    nomEleve: string;
    prenomEleve: string;
    matriculeEleve: string;
    libelleClasseCourt: string;
    libelleClasseLong: string;
    nombreAbsence?: number;
    
}

export interface matieresAbsences {
    libelleMatiereCourt: string;
    libelleMatiereLong: number;
    nombreAbsentDansLaMatiere: number;
}

export interface sms {
    smsEnvoyes: number;
    smsNonEnvoyes: number;
}

export interface IProfAffecteClassse {
    idClasse: number;
    idPersonnel: number;
    idMatiere: number;
}

export interface ISpiderPlanning {
    anneeScolaire?: string;
    codeEtab?: string;
    idClasse: number;
    idHoraire: number;
    idMatiere: number;
    idPersonnel: number;
    idSeance: number;
    libelleClasseCourt: string;
    libelleHoraire: string;
    libelleMatiereCourt: string;
    libelleMatiereLong: string;
    nomPersonnel: string;
    plageHoraire: string;
    prenomPersonnel: string;
    sexe: string | null;
    idSalle: number | null;
    libelleSalle: string | null;
}