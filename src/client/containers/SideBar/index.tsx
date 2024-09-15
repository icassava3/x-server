import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Card } from 'ui-neumorphism'
import { IReduxState } from '../../store/store'
import AppName from './AppName'
import ConnectionInfos from './ConnectionInfos'
import EtatDesServeurs from './EtatDesServeurs'
import useMediaQuery from '@mui/material/useMediaQuery';
import { InternetAvailable } from './InternetAvailable'

//Pour connaitre la taille de l'écran
export const screenWidth = () => {
    const [screenSize, getDimension] = useState({
        dynamicWidth: window.innerWidth,
        dynamicHeight: window.innerHeight
    });

    const setDimension = () => {
        getDimension({
            dynamicWidth: window.innerWidth,
            dynamicHeight: window.innerHeight

        })
    }

    useEffect(() => {
        window.addEventListener('resize', setDimension);
        return (() => {
            window.removeEventListener('resize', setDimension);
        })
    }, [screenSize])

    return screenSize
}



function Sidebar() {
    
    const { useDarkMode, hideSideBar } = useSelector((state: IReduxState) => state.application);
    const isSmallScreen = useMediaQuery('(min-width:600px)');
    return (
        <>
            {/* @ts-ignore */}
            <Card
                bordered={true}
                dark={useDarkMode}
                flat
                className={`sidebar  ${screenWidth().dynamicWidth <= 799
                    ? ''
                    : 'sidebar--always'} ${hideSideBar
                        ? 'sidebar--open'
                        : ''
                    }  
                `}
                // className={`sidebar sidebar--always
                // `}
            >
                <AppName />
                {/* <InternetAvailable /> */}
                <ConnectionInfos />
                <EtatDesServeurs />
            </Card>

        </>
    )
}

export default Sidebar