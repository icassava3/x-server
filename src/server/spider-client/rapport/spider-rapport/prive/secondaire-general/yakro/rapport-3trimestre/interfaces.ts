export interface IChp1_A_1 {
  Discipline: string,
  DatePeriode: string,
  TypeActivite: string,
  AnimateurTheme: string,
  Objectifs:string,
  Cible:string,
  Dates:string,
  Lieu:string,
 Moyens:string,
}
export interface IChp1_A_2_a {
  Visiteur:string,
  typeVisiteur:string,
  nomVisiteur: string,
  NomCompletProf: string,
  Discipline: string,
  Classe: string,
  Dates: string,
  Heures: string,
}

export interface IChp1A_2_b {
  Visiteur: string,
  NomCompletProf: string,
  Discipline: string,
  Classe: string,
  Dates: string,
  Heures: string,
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
  NiveauSerie: string;
  NiveauCourt: string;
  Genre: string;
  NiveauLong: string;
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
  OrderBy: number;
  RefClasse: number;
  ClasseLong: string;
  ClasseCourt: string;
  MatriculeNational: string;
  NomComplet: string;
  DateNaiss: string;
  Genre: string;
  Nationalite: string;
  Redoub: string;
  Lang2: string;
  MoyG2: number;
  MoyG1: number;
  RangG2: string;
  RangG1: string;
  MS: string;
  ProfP: string;
  StatutEleve: string;
  NumDeciAffect?: any;
  Obs: string;
  Educ: string;
  RefTypeClasse: number;
}

export interface IChp1_B_3 {
  RefTypeClasse: number;
  MoyG2: number;
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
  MoyG1: number;
}

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
export interface IChp2_C {
  RefNiveau: number;
  NiveauCourt: string;
  MatriculeNational: string;
  NomComplet: string;
  ClasseCourt: string;
  Genre: string;
  Decision: string;
  Regime: string;
  DateNaiss:string
  LieuNaissance:string
}

export interface IChp3_C_1 {
  MatriculeNational:string, 
  NomComplet:string, 
  ClasseCourt:string, 
  Age:string, 
  TermeTheorique:string, 
  QualiteAuteur:string, 
  Auteur:string, 
  ProblemePsycho:string, 
  FonctionAuteur:string, 
  Genre:string, 
  Observations:string, 
}

export interface IChp3_C_2 {
  MatriculeNational:string, 
  NomComplet:string, 
  ClasseCourt:string, 
  Genre:string, 
  Age:string, 
  Observations:string, 
}
export interface IChp3_C_3 {
  NomComplet:string, 
  Deces:string, 
  Handicap:string, 
  Maladie:string, 
}
export interface IChp4_2 {
  NomComplet:string, 
  Genre:string, 
  NumCnps:string, 
  NomDiplome:string, 
  MatLong:string, 
  VolumeHoraire:string, 
  categorie:string, 
  NumAut:string, 
  Fonction:string, 
  Fonct:string, 
}

export interface IChp2_E {
  orderby: number;
  label: string;
  _6eme: number;
  _5eme: number;
  _4emeEsp: number;
  _4emeAll: number;
  Tot4eme: number;
  _3emeEsp: number;
  _3emeAll: number;
  Tot3eme: number;
  TotalCycle1: number;
  _2ndAEsp: number;
  _2ndAll: number;
  _2ndCEsp: number;
  _2ndCAll: number;
  Tot2nd: number;
  _1ereAEsp: number;
  _1ereCEsp: number;
  _1ereDEsp: number;
  _1ereAAll: number;
  _1ereCAll: number;
  _1ereDAll: number;
  TOT1ere: number;
  _TleAEsp: number;
  _TleCEsp: number;
  _TleDEsp: number;
  _TleAAll: number;
  _TleCAll: number;
  _TleDAll: number;
  TOTTle: number;
  TotalCycle2: number;
  TotalGeneral: number;
}
export interface IChp4_A_1_3 {
  FrCycle1: number;
  FrCycle2: string;
  PhiloCycle1: number;
  PhiloCycle2: number;
  AnCycle1: number;
  AnCycle2: number;
  AllCycle2: number;
  HgCycle2: number;
  MathCycle2: number;
  PcCycle2: number;
  SvtCycle2: number;
  EpsCycle2: number;
  ApCycle2: number;
  MusCycle2: number;
  TotalCycle1: number;
  TotalCycle2: number;
  Fonction: number;
}