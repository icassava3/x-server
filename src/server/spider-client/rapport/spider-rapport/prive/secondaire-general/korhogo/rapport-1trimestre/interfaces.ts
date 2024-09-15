//Convert from clipboard (Shift + Ctrl + Alt + V)

export interface IChp1_A_2 {
  NombreDoc: string;
  NomDoc: string;
  CahierDeNotes: string;
  CahierDappel: string;
}

export interface IChp1_A_3_a {
  ResponsableEtab: string;
  Discipline: string;
  NomComplet: string;
  Etab: string;
  Contact: string;
}

export interface IChp1_A_3_b {
  Activite: string;
  Theme: string;
  Discipline: string;
  Lieu: string;
  Heure: boolean;
}

export interface IChp1_A_4_a {
  Visiteur: string;
  typeVisiteur: string;
  nomVisiteur: string;
  NomCompletProf: string;
  Discipline: string;
  Classe: string;
  Dates: string;
  Heures: string;
}
export interface IChp1_A_4_c {
  Visiteur: string;
  typeVisiteur: string;
  nomVisiteur: string;
  NomCompletProf: string;
  Discipline: string;
  Classe: string;
  Dates: string;
  Heures: string;
}

export interface IChp1_A_4_d {
  Discipline: string;
  DateFormation: string;
  ThemeEtLieu: string;
  AnimateurDuTheme: string;
}

export interface IChp1_B_1 {
  RefNiveau: number;
  orderby: number;
  OrdreClasse: number;
  ClasseCourt: string;
  NiveauCourt: string;
  bg: string;
  genre: string;
  EffectTotal: number;
  EffectClasse: number;
  EffectNonClasse: number;
  Tranche1: number;
  Taux1: number;
  Tranche2: number;
  Taux2: number;
  Tranche3: number;
  Taux3: number;
  MoyClasse: number;
}


export interface IChp1_B_1_b {
  RefNiveau: number;
  orderby: number;
  label: string;
  NiveauCourt: string;
  bg: string;
  genre: string;
  NbreClasses: number;
  EffectTotal: number;
  EffectClasse: number;
  EffectNonClasse: number;
  Tranche1: number;
  Taux1: number;
  Tranche2: number;
  Taux2: number;
  Tranche3: number;
  Taux3: number;
  MoyClasse: number;
}



export interface IChp1_B_2 {
  OrderBy: number,
  ClasseCourt: string,
  ClasseLong: string,
  MatriculeNational: string,
  NomComplet: string,
  DateNaiss: string,
  Genre: string,
  Nationalite: string,
  Redoub: string,
  Lang2: string,
  Lang1: string,
  MoyG3: string,
  MoyG1: string,
  RangG1: string,
  RangG3: string,
  MS: string,
  ProfP: string,
  Educ: string,
  StatutEleve: string,
  NumDeciAffect: string,
  Obs: string,
  EffectTotal: number,
  Admis: number,
  Redouble: number,
  Exclus: number,
  IdAppréciation: string;
  Niveau: string;
  Appréciations: string;
  NotePlancher: number;
  NotePlafond: number;
  Appreciations:string;
  RefNiveau:string, 
  RefClasse:string,  
  RefTypeClasse:string,  
  MoyG2:string,  
  RangG2:string,  
  LieuNaiss:string,  
}


export interface IChp1_B_3 {
  RefTypeClasse: number;
  MoyG1: number;
  NiveauCourt: string;
  NiveauSerie: string;
  ClasseCourt: string;
  MatriculeNational: string;
  NomComplet: string;
  DateNais: string;
  Age: number;
  Genre: string;
  Nationalite: string;
  Redoub: string;
  Lang2: string;
  Lang: string;
  StatutEleve: string;
  NumDeciAffect: string;
  RangG1: string;
}


//CHP2
export interface IChp2_A_1 {
  RefClasse: number;
  RefTypeClasse: number;
  MatriculeNational: string;
  NomComplet: string;
  Genre: string;
  ClasseCourt: string;
  NiveauCourt: string;
  DateNaiss: string;
  Age: number;
  Redoub: string;
  Nat: string;
  EtsOrig: string;
  EtsAcc: string;
  NumTrans: string;
  Decision: string;
}

export interface IChp2_A_2 {
  label: string;
  _6e: number;
  _5e: number;
  _4e: number;
  _3e: number;
  ST1: number;
  _2ndA: number;
  _2ndC: number;
  _1ereA: number;
  _1ereC: number;
  _1ereD: number;
  _TleA: number;
  _TleC: number;
  _TleD: number;
  ST2: number;
  TOTAL: number;
}
export interface IChp2_B {
  annee: string;
  genre: string;
  "6e": number;
  "5e": number;
  "4e": number;
  "3e": number;
  ST1: number;
  "2ndA": number;
  "2ndC": number;
  "1ereA": number;
  "1ereC": number;
  "1ereD": number;
  TleA: number;
  TleC: number;
  TleD: number;
  ST2: number;
  TOTAL: number;
}

export interface IChp2_C {
  RefNiveau: number;
  NiveauCourt: string;
  MatriculeNational: string;
  NomComplet: string;
  ClasseCourt: string;
  Genre: string;
  Decision: string;
  Regime: string;
}

export interface IChp2_D {
  RefNiveau: number;
  bg: string;
  NiveauCourt: string;
  NiveauSerie: string;
  CycleX: string;
  NbreClasses: number;
  F1: number;
  F2: number;
  T1: number;
  G1: number;
  G2: number;
  T2: number;
  TT1: number;
  TT2: number;
  TT3: number;
}

//CHP3
export interface IChp3_A {
  membre: string;
  fonction: string;
  qualite: string;
}

export interface IChp3_B {
  membre: string;
  fonction: string;
  qualite: string;
}

export interface IChp3_D {
  label: string;
  maladies: number;
  grossesses: number;
  abandons: number;
  handicaps: number;
  deces: number;
}

//CHP4
export interface IChp4_A_1 {
  NomComplet: string;
  Matricule?: any;
  discipline: string;
  emploi: string;
  vacataire: string;
  permanant: string;
  anciennete: string;
  sitmati: string;
  volhoraire?: any;
}

export interface IChp4_B {
  NomComplet: string;
  Matricule?: any;
  emploi: string;
  fonction: string;
  anciennete: string;
  Groupe: number;
}