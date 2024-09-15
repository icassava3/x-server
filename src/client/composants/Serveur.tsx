import React from 'react';
import { useSelector } from 'react-redux';
import { Card } from 'ui-neumorphism';
import { IReduxState } from '../store/store';
import CardLibelle from './CardLibelle';
import TitleValue from './TitleValue';

export interface IWebServiceSatus {
    useDarkMode: boolean;
}

const WebServiceSatus: React.FC<IWebServiceSatus> = ({ useDarkMode }) => {
    const { dashboardStatus } = useSelector((state: IReduxState) => state.application);

    return (

        // @ts-ignore
        <Card dark={useDarkMode} height={190}>

            <CardLibelle libelleCard='Serveur' status={dashboardStatus.serverStatus} useDarkMode={useDarkMode} />
            {/* @ts-ignore */}
            <Card flat dark={useDarkMode} height={125} className='overflow-hiddens'>
                {/* @ts-ignore */}
                <Card flat style={{ paddingLeft: '20px', paddingRight: '20px', marginTop: '4px', userSelect: "text" }} >
                    <TitleValue title='Distant' value={dashboardStatus?.onlineHddSerial} useDarkMode={useDarkMode} />
                    <TitleValue title='Local' value={dashboardStatus?.localHddSerial} useDarkMode={useDarkMode} />
                    <TitleValue title='Disque' value={dashboardStatus?.currentPcHDDSerial} useDarkMode={useDarkMode} />
                </Card>
            </Card>
        </Card>
    )
}

export default WebServiceSatus