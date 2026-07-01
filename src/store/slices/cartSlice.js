import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchCart = createAsyncThunk(
  "cart/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/cart");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ?? "Error al cargar el carrito"
      );
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addItem",
  async ({ variantId, quantity }, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/cart/items", {
        variantId,
        quantity,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ??
          "No se pudo agregar al carrito"
      );
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateItem",
  async (
    { cartItemId, variantId, quantity },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(
        `/api/cart/items/${cartItemId}`,
        {
          variantId,
          quantity,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ??
          "No se pudo actualizar la cantidad"
      );
    }
  }
);

export const removeCartItem = createAsyncThunk(
  "cart/removeItem",
  async (cartItemId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/cart/items/${cartItemId}`);

      return cartItemId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ??
          "No se pudo eliminar el producto"
      );
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clear",
  async (_, { rejectWithValue }) => {
    try {
      await api.delete("/api/cart");

      return true;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ??
          "No se pudo vaciar el carrito"
      );
    }
  }
);

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    clearCartError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // FETCH CART

      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })

      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD TO CART

      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(addToCart.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE ITEM

      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })

      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // REMOVE ITEM

      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.loading = false;

        if (state.data) {
          state.data.cartItems =
            state.data.cartItems.filter(
              (item) =>
                item.cartItemId !== action.payload
            );
        }
      })

      .addCase(removeCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CLEAR CART

      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;

        if (state.data) {
          state.data.cartItems = [];
        }
      })

      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCartError } = cartSlice.actions;

export default cartSlice.reducer;
