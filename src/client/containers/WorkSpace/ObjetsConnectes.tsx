import { useSelector } from 'react-redux';
import { Card } from 'ui-neumorphism';
import { IObjetConncte } from '../../Data/data';
import CardLibelle from '../../composants/CardLibelle';
import ObjetConnecteItem from '../../composants/ObjetConnecteItem';
import { IReduxState } from '../../store/store';


function ObjetsConnectes() {
    const { useDarkMode, dashboardStatus } = useSelector((state: IReduxState) => state.application);
    const ObjetConnecteData = [
        {
            "objetName": "Sirène",
            "status": dashboardStatus?.sireneStatus
        },
       
    ]
    return (
        // @ts-ignore
        <Card dark={useDarkMode} height={205}>
            <CardLibelle libelleCard='Objets connectés' hideStatus useDarkMode={useDarkMode} />
            {/* @ts-ignore */}
            <Card dark={useDarkMode} height={120} flat className='overflow-hiddens' >
                {/* @ts-ignore */}
                <Card flat style={{ paddingLeft: '24px', paddingRight: '24px', marginTop: '4px' }} >
                    {ObjetConnecteData.map((item: IObjetConncte, index: number) => (
                        <ObjetConnecteItem useDarkMode={useDarkMode} key={index} itemIObjetConncte={item} />
                    ))}
                </Card>
            </Card>
        </Card>
    )
}

export default ObjetsConnectes