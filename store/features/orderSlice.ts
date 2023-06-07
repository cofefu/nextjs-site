import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import callApi from "../../common/callApi";


const initialState = {
  cancelTime: 0,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    startCancelTime: (state) => {
        state.cancelTime = 1 * 60 * 1000;
    },
    setCancelTime: (state, action) => {
        state.cancelTime = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
  },
});

export const { startCancelTime, setCancelTime } = orderSlice.actions;

export default orderSlice.reducer;
