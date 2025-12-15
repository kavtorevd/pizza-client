'use client'
import { IMaskInput } from 'react-imask'

import Button from "@/shared/Button";
import styles from './styles.module.scss'
import { useState } from "react";
import {PLACEHOLDERS} from '@/shared/constants'


export default function LoginPage({type}:{type:string}) {
  const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Phone:', phone)
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
        {
        (type=='Registration')&& <>
             <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={PLACEHOLDERS.email_placeholder}
          id={'email-input'}
        />
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={PLACEHOLDERS.name_placeholder}
                id={'name-input'}
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
       <Button href={'/home'} type="submit" className={styles.sub_button}>{(type=='Registration')?'Register':'Sign in'}</Button>
    </form>
  )
}
