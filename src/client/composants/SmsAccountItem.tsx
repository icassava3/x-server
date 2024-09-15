import React from 'react';
import { Caption, Card } from 'ui-neumorphism';

export interface IServiceItemProps {
    useDarkMode: boolean;
    libelleCompte: string;
    fournisseur: string;
    countSms: number;

}

const SmsAccountItem: React.FC<IServiceItemProps> = ({ useDarkMode, libelleCompte, fournisseur, countSms }) => {
    return (
        // @ts-ignore
        <Card
            dark={useDarkMode}
            rounded={false}
            className='mb-4 py-2 pl-4 pr-0 d-flex align-center justify-space-between'
        >
            {/* @ts-ignore */}
            <Card flat className='d-flex align-center'>
                {/* @ts-ignore */}
                <Caption secondary>
                    {libelleCompte}
                </Caption>
            </Card>
            <div
                className='mr-4'
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: "flex-end",
                    flexDirection: 'column'

                }}
            >
                {/* @ts-ignore */}
                <Caption style={{ color: 'var(--primary)', textAlign: "right", marginBottom: 5 }} secondary>
                    {fournisseur}
                </Caption>
                {/* @ts-ignore */}
                <Caption style={{ color: 'var(--primary)', textAlign: "right" }} secondary>
                    {countSms ? `${countSms} sms` : "?"}
                </Caption>
            </div>
        </Card>
    )
}

export default SmsAccountItem