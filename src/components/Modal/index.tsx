import React, {useCallback, useState} from "react";
import Modal from 'react-modal';
import styles from './styles.module.scss';

import {FiX} from 'react-icons/fi'
import {GiTrashCan, GiConfirmed, GiCancel} from 'react-icons/gi'


interface ModalOrderProps {
    isOpen: boolean;
    item: any;
    onRequestClose: () => void;
    component: React.ReactNode;
    postFormAction : () => Promise<any>;
    handleRowDeleteEntity: (oldData:any) => Promise<void>;
}

export function ModalDash({isOpen, item, onRequestClose, component, handleRowDeleteEntity, postFormAction}: ModalOrderProps) {
    const [openDelete, setOpenDelete] = useState(false);

    const customStyles = {
        content: {
            top: '50%',
            bottom: 'auto',
            left: '50%',
            right: 'auto',
            padding: '30px',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#1d1d2e',
        }
    };

    const handleDelete = useCallback(() => {
        setOpenDelete(true);
    }, []);

    const confirmHandleDelete = useCallback(() => {
        handleRowDeleteEntity(item).then(r => {

            postFormAction().then(r => {
                setOpenDelete(false);
                onRequestClose();
            });
        });
    }, [item]);

    const abandonHandleDelete = useCallback(() => {
        setOpenDelete(false);
    }, []);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={customStyles}
        >
            {!openDelete ?
                <div>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="react-modal-close"
                        style={{background: 'transparent', border: 0}}
                    >
                        <GiTrashCan size={45} color="#f34748"/>
                    </button>

                    <button
                        type="button"
                        onClick={onRequestClose}
                        className="react-modal-close"
                        style={{background: 'transparent', border: 0}}
                    >
                        <FiX size={45} color="#8A8A8A"/>
                    </button>
                </div>
                :
                <div>
                    <label className={styles.label}>Are you ready to delete it?</label>

                    <button
                        type="button"
                        onClick={confirmHandleDelete}
                        className="react-modal-close"
                        style={{ background: 'transparent', border: 0}}
                    >
                        <GiConfirmed size={45} color="#3fffa3"/>
                    </button>
                    <button
                        type="button"
                        onClick={abandonHandleDelete}
                        className="react-modal-close"
                        style={{background: 'transparent', border: 0}}
                    >
                        <GiCancel size={45} color="#f34748"/>
                    </button>
                </div>
            }

            <div className={styles.container}>
                {component}
            </div>

        </Modal>
    )
}