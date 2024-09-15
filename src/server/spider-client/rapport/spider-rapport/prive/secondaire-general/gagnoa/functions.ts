import { appCnx, fetchFromMsAccess, paramEtabObjet } from "../../../../../../databases/accessDB";
import { IChp1_B_1_a } from "./interfaces";
const _ = require("lodash");


const Identite = (): Promise<any | {}> => {
    return new Promise(async (resolve, reject) => {
      try {
        const {
          nomcompletetab,
          num_ouverture,
          num_reconnaissance,
          codeetab,
          sitgeo,
          bpetab,
          teletab,
          emailetab,
          drencomplet,
  
          fondateur,
          telfondateur,
          emailfondateur,
  
          nomchefetab,
          telchefetab,
          emailchefetab,
        } = await paramEtabObjet([
          "nomcompletetab",
          "num_ouverture",
          "num_reconnaissance",
          "codeetab",
          "sitgeo",
          "bpetab",
          "teletab",
          "emailetab",
          "drencomplet",
  
          "fondateur",
          "telfondateur",
          "emailfondateur",
  
          "nomchefetab",
          "telchefetab",
          "emailchefetab",
        ]);
  
        const result = {
          //ETABLISSEMENT
          drencomplet: drencomplet,
          nomcompletetab: nomcompletetab,
          num_ouverture: num_ouverture,
          num_reconnaissance: num_reconnaissance,
          codeetab: codeetab,
          sitgeo: sitgeo,
          bpetab: bpetab,
          teletab: teletab,
          emailetab: emailetab,
  
          //FONDATEUR
          fondateur: fondateur,
          telfondateur: telfondateur,
          emailfondateur: emailfondateur,
  
          //DIRECTEUR DES ETUDES
          nomchefetab: nomchefetab,
          telchefetab: telchefetab,
          emailchefetab: emailchefetab,
        };
        // console.log("Identite ... ", result);
  
        resolve(result);
      } catch (err: any) {
        console.log(`err => Identite`);
        return reject(err);
      }
    });
  };
  

/**
 * Récapitulatif des résultats des élèves par tranche de moyennes générales
 * du premier trimestre et par sexe au général
 * @returns 
 */
const getElevesSecondaireGeneralRendement = (trim: number) => {
    console.log("🚀 ~ getElevesSecondaireGeneralRendement ~ trim:", trim)
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.Série AS Serie, Sum(IIf([Elèves].[inscrit]=-1 
                And [Elèves].[Sexe]=2,1,0)) AS FilleIns, Sum(IIf([Elèves].[inscrit]=-1 And [Elèves].[Sexe]=1,1,0)) AS GarcIns, 
                Sum(IIf([Elèves].[inscrit]=-1 And [Elèves].[Sexe]=2 And [T_Notes].[MOYG${trim}] Is Not Null,1,0)) AS FilleClass, 
                Sum(IIf([Elèves].[inscrit]=-1 And [Elèves].[Sexe]=1 And [T_Notes].[MOYG${trim}] Is Not Null,1,0)) AS GarcClass, 
                Sum(IIf([Elèves].[inscrit]=-1 And [Elèves].[Sexe]=2 And [T_Notes].[MOYG${trim}]>=10,1,0)) AS FilleMoySup10, 
                Sum(IIf([Elèves].[inscrit]=-1 And [Elèves].[Sexe]=1 And [T_Notes].[MOYG${trim}]>=10,1,0)) AS GarcMoySup10, 
                Sum(IIf([Elèves].[inscrit]=-1 And [Elèves].[Sexe]=2 And [T_Notes].[MOYG${trim}]>=8.5 And [T_Notes].[MOYG${trim}]<10,1,0)) AS FilleMoyEntr810,
                 Sum(IIf([Elèves].[inscrit]=-1 And [Elèves].[Sexe]=1 And [T_Notes].[MOYG${trim}]>=8.5 And [T_Notes].[MOYG${trim}]<10,1,0)) AS GarcMoyEntr810,
                  Sum(IIf([Elèves].[inscrit]=-1 And [Elèves].[Sexe]=2 And [T_Notes].[MOYG${trim}]<8.5,1,0)) AS FilleMoyInf8, 
                  Sum(IIf([Elèves].[inscrit]=-1 And [Elèves].[Sexe]=1 And [T_Notes].[MOYG${trim}]<8.5,1,0)) AS GarcMoyInf8
            FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) 
            ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) 
            INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
            GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.Série, TypesClasses.filière, Elèves.inscrit
            HAVING (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));`;

            const result = await fetchFromMsAccess<any>(sql, appCnx);
            resolve(result)
        } catch (error) {
            reject(error);
        }
    });
};


/**
 * 
 * @returns 
 */
const getElevesSecondaireGeneralMoyennesParDiscipline = (trim: number) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.Série AS Serie, TypesClasses.RefTypeClasse AS refTypeClasse,

            Sum(IIf([T_Notes].[CF${trim}] Is Not Null,1,0)) AS CFClass, 
            Sum(IIf([T_Notes].[CF${trim}] Is Not Null And [Elèves].[Sexe]=2,1,0  )) AS FilleCFClass, 
            Sum(IIf([T_Notes].[CF${trim}] Is Not Null And [Elèves].[Sexe]=1,1,0  )) AS GarcCFClass, 

            Sum(IIf([T_Notes].[CF${trim}] Is Not Null And [T_Notes].[CF${trim}]<10,1,0)) AS CFInf10, 
            Sum(IIf([T_Notes].[CF${trim}] Is Not Null And [T_Notes].[CF${trim}]<10 And [Elèves].[Sexe]=2,1,0 )) AS FilleCFInf10, 
            Sum(IIf([T_Notes].[CF${trim}] Is Not Null And [T_Notes].[CF${trim}]<10 And [Elèves].[Sexe]=1,1,0 )) AS GarcCFInf10, 


            Sum(IIf([T_Notes].[OG${trim}] Is Not Null,1,0)) AS OGClass,
            Sum(IIf([T_Notes].[OG${trim}] Is Not Null And [Elèves].[Sexe]=2,1,0)) AS FilleOGClass,
            Sum(IIf([T_Notes].[OG${trim}] Is Not Null And [Elèves].[Sexe]=1,1,0)) AS GarcOGClass,
             
            Sum(IIf([T_Notes].[OG${trim}] Is Not Null And [T_Notes].[OG${trim}]<10,1,0)) AS OGInf10,
            Sum(IIf([T_Notes].[OG${trim}] Is Not Null And [T_Notes].[OG${trim}]<10 And [Elèves].[Sexe]=2,1,0)) AS FilleOGInf10,
            Sum(IIf([T_Notes].[OG${trim}] Is Not Null And [T_Notes].[OG${trim}]<10 And [Elèves].[Sexe]=1,1,0)) AS GarcOGInf10,


            Sum(IIf([T_Notes].[AN${trim}] Is Not Null,1,0)) AS ANClass,
            Sum(IIf([T_Notes].[AN${trim}] Is Not Null And [Elèves].[Sexe]=2,1,0 )) AS FilleANClass,
            Sum(IIf([T_Notes].[AN${trim}] Is Not Null And [Elèves].[Sexe]=1,1,0 )) AS GarcANClass,

            Sum(IIf([T_Notes].[AN${trim}] Is Not Null And [T_Notes].[AN${trim}]<10,1,0)) AS ANInf10,
            Sum(IIf([T_Notes].[AN${trim}] Is Not Null And [T_Notes].[AN${trim}]<10 And [Elèves].[Sexe]=2,1,0)) AS FilleANInf10,
            Sum(IIf([T_Notes].[AN${trim}] Is Not Null And [T_Notes].[AN${trim}]<10 And [Elèves].[Sexe]=1,1,0)) AS GarcANInf10,
               
               
            Sum(IIf(IIf([elèves].[lv2] Is Null 
            And [classes].[lv2] Is Null,
            "",IIf([classes].[lv2]="Allemand" Or [classes].[lv2]="Espagnol",Left([classes].[lv2],3),IIf(([Elèves].[Lv2] Is Not Null) 
            And ([Elèves].[lv2]="Allemand" Or [Elèves].[lv2]="Espagnol"),Left([Elèves].[lv2],3),"")))="All" 
            And [T_Notes].[LV2${trim}] Is Not Null,1,0)) AS ALLClass, 
               
            Sum(IIf(IIf([elèves].[lv2] Is Null 
            And [classes].[lv2] Is Null,
            "",IIf([classes].[lv2]="Allemand" Or [classes].[lv2]="Espagnol",Left([classes].[lv2],3),IIf(([Elèves].[Lv2] Is Not Null) 
            And ([Elèves].[lv2]="Allemand" Or [Elèves].[lv2]="Espagnol"),Left([Elèves].[lv2],3),"")))="All" 
            And [T_Notes].[LV2${trim}] Is Not Null And [Elèves].[Sexe]=2,1,0)) AS FilleALLClass, 
               
            Sum(IIf(IIf([elèves].[lv2] Is Null 
            And [classes].[lv2] Is Null,
            "",IIf([classes].[lv2]="Allemand" Or [classes].[lv2]="Espagnol",Left([classes].[lv2],3),IIf(([Elèves].[Lv2] Is Not Null) 
            And ([Elèves].[lv2]="Allemand" Or [Elèves].[lv2]="Espagnol"),Left([Elèves].[lv2],3),"")))="All" 
            And [T_Notes].[LV2${trim}] Is Not Null And [Elèves].[Sexe]=1,1,0)) AS GarcALLClass, 
                
                
            Sum(IIf(IIf([elèves].[lv2] Is Null And [classes].[lv2] Is Null,"",
            IIf([classes].[lv2]="Allemand" Or [classes].[lv2]="Espagnol",Left([classes].[lv2],3),IIf(([Elèves].[Lv2] Is Not Null) 
            And ([Elèves].[lv2]="Allemand" Or [Elèves].[lv2]="Espagnol"),Left([Elèves].[lv2],3),"")))="All" And [T_Notes].[LV2${trim}] Is Not Null 
            And [T_Notes].[LV2${trim}]<10,1,0)) AS ALLInf10, 
                
            Sum(IIf(IIf([elèves].[lv2] Is Null And [classes].[lv2] Is Null,"",
            IIf([classes].[lv2]="Allemand" Or [classes].[lv2]="Espagnol",Left([classes].[lv2],3),IIf(([Elèves].[Lv2] Is Not Null) 
            And ([Elèves].[lv2]="Allemand" Or [Elèves].[lv2]="Espagnol"),Left([Elèves].[lv2],3),"")))="All" And [T_Notes].[LV2${trim}] Is Not Null 
            And [T_Notes].[LV2${trim}]<10 And [Elèves].[Sexe]=2,1,0)) AS FilleALLInf10, 
                
            Sum(IIf(IIf([elèves].[lv2] Is Null And [classes].[lv2] Is Null,"",
            IIf([classes].[lv2]="Allemand" Or [classes].[lv2]="Espagnol",Left([classes].[lv2],3),IIf(([Elèves].[Lv2] Is Not Null) 
            And ([Elèves].[lv2]="Allemand" Or [Elèves].[lv2]="Espagnol"),Left([Elèves].[lv2],3),"")))="All" And [T_Notes].[LV2${trim}] Is Not Null 
            And [T_Notes].[LV2${trim}]<10 And [Elèves].[Sexe]=1,1,0)) AS GarcALLInf10, 
                        
                
            Sum(IIf(IIf([elèves].[lv2] Is Null And [classes].[lv2] Is Null,"",
            IIf([classes].[lv2]="Allemand" Or [classes].[lv2]="Espagnol",Left([classes].[lv2],3),IIf(([Elèves].[Lv2] Is Not Null) 
            And ([Elèves].[lv2]="Allemand" Or [Elèves].[lv2]="Espagnol"),Left([Elèves].[lv2],3),"")))="Esp" 
            And [T_Notes].[LV2${trim}] Is Not Null,1,0)) AS ESPClass, 
                
            Sum(IIf(IIf([elèves].[lv2] Is Null And [classes].[lv2] Is Null,"",
            IIf([classes].[lv2]="Allemand" Or [classes].[lv2]="Espagnol",Left([classes].[lv2],3),IIf(([Elèves].[Lv2] Is Not Null) 
            And ([Elèves].[lv2]="Allemand" Or [Elèves].[lv2]="Espagnol"),Left([Elèves].[lv2],3),"")))="Esp" 
            And [T_Notes].[LV2${trim}] Is Not Null And [Elèves].[Sexe]=2,1,0)) AS FilleESPClass, 
                
            Sum(IIf(IIf([elèves].[lv2] Is Null And [classes].[lv2] Is Null,"",
            IIf([classes].[lv2]="Allemand" Or [classes].[lv2]="Espagnol",Left([classes].[lv2],3),IIf(([Elèves].[Lv2] Is Not Null) 
            And ([Elèves].[lv2]="Allemand" Or [Elèves].[lv2]="Espagnol"),Left([Elèves].[lv2],3),"")))="Esp" 
            And [T_Notes].[LV2${trim}] Is Not Null And [Elèves].[Sexe]=1,1,0)) AS GarcESPClass, 
                
                
            Sum(IIf(IIf([elèves].[lv2] Is Null And [classes].[lv2] Is Null,"",
            IIf([classes].[lv2]="Allemand" Or [classes].[lv2]="Espagnol",Left([classes].[lv2],3),IIf(([Elèves].[Lv2] Is Not Null) 
            And ([Elèves].[lv2]="Allemand" Or [Elèves].[lv2]="Espagnol"),Left([Elèves].[lv2],3),"")))="Esp" And [T_Notes].[LV2${trim}] Is Not Null 
            And [T_Notes].[LV2${trim}]<10,1,0)) AS ESPInf10, 
                
            Sum(IIf(IIf([elèves].[lv2] Is Null And [classes].[lv2] Is Null,"",
            IIf([classes].[lv2]="Allemand" Or [classes].[lv2]="Espagnol",Left([classes].[lv2],3),IIf(([Elèves].[Lv2] Is Not Null) 
            And ([Elèves].[lv2]="Allemand" Or [Elèves].[lv2]="Espagnol"),Left([Elèves].[lv2],3),"")))="Esp" And [T_Notes].[LV2${trim}] Is Not Null 
            And [T_Notes].[LV2${trim}]<10 And [Elèves].[Sexe]=2,1,0)) AS FilleESPInf10, 
                
            Sum(IIf(IIf([elèves].[lv2] Is Null And [classes].[lv2] Is Null,"",
            IIf([classes].[lv2]="Allemand" Or [classes].[lv2]="Espagnol",Left([classes].[lv2],3),IIf(([Elèves].[Lv2] Is Not Null) 
            And ([Elèves].[lv2]="Allemand" Or [Elèves].[lv2]="Espagnol"),Left([Elèves].[lv2],3),"")))="Esp" And [T_Notes].[LV2${trim}] Is Not Null 
            And [T_Notes].[LV2${trim}]<10 And [Elèves].[Sexe]=1,1,0)) AS GarcESPInf10, 
                
                
            Sum(IIf([T_Notes].[HG${trim}] Is Not Null,1,0)) AS HGClass, 
            Sum(IIf([T_Notes].[HG${trim}] Is Not Null And [Elèves].[Sexe]=2,1,0)) AS FilleHGClass, 
            Sum(IIf([T_Notes].[HG${trim}] Is Not Null And [Elèves].[Sexe]=1,1,0)) AS GarcHGClass,                
                
            Sum(IIf([T_Notes].[HG${trim}] Is Not Null And [T_Notes].[HG${trim}]<10,1,0)) AS HGInf10, 
            Sum(IIf([T_Notes].[HG${trim}] Is Not Null And [T_Notes].[HG${trim}]<10 And [Elèves].[Sexe]=2,1,0)) AS FilleHGInf10, 
            Sum(IIf([T_Notes].[HG${trim}] Is Not Null And [T_Notes].[HG${trim}]<10 And [Elèves].[Sexe]=1,1,0)) AS GarcHGInf10, 
                    
                    
            Sum(IIf([T_Notes].[MATH${trim}] Is Not Null,1,0)) AS MATHClass, 
            Sum(IIf([T_Notes].[MATH${trim}] Is Not Null And [Elèves].[Sexe]=2,1,0)) AS FilleMATHClass, 
            Sum(IIf([T_Notes].[MATH${trim}] Is Not Null And [Elèves].[Sexe]=1,1,0)) AS GarcMATHClass, 

            Sum(IIf([T_Notes].[MATH${trim}] Is Not Null And [T_Notes].[MATH${trim}]<10,1,0)) AS MATHInf10, 
            Sum(IIf([T_Notes].[MATH${trim}] Is Not Null And [T_Notes].[MATH${trim}]<10 And [Elèves].[Sexe]=2,1,0)) AS FilleMATHInf10, 
            Sum(IIf([T_Notes].[MATH${trim}] Is Not Null And [T_Notes].[MATH${trim}]<10 And [Elèves].[Sexe]=1,1,0)) AS GarcMATHInf10, 


            Sum(IIf([T_Notes].[SP${trim}] Is Not Null,1,0)) AS PCClass, 
            Sum(IIf([T_Notes].[SP${trim}] Is Not Null And [Elèves].[Sexe]=2,1,0)) AS FillePCClass, 
            Sum(IIf([T_Notes].[SP${trim}] Is Not Null And [Elèves].[Sexe]=1,1,0)) AS GarcPCClass, 
                    
            Sum(IIf([T_Notes].[SP${trim}] Is Not Null And [T_Notes].[SP${trim}]<10,1,0)) AS PCInf10,
            Sum(IIf([T_Notes].[SP${trim}] Is Not Null And [T_Notes].[SP${trim}]<10 And [Elèves].[Sexe]=2,1,0)) AS FillePCInf10,
            Sum(IIf([T_Notes].[SP${trim}] Is Not Null And [T_Notes].[SP${trim}]<10 And [Elèves].[Sexe]=1,1,0)) AS GarcPCInf10,
                        
                        
            Sum(IIf([T_Notes].[SVT${trim}] Is Not Null,1,0)) AS SVTClass, 
            Sum(IIf([T_Notes].[SVT${trim}] Is Not Null And [Elèves].[Sexe]=2,1,0)) AS FilleSVTClass, 
            Sum(IIf([T_Notes].[SVT${trim}] Is Not Null And [Elèves].[Sexe]=1,1,0)) AS GarcSVTClass, 

            Sum(IIf([T_Notes].[SVT${trim}] Is Not Null And [T_Notes].[SVT${trim}]<10,1,0)) AS SVTInf10, 
            Sum(IIf([T_Notes].[SVT${trim}] Is Not Null And [T_Notes].[SVT${trim}]<10 And [Elèves].[Sexe]=2,1,0)) AS FilleSVTInf10, 
            Sum(IIf([T_Notes].[SVT${trim}] Is Not Null And [T_Notes].[SVT${trim}]<10 And [Elèves].[Sexe]=1,1,0)) AS GarcSVTInf10, 

            
            Sum(IIf([T_Notes].[PHILO${trim}] Is Not Null,1,0)) AS PHILOClass, 
            Sum(IIf([T_Notes].[PHILO${trim}] Is Not Null And [Elèves].[Sexe]=2,1,0)) AS FillePHILOClass, 
            Sum(IIf([T_Notes].[PHILO${trim}] Is Not Null And [Elèves].[Sexe]=1,1,0)) AS GarcPHILOClass, 
                        
            Sum(IIf([T_Notes].[PHILO${trim}] Is Not Null And [T_Notes].[PHILO${trim}]<10,1,0)) AS PHILOInf10, 
            Sum(IIf([T_Notes].[PHILO${trim}] Is Not Null And [T_Notes].[PHILO${trim}]<10 And [Elèves].[Sexe]=2,1,0)) AS FillePHILOInf10, 
            Sum(IIf([T_Notes].[PHILO${trim}] Is Not Null And [T_Notes].[PHILO${trim}]<10 And [Elèves].[Sexe]=1,1,0)) AS GarcPHILOInf10, 
                            
                            
            Sum(IIf([T_Notes].[CF${trim}] Is Not Null,1,0)) AS FRClass,
            Sum(IIf([T_Notes].[CF${trim}] Is Not Null And [Elèves].[Sexe]=2,1,0)) AS FilleFRClass,
            Sum(IIf([T_Notes].[CF${trim}] Is Not Null And [Elèves].[Sexe]=1,1,0)) AS GarcFRClass,

            Sum(IIf([T_Notes].[CF${trim}] Is Not Null And [T_Notes].[CF${trim}]<10,1,0)) AS FRInf10, 
            Sum(IIf([T_Notes].[CF${trim}] Is Not Null And [T_Notes].[CF${trim}]<10 And [Elèves].[Sexe]=2,1,0)) AS FilleFRInf10, 
            Sum(IIf([T_Notes].[CF${trim}] Is Not Null And [T_Notes].[CF${trim}]<10 And [Elèves].[Sexe]=1,1,0)) AS GarcFRInf10, 
          
          
            Niveaux.Cycle
            FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) 
            ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves 
            ON T_Notes.RefElève = Elèves.RefElève
            GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.RefTypeClasse, TypesClasses.Série, Elèves.inscrit, TypesClasses.Filière, Niveaux.Cycle
            HAVING (((Elèves.inscrit)=Yes) AND ((TypesClasses.Filière)=1));                 
            `
            const result = await fetchFromMsAccess<any>(sql, appCnx);
            resolve(result)
        } catch (error) {
            reject(error);
        }
    });
};

const chp1_B_1_a_statistique_resultat_scolaire = () => {
    return new Promise(async (resolve, reject) => {
      try {
        let sql = `
        SELECT Niveaux.RefNiveau, TypesClasses.RefTypeClasse AS RefTypeClasse, [NiveauCourt] & "" & [Série] AS NiveauSerie, (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, TypesClasses.RefTypeClasse, [NiveauCourt] & "" & [Série], TypesClasses.Filière, Elèves.inscrit, Niveaux.cycle
HAVING ((([NiveauCourt] & "" & [Série])="6ème") AND ((TypesClasses.Filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Niveaux.cycle)="1er Cycle"))
ORDER BY 1, 2, 3, 4;
UNION ALL (
SELECT Niveaux.RefNiveau, TypesClasses.RefTypeClasse AS RefTypeClasse, [NiveauCourt] & "" & [Série] AS NiveauSerie, (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, TypesClasses.RefTypeClasse, [NiveauCourt] & "" & [Série], TypesClasses.Filière, Elèves.inscrit, Niveaux.cycle
HAVING ((([NiveauCourt] & "" & [Série])="5ème") AND ((TypesClasses.Filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Niveaux.cycle)="1er Cycle"))
ORDER BY 1, 2, 3, 4;
)
UNION ALL (
SELECT Niveaux.RefNiveau, TypesClasses.RefTypeClasse AS RefTypeClasse, [NiveauCourt] & "" & [Série] AS NiveauSerie, (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, TypesClasses.RefTypeClasse, [NiveauCourt] & "" & [Série], TypesClasses.Filière, Elèves.inscrit, Niveaux.cycle
HAVING ((([NiveauCourt] & "" & [Série])="4ème") AND ((TypesClasses.Filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Niveaux.cycle)="1er Cycle"))
ORDER BY 1, 2, 3, 4;
)
UNION ALL (
SELECT Niveaux.RefNiveau, TypesClasses.RefTypeClasse AS RefTypeClasse, [NiveauCourt] & "" & [Série] AS NiveauSerie, (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, TypesClasses.RefTypeClasse, [NiveauCourt] & "" & [Série], TypesClasses.Filière, Elèves.inscrit, Niveaux.cycle
HAVING ((([NiveauCourt] & "" & [Série])="3ème") AND ((TypesClasses.Filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Niveaux.cycle)="1er Cycle"))
ORDER BY 1, 2, 3, 4;
)
UNION ALL (
SELECT 4 AS RefNiveau, 5 AS RefTypeClasse, "Total 1er Cycle" AS NiveauSerie, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse<5) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
WHERE (((Niveaux.cycle)="1er Cycle") AND ((TypesClasses.filière)=1))
ORDER BY 1, 2, 3, 4;
)
UNION ALL (
SELECT Niveaux.RefNiveau, TypesClasses.RefTypeClasse AS RefTypeClasse, [NiveauCourt] & "" & [Série] AS NiveauSerie, (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, TypesClasses.RefTypeClasse, [NiveauCourt] & "" & [Série], TypesClasses.RefTypeClasse, TypesClasses.Filière, Elèves.inscrit, Niveaux.cycle
HAVING ((([NiveauCourt] & "" & [Série])="2ndeA") AND ((TypesClasses.RefTypeClasse) Not In (10,13)) AND ((TypesClasses.Filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Niveaux.cycle)="2nd Cycle"))
ORDER BY 1, 2, 3, 4;)
UNION ALL (
SELECT Niveaux.RefNiveau, TypesClasses.RefTypeClasse AS RefTypeClasse, [NiveauCourt] & "" & [Série] AS NiveauSerie, (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, TypesClasses.RefTypeClasse, [NiveauCourt] & "" & [Série], TypesClasses.RefTypeClasse, TypesClasses.Filière, Elèves.inscrit, Niveaux.cycle
HAVING ((([NiveauCourt] & "" & [Série])="2ndeC") AND ((TypesClasses.RefTypeClasse) Not In (10,13)) AND ((TypesClasses.Filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Niveaux.cycle)="2nd Cycle"))
ORDER BY 1, 2, 3, 4;
)
UNION ALL (
SELECT Niveaux.RefNiveau, TypesClasses.RefTypeClasse AS RefTypeClasse, [NiveauCourt] & "" & [Série] AS NiveauSerie, (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, TypesClasses.RefTypeClasse, [NiveauCourt] & "" & [Série], TypesClasses.RefTypeClasse, TypesClasses.Filière, Elèves.inscrit, Niveaux.cycle
HAVING ((([NiveauCourt] & "" & [Série])="1èreA") AND ((TypesClasses.RefTypeClasse) Not In (10,13)) AND ((TypesClasses.Filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Niveaux.cycle)="2nd Cycle"))
ORDER BY 1, 2, 3, 4;
)
UNION ALL (
SELECT Niveaux.RefNiveau, TypesClasses.RefTypeClasse AS RefTypeClasse, [NiveauCourt] & "" & [Série] AS NiveauSerie, (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, TypesClasses.RefTypeClasse, [NiveauCourt] & "" & [Série], TypesClasses.RefTypeClasse, TypesClasses.Filière, Elèves.inscrit, Niveaux.cycle
HAVING ((([NiveauCourt] & "" & [Série])="1èreC") AND ((TypesClasses.RefTypeClasse) Not In (10,13)) AND ((TypesClasses.Filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Niveaux.cycle)="2nd Cycle"))
ORDER BY 1, 2, 3, 4;
)
UNION ALL (
SELECT Niveaux.RefNiveau, TypesClasses.RefTypeClasse AS RefTypeClasse, [NiveauCourt] & "" & [Série] AS NiveauSerie, (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, TypesClasses.RefTypeClasse, [NiveauCourt] & "" & [Série], TypesClasses.RefTypeClasse, TypesClasses.Filière, Elèves.inscrit, Niveaux.cycle
HAVING ((([NiveauCourt] & "" & [Série])="1èreD") AND ((TypesClasses.RefTypeClasse) Not In (10,13)) AND ((TypesClasses.Filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Niveaux.cycle)="2nd Cycle"))
ORDER BY 1, 2, 3, 4;
)
UNION ALL (
SELECT Niveaux.RefNiveau, 10 AS RefTypeClasse, "Tle A" AS NiveauSerie, (Select count(*) from Classes Where refTypeClasse in (10,13)) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
WHERE (((TypesClasses.filière)=1) AND ((TypesClasses.RefTypeClasse) In (10,13)) AND ((Elèves.Inscrit)=True) AND ((Niveaux.cycle)="2nd Cycle"))
GROUP BY Niveaux.RefNiveau
ORDER BY 1, 2, 3, 4;
)
UNION ALL (
SELECT Niveaux.RefNiveau, 10 AS RefTypeClasse, "Tle C" AS NiveauSerie, (Select count(*) from Classes Where refTypeClasse in (10,13)) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
WHERE (((TypesClasses.filière)=1) AND ((TypesClasses.RefTypeClasse) In (10,13)) AND ((Elèves.Inscrit)=True) AND ((Niveaux.cycle)="2nd Cycle"))
GROUP BY Niveaux.RefNiveau
ORDER BY 1, 2, 3, 4;
)
UNION ALL (
SELECT Niveaux.RefNiveau, 10 AS RefTypeClasse, "Tle D" AS NiveauSerie, (Select count(*) from Classes Where refTypeClasse in (10,13)) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
WHERE (((TypesClasses.filière)=1) AND ((TypesClasses.RefTypeClasse) In (10,13)) AND ((Elèves.Inscrit)=True) AND ((Niveaux.cycle)="2nd Cycle"))
GROUP BY Niveaux.RefNiveau
ORDER BY 1, 2, 3, 4;
)
UNION ALL (
SELECT 8 AS RefNiveau, 14 AS RefTypeClasse, "Total 2nd Cycle" AS NiveauSerie, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse  BETWEEN 5 AND 13) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
WHERE (((Niveaux.cycle)="2nd Cycle") AND ((TypesClasses.filière)=1))
ORDER BY 1, 2, 3, 4;
)
UNION ALL (
SELECT 9 AS RefNiveau, 15 AS RefTypeClasse, 
"TOTAL GENERAL" AS NiveauSerie, 
(SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse<14) AS NbreClasses, 
Count(Elèves.RefElève) AS EffectTotal, 
Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, 
Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, 
Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY TypesClasses.filière, Elèves.inscrit
HAVING (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
ORDER BY 1, 2, 3, 4;
)`;
        const sqlResult = await fetchFromMsAccess<IChp1_B_1_a[]>(sql, appCnx);
        if (sqlResult.length === 0) return resolve([{}]);
  
        const contentsArray = sqlResult.map((item: IChp1_B_1_a) => {
          const items = _.omit(item, ["orderby", "label","RefNiveau","RefTypeClasse","NiveauSerie"]);
          return {
            items
          };
        });
        // console.log("contentsArray.chp2_5....", contentsArray)
        resolve(contentsArray);
      } catch (err: any) {
        console.log(`err => chp1_B_1_a_statistique_resultat_scolaire`);
        return reject(err);
      }
    });
  };
  
  const rapport = (): Promise<any> => {
    // console.log("rapport...", data)
    return new Promise(async (resolve, reject) => {
      try {
        const {
          anscol1,
          nometab,
          codeetab,
          drencomplet,
          bpetab,
          teletab,
          emailetab,
          titrechefetab,
          nomchefetab,
          internat,
          num_ouverture,
          ville,
          sitgeo,
        } = await paramEtabObjet([
          "anscol1",
          "nometab",
          "codeetab",
          "drencomplet",
          "bpetab",
          "teletab",
          "emailetab",
          "titrechefetab",
          "nomchefetab",
          "internat",
          "num_ouverture",
          "ville",
          "sitgeo",
        ]);
        //les autres parametres du fichier python 
        const identite = await Identite();
  
    const chp1_B_1_a = await chp1_B_1_a_statistique_resultat_scolaire();
        const result = {
          name_report: "prive_secondairegeneral_abidjan3_2trimestre",
          path_report: "prive/secondaire-general/abidjan3",
          identite,
          anscol1,
          nometab,
          codeetab,
          drencomplet,
          bpetab,
          teletab,
          emailetab,
          titrechefetab,
          nomchefetab,
          internat,
          num_ouverture,
          ville,
          sitgeo,
          chp1_B_1_a,  
        };
        // console.log("🚀 ~ returnnewPromise ~ result:", result.chp1_B_1_b)
        resolve(result);
      } catch (err: any) {
        return reject(err);
      }
    });
  };
  

export default {
    // getElevesSecondaireGeneralRendement,
    // getElevesSecondaireGeneralMoyennesParDiscipline,
    rapport
}


