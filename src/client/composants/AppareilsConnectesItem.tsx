import React from 'react'
import { Caption, ProgressCircular } from 'ui-neumorphism';

export interface AppareilsConnectesItemProps {
    useDarkMode: boolean;
    libelle: string;
    devicePercent: number;
    count: number

}

const AppareilsConnectesItem: React.FC<AppareilsConnectesItemProps> = ({ useDarkMode, libelle, devicePercent, count }) => {
    return (
        <div className='d-flex align-center justify-center' style={{ flexDirection: "column" }}  >
            <div>
                {/* @ts-ignore */}
                <ProgressCircular dark={useDarkMode} size={40} value={devicePercent} color='var(--info)' label={`${count}`} />
            </div>
            <div >
                {/* @ts-ignore */}
                <Caption style={{ color: 'gray' }}>
                    {libelle}
                </Caption>
            </div>
        </div>
    )
}

export default AppareilsConnectesItem