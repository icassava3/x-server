import { useSelector } from 'react-redux';
import { Card } from 'ui-neumorphism';
import { IReduxState } from '../store/store';
import CardLibelle from './CardLibelle';
import ServiceItem from './ServiceItem';


export interface IUptimeEtBd {
  useDarkMode: boolean;
}

const WebServiceStatus: React.FC<IUptimeEtBd> = (props) => {
  const { useDarkMode } = props
  const { dashboardStatus } = useSelector((state: IReduxState) => state.application);
  const listService = [
    {
      "serviceName": "Cinetpay",
      "status": dashboardStatus.cinetpay
    },
  ]
  return (
    <>
      {/* @ts-ignore */}
      <Card dark={useDarkMode} outlined  height={130}>
        {/* @ts-ignore */}
        {/* <Card dark={useDarkMode} height={110} outlined > */}
          <CardLibelle libelleCard='Web services' hideStatus useDarkMode={useDarkMode} />
          {/* @ts-ignore */}
          <Card flat   className='overflow-hiddens'>
            {/* @ts-ignore */}
            <div style={{ paddingLeft: '24px', paddingRight: '24px', marginTop: '4px' }} >
              {listService?.map((item: any, index: number) => (
                <ServiceItem key={index} useDarkMode={useDarkMode} serviceName={item?.serviceName} status={item?.status} />
              ))}
            </div>
          </Card>

        </Card>
      {/* </Card> */}
    </>
  )
}

export default WebServiceStatus