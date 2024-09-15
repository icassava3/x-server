import Icon from '@mdi/react'
import React from 'react'
import { Caption, Card } from 'ui-neumorphism';
import { IReduxState } from '../store/store';
import { useSelector } from 'react-redux';

interface IPriseDeVueItem {
    icon: any;
    count: number;
    libelle: string;
    color: string;
    borderLeft?: string;
    borderRight?: string;
    paddingLeft?: number
}
export const PriseDeVueItem: React.FC<IPriseDeVueItem> = (props) => {
    const { useDarkMode } = useSelector((state: IReduxState) => state.application);

    const { icon, libelle, count, color, borderLeft, borderRight, paddingLeft } = props
    return (
        <>
            {/* @ts-ignore */}
            <Card
                dark={useDarkMode}
                flat
                style={{
                    height: "67px",
                    borderLeft: borderLeft,
                    borderRight: borderRight,
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    paddingLeft: paddingLeft
                }}
            >
                <div style={{ display: "flex", marginBottom: 5 }}>
                    <Icon path={icon} color={color} size={1.3} />
                    <h4 style={{ marginLeft: 5, paddingTop: 6 }} >{count}</h4>
                </div>
                {/* @ts-ignore */}
                <Caption dark={useDarkMode} secondary>{libelle}</Caption>
            </Card>
        </>
    )
}
