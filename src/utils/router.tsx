import React, {useContext, useMemo} from 'react';
import {FaRegAddressCard} from 'react-icons/fa';
import Link from 'next/link';

import {VscProject} from 'react-icons/vsc';


export function Paths(){
    return(<React.Fragment>
            <Link href="/signup">
                <FaRegAddressCard color="#FFF" size={24}/>
            </Link>
			

        </React.Fragment>);
}
