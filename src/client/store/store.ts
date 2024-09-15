import { configureStore } from '@reduxjs/toolkit';
import appReducer from './appSlice';
import presenceReducer, { IPresenceState } from './ListePresenceSlice'
import photoReducer, { IPhotoState } from './photoSlice'
import statReducer, { IStatState } from './statSlice'
import { IAppState } from './interfaces';
export interface IReduxState {
    application: IAppState;
    presence: IPresenceState;
    photo: IPhotoState;
    stat: IStatState

}

export default configureStore({
    reducer: {
      application: appReducer,
      presence: presenceReducer,
      photo: photoReducer,
      stat: statReducer
    },
  });