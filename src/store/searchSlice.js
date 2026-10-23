import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchBrands, fetchAnalogues } from "../api/favoritApi";

// Два этапа = два thunk'а. Оба пишут в один slice, но в разные поля.
export const loadBrands = createAsyncThunk(
  "search/loadBrands",
  async (number) => ({ number, brands: await fetchBrands(number) }),
);

export const loadAnalogues = createAsyncThunk(
  "search/loadAnalogues",
  async ({ number, brand }) => ({
    brand,
    items: await fetchAnalogues(number, brand),
  }),
);

const slice = createSlice({
  name: "search",
  initialState: {
    number: "",
    brands: [],
    selectedBrand: null,
    analogues: [],
    brandsLoading: false,
    analoguesLoading: false,
    error: null,
  },
  reducers: {
    reset: () => slice.getInitialState(),
    setNumber: (s, a) => {
      s.number = a.payload;
    },
  },
  extraReducers: (b) => {
    b.addCase(loadBrands.pending, (s) => {
      s.brandsLoading = true;
      s.error = null;
      s.brands = [];
      s.analogues = [];
      s.selectedBrand = null;
    })
      .addCase(loadBrands.fulfilled, (s, a) => {
        s.brandsLoading = false;
        s.brands = a.payload.brands;
        s.number = a.payload.number;
      })
      .addCase(loadBrands.rejected, (s, a) => {
        s.brandsLoading = false;
        s.error = a.error.message;
      })
      .addCase(loadAnalogues.pending, (s, a) => {
        s.analoguesLoading = true;
        s.error = null;
        s.analogues = [];
        s.selectedBrand = a.meta.arg.brand;
      })
      .addCase(loadAnalogues.fulfilled, (s, a) => {
        s.analoguesLoading = false;
        s.analogues = a.payload.items;
      })
      .addCase(loadAnalogues.rejected, (s, a) => {
        s.analoguesLoading = false;
        s.error = a.error.message;
      });
  },
});

export const { reset, setNumber } = slice.actions;
export default slice.reducer;
