import {useContext, useMemo} from 'react';
import styles from './styles.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import {AuthContext, UserProps} from '../../contexts/AuthContext';
import {FiLogOut} from 'react-icons/fi';
// @ts-ignore
import logoImgIndex from '../../../public/index.svg';

export function Header({name}: UserProps){
    const {signOut} = useContext(AuthContext);
    return(
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Link href="/dashboard">
                    <Image width={80} src={logoImgIndex} alt="Logo" />
                </Link>
                <nav className={styles.menuNav}>
                    <div>{name}</div>
                    <button onClick={signOut}>
                        <FiLogOut color="#FFF" size={24}/>
                    </button>
                </nav>
            </div>
        </header>
    )
}
