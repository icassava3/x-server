import { mdiMenu, mdiMoonWaningCrescent, mdiWhiteBalanceSunny } from '@mdi/js'
import Icon from '@mdi/react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Divider, H6, ToggleButton } from 'ui-neumorphism'
import { setHttpIn, setHttpOut, toggleHideSideBar, toggleUseDarkMode } from '../../store/appSlice'
import { IReduxState } from '../../store/store'
import Led from './Led'

function TopBar() {

    // redux
    const dispatch = useDispatch()

    const { useDarkMode, hideSideBar, paramEtab, httpIn, httpOut } = useSelector((state: IReduxState) => state.application);

    useEffect(() => {
        if (httpIn) {
            setTimeout(() => {
                dispatch(setHttpIn(false))
            }, 50);
        } else if (httpOut === true || httpOut === false) {
            setTimeout(() => {
                dispatch(setHttpOut(null))
            }, 50);
        }
    }, [httpIn, httpOut])

    return (
        <>
            {/* @ts-ignore */}
            <Card flat dark={useDarkMode} className={`main-topbar`}>
                {/* @ts-ignore */}
                <Card flat className='d-flex align-center topbar-headline'>
                    <div className={'hide-menu-button'}>
                        {/* @ts-ignore */}
                        <ToggleButton
                            dark={useDarkMode}
                            onClick={() => (dispatch(toggleHideSideBar(!hideSideBar)))}
                        >
                            <Icon path={mdiMenu} size={1} />
                        </ToggleButton>
                    </div>
                    {/* @ts-ignore */}
                    <H6
                        className='topbar-title'
                        style={{ color: 'var(--primary)' }}
                    >
                        {`${paramEtab.codeetab} - ${paramEtab.nomcompletetab} - ${paramEtab.anscol1}`}
                    </H6>
                </Card>
                {/* @ts-ignore */}
                <Card flat className='d-flex align-center topbar-actions'>
                    {/* @ts-ignore */}
                    <Card
                        flat
                        height={25}
                        width={90}
                        rounded
                        className={'d-flex align-center justify-center '}
                    >
                        {/* <Led actionColor="blue" />
                        <Led actionColor="green" />
                        <Led actionColor="red" /> */}
                        <Led actionColor={httpIn ? '#00bfff' : '#055099'} />
                        <Led actionColor={!httpOut ? '#037d50' : '#83f52c'} />
                        <Led actionColor={httpOut === false ? '#ff0000' : '#800000'} />
                    </Card>
                    {/* @ts-ignore */}
                    <ToggleButton className='topbar-action'
                        onClick={() => (dispatch(toggleUseDarkMode(!useDarkMode)))}
                    >
                        <Icon className='rotate-moon-icon' path={useDarkMode ? mdiWhiteBalanceSunny : mdiMoonWaningCrescent} size={1} />
                    </ToggleButton>
                </Card>
            </Card>
            {/* @ts-ignore */}
            <Divider dark={useDarkMode} dense style={{ marginBottom: 20 }} />
        </>
    )
}

export default TopBar