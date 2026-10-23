import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchBrands, fetchAnalogues } from "../api/favoritApi";

// Защита от гонок: храним requestId последнего запроса каждого этапа.
const latestBrandsRequest = { current: null };
const latestAnaloguesRequest = { current: null };

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
    // Этап 1: бренды
    b.addCase(loadBrands.pending, (s, a) => {
      s.brandsLoading = true;
      s.error = null;
      s.brands = [];
      s.analogues = [];
      s.selectedBrand = null;
      latestBrandsRequest.current = a.meta.requestId;
    })
      .addCase(loadBrands.fulfilled, (s, a) => {
        if (a.meta.requestId !== latestBrandsRequest.current) return; // устаревший ответ — игнор
        s.brandsLoading = false;
        s.brands = a.payload.brands;
        s.number = a.payload.number;
      })
      .addCase(loadBrands.rejected, (s, a) => {
        if (a.meta.requestId !== latestBrandsRequest.current) return;
        s.brandsLoading = false;
        s.error = a.error.message;
      })
      // Этап 2: аналоги
      .addCase(loadAnalogues.pending, (s, a) => {
        s.analoguesLoading = true;
        s.error = null;
        s.analogues = [];
        s.selectedBrand = a.meta.arg.brand;
        latestAnaloguesRequest.current = a.meta.requestId;
      })
      .addCase(loadAnalogues.fulfilled, (s, a) => {
        if (a.meta.requestId !== latestAnaloguesRequest.current) return;
        s.analoguesLoading = false;
        s.analogues = a.payload.items;
      })
      .addCase(loadAnalogues.rejected, (s, a) => {
        if (a.meta.requestId !== latestAnaloguesRequest.current) return;
        s.analoguesLoading = false;
        s.error = a.error.message;
      });
  },
});

export const { reset, setNumber } = slice.actions;
export default slice.reducer;
