import { Caption, Card } from 'ui-neumorphism'
import { useSelector } from 'react-redux';
import { IReduxState } from '../../store/store';
import CardLibelle from '../../composants/CardLibelle';
import SchoolControlActiviteItem from '../../composants/SchoolControlActiviteItem';

function SchoolControl() {
    const { useDarkMode, dashboardStatus } = useSelector((state: IReduxState) => state.application);
    const activitiesActivivated = dashboardStatus?.schoolControlConfig?.filter(x => x.activiteStatus)
    return (
        // @ts-ignore
        <Card dark={useDarkMode} height={350} outlined >
            <CardLibelle libelleCard='School control' status={dashboardStatus.schoolControl} useDarkMode={useDarkMode} />
            {/* @ts-ignore */}
            <Card flat height={275} style={
                !dashboardStatus.schoolControlConfig?.length || !activitiesActivivated?.length
                    ? {
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }
                    : {} // Laissez le style vide si la condition n'est pas satisfaite
            } className='overflow-hiddens'>
                {
                    !dashboardStatus.schoolControlConfig?.length || !activitiesActivivated?.length
                        ?
                        <div  >
                            {/* @ts-ignore */}
                            <Caption style={{ color: 'gray' }}>
                                Aucune activité paramétrée !
                            </Caption>
                        </div>
                        :
                        //    @ts-ignore
                        < Card flat style={{ paddingLeft: '24px', paddingRight: '24px', marginTop: '4px' }} >
                            {activitiesActivivated
                                .map((item, index: number) => (
                                    <SchoolControlActiviteItem key={index} useDarkMode={useDarkMode} serviceName={item.libelleActivite} count={item.config.users?.filter(x => x.status)?.length} />
                                ))}
                        </Card>
                }
            </Card>
        </Card >
    )
}

export default SchoolControl