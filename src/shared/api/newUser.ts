import { IUser } from "../interfaces";

async function newUser(user_data:IUser, email:string) {
  const data = {
    password:email,
    username:(user_data.phone_number + user_data.name)
    .replace(/[^a-zA-Z0-9]/g, ''),
    phone_number:user_data.phone_number,
    name:user_data.name,
  }
  try{
    const response = await fetch(
      `http://localhost:8000/users/users/`,
      {
        body: JSON.stringify(data),

        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token 5a4fd672a7f4bcbe5537dc745db4fb827918d12a'
        },
        method: 'POST',
      }
    ).then((res) => {
      if (res.ok) return res.json();
      else throw new Error(`ERROR: ${res.status} ${res.statusText}`);
    });
    const res:IUser = response;
    return res;}
   catch(e){
      return "Простите, произошла ошибка"
   } 
}

export default newUser;