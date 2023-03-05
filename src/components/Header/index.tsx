import {useContext} from 'react';
import styles from './styles.module.scss';
import Link from 'next/link';
import Image from 'next/image';

// @ts-ignore
import logoImgIndex from '../../../public/index.svg';

import { AuthContext } from '../../contexts/AuthContext'; 

export function Header(){
    const {signOut} = useContext(AuthContext);
    return(
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Link href="/dashboard">
                    <Image width={80} src={logoImgIndex} alt="Logo" />
                </Link>

            </div>
        </header>
    )
}