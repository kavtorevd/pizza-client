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
}

export interface ILocation{
    name:string,
    address:string,
}