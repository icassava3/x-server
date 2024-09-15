import { useSelector } from 'react-redux';
import { Card } from 'ui-neumorphism';
import { IReduxState } from '../store/store';
import CardLibelle from './CardLibelle';
import SmsAccountItem from './SmsAccountItem';


export interface IWebSmsStatus {
    useDarkMode: boolean;
}

const WebSmsStatus: React.FC<IWebSmsStatus> = ({ useDarkMode }) => {

    const { dashboardStatus } = useSelector((state: IReduxState) => state.application);
    return (
        <>
            {/* @ts-ignore */}
            <Card
                dark={useDarkMode}
                height={205}
                outlined
            >
                <CardLibelle libelleCard='Sms' status={dashboardStatus?.compteSms?.compteSmsStatus} useDarkMode={useDarkMode} />
                 {/* @ts-ignore */}
                <Card flat height={130} className='overflow-hiddens'>
                    {/* @ts-ignore */}
                    <Card flat >
                        <div style={{ paddingLeft: '20px', paddingRight: '20px', marginTop: '4px' }} >
                            <SmsAccountItem useDarkMode={useDarkMode} libelleCompte='Compte par défaut' fournisseur={dashboardStatus.compteSms?.defaultAccount?.libelle || 'Non configuré'} countSms={dashboardStatus.compteSms?.defaultAccount?.creditSms?.smsCount} />
                            <SmsAccountItem useDarkMode={useDarkMode} libelleCompte='Compte appel numérique' fournisseur={dashboardStatus.compteSms?.compteAppelNumerique?.libelle || 'Non configuré'} countSms={dashboardStatus.compteSms?.compteAppelNumerique?.creditSms?.smsCount} />
                        </div>
                    </Card>
                </Card>

            </Card>
        </>
    )
}

export default WebSmsStatus