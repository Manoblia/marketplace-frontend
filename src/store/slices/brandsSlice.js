import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchBrands = createAsyncThunk(
  "brands/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/brands");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error al cargar las marcas"
      );
    }
  }
);

export const createBrand = createAsyncThunk(
  "brands/create",
  async (brandName, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/brands", { brandName });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "No se pudo crear la marca"
      );
    }
  }
);

export const updateBrand = createAsyncThunk(
  "brands/update",
  async ({ id, brandName }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/brands/${id}`, { brandName });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "No se pudo actualizar la marca"
      );
    }
  }
);

export const deleteBrand = createAsyncThunk(
  "brands/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/brands/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "No se pudo eliminar la marca"
      );
    }
  }
);

const brandsSlice = createSlice({
  name: "brands",

  initialState: {
    items: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })

      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createBrand.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      .addCase(updateBrand.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (brand) => brand.brandId === action.payload.brandId
        );

        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (brand) => brand.brandId !== action.payload
        );
      });
  },
});

export default brandsSlice.reducer;