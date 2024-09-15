//interface pour activer un service
export interface IActivateService {
    apiKey:string,
    siteId:string,
    serviceId:string
}

export interface IPaymentData {
    codeEtab:string,
    anneeScolaire:string,
    amount:number,
    studentId:number
    op:string,
    requestDate?: Date,
    // details: IPaymentDataDetailItem[] v1
    details: {
        echeanciersRubriquesOptionnelles: IEcheanciersRubriquesOptionnelles[];
        montantRubriqueObligatoire: number
    }
}
export interface IEcheanciersRubriquesOptionnelles {
    montant: number;
    idSouscriptionFraisRubriqueOptionnel: number
}

//v1
// export interface IPaymentDataDetailItem {
//     idRubrique:string,
//     montant:number
// }

export interface ICredentialItem {
    codeEtab: string;
    apikey: string;
    site_id: number;
};

export interface ICheckPaymentStatusPayload {
    codeEtab: string;
    transaction_id: string;
};


export interface ICinetPayLogItem {
    id: string;
    action: string;
    payload: number[]|null;
    statut: number;
    date: string;
  }