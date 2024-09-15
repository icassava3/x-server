import { hot } from 'react-hot-loader';
import { useSelector } from 'react-redux';
import { Card } from 'ui-neumorphism';
import 'ui-neumorphism/dist/index.css';
import MiseAJour from './composants/MiseAJour';
import Sidebar from './containers/SideBar';
import TopBar from './containers/TopBar/TopBar';
import WorkSpace from './containers/WorkSpace';
import socketIO from './socket/socketIO';
import { IReduxState } from './store/store';


socketIO.initialize()

function App() {
  const { useDarkMode } = useSelector((state: IReduxState) => state.application);
  return (
    <main style={{ userSelect: "none" }} >
      {/* @ts-ignore */}
      <Card dark={useDarkMode} flat className={`main-container `} >
        {/* Panel de mise à jour de x-server */}
        <MiseAJour />
        {/* @ts-ignore */}
        <Card dark={useDarkMode} className='main-content'>
          <Sidebar />
          {/* @ts-ignore */}
          <Card dark={useDarkMode} className={`main-view`}>
            <TopBar />
            <WorkSpace />
          </Card>
        </Card>
      </Card>
    </main>
  );
}

export default hot(module)(App);