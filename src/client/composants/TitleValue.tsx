import React from 'react';
import { Caption, Card, Tooltip } from 'ui-neumorphism';

export interface IServiceItemProps {
    useDarkMode: boolean;
    title: string;
    value: string;

}

const TitleValue: React.FC<IServiceItemProps> = ({ useDarkMode, title, value }) => {
    return (
        // @ts-ignore
        <Card
            dark={useDarkMode}
            rounded={false}
            flat
            className=' py-2 pl-4 pr-0 d-flex align-center justify-space-between'
        >
            {/* @ts-ignore */}
            <Card flat className='d-flex align-center mr-2'>
                {/* @ts-ignore */}
                <Caption secondary>
                    {title}
                </Caption>
            </Card>
            {/* @ts-ignore */}
            <Tooltip dark={useDarkMode} content={<div style={{ color: 'var(--primary)' }}>{value}</div>} >
                <div>
                    {/* @ts-ignore */}
                    <Caption style={{ color: 'var(--primary)' }} secondary>
                       {value?.length >= 15 ? `${value?.substring(0, 15)} ...` : value}
                    </Caption>
                </div>
            </Tooltip>

        </Card>
    )
}

export default TitleValue