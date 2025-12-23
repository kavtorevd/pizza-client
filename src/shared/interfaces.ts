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
  id:number,
  name:string,
  cost:number,
  sale?:number, 
  type?:string,
  image?:string,
  amount?: number, 
  description?:string;
  ingredients?:{name:string, amount:string}[];
}

export interface IApiGetPizzas {
  count: number,
  next?:null,
  previous?:null,
  results:IPizza_complete[],
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


export interface IUser {
  id?: number;
  phone_number: string;
  name: string;
}

export interface IOrderItem {
  pizza: number,
  pizza_name: string,
  quantity: number,
  price: string
}

export interface IOrder {
  id?: number,
  customer_phone: string,
  delivery_address: string,
  delivery_coordinates: string,
  total_cost: string,
  items: IOrderItem[],
  status?: "pending",
  status_display?: string,
  estimated_delivery_time?: number,
  created_at?: string,
  updated_at?: string,
  driver?: number,
  branch?: number,
  user_name?: string,
  branch_address?: string,
  driver_name?: string
}
