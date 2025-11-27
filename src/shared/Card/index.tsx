import React, { ButtonHTMLAttributes } from 'react';
import cn from 'classnames';
import styles from './styles.module.scss'
import Link from 'next/link';
import Imagetmp from "@@/images/image.png";
import Image from 'next/image';


interface ICard {
  name: string;
  image?: string| undefined;
  href?:string | undefined;
  cost: number;
  sale?: number | undefined;
  currency:string;
}

const Card= ({
  name,
  image,
  href,
  cost,
  sale,
  currency
}:ICard) => (
  <div className={styles.container}>
    <div className={styles.image_container}>
      <Image
            className={styles.articleImg}
            src={image||Imagetmp.src}
            width={400}
            height={300}
            alt={`картинка`}
            priority
      />
    </div>
    <div className={styles.name_line}>{name}</div>
    <div className={styles.cost_line}>
        <div className={cn(styles.def_price, sale&&styles.def_price__saled )}>{cost + currency}</div>
        {sale&&<div className={styles.sale}>{sale + currency}</div>}
      </div>
  </div>
);

export default Card;
