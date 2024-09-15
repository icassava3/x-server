import * as ReactDOM from "react-dom";
import './index.css';
import App from './App';
import store from './store/store';
import { Provider } from 'react-redux';



const Root = () => {

  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

ReactDOM.render(
  <Root />,
  document.getElementById("root")
);

