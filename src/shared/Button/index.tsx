import React, { ButtonHTMLAttributes } from 'react';
import cn from 'classnames';
import styles from './styles.module.scss'
import Link from 'next/link';

interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string | undefined;
  children?: React.ReactNode;
  href?:string | undefined;
}

const Button: React.FC<IButton> = ({
  children,
  className,
  disabled,
  onClick,
  type,
  href,
}) => (
  <>
  {href ? (
      <Link className={cn(styles.button_link,className)} href={href}>
        {children}
      </Link>
    ) : (
      <button
        type={type}
        className={cn(className,styles.button)}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
  )}
  </>
);

export default Button;
