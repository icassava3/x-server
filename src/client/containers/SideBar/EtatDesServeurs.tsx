import { Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { Card } from 'ui-neumorphism';
import { IServeur } from '../../Data/data';
import CardLibelle from '../../composants/CardLibelle';
import IEtatServeurItemProps from '../../composants/EtatServeurItem';
import { IReduxState } from '../../store/store';

function EtatDesServeurs() {
    const { useDarkMode, dashboardStatus } = useSelector((state: IReduxState) => state.application);
    const listServer = [
        {
            "serverName": "Global api",
            "routeServer": "https://global.spider-api.com/v1/test",
            "status": dashboardStatus?.globalApi
        },
        {
            "serverName": "Warehouse",
            "routeServer": "https://wh.spider-api.com/v1/test",
            "status": dashboardStatus?.warehouse
        },
        {
            "serverName": "Prof-Expert",
            "routeServer": "https://profexpert.spider-api.com/v2/test",
            "status": dashboardStatus?.profExpert
        },
        {
            "serverName": "Focus-Ecole",
            "routeServer": "https://focusecole.spider-api.com/v1/test",
            "status": dashboardStatus?.focusEcole
        },
        {
            "serverName": "Cinetpay",
            "routeServer": "https://cinetpay.spider-api.com/v1/test",
            "status": dashboardStatus?.cinetpayServer
        },

    ]
    return (
        <Grid container direction='column'>
            <Grid item xs={12} sm={12} md={12}>
                {/* @ts-ignore */}
                <Card flat
                    dark={useDarkMode}
                    height={290}
                    // width={310}
                >
                    <CardLibelle libelleCard='Etat des serveurs en ligne' hideStatus useDarkMode={useDarkMode} />
                    {/* @ts-ignore */}
                    <Card flat height={260} className='overflow-hiddens'>
                        {/* @ts-ignore */}
                        <Card flat style={{ paddingLeft: '24px', paddingRight: '24px' }} >
                            {listServer.map((item: IServeur, index: number) => (
                                <IEtatServeurItemProps key={index} itemEtatServeur={item} useDarkMode={useDarkMode} />
                            ))}
                        </Card>
                    </Card>
                </Card>
            </Grid>
        </Grid>
    )
}

export default EtatDesServeurs