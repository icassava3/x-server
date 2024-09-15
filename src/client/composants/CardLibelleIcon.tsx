import { mdiClose, mdiDotsHorizontal } from '@mdi/js';
import Icon from '@mdi/react';
import React from 'react';
import { Card, H6, IconButton } from 'ui-neumorphism';
import { useSelector } from 'react-redux';
import colors from '../Data/colors';
import { IReduxState } from '../store/store';

export interface ICardLibelleIconProps {
    libelle: string;
    showDialog: boolean,
    setShowDialog: (x: boolean) => void

}

const CardLibelleIcon: React.FC<ICardLibelleIconProps> = ({ libelle, showDialog, setShowDialog }) => {
    const { useDarkMode } = useSelector((state: IReduxState) => state.application);

    return (
        // @ts-ignore
        <Card flat dark={useDarkMode} style={{
            padding: '24px 24px 10px 24px'
        }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                }}
            >
                {/* @ts-ignore */}
                <H6 dark={useDarkMode} >
                    {libelle}
                </H6>
                {/* @ts-ignore */}
                <IconButton
                    dark={useDarkMode}
                    size='small'
                    rounded
                    text={false}
                    color={colors.primary}
                    style={{ marginLeft: '10px' }}
                    onClick={() => setShowDialog(!showDialog)}
                >
                    <Icon path={showDialog ? mdiClose : mdiDotsHorizontal} size={0.8} />
                </IconButton>

            </div>
        </Card>
    )
}

export default CardLibelleIcon