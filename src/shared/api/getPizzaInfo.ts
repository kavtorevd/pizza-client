import {IPizza } from "../interfaces";

async function getPizzaInfo(id:number) {
  try{
    const response = await fetch(
      `http://127.0.0.1:8000/pizzas/${id}`,
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
    const res:IPizza = response;
    return res;}
   catch(e){
      return "Простите, произошла ошибка"
   } 
}

export default getPizzaInfo;