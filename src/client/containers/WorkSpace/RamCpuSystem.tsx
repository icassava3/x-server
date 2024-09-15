
import { useEffect, useState } from 'react';
import GaugeComponent from 'react-gauge-component';
import { useSelector } from 'react-redux';
import { Caption, Card, Tooltip } from 'ui-neumorphism';
import { IReduxState } from '../../store/store';


var osu = require('node-os-utils')
const os = require('os');
var cpu = osu.cpu
const cpus = os.cpus()

export const getRam = () => {
    const ramUtiliseEnPourcentage = (os.totalmem() - os.freemem()) / os.totalmem()
    return ramUtiliseEnPourcentage;
}

function RamCpuSystem() {
    const { useDarkMode } = useSelector((state: IReduxState) => state.application);

    const [dataRam, setDataRam] = useState<number>(0);
    const [dataCpu, setDataCpu] = useState<number>(0);

    // RAM et CPU
    useEffect(() => {
        const id = setInterval(() => {
            setDataRam(getRam());

            cpu.usage()
                .then((cpuPercentage: number) => {
                    setDataCpu(cpuPercentage) // 10.38
                })
        }, 5000);
        return () => {
            clearInterval(id);
        };
    }, []);

    const bytesToGigabytes = bytes => bytes / (1024 ** 3);

    return (
        <>
            {/* @ts-ignore */}
            <Card flat dark={useDarkMode} >
                {/* <CardLibelle libelleCard='Système' hideStatus useDarkMode={useDarkMode} /> */}
                {/* @ts-ignore */}

                <div style={{ display: "flex", flexDirection: "row", marginTop: -30, justifyContent: "center", alignItems: "center" }}>
                    <div style={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <GaugeComponent
                            type="semicircle"
                            style={{ width: "160px" }}
                            arc={{
                                colorArray: ['#00FF15', '#FF2121'],
                                // padding: 0.02,
                                subArcs:
                                    [
                                        { limit: 10 },
                                        { limit: 20 },
                                        { limit: 30 },
                                        {},
                                        {},
                                        {},
                                        {}
                                    ]
                            }}
                            pointer={{ type: "blob", animationDelay: 0 }}
                            value={(dataRam * 100)}
                            className="custom-gauge" // Ajoutez la classe personnalisée ici

                        />
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                            {/* @ts-ignore */}
                            <Caption dark={useDarkMode} style={{ paddingTop: 8 }}>&nbsp; RAM : {(dataRam * 100).toFixed(1)} %</Caption>
                            {/* @ts-ignore */}
                            <Caption dark={useDarkMode} style={{ paddingTop: 8 }}>{`${bytesToGigabytes(os.totalmem()).toFixed(2)} Go`} </Caption>

                        </div>
                    </div>
                    <div style={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <GaugeComponent
                            type="semicircle"
                            style={{ width: "160px" }}
                            arc={{
                                colorArray: ['#00FF15', '#FF2121'],
                                // padding: 0.02,
                                subArcs:
                                    [
                                        { limit: 10 },
                                        { limit: 20 },
                                        { limit: 30 },
                                        {},
                                        {},
                                        {},
                                        {}
                                    ]
                            }}
                            pointer={{ type: "blob", animationDelay: 0 }}
                            value={dataCpu}
                            className="custom-gauge" // Ajoutez la classe personnalisée ici

                        />
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                            {/* @ts-ignore */}
                            <Caption dark={useDarkMode} style={{ paddingTop: 8 }}>&nbsp; CPU : {dataCpu.toFixed(0)} %</Caption>
                            {/* @ts-ignore */}
                            <Tooltip
                                // className='ma-3'
                                dark={useDarkMode} style={{ paddingTop: 8, fontSize: "0.8em " }}
                                content={<div>{cpus[0].model}</div>}
                            // maxWidth={50}
                            >
                                {/* <Caption></Caption> */}
                                {`${cpus[0]?.model?.substring(0, 12)}...`}
                            </Tooltip>
                        </div>
                    </div>



                </div>





            </Card>
        </>
    )
}

export default RamCpuSystem