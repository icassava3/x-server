import Grid from '@mui/material/Grid';
import { useSelector } from 'react-redux';
import { Card } from 'ui-neumorphism';
import Footer from '../../composants/Footer';
import WebServiceStatus from '../../composants/WebServiceStatus';
import WebSmsStatus from '../../composants/WebSmsStatus';
import { IReduxState } from '../../store/store';
import { screenWidth } from '../SideBar';
import ActivitesRecentes from './ActivitesRecentes';
import EtatSystem from './EtatSysteme';
import ObjetsConnectes from './ObjetsConnectes';
import PrisesDeVues from './PrisesDeVues';
import SchoolControl from './SchoolControl';
import Sirene from './Sirene';
import UtilisateursConnectes from './UtilisateursConnectes';



function WorkSpace() {
    const { useDarkMode } = useSelector((state: IReduxState) => state.application);
   
    return (
        // @ts-ignore
        <Card dark={useDarkMode} style={{ display: 'flex' }} flat>
            <Grid container spacing={2}  >
                <Grid item xs={12} sm={12} md={screenWidth().dynamicWidth <= 1600 ? 12 : 9}>
                    <Grid container direction='column' spacing={2}>
                        <Grid item xs={12} sm={6} md={6}>
                            <EtatSystem />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12} md={screenWidth().dynamicWidth <= 1600 ? 12 : 4} style={{ order: screenWidth().dynamicWidth <= 1600 ? 2 : 1 }}>
                                    <UtilisateursConnectes />
                                </Grid>
                                <Grid item xs={12} sm={12} md={screenWidth().dynamicWidth <= 1600 ? 12 : 8} style={{ order: screenWidth().dynamicWidth <= 1600 ? 1 : 2 }}>
                                    <Grid container spacing={2} direction='column' >
                                        <Grid item xs={12} sm={6} md={6}>
                                            <Grid container spacing={2} direction='column' >
                                                <Grid item xs={12} sm={12} md={12}>
                                                    {/* @ts-ignore */}
                                                    <Card dark={useDarkMode} className={`body-card `}>
                                                        <Grid container spacing={2} >
                                                            {/* @ts-ignore */}
                                                            <Grid item xs={12} sm={12} md={6} >
                                                                <SchoolControl />
                                                            </Grid>
                                                            {/* @ts-ignore */}
                                                            <Grid item xs={12} sm={12} md={6} >
                                                                <Grid container spacing={2} direction='column' >
                                                                    <Grid item xs={12} sm={12} md={6} >
                                                                        <WebServiceStatus useDarkMode={useDarkMode} />
                                                                    </Grid>
                                                                    <Grid item xs={12} sm={12} md={6} >
                                                                        <WebSmsStatus useDarkMode={useDarkMode} />
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </Card>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <Grid container spacing={2} direction='row'>
                                                <Grid item xs={12} sm={6} md={6}>
                                                    <ObjetsConnectes />
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={6}>
                                                    <PrisesDeVues />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={screenWidth().dynamicWidth <= 1600 ? 12 : 3} >
                    <Grid container direction='column' spacing={2}>
                        <Grid item xs={12} sm={6} md={6}>
                            <Sirene />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                            <ActivitesRecentes />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                    <Footer />
                </Grid>
            </Grid>
        </Card>
    )
}
export default WorkSpace