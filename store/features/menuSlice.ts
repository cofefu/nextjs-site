import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import callApi from "../../common/callApi";

export const fetchMenu = createAsyncThunk("user/fetchMenu", async (_) => {
  const response = await callApi("/products", "GET", undefined, {});

  return response;
});

export const fetchToppings = createAsyncThunk(
  "user/fetchToppings",
  async (_) => {
    const response = await callApi("/toppings", "GET", undefined, {});

    return response;
  }
);

export const fetchCoffeeHouses = createAsyncThunk(
  "user/fetchCoffeeHouses",
  async (_) => {
    const response = await callApi("/coffee_houses", "GET", undefined, {});

    return response;
  }
);

// export const fetchUserInfo = createAsyncThunk(
//     'user/info',
//     async () => {
//         return await callApi(apiUrls.userInfo);
//     }
// );

const initialState = {
  products: [],
  toppings: [],
  coffeeHouses: [],
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.fulfilled, (state, { payload }) => {
        state.products = payload;
      })
      .addCase(fetchToppings.fulfilled, (state, { payload }) => {
        state.toppings = payload;
      })
      .addCase(fetchCoffeeHouses.fulfilled, (state, { payload }) => {
        state.coffeeHouses = payload;
      });
  },
});

export const {} = menuSlice.actions;

export default menuSlice.reducer;
