import { mdiWebCheck, mdiWebRemove } from '@mdi/js';
import React from 'react'
import { useSelector } from 'react-redux';
import { IReduxState } from '../../../client/store/store';
import Icon from '@mdi/react';
import { Chip } from 'ui-neumorphism';

export const InternetAvailable = () => {
    const {  dashboardStatus } = useSelector((state: IReduxState) => state.application);

    return (
        <>
            {/* @ts-ignore */}
            <Chip
                type={`${dashboardStatus.isInternetAvailable ? "success" : "error"}`}
                className='ml-2 mb-2'
            >
                <Icon path={dashboardStatus.isInternetAvailable ? mdiWebCheck : mdiWebRemove} size={0.68} />
                {dashboardStatus.isInternetAvailable ? "Internet disponible !" : "Internet indisponible !"}
            </Chip>
        </>
    )
}
