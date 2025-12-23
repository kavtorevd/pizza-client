import { IApiGetPizzas } from "../interfaces";

async function getPizzas() {
  try{
    const response = await fetch(
      `http://127.0.0.1:8000/pizzas/`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',
      }
    ).then((res) => {
      if (res.ok) return res.json();
      else throw new Error(`ERROR: ${res.status} ${res.statusText}`);
    });
    const res:IApiGetPizzas = response;
    return res;}
   catch(e){
      return "Простите, произошла ошибка"
   } 
}

export default getPizzas;