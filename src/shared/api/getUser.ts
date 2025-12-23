import { IUserAll } from "../interfaces";

async function getUser(user_data:{name:string, phone:string}) {
  try{
    const response = await fetch(
      `http://localhost:8000/auth/register/customer/getID`,
      {
        body: JSON.stringify(user_data),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      }
    ).then((res) => {
          console.log(res)
      if (res.ok) return res.json();
      else throw new Error(`ERROR: ${res.status} ${res.statusText}`);
    });
    const res = response;
    return res.exists;
  }
   catch(e){
      return false
   } 
}

export default getUser;