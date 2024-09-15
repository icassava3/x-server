import React from 'react'
import { Caption, Card } from 'ui-neumorphism'
import StatusIconLibelle from './StatusIconLibelle';

export interface IServiceItemProps {
    useDarkMode: boolean;
    serviceName: string;
    status: boolean;

}

const ServiceItem: React.FC<IServiceItemProps> = ({ useDarkMode, serviceName, status }) => {
    return (
        // @ts-ignore
        <Card
            dark={useDarkMode}
            rounded={false}
            className='mb-5 py-2 pl-4 pr-0 d-flex align-center justify-space-between'
        >
            {/* @ts-ignore */}
            <Card flat className='d-flex align-center'>
                {/* @ts-ignore */}
                <Caption secondary>
                    {serviceName}
                </Caption>
            </Card>
            <StatusIconLibelle status={status} />
        </Card>
    )
}

export default ServiceItem