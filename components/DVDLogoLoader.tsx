import { useEffect, useState } from "react";
import Image from 'next/image';
import dvdLogo from '@/public/dvd_logo.png';
import styles from './DVDLogoLoader.module.css';

function random(n: number) {
  return Math.floor(Math.random() * n)
}

export const DVDLogoLoader = () => {
  useEffect(() => {
    document.documentElement.style.setProperty('--dvd-move-x', `-${random(15)}s`);
    document.documentElement.style.setProperty('--dvd-move-y', `-${random(30)}s`);
  }, []);

  return (
    <div className="w-screen absolute top-0 bot-100 left-0 right-100">
        <Image className={styles.logo} width="125" height="65" src={dvdLogo} alt="DVD Logo" />
    </div>
  );
}