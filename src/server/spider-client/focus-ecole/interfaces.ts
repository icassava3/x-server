interface IAnneeScolaireCodeEtab {
    anneeScolaire: string;
    codeEtab: string;
}

export interface IConfigItem {
    showPhoto?: boolean;
    showContact?: boolean;
}

export interface IFocusEcoleConfig extends IAnneeScolaireCodeEtab {
    config: IConfigItem
}