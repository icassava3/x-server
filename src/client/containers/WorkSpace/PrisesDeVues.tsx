import { useSelector } from 'react-redux';
import CardLibelle from '../../composants/CardLibelle';
import { Caption, Card, H6 } from 'ui-neumorphism'
import PhotoItem from '../../composants/PhotoItem';
import { IReduxState } from '../../store/store';
import TitleValue from '../../composants/TitleValue';
import { Grid } from '@mui/material';
import Icon from '@mdi/react';
import { mdiAccountCancel, mdiAccountSupervisor, mdiDatabase, mdiFolder, mdiFolderAccount, mdiInformationVariantCircleOutline, mdiMapMarkerOffOutline, mdiMapMarkerRadiusOutline, mdiWalk } from '@mdi/js';
import { PriseDeVueItem } from '../../../client/composants/PriseDeVueItem';
function PrisesDeVues() {


    const { useDarkMode, dashboardStatus, allStatEtab } = useSelector((state: IReduxState) => state.application);
    // const { statEtab, nbPriseVue } = useSelector((state: IReduxState) => state.stat);


    return (
        <>
            {/* @ts-ignore */}
            <Card dark={useDarkMode} height={205} className={`overflow-hiddens`}
            >
                <CardLibelle libelleCard='Prises de vues' status={dashboardStatus.priseDeVue} useDarkMode={useDarkMode} />
                 {/* @ts-ignore */}
                <Card flat style={{ marginLeft: '20px', marginRight: '20px', marginTop: '4px', userSelect: "text" }} >
                    <Grid container spacing={0}>
                        <Grid item xs={6} sm={6} md={6}>
                            <PriseDeVueItem
                                libelle='Effectif des élèves'
                                icon={mdiAccountSupervisor}
                                count={allStatEtab.statEtab.stat.effectifEleves}
                                color='var(--primary)'
                                borderRight="0.1px solid #797A9252"
                            />
                        </Grid>
                        <Grid item xs={6} sm={6} md={6}>
                            <PriseDeVueItem
                                libelle='Dans le dossier'
                                icon={mdiFolderAccount}
                                count={allStatEtab.studentPhotoCountInFolder}
                                color='grayText'
                                paddingLeft={20}
                                borderLeft="0.1px solid #797A9252"
                            />
                        </Grid>
                    </Grid>
                    <div style={{ height: "0.5px", background: "#797A9252" }}></div>
                    <Grid container spacing={0}>
                        <Grid item xs={6} sm={6} md={6} >
                            <PriseDeVueItem
                                libelle='Dans la base'
                                icon={mdiDatabase}
                                count={allStatEtab.studentPhotoCountInBD}
                                color='var(--success)'
                                borderRight="0.1px solid #797A9252"
                            />
                        </Grid>
                        <Grid item xs={6} sm={6} md={6}>
                            <PriseDeVueItem
                                libelle='Retardataires'
                                icon={mdiAccountCancel}
                                count={allStatEtab.statEtab.stat.effectifEleves > 0 ? allStatEtab.statEtab.stat.effectifEleves - allStatEtab.studentPhotoCountInFolder : 0}
                                color='red'
                                borderLeft="0.1px solid #797A9252"
                                paddingLeft={20}
                            />
                        </Grid>
                    </Grid>
                </Card>


            </Card>
        </>
    )
}

export default PrisesDeVues