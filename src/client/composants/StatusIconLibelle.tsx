import React from 'react';
import { useSelector } from 'react-redux';
import { Chip } from 'ui-neumorphism';
import { IReduxState } from '../store/store';

export interface IStatusIconLibelleProps {
    status: boolean;
    type?: number;

}

const StatusIconLibelle: React.FC<IStatusIconLibelleProps> = ({ status, type }) => {

    const { useDarkMode } = useSelector((state: IReduxState) => state.application);

    return (
        <div
            className='d-flex align-center mr-4'
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',

            }}
        >
            {/* @ts-ignore */}
            <Chip dark={useDarkMode} type={`${status ? 'success' : 'error'}`} >
                {status
                    ? type ? ' ON' : "Activé"
                    : type ? ' OFF' : "Désactivé"
                }            </Chip>
        </div>
    )
}

export default StatusIconLibelle