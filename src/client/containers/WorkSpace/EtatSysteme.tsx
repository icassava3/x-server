
import Grid from '@mui/material/Grid';
import { useSelector } from 'react-redux';
import { Card } from 'ui-neumorphism';
import DatabaseInfo from '../../composants/DatabaseInfo';
import WebServiceSatus from '../../composants/Serveur';
import { IReduxState } from '../../store/store';
import DisqueMemoireInfo from './EspacesDisquesInfo';
import RamCpuSystem from './RamCpuSystem';
import { screenWidth } from '../SideBar';
import CardLibelle from '../../composants/CardLibelle';

function EtatSystem() {
    const { useDarkMode } = useSelector((state: IReduxState) => state.application);

    return (
        <Grid container spacing={2} >
            <Grid item xs={12} sm={6} md={screenWidth().dynamicWidth <= 1300 ? 6 : 3}>
                <DatabaseInfo useDarkMode={useDarkMode} />
            </Grid>
            <Grid item xs={12} sm={6} md={screenWidth().dynamicWidth <= 1300 ? 6 : 3}>
                <WebServiceSatus useDarkMode={useDarkMode} />
            </Grid>
            <Grid item xs={12} sm={12} md={screenWidth().dynamicWidth <= 1300 ? 12 : 6}>
                {/* @ts-ignore */}
                <Card
                    dark={useDarkMode}
                    height={190}

                >
                    <CardLibelle libelleCard='Système' hideStatus useDarkMode={useDarkMode} />
                    <div style={{  display: "flex" ,  alignItems:"center", justifyContent:"center"}}>
                        <RamCpuSystem />
                        <DisqueMemoireInfo />
                    </div>
                </Card>

            </Grid>
        </Grid>
    )
}
export default EtatSystem