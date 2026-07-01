import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/products");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ?? "Error al cargar productos"
      );
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ?? "Error al cargar producto"
      );
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/create",
  async (product, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/products", product);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ?? "No se pudo crear el producto"
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, product }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/products/${id}`, product);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ?? "No se pudo actualizar el producto"
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/products/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ?? "No se pudo eliminar el producto"
      );
    }
  }
);

export const uploadProductImage = createAsyncThunk(
  "products/uploadImage",
  async ({ productId, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("productId", productId);
      formData.append("file", file);

      const response = await api.post("/api/images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return { productId, image: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ?? "No se pudo subir la imagen"
      );
    }
  }
);

const initialState = {
  items: [],
  selectedProduct: null,
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: "products",

  initialState,

  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },

    clearProductsError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })

      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.items = [];
        state.error = action.payload;
      })

      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedProduct = null;
      })

      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })

      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.selectedProduct = null;
        state.error = action.payload;
      })

      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })

      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.items.findIndex(
          (product) => product.productId === action.payload.productId
        );

        if (index !== -1) {
          state.items[index] = action.payload;
        }

        if (state.selectedProduct?.productId === action.payload.productId) {
          state.selectedProduct = action.payload;
        }
      })

      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;

        state.items = state.items.filter(
          (product) => product.productId !== action.payload
        );

        if (state.selectedProduct?.productId === action.payload) {
          state.selectedProduct = null;
        }
      })

      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(uploadProductImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(uploadProductImage.fulfilled, (state, action) => {
        state.loading = false;

        const { productId, image } = action.payload;

        const product = state.items.find(
          (item) => item.productId === productId
        );

        if (product) {
          if (!product.images) {
            product.images = [];
          }

          product.images.push(image);
        }

        if (state.selectedProduct?.productId === productId) {
          if (!state.selectedProduct.images) {
            state.selectedProduct.images = [];
          }

          state.selectedProduct.images.push(image);
        }
      })

      .addCase(uploadProductImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearSelectedProduct,
  clearProductsError,
} = productsSlice.actions;

export default productsSlice.reducer;