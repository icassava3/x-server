import React from 'react';
import { Caption, Card, Divider } from 'ui-neumorphism';
import { IObjetConncte } from '../Data/data';
import StatusIconLibelle from './StatusIconLibelle';

export interface IObjetCOnnecte {
    itemIObjetConncte: IObjetConncte;
    useDarkMode: boolean;
}

const ObjetConnecteItem: React.FC<IObjetCOnnecte> = ({ itemIObjetConncte, useDarkMode }) => {
    return (
        // @ts-ignore
        <Card
            dark={useDarkMode}
            rounded={false}
            className='mb-5 py-2 pl-4 pr-0 d-flex align-center justify-space-between'
        >
            {/* @ts-ignore */}
            <Card flat className='d-flex align-center'>
                {/* @ts-ignore */}
                <Caption secondary >
                    {itemIObjetConncte.objetName}
                </Caption>
                {/* @ts-ignore */}
                <Divider dense dark={useDarkMode} />
            </Card>

            <StatusIconLibelle status={itemIObjetConncte.status} type={1} />
        </Card>
    )
}

export default ObjetConnecteItem