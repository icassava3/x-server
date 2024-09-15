import { createSlice } from "@reduxjs/toolkit";

export interface IStatState {
  statEtab: IStatEtab;
  nbPriseVue: number;
  // readonly nbRetard:number;
}

export interface IStatEtab {
  series: any[];
  stat: IStat;
}

export interface IStat {
  effectifEleves: number;
  elevesAffectes: number;
  elevesNonAffectes: number;
  nbClasses: number;
  personnelAdmin: number;
  personnelEns: number;
}


export const statSlice = createSlice({
  name: "stat",
  initialState: {
    statEtab: {
      series: [0, 0, 0, 0,0],
      stat: {
        effectifEleves: 0,
        elevesAffectes: 0,
        elevesNonAffectes: 0,
        nbClasses: 0,
        personnelAdmin: 0,
        personnelEns: 0,
      }
    },
    nbPriseVue: 0,
    // nbRetard:0
  },
  reducers: {
    setStatEtab: (state, action) => {
      console.log("🚀 ~ file: statSlice.ts ~ line 44 ~ ction.payload", action.payload)
      state.statEtab = action.payload;
    },
    setNbPriseVue: (state, action) => {
      state.nbPriseVue = action.payload;
    },
  },
});
export const { setStatEtab, setNbPriseVue } = statSlice.actions;
export default statSlice.reducer;
