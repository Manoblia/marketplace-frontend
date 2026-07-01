import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

const ADMIN_EMAILS = [
  "admin2@test.com",
  "vendedor@gmail.com",
];

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/auth/login", {
        email,
        password,
      });

      const { token } = response.data;

      const user = {
        name: email.split("@")[0],
        email,
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (ADMIN_EMAILS.includes(email.toLowerCase())) {
        localStorage.setItem("isAdmin", "true");
      } else {
        localStorage.removeItem("isAdmin");
      }

      return user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Email o contraseña incorrectos"
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ userName, email, password }, { rejectWithValue }) => {
    try {
      await api.post("/api/auth/register", {
        userName,
        email,
        password,
      });
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Error al registrarse"
      );
    }
  }
);

const storedUser = JSON.parse(
  localStorage.getItem("user") || "null"
);

const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: storedUser,
    loading: false,
    error: null,
  },

  reducers: {
    logout: (state) => {
      state.user = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("lastOrder");
      localStorage.removeItem("isAdmin");
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;