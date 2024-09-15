//Convert from clipboard (Shift + Ctrl + Alt + V)

export interface IChp {
  orderby: number;
  label: string;
}

export interface IChp1_identification {
  RefFonction:number;
  Fonction:string;
  NomCorps:string; 
  NomComplet:string; 
  GradeActuel:string;
  Contact:string; 
  CelPers:string;
  Quartier:string;
}
export interface IChp1_educateur {
  RefPersonnel:number;
  Fonction:string;
  NomCorps:string; 
  nbreEduc:number; 
  GradeActuel:string;
  FonctionCourt:string; 
}



export interface IChp1_3 {
  orderby: number;
  label: string;
  internat: string;
  G: number;
  F: number;
  T: number;
}

export interface IChp1_4_a {
  orderby: number;
  label: string;
}

export interface IChp1_5 {
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

export interface IChp1_6 {
  orderby: number;
  label: string;
  _4e_all: number;
  _4e_esp: number;
  _3e_all: number;
  _3e_esp: number;
  ST1: number;
  _2ndA_all: number;
  _2ndA_esp: number;
  _2ndC_all: number;
  _2ndC_esp: number;
  _1ereA_all: number;
  _1ereA_esp: number;
  _TleA_all: number;
  _TleA_esp: number;
  ST2: number;
  TOTAL: number;
}

export interface IChp1_7_1 {
  orderby: number;
  label: string;
  genre: string;
  _6e: number;
  _5e: number;
  _4e: number;
  _3e: number;
  ST1: number;
}

export interface IChp1_7_2 {
  orderby: number;
  label: string;
  genre: string;
  _2ndA: number;
  _2ndC: number;
  T_2nd: number;
  _1ereA: number;
  _1ereC: number;
  _1ereD: number;
  T_1ere: number;
  _TleA: number;
  _TleC: number;
  _TleD: number;
  T_Tle: number;
  T_2nd_cycle: number;
  T_1er_2nd_cycle: number;
}

export interface IChp1_8 {
  RefNiveau: number;
  orderby: number;
  NiveauSerie: string;
  bg: string;
  G1: number;
  F1: number;
  T1: number;
  G2: number;
  F2: number;
  T2: number;
  G3: number;
  F3: number;
  T3: number;
  TG: number;
  TF: number;
  TGF: number;
}
export interface IChp1_9 {
  orderby: number;
  label: string;
  _6e_G: number;
  _6e_F: number;
  _6e_T: number;
  _2ndA_G: number;
  _2ndA_F: number;
  _2ndA_T: number;
  _2ndC_G: number;
  _2ndC_F: number;
  _2ndC_T: number;
  _2nd_T_G: number;
  _2nd_T_F: number;
  _2nd_T_G_F: number;
}

export interface IChp1_11 {
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

export interface IChp1_12_A {
  orderby: number;
  label: string;
  cycle1_F: number;
  cycle1_H: number;
  cycle1_T: number;
  besoins1: string;
  cycle2_F: number;
  cycle2_H: number;
  cycle2_T: number;
  besoins2: string;
  cycle1_cycle2_F: number;
  cycle1_cycle2_H: number;
  cycle1_cycle2_T: number;
  besoins3: string;
}
export interface IChp1_12_B {
  RefFonction: number;
  Fonction: string;
  FonctionCourt: string;
  F: string;
  H: string;
  T: string;
}
//fin
