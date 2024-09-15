import { mdiCellphone, mdiTablet, mdiTelevision } from '@mdi/js';
import Icon from '@mdi/react';
import React from 'react';
import { Avatar, Caption, Card, IconButton, Subtitle2 } from 'ui-neumorphism';
import { IDevice } from '../store/interfaces';

export interface IUserConnectedItemProps {
    itemUser: IDevice;
    useDarkMode: boolean;
}

const renderDeviceIcon = (deviceType: string | undefined) => {
    return (
        deviceType === 'Phone' && mdiCellphone ||
        deviceType === 'Desktop' && mdiTelevision ||
        deviceType === 'Tablet' && mdiTablet
    )
}

const UserConnectedItem: React.FC<IUserConnectedItemProps> = ({ itemUser, useDarkMode }) => {

    return (
        // @ts-ignore
        <Card
            dark={useDarkMode}
            rounded={false}
            elevation={2}
            style={{ padding: '16px', marginBottom: 20, marginTop: 10 }}
        >
            <div style={{ display: "flex", justifyContent: "space-between" }}>

                <div style={{ display: "flex", flexDirection: "row" }}>
                    {/* @ts-ignore */}
                    <Card flat
                        dark={useDarkMode}
                        style={{ width: '46px', height: '46px' }}
                    >
                        {/* @ts-ignore */}
                        <Avatar size={46} rounded style={{ textTransform: 'capitalize' }} >
                            {itemUser?.userName?.slice(0, 1)}
                        </Avatar>
                    </Card>
                    {/* @ts-ignore */}
                    <Card
                        dark={useDarkMode}
                        flat
                        style={{ marginLeft: '12px', textTransform: "uppercase" }}
                    >
                        {/* @ts-ignore */}
                        <Subtitle2 style={{ margin: '0px 0px', }}>
                            {itemUser?.userName?.slice(0, 20)}
                        </Subtitle2>
                        {/* @ts-ignore */}
                        <Card
                            flat
                            style={{
                                display: 'flex',
                                flexDirection: "column"
                            }}
                        >
                            {/* @ts-ignore */}
                            <Caption secondary >
                                {itemUser?.deviceName}
                            </Caption>
                            {/* @ts-ignore */}
                            <Caption secondary style={{ color: "gray", fontSize: 10 }} >
                                {itemUser?.appName}
                            </Caption>

                        </Card>
                    </Card>
                </div>
                <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                    {/* @ts-ignore */}
                    <IconButton
                        dark={useDarkMode}
                        text={false}
                        size='small'
                        rounded
                    >
                        <Icon
                            path={`${renderDeviceIcon(itemUser?.deviceType)}` || undefined}
                            size={0.7}
                            color='var(--primary)'
                        />
                    </IconButton>
                </div>
            </div>
        </Card>
    )
}

export default UserConnectedItem