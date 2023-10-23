import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userService from "./userService";
import { toast } from "react-toastify";
import { logout, logoutUser } from "../auth/authSlice";
const initialState = {
    user: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
  };
  export const getUser = createAsyncThunk('user/getUser', async (data=null,thunkAPI) => {
    try {
      const response = await userService.getUser();
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      return result;
    } catch (error) {
        toast.error(error.message);
        if(error.message === "You are not authorized to access this route"){
          thunkAPI.dispatch(logoutUser());
        }
        return thunkAPI.rejectWithValue(error.message);
    }
  });
  export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
      reset: (state) => {
        state.isError = false;
        state.isSuccess = false;
        state.isLoading = false;
        state.message = "";
      },
    },
    extraReducers: (builder) => {
        builder
        .addCase(getUser.pending, (state) => {
          state.isLoading = true
        })
        .addCase(getUser.rejected, (state) => {
          state.isLoading = false
          state.user = null
          state.isError = false
          state.isSuccess = false
          state.message = ""
        })
        .addCase(getUser.fulfilled, (state,action) => {
          state.isLoading = false
          state.isSuccess = true
          state.isError = false
          state.user = action.payload.user
        })
        .addCase(logout.fulfilled, (state) => {
          state.isLoading = false
          state.isSuccess = false
          state.isError = false
          state.message = ""
          state.user = null
        }) 
    }

});

export const { 
  reset 
 } = userSlice.actions;
export default userSlice.reducer;