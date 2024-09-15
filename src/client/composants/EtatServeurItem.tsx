import React from 'react';
import { Caption, Card, Divider } from 'ui-neumorphism';
import { IServeur } from '../Data/data';
import StatusIconLibelle from './StatusIconLibelle';

export interface IEtatServeurItemProps {
    itemEtatServeur: IServeur;
    useDarkMode: boolean;

}
const EtatServeurItem: React.FC<IEtatServeurItemProps> = ({ itemEtatServeur, useDarkMode }) => {
    return (
        <>
            {/* @ts-ignore */}
            <Card
                dark={useDarkMode}
                flat
                rounded={false}
                className='mt-3 py-1 mb-4  pr-0 d-flex align-center justify-space-between'
            >
                {/* @ts-ignore */}
                <Card flat className='d-flex align-center' style={{ flexDirection: 'column' }}>
                    {/* @ts-ignore */}
                    <Caption >
                        {itemEtatServeur.serverName}
                    </Caption>
                    {/* <Caption style={{ color: 'gray' }} secondary>
                        {itemEtatServeur.routeServer}
                    </Caption> */}
                </Card>
                <StatusIconLibelle status={itemEtatServeur?.status} type={1} />

            </Card>
            {/* @ts-ignore */}
            <Divider dark={useDarkMode} dense elevated />
        </>
    )
}

export default EtatServeurItem



