/*
export interface INavItem {
  text?: string;
  link: string;
  id: number;
}

export interface IDataArticles<T> {
  id: number;
  slug: string;
  name: string;
  articles: T;
}

*/


export interface IPizza{
    name:string,
    image:string,
    cost:number,
    sale:number,
    amount?: number, 
    id?:number,
    description?:string;
}

export interface ILocation {
  id?: number;
  address: string;
  name?: string;
  lat: number;
  lng: number; 
  deliveryTime?: string;
  minOrder?: number;
}

export interface ILocationPrint {
  id?: number;
  address: string;
  name: string;
}