import { createSlice } from "@reduxjs/toolkit";
export interface IPhotoState {
  dataPhoto: IPhotoItem[]
}
export interface IPhotoItem {
  idPriseDeVue: string;
  studentId: number;
  matricule: string;
  nomPrenom: string;
  classe: string;
  codeEtab: string;
  anneeScolaire: string;
  datePhoto: string;
  photographerId: string;
  photographerName: string;
  deviceModel: string;
}
export const photoSlice = createSlice({
  name: "photo",
  initialState: {
    dataPhoto: []
  },
  reducers: {
    setListePhoto: (state, action) => {
      state.dataPhoto = action.payload;
    },
    // updateListePhotos: (state, action) => {
    //   state.dataPhoto=[...action.payload,...state.dataPhoto];
    // },
    updateListePhoto: (state, action) => {
      state.dataPhoto=[...action.payload,...state.dataPhoto];
    },
  },
});
export const { setListePhoto, updateListePhoto } = photoSlice.actions;
export default photoSlice.reducer;