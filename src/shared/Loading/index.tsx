import React, { ButtonHTMLAttributes } from 'react';
import Pizza1 from '@@/images/Pizza/pizza1.png';
import Pizza2 from '@@/images/Pizza/pizza2.png';
import Pizza3 from '@@/images/Pizza/pizza3.png';
import Pizza4 from '@@/images/Pizza/pizza4.png';
import Pizza5 from '@@/images/Pizza/pizza5.png';
import Image  from 'next/image';
import styles from './styles.module.scss'

interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string | undefined;
  children?: React.ReactNode;
  href?:string | undefined;
}

const Loading: React.FC<IButton> = () => (
  <div className={styles.container}>
    <div className={styles.chank1}>
      <div className={styles.sausage}>@</div>
      <Image 
        src={Pizza1} 
        alt="Pizza 1" 
        width={150}
        height={150}
      />
    </div>
    <div className={styles.chank2}>
      <div className={styles.sausage}>@</div>
      <Image 
        src={Pizza2} 
        alt="Pizza 1" 
        width={150}
        height={150}
      />
    </div>
    <div className={styles.chank3}>
      <div className={styles.sausage}>@</div>
      <Image 
        src={Pizza3} 
        alt="Pizza 1" 
        width={150}
        height={150}
      />
    </div>
    <div className={styles.chank4}>
      <div className={styles.sausage}>@</div>
      <Image 
        src={Pizza4} 
        alt="Pizza 1" 
        width={150}
        height={150}
      />
    </div>
    <div className={styles.chank5}>
      <div className={styles.sausage}>@</div>
      <Image 
        src={Pizza5} 
        alt="Pizza 1" 
        width={150}
        height={150}
      />
    </div>
  </div>
);

export default Loading;
