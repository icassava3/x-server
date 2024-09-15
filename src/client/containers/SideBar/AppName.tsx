import { mdiClose } from '@mdi/js';
import Icon from '@mdi/react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Divider, Caption, ToggleButton } from 'ui-neumorphism'
import { toggleHideSideBar } from '../../store/appSlice';
import { IReduxState } from '../../store/store';
import packageJson from "../../../../package.json";

function AppName() {
    const year = new Date().getFullYear()

    // redux
    const dispatch = useDispatch()
    const { useDarkMode, hideSideBar } = useSelector((state: IReduxState) => state.application);
    return (
        // @ts-ignore
        <Card dark={useDarkMode} flat>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ margin: 10, fontSize: 35, marginTop: 20, fontFamily: 'Elektra', letterSpacing: 5 }}>
                        x-SERVER
                    </div>
                    <span
                        className='mt-8 '
                        style={{ fontFamily: 'Elektra', fontSize: 20, letterSpacing: 1 }}
                    >
                        {packageJson.version}
                    </span>
                </div>
                {hideSideBar
                    ?
                    // @ts-ignore
                    <ToggleButton
                        onClick={() => (dispatch(toggleHideSideBar(!hideSideBar)))}
                    >
                        <Icon color='red' path={mdiClose} size={1} />
                    </ToggleButton>
                    : null
                }
            </div>
            {/* @ts-ignore */}
            <Caption style={{ color: 'gray', letterSpacing: 2.8, marginLeft: 10, marginBottom: 10, fontSize: 8 }}>
                SPIDER TECHNOLOGIES ® 2010-{year}
            </Caption>
            {/* @ts-ignore */}
            <Divider dense />
        </Card>
    );
}
export default AppName