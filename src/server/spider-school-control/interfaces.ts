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
    statusUtilisateur: number;
    dateExpiration: string | Date
}



export interface IPointage {
    idPointageEleve: number;
    idActivite: string;
    idPersonne: number;
    codeEtab: string;
    anneeScolaire: string;
    datePointage?: string;
    createdatetime?: string;
    updatedatetime?: string;
}
export interface IEleveItem {
    idEleve: number;
    idClasse: number;
    matricule: string;
    nomEleve: string;
    prenomEleve: string;
    prenoms: string;
    statutEleve: string;
    sexe: string;
    niveau: string;
    idclasse: string;
    numeroExtrait: string;
    dateEnregExtrait: string;
    dateNaissance: string;
    lieuNaissance: string;
    mobile: string;
    lv2: string;
    arts: string;
    nationalite: string;
    residenceEleve: string;
    emailEleve: string;
    inscrit: number;
    dateInscrit: Date | string;
    etabOrigine: string;
    redoublant: number;
    transfert: number;
    numeroTransfert: string;
    decisionAffectation: string;
}
export interface IClasseItem {
    idClasse: number;
    libelleClasseCourt: string;
    libelleClasseLong: string
    idTypeClasse: number
}
export interface IEleveClasse {
    idEleve: number;
    nomEleve: string;
    prenomEleve: string;
    matriculeEleve: string;
    libelleClasseCourt: string;
    libelleClasseLong: string;
    idPersonne?: number;
    genre: number
}
export interface IPersonnelFonction {
    idPersonnel: number;
    fonction: string;
    prenomPersonnel: string;
    nomPersonnel: string;
}
export interface IUser {
    username: string;
    password: string;
    userType?: string;
    userRights?: string[];
}
export interface IActivite {
    idActivite: string;
    libelleActivite: string
    descriptionActivite: string
    idTypeActiviteSchoolControl: number;
    iconActivite: string;
}

export interface IPointagePayload {
    idPersonne: number;
    idActivite: string;
    codeEtab: string;
    operateur: string;
    anneeScolaire: string;
    idPlage?: number;
    sensAcces?: boolean
}

export interface IHistoriquePointagePayload {
    idActivite: string;
    datePointage: string | null;
    codeEtab: string;
    anneeScolaire: string;
}

// export interface IControleFraisScolaire {
// 	rubrique: string;
// 	netAPayer: number;
// 	dejaPaye: number;
// 	resteAPayer: number;
// }


export interface IItemStudentDataFraisScolaire {
    idEleve: number;
    idRubrique: string;
    libelleRubrique: string;
    optionnel: boolean;
    netAPayer: number;
    dejaPaye: number;
    resteAPayer: number;
    genre: number;
    nomEleve: string;
    prenomEleve: string;
    matriculeEleve: string;
    libelleClasseCourt: string;
    libelleClasseLong: string;
    idControle?: number;
    libelleGroupeOptionnel: string;
    idGroupeOptionnel: number;
    datelimite: string;
    description: string;
}


export interface IPointageConfig {
    idActivite: string;
    config: IParamPlageHorraire
}

export interface IParamPlageHorraire {
    idPlage: number;
    heureDebut: string;
    heureFin: string;
}
export interface IConfig {
    params: IParamPlageHorraire[] | [];
    users: IUser[]
}


export interface IUser {
    userId: string;
    userName: string;
    deviceName: string;
    modelName: string | undefined;
    deviceType: "Phone" | "Tablet" | undefined;
    createdAt: Date;
    createdBy: string;
    status: boolean;
}

export interface ISchoolControlActivitiesConfig {
    codeEtab: string;
    anneeScolaire: string;
    idActivite: string;
    config: IConfig
}

export interface ISchoolControlActivityStatusUpdate {
    codeEtab: string;
    anneeScolaire: string;
    idActivite: string;
    status: number
}

export interface ISchoolControlActivitiesUsers {
    codeEtab: string;
    anneeScolaire: string;
    idActivities: string[];
    user: IUser;
    status?: boolean
}

export interface IControleFraisScolairePayload {
    codeEtab: string;
    anneeScolaire: string;
    idActivite: string;
    operateur: string;//id uuid du user
    idPersonne: number
}
export interface IControleItem {
    codeEtab: string;
    anneeScolaire: string;
    idActivite: string;
    operateur: string;//id uuid du user
    idPersonne: number;
    aJour?: number;
    accepte?: number;
    createdatetime?: string
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

export interface ISmsAccount {
    codeEtab: string;
    providerId: number;
    login: string;
    password: string;
    sender: string;
    // schoolControlSmsAccount: number;
    sendSmsStudentDenied: number;
    sendSmsStudentAccepted: number;

}

export interface IControleDecisionAccepte {
    idControle: number;
    decision: number;
    idPersonne: number;
    telephoneTuteur: string;
    nomPrenomEleve: string;
    resteAPayer: number;
    idActivite: string;
}