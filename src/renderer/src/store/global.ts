import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getSettings = createAsyncThunk(
  "settings/fetchSetting",
  async () => {
    // @ts-ignore
    const res = await window.ipcRenderer.sendSync("get-settings");
    console.log(res, 'setting');
    return res;
  }
);

export const GlobalSice = createSlice({
  name: "global",
  initialState: {
    settings: {},
  },
  reducers: {
    setSettings(state, { payload }) {
      state.settings = { ...state.settings, ...payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSettings.fulfilled, (state, { payload }) => {
      console.log(payload, "payload");
      state.settings = payload;
    });
  },
});

export default GlobalSice.reducer;
