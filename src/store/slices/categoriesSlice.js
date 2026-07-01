import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/categories");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error al cargar las categorías"
      );
    }
  }
);

export const createCategory = createAsyncThunk(
  "categories/create",
  async (categoryName, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/categories", {
        categoryName,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "No se pudo crear la categoría"
      );
    }
  }
);

export const updateCategory = createAsyncThunk(
  "categories/update",
  async ({ id, categoryName }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/categories/${id}`, {
        categoryName,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "No se pudo actualizar la categoría"
      );
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/categories/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "No se pudo eliminar la categoría"
      );
    }
  }
);

const categoriesSlice = createSlice({
  name: "categories",

  initialState: {
    items: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })

      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createCategory.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (category) =>
            category.categoryId === action.payload.categoryId
        );

        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (category) =>
            category.categoryId !== action.payload
        );
      });
  },
});

export default categoriesSlice.reducer;