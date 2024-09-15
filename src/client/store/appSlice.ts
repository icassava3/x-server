import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { initialCnxInfos, initialState } from "./initialState";
import { IAllStatEtab, IAppState, IConnectionInfos, IDashboardStatus, IDevice, IRecentActivity } from "./interfaces";

export const appSlice = createSlice({
  name: "application",
  initialState: <IAppState>initialState,
  reducers: {
    toggleUseDarkMode: (state, action: PayloadAction<boolean>) => {
      state.useDarkMode = action.payload;
    },

    toggleHideSideBar: (state, action: PayloadAction<boolean>) => {
      state.hideSideBar = action.payload
    },
    setConnectionInfos: (state, action: PayloadAction<IConnectionInfos>) => {
      state.connectionInfos =
        action.payload === null
          ? initialCnxInfos
          : {
            ...action.payload,
            serverUrl: `http://${action.payload.ip}:${action.payload.port}`,
          };
    },
    upsertDevice: (state, action: PayloadAction<IDevice>) => {
      const newDevice = action.payload;
      const index: number = state.devices.findIndex(
        (item) => item.modelName === newDevice.modelName
      );
      if (index === -1) state.devices.push(newDevice);
    },
    resetDevices: (state, action) => {
      state.devices = [];
    },
    setLastStudentId: (state, action) => {
      state.lastStudentId = action.payload;
    },
    setDevices: (state, action: PayloadAction<IDevice[]>) => {
      state.devices = action.payload;
    },
    setParamEtab: (state, action) => {
      state.paramEtab = action.payload;
    },
    setShowPanel: (state, action) => {
      if (action.payload >= 0) {
        state.showPanel = true;
      } else {
        state.showPanel = false;
      }
    },
    setDashboardStatus: (state, action: PayloadAction<Partial<IDashboardStatus>>) => {
      state.dashboardStatus = { ...state.dashboardStatus, ...action.payload };
    },
    setHttpIn: (state, action: PayloadAction<boolean>) => {
      state.httpIn = action.payload ;
    },
    setHttpOut: (state, action: PayloadAction<boolean>) => {
      state.httpOut = action.payload ;
    },
    addRecentActivity: (state, action: PayloadAction<IRecentActivity>) => {
      state.recentActivity.unshift(action.payload)  ;
    },
    setRecentActivitiesList: (state, action: PayloadAction<IRecentActivity[]>) => {
      state.recentActivity = action.payload ;
    },
    setAllStatEtab: (state, action: PayloadAction<IAllStatEtab>) => {
      state.allStatEtab = action.payload ;
    },
  }
});

export const {
  toggleUseDarkMode,
  toggleHideSideBar,
  setConnectionInfos,
  setDevices,
  upsertDevice,
  resetDevices,
  setParamEtab,
  setShowPanel,
  setDashboardStatus,
  setHttpIn,
  setHttpOut,
  addRecentActivity,
  setRecentActivitiesList,
  setLastStudentId,
  setAllStatEtab
} = appSlice.actions;
export default appSlice.reducer;
