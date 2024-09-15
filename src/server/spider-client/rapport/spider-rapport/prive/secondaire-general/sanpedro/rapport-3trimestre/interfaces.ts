//Convert from clipboard (Shift + Ctrl + Alt + V)

export interface IChp1_A_3_1_a {
  Discipline: string;
  Responsable: string;
  Emploi: string;
  Contact: string;
}
export interface IChp1_A_3_1_b {
  Discipline: string;
  DatePeriode: string;
  TypeActivite: string;
  AnimateurTheme: string;
}

export interface IChp1_A_3_2_a {
  ResponsableEtab: string;
  Discipline: string;
  NomComplet: string;
  Etab: string;
  Contact: string;
}

export interface IChp1_A_3_2_b {
  Discipline: string;
  DatePeriode: string;
  TypeActivite: string;
  AnimateurTheme: string;
}

export interface IChp1_A_4_1 {
  Visiteur: string;
  NomCompletProf: string;
  Discipline: string;
  Classe: string;
  Dates: string;
  Heures: string;
}

export interface IChp1_A_4_2 {
  Visiteur: string;
  NomCompletProf: string;
  Discipline: string;
  Classe: string;
  Dates: string;
  Heures: string;
}

export interface IChp1_A_4_3 {
  qualite_formateur: string;
  discipline: string;
  dates: string;
  heures: string;
  classe: string;
  obs: string;
}

export interface IChp1_B_1_1 {
  RefNiveau: number;
  bg: string;
  NiveauSerie: string;
  Genre: string;
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

export interface IChp1_B_2_1 {
  RefNiveau: number;
  RefClasse: number;
  ClasseLong: string;
  ClasseCourt: string;
  MatriculeNational: string;
  NomEleve: string;
  PrenomEleve: string;
  DateNaiss: string;
  LieuNaiss: string;
  Genre: string;
  Nationalite: string;
  ClassePrec: string;
  ClasseEnCours: string;
  StatutEleve: number;
  NumDecStatut: string;
  NumTransfert?: any;
  Regime: string;
  Redoub: string;
  MOYG1: number;
  MOYG2: number;
  MOYG3: number;
  MOYG4: number;
  RangG4: string;
  Decision?: any;
  ProfP: string;
  Educ: string;
}

export interface IChp1_B_2_2 {
  Langue: string;
  Genre: string;
  _4e: number;
  _3e: number;
  ST1: number;
  _2nd: number;
  _1ere: number;
  _Tle: number;
  ST2: number;
  ST3: number;
}

export interface IChp1_B_3 {
  RefTypeClasse: number;
  ClasseCourt: string;
  MoyG3: number;
  NiveauCourt: string;
  label: string;
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
  RangG3: string;
}

export interface IChp1_B_4_1_1 {
  RefNiveau: string;
  Classe: string;
  CycleX: string;
  TotalTaux: number;
  TauxGarçon: string;
  TauxFille: string;
  TotalAdmis: string;
  AdmisGarçon: string;
  AdmisFille: string;
  TotalPresent: number;
  PresentGarçon: string;
  PresentFille: string;
  TotalInscrit: string;
  InscritGarçon: string;
  InscritFille: string;
}

export interface IChp1_B_4_1_2 {
  RefNiveau: string;
  Serie: string;
  TotalTaux: number;
  TauxGarçon: string;
  TauxFille: string;
  TotalAdmis: string;
  AdmisGarçon: string;
  AdmisFille: string;
  TotalPresent: number;
  PresentGarçon: string;
  PresentFille: string;
  TotalInscrit: string;
  InscritGarçon: string;
  InscritFille: string;
}

//CHP2
export interface IChp2_B {
  label: string;
  _6e_G: number;
  _6e_F: number;
  _5e_G: number;
  _5e_F: number;
  _4e_G: number;
  _4e_F: number;
  _3e_G: number;
  _3e_F: number;
  ST1_G: number;
  ST1_F: number;
  _2nd_G: number;
  _2nd_F: number;
  _1ere_G: number;
  _1ere_F: number;
  _Tle_G: number;
  _Tle_F: number;
  ST2_G: number;
  ST2_F: number;
  ST_G: number;
  ST_F: number;
  T: number;
}

export interface IChp2_C {
  RefNiveau: number;
  NiveauCourt: string;
  MatriculeNational: string;
  NomComplet: string;
  Genre: string;
  DateNais: string;
  LieuNaiss: string;
  Nationalite: string;
  MoyG3: number;
  RangG3: string;
  Regime: string;
  ClasseCourt: string;
}

export interface IChp2_D {
  orderby: number;
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

export interface IChp3_B_1 {
  MatriculeNational: string;
  NomComplet: string;
  ClasseCourt: string;
  CauseDeces: string;
  StatutEleve: string;
  ContactsFamille: string;
}

export interface IChp3_B_2 {
  MatriculeNational: string;
  NomComplet: string;
  Age: string;
  ClasseCourt: string;
  DateNaiss: string;
  Genre: string;
  AdresseParent: string;
  DateDepotCertificat: string;
  NomAuteur: string;
  FonctionAuteur: string;
  DateAccouchement: string;
  ContactsFamille: string;
  Contacts: string;
}

export interface IChp3_B_3 {
  MatriculeNational: string;
  NomComplet: string;
  ClasseCourt: string;
  DateNaiss: string;
  NatureMaladie: string;
  DureeMaladie: string;
}

export interface IChp3_B_4 {
  MatriculeNational: string;
  NomComplet: string;
  ClasseCourt: string;
  DateNaiss: string;
  DateAbandon: string;
  RaisonAbandon: string;
}

export interface IChp4_A {
  NomComplet: string;
  NomDiplome: string;
  Fonction: string;
  NumCnps: string;
  NumAut: string;
  Contacts: string;
  Groupe: number;
}

export interface IChp4_B {
  RefPersonnel: number;
  NomComplet: string;
  Genre: string;
  NomDiplome: string;
  FonctVacatire: string;
  PrivePermanent: string;
  PriveVacataire: string;
  VolumeHoraire?: any;
  NumCnps?: any;
  NumAut?: any;
  MatCourt: string;
  Contacts: string;
  Fonction: number;
}

export interface IChp4_C {
  NomComplet: string;
  NomDiplome: string;
  Fonction: string;
  NumCnps: string;
  NumAut: string;
  Contacts: string;
  Groupe: number;
}

export interface IChp6_A_1 {
  RefNiveau: number;
  orderby: number;
  OrdreClasse: number;
  ClasseCourt: string;
  NiveauCourt: string;
  bg: string;
  EffectTotal: number;
  Gadmis: number;
  Fadmis: number;
  T1: number;
  Gredouble: number;
  Fredouble: number;
  T2: number;
  Gexclus: number;
  Fexclus: number;
  T3: number;
  EFG_FinAnnee: number;
  MoyClasse: number;
}

export interface IChp6_B {
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
export interface IChp6_C {
  bg: string;
  Bourse: string;
}
//fin
