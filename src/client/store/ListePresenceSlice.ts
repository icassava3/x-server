import { createSlice } from "@reduxjs/toolkit";

export interface IPresenceState {
  dataPresence: IPointageItem[]
}

export interface IPointageItem {
  idPointage: number;
  nomEleve: string;
  matriculeEleve: string;
  codeEtab: string;
  nomEtab: string;
  anneeScolaire: string;
  datePointage: string;
}


export const listePresenceSlice = createSlice({
  name: "listePresence",
  initialState: {
    dataPresence: []
  },
  reducers: {
    setListePresence: (state, action) => {
      state.dataPresence = action.payload;
    },
    updateListePresence: (state, action) => {
      state.dataPresence.unshift(action.payload);
    },
  },
});
export const { setListePresence, updateListePresence } = listePresenceSlice.actions;
export default listePresenceSlice.reducer;
