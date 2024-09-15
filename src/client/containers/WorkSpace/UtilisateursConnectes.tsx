import Grid from '@mui/material/Grid';
import { useSelector } from 'react-redux';
import { Card } from 'ui-neumorphism';
import { IDevice } from '../../../client/store/interfaces';
import CardLibelle from '../../composants/CardLibelle';
import UserConnectedItem from '../../composants/UserConnectedItem';
import { IReduxState } from '../../store/store';
import AppareilsConnectes from './AppareilsConnectes';

function UtilisateursConnectes() {
    const { useDarkMode, devices } = useSelector((state: IReduxState) => state.application);

    return (
        <Grid container direction='column' >

            <Grid item xs={12} sm={12} md={12}>
                {/* @ts-ignore */}
                <Card dark={useDarkMode} height={620} >
                    <CardLibelle libelleCard='Utilisateurs connectés' hideStatus useDarkMode={useDarkMode} />
                    {/* @ts-ignore */}
                    <Card flat height={480} className='overflow-hiddens'>
                        {/* @ts-ignore */}
                        <Card dark={useDarkMode} flat style={{ paddingLeft: '24px', paddingRight: '24px' }} >
                            {devices?.map((item: IDevice, index: number) => (
                                <UserConnectedItem key={index} itemUser={item} useDarkMode={useDarkMode} />
                            ))}
                        </Card>
                    </Card>
                    <AppareilsConnectes />
                </Card>
            </Grid>
        </Grid>
    )
}

export default UtilisateursConnectes