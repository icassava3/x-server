export interface IEtabParams {
    anneeScolaire: string;
    codeEtab: string;
    idPersonnel: number;
    nomPersonnel: string;
    fonction: string;
    specialite: string;
    phone: null;
    libEtab: string;
    whatsapp: string;
    facebook: string;
    email: string;
    modeCalc: number;
    decoupSemestres: number;
    logo: string;
    mode_calc_moy_period: number;
    coef_test_lourd: number;
}

export interface IEleve {
    anneeScolaire: string;
    codeEtab: string;
    idEleve: number;
    idClasse: number;
    matricule: string;
    nomEleve: string;
    prenomEleve: string;
    dateNaissance: string;
    lieuNaissance: string;
    sexe: string;
    lv2: string;
    arts: string;
    dispEPS: number; //à ajouter dans le warehouse
    parentPhone: string;
    affecte: number;
}
export interface IClasse {
    anneeScolaire: string;
    codeEtab: string;
    idClasse: number;
    idMatiere: number;
    classeCourt: string;
    idTypeClasse: number;
    ordreClasse: number;
    libelleMatiereCourt: string;
    libelleMatiereLong: string;
    idPersonnel: number;
    nomPersonnel: string;
}
export interface IEvalProg {
    anneeScolaire: string;
    codeEtab: string;
    idEval: string;
    idClasse: number;
    idMatiere: number;
    periodeEval: number;
    numEval: number;
    coefEval: number;
    dateCompo: string;
    typeEval: string;
}
export interface IEvalNote {
    anneeScolaire: string;
    codeEtab: string;
    idEval: string;
    idEleve: number;
    noteEval: number | null;
    dateSaisie: string | null;
    opSaisie: string | null;
    dateModif: string;
    opModif: string;
    recup: boolean;
    device: string;
}
export interface IServerPlanningData {
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

export interface IAppel {
    anneeScolaire: string;
    codeEtab: string;
    idSeance: number;
    dateAppel: string;
    recup: number;
    idClasse: number;
    idPersonnel: number;
    plageHoraire: string;
    libelleMatiereCourt: string;
    libelleMatiereLong: string;
    dateSaisie: string | null;
    operateurSaisie: string | null;
    device: string;
    createdAt?: string;
    updatedAt?: string;
}

/** interface du payload de l'obtention de données depuis profexpert*/
export interface IProfDataPayload {
    userPhone: string;
    codeEtab: string;
    anneeScolaire: string;
}


export interface IAppelPayload {
    idSeance: number;
    dateAppel: string;
    plageHoraire: string;
    libelleMatiereCourt: string;
    libelleMatiereLong: string;
    dateSaisie: string | null;
    operateurSaisie: string | null;
    dateModif: string;
    operateurModif: string | null;
    recup: number;
    device: string;
    idClasse: number;
    idPersonnel: number;
    assiduites: { idEleve: number; status: number; }[]
}

export interface ISpiderEvalProg {
    anneeScolaire: string;
    codeEtab: string;
    idEval: string;
    idClasse: number;
    idMatiere: number;
    periodeEval: number;
    numEval: number;
    coefEval: number;
    dateCompo: string;
    typeEval: string;
}

export interface ISpiderEvalNote {
    anneeScolaire: string;
    codeEtab: string;
    idEval: number;
    idEleve: number;
    noteEval: number | null;
    dateSaisie?: string | null;
    opSaisie?: string | null;
    dateModif?: string;
    opModif?: string;
    recup?: number;
    device?: string;
}

export interface IEvalsAndProgs {
    progs: ISpiderEvalProg[];
    notes: ISpiderEvalNote[];
}

export interface IGetEvalsAndProgsResponse {
    progsPath: string;
    notesPath: string;
}

export interface IEvalsAndProgsPayload {
  codeEtab: string;
  anScol: string;
  arrayClasse: number[];
  arrayMat: number[];
  arrayPeriode: number[];
  lockEval: number;
}

export interface IEncadreur {
    idPersonne: number;
    idPersonnel: number;
    anneeScolaire: string;
    codeEtab: string;
    classeCourt: string;
    specialite: string;
    phone1: string;
    phone2: string;
    nomPrenomPersonnel: string;
}

// export interface IPayloadUpdateProfData {
//     anneeScolaire: string;
//     codeEtab: string;
//     appID: number;
//     idPersonnel: number;
// }