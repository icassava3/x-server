import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Caption, Card, Chip } from 'ui-neumorphism';
import CopyText from '../../composants/CopyText';
import { encryptQr } from '../../helpers/functions';
import { IReduxState } from '../../store/store';
import Icon from '@mdi/react';
import { mdiWebCheck, mdiWebRemove } from '@mdi/js';

function ConnectionInfos() {

    // redux
    const { useDarkMode, connectionInfos, paramEtab, dashboardStatus } = useSelector((state: IReduxState) => state.application);
    // hooks
    const [qrValue, setQrValue] = useState<string>('')

    useMemo(() => {
        const qrValueStringify = JSON.stringify({
            wifi: `http://${connectionInfos?.ip}:${connectionInfos?.port}`,
            tunnel: connectionInfos?.tunnel,
            codeEtab: paramEtab?.codeetab,
            libEtab: paramEtab?.nomcompletetab,
            anneeScolaire: paramEtab?.anscol1
        })
        setQrValue(encryptQr(qrValueStringify))
    }, [connectionInfos, paramEtab])


    return (
        <>
            {/* @ts-ignore */}
            <Card
                dark={useDarkMode}
                flat
                style={{ paddingTop: 7, marginBottom: 10 }}
            >
                {/* @ts-ignore */}
                <Chip style={{ display: "flex", flexDirection: "row" }} size='large' className='mb-2'>
                    {/* @ts-ignore */}
                    <Caption secondary dark={useDarkMode}  >
                        Wifi : <span style={{ color: 'var(--primary)', marginLeft: 15, marginRight: 5, userSelect: "text" }}>
                            {`http://${connectionInfos?.ip}:${connectionInfos?.port}`}
                        </span>
                    </Caption>
                    <CopyText useDarkMode texteACopier={`http://${connectionInfos?.ip}:${connectionInfos?.port}`} />
                </Chip>
                {/* @ts-ignore */}
                <Chip
                    style={{ display: "flex", flexDirection: "row" }} size='large' className='mb-2'>
                    {/* @ts-ignore */}
                    <Caption secondary dark={useDarkMode}  >
                        {`Tunnel :`}
                        <span style={{ color: 'var(--primary)', marginLeft: 0, marginRight: 3, userSelect: "text" }}>
                            {`  ${connectionInfos?.tunnel}${connectionInfos?.tunnelStatus === 'closed' ? " (déconnecté)" : ""}`}
                        </span>
                        <CopyText useDarkMode texteACopier={`  ${connectionInfos?.tunnel}${connectionInfos?.tunnelStatus === 'closed' ? " (déconnecté)" : ""}`} />
                    </Caption>
                </Chip>
                {/* @ts-ignore */}
                <Chip
                    type={`${dashboardStatus.isInternetAvailable ? "success" : "error"}`}
                    className='ml-2 mb-2'
                >
                    <Icon path={dashboardStatus.isInternetAvailable ? mdiWebCheck : mdiWebRemove} size={0.68} />
                    {dashboardStatus.isInternetAvailable ? "Internet disponible !" : "Internet indisponible !"}
                </Chip>
            </Card>
            {/* @ts-ignore */}
            <Card
                dark={useDarkMode}
                bordered
                className='pb-3 pt-3 mb-2 d-flex align-center justify-center'
            >
                <div
                    className=' d-flex align-center justify-center'
                    style={{
                        backgroundColor: 'white',
                        borderRadius: '5px',
                        padding: 10
                    }}
                >
                    <QRCodeSVG
                        value={qrValue}
                        size={210}
                        level={'H'}
                        bgColor={"white"}
                        fgColor={useDarkMode ? 'black' : '#3c83f9'}
                    />
                </div>
            </Card>
        </>
    )
}

export default ConnectionInfos