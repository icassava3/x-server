//Convert from clipboard (Shift + Ctrl + Alt + V)


export interface IChp_A_1 {
  Etab: string;
  CahierDeText: string;
  CahierDeNotes: string;
  CahierDappel: string;
}

export interface IChp_A_1_3_1 {
  ResponsableEtab: string;
  Discipline: string;
  NomComplet: string;
  Etab: string;
  Contact: string;
}

export interface IChp_A_1_3_a {
  Etablissement: string;
  NombrePresent: string;
  TypeActivite: string;
  Observation: string;
  ProcesVerbale: boolean;
}

export interface IChp_A_1_4_1 {
  Discipline: string;
  Responsable: string;
  Emploi: string;
  Contact: string;
}

export interface IChp_A_3_a {
  Discipline: string;
  DatePeriode: string;
  TypeActivite: string;
  Observation: string;
  NombreParticipant: boolean;
}

export interface IChp1A_4 {
  Visiteur:string,
  typeVisiteur:string,
  nomVisiteur: string,
  NomCompletProf: string,
  Discipline: string,
  Classe: string,
  Dates: string,
  Heures: string,
  Fonction: string,
}

export interface IChp_A_2_1_1 {
  OrderBy: number;
  bg: string;
  CycleX: string;
  NiveauSerie: string;
  EffectTotal: number;
  EffectClasse: number;
  EffectNonClasse: number;
  Tranche1: number;
  Taux1: string;
  Tranche2: number;
  Taux2: string;
  Tranche3: number;
  Taux3: string;
  MoyClasse: number;
  StatutEleve: number;
}

export interface IChp2_3 {
  orderby: number;
  label: string;
  _6eG: number;
  _6eF: number;
  _5eG: number;
  _5eF: number;
  _4eG: number;
  _4eF: number;
  _3eG: number;
  _3eF: number;
  ST1G: number;
  ST1F: number;
  _2ndAG: number;
  _2ndAF: number;
  _2ndCG: number;
  _2ndCF: number;
  _1ereAG: number;
  _1ereAF: number;
  _1ereCG: number;
  _1ereCF: number;
  _1ereDG: number;
  _1ereDF: number;
  _TleAG: number;
  _TleAF: number;
  _TleCG: number;
  _TleCF: number;
  _TleDG: number;
  _TleDF: number;
  ST2G: number;
  ST2F: number;
  TG: number;
  TF: number;
  TT: number;
}

export interface IChp_A_2_1_1_Result {
  header: string[];
  m_sup_10: [];
  m_entre_8_5_et_10: [];
  m_inf_8_5: [];
  eff_total: [];
  classe: [];
  non_classe: [];
}

export interface IChp_A_2_2 {
  RefNiveau: string;
  RefClasse: string;
  ClasseLong: string;
  ClasseCourt: string;
  MatriculeNational: string;
  NomComplet: string;
  DateNaiss: string;
  Genre: string;
  Nationalite: string;
  Redoub: string;
  Lang1: string;
  Lang2: string;
  MoyG2: number | string;
  MoyG3: number | string;
  RangG2: string;
  RangG3: string;
  MoyG4: string;
  RangG4: string;
  MS: string;
  ProfP: string;
  StatutEleve: string;
  NumDeciAffect: string;
  Obs: string;
  Educ: string;
  RefTypeClasse: string;
  IdAppréciation: string;
  Niveau: string;
  Appréciations: string;
  NotePlancher: number;
  NotePlafond: number;
  Appreciations:string

}


export interface IChp_A_2_3 {
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
  RangG2: string;
}

export interface IChp1_B_1_a {
  orderby: number;
  cycle: string;
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
  label: string;
}

export interface IChp1_B_1_b {
  RefNiveau: number;
  bg: string;
  label: string;
  Genre: string;
  NiveauSerie: string;
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

export interface IChp1_B_c {
  CycleX: string;
  NiveauSerie: string;
  GT1: number;
  FT1: number;
  TT1: number;
  GT2: number;
  FT2: number;
  TT2: number;
  GT3A: number;
  FT3A: number;
  TT3A: number;
  GT3B: number;
  FT3B: number;
  TT3B: number;
  GT3C: number;
  FT3C: number;
  TT3C: number;
  TT3: number;
}

export interface IChp2_2 {
  AN: string,
  libelle: string,
  Niveau1: number,
  Niveau2: number,
  Niveau3: number,
  Niveau4: number,
  ST1: number,
  Niveau5A: number,
  Niveau5C: number,
  Niveau6A: number,
  Niveau6C: number,
  Niveau6D: number,
  Niveau7A: number,
  Niveau7C: number,
  Niveau7D: number,
  ST2: number,
  StOTAL: number,
  filière: number,
  Genre: string,
  G: number,
  F: number,
  T: number,
}

export interface IChp2_1_a {
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
export interface IChp2_4 {
  CycleX: string,
  NiveauSerie: string,
  NbreClasses: number,
  G1: number,
  F1: number,
  T1: number,
  G2: number,
  F2: number,
  T2: number,
  G3: number,
  F3: number,
  T3: number,
  G4: number,
  F4: number,
  T4: number,
  TG: number,
  TF: number,
  TT: number,
}
export interface IChp2_5 {
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



export interface IChp_B_1 {
  OrderBy: number;
  CycleX: string;
  NiveauSerie: string;
  NbreClasses: number;
  EffectTotal: number;
}

export interface IChp_B_1_Result {
  header: string[];
  row1: [];
  row2: [];
}

export interface IChp_B_2 {
  MatriculeNational: string,
  NomComplet: string,
  Genre: string,
  ClasseCourt: string,
  Age: number,
  Redoub: string,
  Nat: string,
  EtsOrig: string,
  EtsAcc: string,
}

export interface IChp_B_3 {
  MatriculeNational: string,
  NomComplet: string,
  ClasseCourt: string,
  Genre: string,
  BE: string,
  Demiboursier: string,
}

export interface IChp_B_4 {
  annee: string;
  AN: string;
  libelle: string;
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


export interface chp3_4_a_1 {
  label: string;
  _6e: number;
  _5e: number;
  _4e: number;
  _3e: number;
  ST1: number;
  _2nd: number;
  _1ere: number;
  _Tle: number;
  ST2: number;
  TOTAL: number;
  obs: string;
}

export interface IChp_B_5 {
  CycleX: string,
  NiveauSerie: string,
  NbreClasses: number,
  G1: number,
  F1: number,
  T1: number,
  G2: number,
  F2: number,
  T2: number,
  G3: number,
  F3: number,
  T3: number,
  G4: number,
  F4: number,
  T4: number,
  TG: number,
  TF: number,
  TT: number,
}

export interface IChp_C_1_1 {
  NomComplet: string,
  Genre: string,
  Fonction: string,
  QualiteMembre: string,
  Contact: string,
}

export interface IChp_3_1 {
  Periode: string,
  Activite_menee: string,
  Nombre: string,
  Observations: string,
}

export interface IChp3_3 {
  Club:string, 
  Observation:string, 
  ActiviteMenee:string, 
  Nombre:string, 
}

export interface IChp_C_2_1 {
  NomComplet: string,
  Genre: string,
  Fonction: string,
  QualiteMembre: string,
  Contact: string,
}

export interface IChp_3_2 {
  Activite_menee: string,
  Nombre: string,
  Observations: string,
}

export interface IChp_C_3_1 {
  denomination: string;
  existe: string;
  fonction: string;
  programme_activite: string;
  responsable: string;
}

export interface IChp_C_3_2 {
  NomClub:string, 
  dateActiviteMenee:string, 
  ActiviteMenee:string, 
  }

export interface IChp_C_3_3 {
  NomSport:string, 
  dateActiviteMenee:string, 
  ActiviteMenee:string, 
  }

export interface IChp_C_3_4 {
  NomSport:string, 
  dateActiviteMenee:string, 
  ActiviteMenee:string, 
  NomResponsable:string, 
  }

  export interface IChp_C_4 {
    DateDebut:string, 
    DateFin:string, 
    NomComplet:string, 
    Matricule:string, 
    Fonction:string, 
    Motif:string, 
    Obs:string, 
    }
  export interface IChp_C_5_1 {
    EtsOrig:string, 
    NatureMaladie:string, 
    DateAccouchement:string, 
    RaisonAbandon:string, 
    NatureHandicap:string, 
    OrigineHandicap:string, 
    Deces:string, 
    }
  export interface IChp_C_5_2 {
    MatriculeNational:string, 
    NomComplet:string, 
    Age:string, 
    ClasseCourt:string, 
    Genre:string, 
    RaisonAbandon:string, 
    }
  export interface IChp_C_5_3 {
    MatriculeNational:string, 
    NomComplet:string, 
    Age:string, 
    ClasseCourt:string, 
    Genre:string, 
    RaisonAbandon:string, 
    ProblemePsychosocial:string, 
    Observation:string, 
    }
  export interface IChp_C_5_4 {
    MatriculeNational:string, 
    NomComplet:string, 
    Age:string, 
    ClasseCourt:string, 
    Genre:string, 
    AdresseParent:string, 
    DateDepotCertificat:string, 
    NomAuteur:string, 
    FonctionAuteur:string, 
    DateAccouchement:string, 
    }
  export interface IChp_C_5_5 {
    MatriculeNational:string, 
    NomComplet:string, 
    Age:string, 
    ClasseCourt:string, 
    Genre:string, 
    DateDepotCertificat:string, 
    NatureMaladie:string, 
    DureeMaladie:string, 
    }
  export interface IChp_C_5_6 {
    MatriculeNational:string, 
    NomComplet:string, 
    ClasseCourt:string, 
    Genre:string, 
    DateDepotCertificat:string, 
    DateDeces:string, 
    CauseDeces:string, 
    }

    export interface IChp_D_1 {
      NomPers:string, 
      PrénomPers:string, 
      NomDiplome:string, 
      NumCnps:string, 
      NomComplet:string, 
      RefGroupePers:number, 
      Fonction:string, 
      Genre:string, 
      }
      export interface IChp4_2_a {
        Discipline:string, 
        NomPers:string, 
        PrénomPers:string, 
        NomDiplome:string, 
        NumCnps:string, 
        NomComplet:string, 
        RefGroupePers:number, 
        Fonction:string, 
        Genre:string, 
        }
        export interface IChp4_2_1 {
          label: string;
          pcf: number;
          pch: number;
          pct: number;
          bs1: string;
          scf: number;
          sch: number;
          sct: number;
          bs2: string;
          tf: number;
          th: number;
          te: number;
          obs: string;
        }
    export interface IChp_D_2 {
      NomComplet:string, 
      NomPers:string, 
      PrénomPers:string, 
      NomDiplome:string, 
      NumCnps:string, 
      RefGroupePers:number, 
      Fonction:string, 
      Genre:string, 
      Cycle:string, 
      NiveauCourt:string,
      Niveau:string,
      fil_gen:boolean,
      LibelleTypePers:string,
      Contact:string,
      TélPers:string
      NumAutEnseigner:string,
      }

      export interface IChp5_1_a {
        Locaux:string, 
        Toiture:string, 
        Plafond:string, 
        Mur:string, 
        Plancher:string, 
        Portes:string, 
        Fenetres:string, 
        Electricite:string, 
        Plomberie:string, 
        Besoin:string, 
      }
      export interface IChp5_1_b {
        TypesInstallation:string, 
        Etats:string, 
        Besoins:number, 
      }
      export interface IChp5_2 {
        Designation:string, 
        Bon:string, 
        Passable:string, 
        HorsUsage:string, 
        Total:string, 
        Besoins:string, 
      }
      export interface IChp5A_3_c {
        Designation:string, 
        Bon:string, 
        Passable:string, 
        HorsUsage:string, 
        Total:string, 
        Besoins:string, 
      }
      