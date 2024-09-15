//Convert from clipboard (Shift + Ctrl + Alt + V)

//Grand A
export interface IA_Chp1 {
  nomFiliere: string;
  groupe_filiere: string;
  duree_etude: number;
}

export interface IA_Chp2_1 {
  label: string;
  bg: string;
  total: number;
}

export interface IA_Chp2_2 {
  fonction: string;
  existant: string;
  necessaire: string;
  ecart: string;
  Obs: string;
}

export interface IA_Chp3_1 {
  filiere: string;
  bg: string;
  F: number;
  G: number;
  T: number;
  be_F: number;
  be_G: number;
  nb_F: number;
  nb_G: number;
}

export interface IA_Chp3_2 {
  label: string;
  bg: string;
  F1: number;
  G1: number;
  T1: number;
  F2: number;
  G2: number;
  T2: number;
  F3: number;
  G3: number;
  T3: number;
  F4: number;
  G4: number;
  T4: number;
}

export interface IA_Chp3_3 {
  examens: string;
  label: string;
  bg: string;
  F1: number;
  G1: number;
  T1: number;
  F2: number;
  G2: number;
  T2: number;
}

export interface IA_Chp4 {
  examens: string;
  label: string;
  bg: string;
}


//Grand B
export interface IB_Chp1_1 {
  RefNiveau: number;
  ClasseLong: string;
  Effectif: number;
  Nom: string;
  Prenoms: string;
  MOYG_4: number;
  RangG_4: string;
  Bourses: string;
  Decision?: any;
}

export interface IB_Chp1_2 {
  RefNiveau: number;
  filiere: string;
  ClasseLong: string;
  NiveauCourt: string;
  diplome: string;
  Nom: string;
  Prenoms: string;
  DateNais: string;
  LieuNaiss: string;
  Genre: string;
  BE: string;
  NB: string;
  candidatLibre: string;
}

export interface IB_Chp2_1 {
  Nom: string;
  Prenoms: string;
  DateNaiss: string;
  LieuNaiss: string;
  Discipline?: any;
  Fonction: string;
  Ancien?: any;
  Anciennete?: any;
  DatePriseService: string;
  DateRetraite: string;
  fil_tech: boolean;
}

