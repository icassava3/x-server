export interface IPartner {
    idPartenaire:string,
    libelle:string
} 

export interface IService {
    idService: string,
    idPartenaire: string,
    libelle: string,
    description: string,
    config: any,
    activated: number,
    initialized: number,
    neededKey: number,
}

export interface IActivateDeactivateService {
    serviceId:string,
    spiderKey?:string,
    partnerKey?:string,
    methode?:string,
    apikey?:string,
    site_id?:number

}