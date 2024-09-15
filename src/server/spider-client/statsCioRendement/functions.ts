import { appCnx, fetchFromMsAccess, paramEtabObjet } from '../../databases/accessDB';
import { IElevesSecondaireGeneralMoyennesParDiscipline, IElevesSecondaireGeneralRendementParDfaEtSexe, IElevesSecondaireGeneralRendementParDiscipline2, IElevesSecondaireGeneralRendementParTrancheMoyEtSexe } from './interfaces';


/**
 * Récapitulatif des résultats des élèves par tranche de moyennes 
 * et par sexe au général
 * @returns 
 */
const getElevesSecondaireGeneralRendementParTrancheMoyEtSexe = (trim: number): Promise<IElevesSecondaireGeneralRendementParTrancheMoyEtSexe[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT 
            Niveaux.RefNiveau, 
            Niveaux.NiveauCourt, 
            TypesClasses.Série AS Serie, 
            Sum(IIf([Elèves].[inscrit]=-1 And [Elèves].[Sexe]=2,1,0)) AS FilleIns, 
            Sum(IIf([Elèves].[inscrit]=-1 And [Elèves].[Sexe]=1,1,0)) AS GarcIns, 
            Sum(IIf([Elèves].[inscrit]=-1 And [Elèves].[Sexe]=2 And [T_Notes].[MOYG${trim}] Is Not Null,1,0)) AS FilleClass, 
            Sum(IIf([Elèves].[inscrit]=-1 And [Elèves].[Sexe]=1 And [T_Notes].[MOYG${trim}] Is Not Null,1,0)) AS GarcClass, 
            Sum(IIf([Elèves].[inscrit]=-1 And [Elèves].[Sexe]=2 And [T_Notes].[MOYG${trim}]>=10,1,0)) AS FilleMoySup10, 
            Sum(IIf([Elèves].[inscrit]=-1 And [Elèves].[Sexe]=1 And [T_Notes].[MOYG${trim}]>=10,1,0)) AS GarcMoySup10, 
            Sum(IIf([Elèves].[inscrit]=-1 And [Elèves].[Sexe]=2 And [T_Notes].[MOYG${trim}]>=8.5 And [T_Notes].[MOYG${trim}]<10,1,0)) AS FilleMoyEntr810,
            Sum(IIf([Elèves].[inscrit]=-1 And [Elèves].[Sexe]=1 And [T_Notes].[MOYG${trim}]>=8.5 And [T_Notes].[MOYG${trim}]<10,1,0)) AS GarcMoyEntr810,
            Sum(IIf([Elèves].[inscrit]=-1 And [Elèves].[Sexe]=2 And [T_Notes].[MOYG${trim}]<8.5,1,0)) AS FilleMoyInf8, 
            Sum(IIf([Elèves].[inscrit]=-1 And [Elèves].[Sexe]=1 And [T_Notes].[MOYG${trim}]<8.5,1,0)) AS GarcMoyInf8,
            IIf(IsNull([TypesClasses].[Série]),[Niveaux].[NiveauCourt],[Niveaux].[NiveauCourt] & '' & [TypesClasses].[Série]) AS libelleNiveauParSerie
        FROM 
            ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) 
            ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) 
            INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève 
        GROUP BY 
            Niveaux.RefNiveau, 
            Niveaux.NiveauCourt, 
            TypesClasses.Série, 
            TypesClasses.filière, 
            Elèves.inscrit
        HAVING 
            (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
        `;
            const result = await fetchFromMsAccess<any>(sql, appCnx);
            resolve(result)
        } catch (error) {
            reject(error);
        }
    });
};


/**
 * Récapitulatif des résultats des élèves par décision de fin d'année
 * et par sexe au général
 * @returns 
 */
const getElevesSecondaireGeneralRendementParDfaEtParSexe = (trim: number): Promise<IElevesSecondaireGeneralRendementParDfaEtSexe[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT 
            Niveaux.RefNiveau, 
            Niveaux.NiveauCourt, 
            TypesClasses.Série AS Serie, 
            Sum(IIf([Elèves].[inscrit]=-1 And [Elèves].[Sexe]=2,1,0)) AS FilleIns, 
            Sum(IIf([Elèves].[inscrit]=-1 And [Elèves].[Sexe]=1,1,0)) AS GarcIns, 
            Sum(IIf([Elèves].[inscrit]=-1 And [Elèves].[Sexe]=2 And [T_Notes].[MOYG${trim}] Is Not Null,1,0)) AS FilleClass, 
            Sum(IIf([Elèves].[inscrit]=-1 And [Elèves].[Sexe]=1 And [T_Notes].[MOYG${trim}] Is Not Null,1,0)) AS GarcClass, 
        
            Sum(IIf([Elèves].[inscrit]=-1 And [Elèves].[Sexe]=2 And ([Elèves].[Décision] IS NULL OR [Elèves].[Décision] IN ("A", "D", "C", "Tr", "TrC", "TrA", "TrD")),1,0)) AS FilleAdmise,
            Sum(IIf([Elèves].[inscrit]=-1 And [Elèves].[Sexe]=1 And ([Elèves].[Décision] IS NULL OR [Elèves].[Décision] IN ("A", "D", "C", "Tr", "TrC", "TrA", "TrD")),1,0)) AS GarcAdmis,
        
            Sum(IIf([Elèves].[inscrit]=-1 And [Elèves].[Sexe]=2 And ([Elèves].[Décision] IN ("R", "RA", "RC", "RD", "RE", "TrR", "TrRC", "TrRA", "TrRD")),1,0)) AS FilleRedoublante,
            Sum(IIf([Elèves].[inscrit]=-1 And [Elèves].[Sexe]=1 And ([Elèves].[Décision] IN ("R", "RA", "RC", "RD", "RE", "TrR", "TrRC", "TrRA", "TrRD")),1,0)) AS GarcRedoublant,
        
            Sum(IIf([Elèves].[inscrit]=-1 And [Elèves].[Sexe]=2 And ([Elèves].[Décision] IN ("E")),1,0)) AS FilleExclue,
            Sum(IIf([Elèves].[inscrit]=-1 And [Elèves].[Sexe]=1 And ([Elèves].[Décision] IN ("E")),1,0)) AS GarcExclu,
            IIf(IsNull([TypesClasses].[Série]),[Niveaux].[NiveauCourt],[Niveaux].[NiveauCourt] & '' & [TypesClasses].[Série]) AS libelleNiveauParSerie

        FROM 
            (
                (Niveaux 
                INNER JOIN (TypesClasses 
                    INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) 
                ON Niveaux.RefNiveau = TypesClasses.Niveau) 
            INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) 
        INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
        GROUP BY 
            Niveaux.RefNiveau, 
            Niveaux.NiveauCourt, 
            TypesClasses.Série, 
            TypesClasses.filière, 
            Elèves.inscrit
        HAVING 
            (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
        `;

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
const getElevesSecondaireGeneralMoyennesParDiscipline = (trim: number): Promise<IElevesSecondaireGeneralMoyennesParDiscipline[]> => {
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
            IIf(IsNull([TypesClasses].[Série]),[Niveaux].[NiveauCourt],[Niveaux].[NiveauCourt] & '' & [TypesClasses].[Série]) AS libelleNiveauParSerie,
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

const getMoyennsParTrimEtParMatiere = (trim: number): Promise<IElevesSecondaireGeneralRendementParDiscipline2[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);

            const sql = `SELECT 
            "${anscol1}" AS anneeScolaire, 
            "${codeetab}" AS codeEtab, 
            IIf([Niveaux].[Cycle] = "2nd Cycle",2,1) AS cycle, 
            Elèves.LV2 AS eleveLV2, 
            Elèves.DateNaiss AS dateNaissance, 
            IIf([Elèves].[Décision] IN ("R", "RA", "RC", "RD", "RE", "TrR", "TrRC", "TrRA", "TrRD"),1,0) AS dfa, 
            T_Notes.RefElève AS idEleve, 
            T_Notes.RefTypeClasse, 
            T_Notes.RefClasse, 
            IIf([Niveaux].[Cycle] = "2nd Cycle", 22, IIf([T_Notes].[CF${trim}] Is Null,21,[T_Notes].[CF${trim}])) AS CF${trim}, 
            IIf([Niveaux].[Cycle] = "2nd Cycle", 22, IIf([T_Notes].[OG${trim}] Is Null,21,[T_Notes].[OG${trim}])) AS OG${trim}, 
            T_Notes.EO1, 
            IIf([Niveaux].[Cycle] = "1er Cycle", 22, IIf([T_Notes].[FR${trim}] Is Null,21,[T_Notes].[FR${trim}])) AS FR${trim}, 
            IIf([Niveaux].[Cycle] = "1er Cycle", 22, IIf([T_Notes].[PHILO${trim}] Is Null,21,[T_Notes].[PHILO${trim}])) AS PHILO${trim}, 
            IIf([T_Notes].[HG${trim}] Is Null,21,[T_Notes].[HG${trim}]) AS HG${trim}, 
            IIf([T_Notes].[AN${trim}] Is Null,21,[T_Notes].[AN${trim}]) AS AN${trim},  
            IIf([T_Notes].[LV2${trim}] Is Null,21,[T_Notes].[LV2${trim}]) AS LV2${trim}, 
            IIf([Elèves].[LV2] = "Allemand", IIf([T_Notes].[LV2${trim}] Is Null,21,[T_Notes].[LV2${trim}]),22) AS ALL${trim}, 
            IIf([Elèves].[LV2] = "Espagnol", IIf([T_Notes].[LV2${trim}] Is Null,21,[T_Notes].[LV2${trim}]),22) AS ESP${trim},  
            IIf([T_Notes].[MATH${trim}] Is Null,21,[T_Notes].[MATH${trim}]) AS MATH${trim}, 
            IIf([T_Notes].[SP${trim}] Is Null,21,[T_Notes].[SP${trim}]) AS SP${trim}, 
            IIf([T_Notes].[SVT${trim}] Is Null,21,[T_Notes].[SVT${trim}]) AS SVT${trim}, 
            T_Notes.EPS1, 
            T_Notes.APMUS1, 
            T_Notes.ECM1, 
            IIf([T_Notes].[COND${trim}] Is Null,21,[T_Notes].[COND${trim}]) AS COND${trim}, 
            T_Notes.MOYG${trim}, 
            T_Notes.MOYG2 AS MOYG2_, 
            T_Notes.MOYG3 AS MOYG3_, 
            T_Notes.MOYG4 AS MOYG4_, 
            T_Notes.MCA1, 
            T_Notes.MCB1, 
            T_Notes.Info1, 
            T_Notes.TM1, 
            T_Notes.MCC1, 
            T_Notes.MCD1, 
            Elèves.LV2, 
            Elèves.Arts, 
            Classes.LV2 AS classeLV2, 
            Classes.Arts AS classeArts, 
            T_Notes.CoefFR1, 
            T_Notes.CoefPHILO1, 
            T_Notes.CoefHG1, 
            T_Notes.CoefAN1, 
            T_Notes.CoefLV21, 
            T_Notes.CoefMATH1, 
            T_Notes.CoefSP1, 
            T_Notes.CoefSVT1, 
            T_Notes.CoefEPS1, 
            T_Notes.CoefAPMUS1, 
            T_Notes.CoefECM1, 
            T_Notes.CoefCOND1, 
            Elèves.TélTuteur AS telTuteur, 
            Elèves.PrénomElève AS prenomEleve, 
            Classes.ClasseCourt AS libelleClasseCourt, 
            ordre_enseig.ref_ordre_enseig AS idOrdreEnseignement, 
            Classes.ClasseLong AS libelleClasseLong, 
            Elèves.MatriculeNational AS matriculeEleve, 
            TypesClasses.Série AS serie, 
            TypesClasses.RefTypeClasse AS idTypeClasse, 
            Niveaux.RefNiveau AS idNiveau, 
            Filières.OrdreEnseignement AS ordreEnseignement, 
            Niveaux.NiveauCourt AS libelleNiveauCourt, 
            Classes.RefClasse AS idClasse, 
            IIf(IsNull([TypesClasses].[Série]),[Niveaux].[NiveauCourt],[Niveaux].[NiveauCourt] & '' & [TypesClasses].[Série]) AS libelleNiveauParSerie, 
            Elèves.Décision AS decision, 
            IIf([Elèves].[Sexe]=1,"M","F") AS sexe, 
            Elèves.NomElève AS nomEleve,   
            Niveaux.NiveauCourt AS niveauCourt
        
        FROM 
            (ordre_enseig 
            INNER JOIN Filières ON ordre_enseig.ref_ordre_enseig = Filières.ref_ordre_enseig) 
            INNER JOIN (
                Niveaux 
                INNER JOIN (
                    TypesClasses 
                    INNER JOIN (
                        (T_Notes 
                        INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève) 
                        INNER JOIN Classes ON Elèves.RefClasse = Classes.RefClasse
                    ) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
                ) ON Niveaux.RefNiveau = TypesClasses.Niveau
            ) ON Filières.RefFilière = TypesClasses.Filière
        
        WHERE 
            (((Elèves.TélTuteur) Is Not Null And (Elèves.TélTuteur)<>"") AND ((ordre_enseig.ref_ordre_enseig)=4))
        
        ORDER BY 
            Classes.OrdreClasse, 
            Elèves.NomElève, 
            Elèves.PrénomElève
                   
            `;
            const result = await fetchFromMsAccess<any[]>(sql, appCnx);
            resolve(result);
        } catch (error) {
            console.log("🚀 ~ file: functions.ts:259 ~ returnnewPromise<IMoyenneGeneral[]> ~ error:", error)
            reject(error);
        }
    })
}

/**
 * recuperer les notes du general
 * @param periodeEval 
 * @returns 
 */
export function fetchNotesGeneral(periodeEval: number): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT Notes.RefElève AS idEleve, Notes.RangCF1, Notes.RangOG1, Notes.RangEO1, Notes.RangFR1, Notes.RangPHILO1, Notes.RangHG1,
         Notes.RangAN1, Notes.RangLV21, Notes.RangMATH1, Notes.RangSP1, Notes.RangSVT1, Notes.RangEPS1, Notes.RangAPMUS1,
          Notes.RangECM1, Notes.RangMCA1, Notes.RangMCB1, Notes.RangInfo1, Notes.RangMCC1, Notes.RangMCD1, Notes.RangG1, Notes.RangG2 AS RangG2_, Notes.RangG3 AS RangG3_, Notes.RangG4 AS RangG4_
        FROM Notes;            
        `.replace(/1/g, periodeEval.toString());
            const result = await fetchFromMsAccess<any[]>(sql, appCnx);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

export default {
    getElevesSecondaireGeneralRendementParTrancheMoyEtSexe,
    getElevesSecondaireGeneralMoyennesParDiscipline,
    getElevesSecondaireGeneralRendementParDfaEtParSexe,
    getMoyennsParTrimEtParMatiere,
    fetchNotesGeneral
}


