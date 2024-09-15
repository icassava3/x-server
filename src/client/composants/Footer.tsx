import React from 'react'
import { Caption, Card } from 'ui-neumorphism'
import { convertirTemps } from '../helpers/functions'
import { useSelector } from 'react-redux';
import { IReduxState } from '../store/store';

const Footer = () => {

    const { useDarkMode, dashboardStatus } = useSelector((state: IReduxState) => state.application);
    const [seconde, setSeconde] = React.useState(0);
    const UpsecondeClock = () => {
        setSeconde(seconde + 1);
    }
    React.useEffect(() => {
        const minuterie = setInterval(
            UpsecondeClock,
            1000
        );
        return () => clearInterval(minuterie);
    }, [seconde]);

    return (
        //   @ts-ignore 
        <Card dark={useDarkMode} height={30} className='d-flex align-center pl-5 pr-5' style={{ justifyContent: "space-between" }}>
            {/* @ts-ignore */}
            <Caption secondary>Base de données en cours : <span style={{ color: 'var(--primary)' }}>{dashboardStatus?.accessDbPath}</span> </Caption>
            {/* @ts-ignore */}
            <Caption secondary>Temps : <span style={{ color: 'var(--primary)' }}>{convertirTemps(seconde)}</span> </Caption>
        </Card>
    )
}

export default Footer