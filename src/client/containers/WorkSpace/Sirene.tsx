import React from 'react'
import { Button, Card, H5, IconButton } from 'ui-neumorphism'
import { useSelector } from 'react-redux';
import Icon from '@mdi/react';
import { mdiAlarmCheck } from '@mdi/js';
import { IReduxState } from '../../store/store';
import CardLibelle from '../../composants/CardLibelle';
function Sirene() {
    //redux
    const { useDarkMode } = useSelector((state: IReduxState) => state.application);

    //Hook
    const [stopSirene, setStopSirene] = React.useState<boolean>(false)
    const [date, setDate] = React.useState(new Date());
    const UpdateClock = () => {
        setDate(new Date());
    }
    React.useEffect(() => {
        const minuterie = setInterval(
            UpdateClock,
            1000
        );
        return () => clearInterval(minuterie);
    }, [date]);

    return (
        // @ts-ignore
        <Card dark={useDarkMode}
            height={400} >
            <CardLibelle libelleCard='Sonnerie' hideStatus useDarkMode={useDarkMode} />
            <div
                className='d-flex align-center justify-center'
            >
                {/* @ts-ignore */}
                <Card
                    dark={useDarkMode}
                    width={208}
                    height={208}
                    elevation={3}
                    className='mt-5 d-flex align-center justify-center'
                    style={{ borderRadius: '208px' }}
                >
                    {/* @ts-ignore */}
                    <Card
                        flat
                        width={196}
                        height={196}
                        style={{ borderRadius: '196px' }}
                        className={`clock-dashed ${stopSirene ? '' : 'clock-dashed--animating'} `}
                    ></Card>
                    {/* @ts-ignore */}
                    <Card flat className='p-absolute'>
                        {/* @ts-ignore */}
                        <H5 style={{ fontFamily: 'DS-Digital Bold' }}>{date.toLocaleTimeString()}</H5>
                        <div className='mt-5 d-flex align-center justify-center'>
                            {/* @ts-ignore */}
                            <IconButton
                                className={false ? 'shakeMe' : ''}
                                size='small'
                                rounded
                                dark={useDarkMode}
                            >
                                <Icon path={mdiAlarmCheck} size={0.8} />
                            </IconButton>
                        </div>
                    </Card>
                </Card>
            </div>
            {/* @ts-ignore */}
            <Card flat rounded={false} className='d-flex align-center justify-center mt-10 '>
                {/* @ts-ignore */}
                <Card flat className='pr-3' style={{ width: '40%' }}>
                    {/* @ts-ignore */}
                    <Button
                        block
                        color='var(--error)'
                        style={{ overflow: 'hidden' }}
                    >
                        prec : 7:30
                    </Button>
                </Card>
                {/* @ts-ignore */}
                <Card flat className='pl-3' style={{ width: '40%' }}>
                    {/* @ts-ignore */}
                    <Button
                        block
                        color='var(--primary)'
                        style={{ overflow: 'hidden' }}
                    >
                        suiv : 14:30
                    </Button>
                </Card>
            </Card>
        </Card>
    )
}

export default Sirene