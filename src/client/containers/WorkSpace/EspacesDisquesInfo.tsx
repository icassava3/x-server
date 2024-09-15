
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Body2, Caption, Card, ProgressLinear } from 'ui-neumorphism';
var d = require('diskinfo');
const _ = require('lodash');

function DisqueMemoireInfo() {
    const { useDarkMode } = useSelector((state: any) => state.application);
    const [diskData, setDiskData] = useState<any>([]);

    const bytesToGigabytes = bytes => bytes / (1024 ** 3);

    d.getDrives(function (err, aDrives) {
        if (err) {
            console.error('Erreur lors de la récupération des informations sur les disques:', err);
            return;
        }
        setDiskData(aDrives)
    });

    // Convertir les valeurs en Go et rendre les données uniques
    const uniqueMounted = useMemo(() => {
        const convertedData = diskData.map(item => ({
            ...item,
            blocks: bytesToGigabytes(item.blocks).toFixed(1),
            used: bytesToGigabytes(item.used).toFixed(1),
            available: bytesToGigabytes(item.available).toFixed(1),
        }));

        return _.uniqBy(convertedData, 'mounted');
    }, [diskData]);

    return (
        <>
            {/* @ts-ignore */}
            <Card
                dark={useDarkMode}
                flat
            >
                {/* @ts-ignore */}
              
                    <Card dark={useDarkMode} height={110} flat className='overflow-hiddens'  >
                       {/* @ts-ignore */}
                        <Card flat style={{ paddingLeft: '24px', paddingRight: '4px' }} >
                            {uniqueMounted?.map((item: any, index: number) => (
                                <div key={index} className='mb-5' >
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        {/* @ts-ignore */}
                                        <Body2 secondary dark={useDarkMode}>{item?.mounted}\</Body2>
                                        {/* @ts-ignore */}
                                        <Caption secondary dark={useDarkMode}>{item?.available} Go libres sur {item?.blocks} Go</Caption>
                                    </div>
                                    {/* @ts-ignore */}
                                    <ProgressLinear dark={useDarkMode} value={(item?.used / item?.blocks) * 100} color='var(--primary)' />
                                </div>
                            ))
                            }
                        </Card>
                    </Card>
                </Card>

        </>
    )
}

export default DisqueMemoireInfo