

export interface IModeleRapport {
    idModeleRapport: string;
    libelleModeleRapport: string;
    planModeleRapport: IPlanModeleRapport;
    status: 0 | 1;
    revision: number;
}


export interface IPlanModeleRapport {
    index: number;
    title: string;
    name: string;
    type: ITypePlanRapportItem;
    content: string;
    instructions: string;
}

export interface IRapport {
    idRapport?: number;
    idModeleRapport: string;
    planModeleRapport: IPlanModeleRapportItem[];
    anneeScolaire: string;
    codeEtab: string;
    libelleRapport:  string
    revisionModeleRapport: number
    // status: IStatus;
}

export interface IPlanModeleRapportItem {
    index: number;
    title: string;
    name: string;
    type: ITypePlanRapportItem;
    content: string;
    instructions: string;
}

export type ITypePlanRapportItem = "textarea" | "h5" | "h6" | "p" | "span";
export type IStatus = 0|1;







