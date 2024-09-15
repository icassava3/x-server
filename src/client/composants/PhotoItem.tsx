import React from 'react';
import { Caption, Card, Chip } from 'ui-neumorphism';

export interface ISchoolControlActiviteItemProps {
    useDarkMode: boolean;
    libelle: string;
    count: number;

}

const PhotoItem: React.FC<ISchoolControlActiviteItemProps> = ({ useDarkMode, libelle, count }) => {
    return (
        // @ts-ignore
        <Card
            dark={useDarkMode}
            rounded={false}
            className='mb-3 py-1 pl-4 pr-0 d-flex align-center justify-space-between'
        >
            {/* @ts-ignore */}

            <Card flat className='d-flex align-center justify-center'>
                {/* @ts-ignore */}
                <Caption secondary>
                    {libelle}
                </Caption>
            </Card>


            <div
                className='d-flex align-center mr-4'
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',

                }}
            >
                {/* @ts-ignore */}
                <Chip key='1' dark={useDarkMode} style={{ color: "var(--primary)" }} className='ma-1'>
                    {count}
                </Chip>
            </div>
            {/* <Icon path={mdiBell} size={1} /> */}
        </Card>
    )
}

export default PhotoItem