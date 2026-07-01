import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import productsReducer from "./slices/productsSlice";
import cartReducer from "./slices/cartSlice";
import ordersReducer from "./slices/ordersSlice";
import brandsReducer from "./slices/brandsSlice";
import categoriesReducer from "./slices/categoriesSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    brands: brandsReducer,
    categories: categoriesReducer,
    cart: cartReducer,
    orders: ordersReducer,
  },
});

export default store;
