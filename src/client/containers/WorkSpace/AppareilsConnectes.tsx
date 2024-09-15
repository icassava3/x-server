import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import AppareilsConnectesItem from '../../composants/AppareilsConnectesItem';
import { IReduxState } from '../../store/store';


const AppareilsConnectes = () => {

    const { devices, useDarkMode } = useSelector((state: IReduxState) => state.application);
    const [series, setSeries] = useState([0, 0, 0]);

    const totalDevice = useMemo(() => series.reduce((acc, count) => acc + count, 0), [series]);
    const phonePercentage = useMemo(() => (series[2] / totalDevice) * 100, [series, totalDevice]);
    const tabletPercentage = useMemo(() => (series[1] / totalDevice) * 100, [series, totalDevice]);
    const desktopPercentage = useMemo(() => (series[0] / totalDevice) * 100, [series, totalDevice]);

    const getSeries = useCallback(() => {
        let desktopCount = 0;
        let tabletCount = 0;
        let phoneCount = 0;

        devices?.forEach((item) => {
            if (item.deviceType === 'Desktop') {
                desktopCount++;
            } else if (item.deviceType === 'Tablet') {
                tabletCount++;
            } else if (item.deviceType === 'Phone') {
                phoneCount++;
            }
        });

        setSeries([desktopCount, tabletCount, phoneCount]);
    }, [devices]);

    useEffect(() => {
        getSeries();
    }, [getSeries]);

    return (
        <div style={{ display: "flex", justifyContent: "space-between", paddingLeft: 10, paddingRight:10 }}  >
            <AppareilsConnectesItem useDarkMode={useDarkMode} libelle='Téléphones' devicePercent={phonePercentage} count={series[2]} />
            <AppareilsConnectesItem useDarkMode={useDarkMode} libelle='Tablettes' devicePercent={tabletPercentage} count={series[1]} />
            <AppareilsConnectesItem useDarkMode={useDarkMode} libelle='Ordinateurs' devicePercent={desktopPercentage} count={series[0]} />
        </div>
    )
}

export default AppareilsConnectes