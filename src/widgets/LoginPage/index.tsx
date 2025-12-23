'use client'
import { IMaskInput } from 'react-imask'

import Button from "@/shared/Button";
import styles from './styles.module.scss'
import { useState } from "react";
import {PLACEHOLDERS} from '@/shared/constants'
import Link from 'next/link';
import { ROUTING } from '@/shared/routing';
import getUser from '@/shared/api/getUser';
import newUser from '@/shared/api/newUser';


export default function LoginPage({type}:{type:string}) {
  const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
  
  const fetchFuncAutn = async ()=>{
    const data = {name:name, phone:phone};
    console.log(data)
    const res = await getUser(data);
    return res;
  }

  const fetchFuncReg = async ()=>{
    const data = { phone_number: phone, name: name};
    console.log(data)
    const res = await newUser(data, email);
    if (typeof res == 'string') {window.alert(res); return}
    return (res.id);
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
        e.preventDefault();
    }

    if (type=='Login') {
      const res = await fetchFuncAutn();
      if (res) {
        localStorage.setItem('userName', name);
        localStorage.setItem('userPhone', phone);
        window.location.href = '/';}
      else
        window.alert("Пользователь не найден");
    }


    if (type=='Registration') {
      const res = await fetchFuncReg();
      if (res) {
        localStorage.setItem('userName', name);
        localStorage.setItem('userPhone', phone);
        window.location.href = '/';
      }
      }

    console.log('Phone:', phone);
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.container}>
        <h1 className={styles.title}>{type}</h1>
        <IMaskInput
          mask="+7 (000) 000-00-00"
          value={phone}
          onAccept={setPhone}
          placeholder={PLACEHOLDERS.number_placeholder}
          id={'number-input'}
        />
            <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={PLACEHOLDERS.name_placeholder}
        id={'name-input'}
        />
        {
        (type=='Registration')&& <>
             <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={PLACEHOLDERS.email_placeholder}
          id={'email-input'}
        />
        </>
        }
        <label className={styles.login_checkbox}>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            id={'rem-checkbox'}
          />
          Remember me
        </label>
      </div>
       <Button type="submit" className={styles.sub_button}
       onClick={(e)=>{handleSubmit(e)}}
       >{(type=='Registration')?'Register':'Sign in'}</Button>
       {(type=='Login')&&<Link href={ROUTING.registration.href} className={styles.linkStyle}>Еще не зарегистрирированы?</Link>}
       <Link href={ROUTING.home.href} className={styles.linkStyle}>Зайти без авторизации</Link>
    </form>
  )
}
