import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchOrders = createAsyncThunk(
  "orders/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/orders");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ??
          "Error al cargar pedidos"
      );
    }
  }
);

export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAllAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/orders/all");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ??
          "Error al cargar todas las ventas"
      );
    }
  }
);

export const checkout = createAsyncThunk(
  "orders/checkout",
  async (
    {
      fullName,
      shippingAddress,
      paymentMethod,
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(
        "/api/orders/checkout",
        {
          fullName,
          shippingAddress,
          paymentMethod,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ??
          "No se pudo confirmar la compra"
      );
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: "orders",

  initialState,

  reducers: {
    clearOrdersError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // PEDIDOS DEL USUARIO

      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })

      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.items = [];
        state.error = action.payload;
      })

      // TODAS LAS VENTAS (ADMIN)

      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })

      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CHECKOUT

      .addCase(checkout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(checkout.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(checkout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrdersError } =
  ordersSlice.actions;

export default ordersSlice.reducer;
