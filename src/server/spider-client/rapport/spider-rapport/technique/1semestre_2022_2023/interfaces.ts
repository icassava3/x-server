//Convert from clipboard (Shift + Ctrl + Alt + V)

export interface IChp1 {
  nomFiliere: string;
  groupe_filiere: string;
  duree_etude: number;
}

export interface IChp2_1 {
  NomComplet: string;
  emploi: string;
  fonction: string;
  anciennete: string;
  Groupe: string;
  CelPers: string;
  Corps: string;
}

export interface IChp2_2 {
  Fonction: string;
  Homme: string;
  Femme: string;
  Total: string;
  Obs: string;
}

export interface IChp2_3 {
  label: string;
  bg: string;
  h_maitrise: number;
  h_licence: number;
  h_deug: number;
  h_n_aut_ens: number;
  f_maitrise: number;
  f_licence: number;
  f_deug: number;
  f_n_aut_ens: number;
  vacataire: number;
  permanant: number;
  total: number;
}

export interface IChp3 {
  diplome: string;
  filiere: string;
  bg: string;
  annee1: number;
  annee2: number;
  annee3: number;
  total: number;
}
export interface IChp4_1 {
  niveau: string;
  bg: string;
  ClasseCourt: string;
  nbreClasses: number;
  be_G: number;
  nb_G: number;
  total1: number;
  be_F: number;
  nb_F: number;
  total2: number;
}

export interface IChp4_2 {
  niveau: string;
  filiere: string;
  bg: string;
  F: number;
  G: number;
  T: number;
}

export interface IChp4_3 {
  diplome: string;
  aff_F: number;
  non_aff_F: number;
  T1: number;
  aff_G: number;
  non_aff_G: number;
  T2: number;
}

export interface IChp4_4_1 {
  niveau: string;
  cap_F: number;
  cap_G: number;
  cap_total: number;
  bt_F: number;
  bt_G: number;
  bt_total: number;
  t_F: number;
  t_G: number;
  t_Total: number;
}

export interface IChp4_4_2 {
  diplome: string;
  niveau: string;
  bg: string;
  acceuil: number;
  inscrit: number;
  ecart: number;
}


export interface IChp7_2 {
  designation: string;
  objet: string;
  responsable: string;
}

