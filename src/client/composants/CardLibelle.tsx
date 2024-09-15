import React from 'react'
import { Chip, H6 } from 'ui-neumorphism';


export interface ICardLibelleProps {
    useDarkMode: boolean;
    libelleCard: string;
    status?: boolean;
    hideStatus?: boolean;

}

const CardLibelle: React.FC<ICardLibelleProps> = ({ status, useDarkMode, libelleCard, hideStatus }) => {
    return (
        <div style={{
            padding: '16px 0px 16px 16px',
        }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                }}
            >
                {/* @ts-ignore */}
                <H6 dark={useDarkMode} >{libelleCard}</H6>
                {!hideStatus &&
                    <div
                        className='d-flex align-center mr-4'
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',

                        }}
                    >
                        {/* @ts-ignore */}
                        <Chip dark={useDarkMode} type={`${status ? 'success' : 'error'}`} >
                            {status ? "Activé" : "Désactivé"}
                        </Chip>
                    </div>
                }
            </div>
        </div>)
}

export default CardLibelle