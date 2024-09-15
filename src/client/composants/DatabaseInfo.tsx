import React from 'react';
import { useSelector } from 'react-redux';
import { Card } from 'ui-neumorphism';
import { IReduxState } from '../store/store';
import CardLibelle from './CardLibelle';
import StatusIconButton from './StatusIconButton';

export interface IDatabaseInfo {
    useDarkMode: boolean;
}



const DatabaseInfo: React.FC<IDatabaseInfo> = ({ useDarkMode }) => {

    const { dashboardStatus } = useSelector((state: IReduxState) => state.application);

    return (
        // @ts-ignore
        <Card dark={useDarkMode} height={190}>
            <CardLibelle libelleCard='Bases de données' hideStatus useDarkMode={useDarkMode} />
            {/* @ts-ignore */}
            <Card flat dark={useDarkMode} height={125} className='overflow-hiddens'>

                {/* Redis server */}
                <StatusIconButton useDarkMode={useDarkMode} libelleIcon='Cache' status={dashboardStatus.redis} />

                {/* Access  */}
                <StatusIconButton useDarkMode={useDarkMode} libelleIcon='Primaire' status={dashboardStatus.msAccess} />

                {/* sqlite  */}
                <StatusIconButton useDarkMode={useDarkMode} libelleIcon='Secondaire' status={dashboardStatus.sqlite} />
            </Card>


        </Card>
    )
}

export default DatabaseInfo