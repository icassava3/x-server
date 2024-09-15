import { mdiCircle } from '@mdi/js';
import Icon from '@mdi/react';
import React from 'react';
import { Caption, Card } from 'ui-neumorphism';
import { useSelector } from 'react-redux';
import colors from '../Data/colors';
import { IReduxState } from '../store/store';

export interface IActiviteRecenteBodyProps {
    cardContentHeight: number
}

const ActiviteRecenteBody: React.FC<IActiviteRecenteBodyProps> = ({ cardContentHeight }) => {
    const { useDarkMode, recentActivity } = useSelector((state: IReduxState) => state.application);

    return (
        // @ts-ignore
        < Card
            height={cardContentHeight}
            flat
            dark={useDarkMode}
            className='overflow-hiddens '
            style={{
                paddingLeft: '24px',
                paddingRight: '24px'
            }
            }
        >
            {recentActivity?.map((item, index: number) => (
                <div key={index}>
                    <div style={{ marginLeft: 15, paddingBottom: 5, marginTop: 5, display: "flex" }} >
                        <div className='mr-2'>

                            <Icon
                                path={mdiCircle}
                                color={item.status
                                    ? colors.green
                                    : colors.red}
                                size={0.4}
                            />
                        </div>
                        <div>
                            {/* @ts-ignore */}
                            <Caption dark={useDarkMode} component='span' >
                                <span style={{ textTransform: "uppercase" }}>{item.userName}</span> - <span style={{ color: 'var(--primary)' }}>{item.action}</span>
                            </Caption>
                            <div >
                                {/* @ts-ignore */}
                                <Caption
                                    dark={useDarkMode}
                                    // secondary
                                    style={{ fontSize: '10px', color: 'gray' }}>
                                    {item.appName} {item.dateTime}
                                </Caption>
                            </div>
                        </div>
                    </div>
                    {/* <Divider dark={useDarkMode} dense /> */}
                </div>
            ))}

        </ Card>
    )
}

export default ActiviteRecenteBody