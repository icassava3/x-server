import { mdiCheck, mdiClose, mdiInformationVariantCircleOutline } from '@mdi/js';
import Icon from '@mdi/react';
import React from 'react';
import { Caption, Card, IconButton } from 'ui-neumorphism';


export interface IStatusIconButtonProps {
    useDarkMode: boolean;
    libelleIcon: string;
    status: number;
}

const iconTheme = {
    1: { color: 'var(--success)', icon: mdiCheck },
    2: { color: 'orange', icon: mdiInformationVariantCircleOutline, message: "Veuillez fermer SPIDER et le relancer !" },
    0: { color: '#ff0000', icon: mdiClose }
};
const StatusIconButton: React.FC<IStatusIconButtonProps> = ({ useDarkMode, libelleIcon, status }) => {


    return (
        <div
            className='ml-8 mb-4'
            style={{
                display: 'flex',
                justifyContent: 'space-between'
            }}
        >
            {/* @ts-ignore */}
            <Caption secondary dark={useDarkMode} style={{ paddingTop: 5 }} >{libelleIcon}</Caption>
            {/* @ts-ignore */}

            <Card
                dark={useDarkMode}
                className='d-flex align-center mr-4'
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
               
                    {/* @ts-ignore */}
                    <IconButton
                        size='small'
                        rounded
                        dark={useDarkMode}
                        color={iconTheme[status].color}
                    >
                        <Icon path={iconTheme[status].icon} size={0.8} />
                    </IconButton>
            </Card>
        </div >
    )
}

export default StatusIconButton