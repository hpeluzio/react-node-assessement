import { createSlice } from "@reduxjs/toolkit";
import { SERVICE_URL } from "./config";
import axios from "axios";

const initialState = {
  users: [],
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    receiveService(state, action) {
      const { users, loading } = action.payload;
      state.users = users;
      state.loading = loading;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

const { setLoading, receiveService } = userSlice.actions;
export const { setUsers } = userSlice.actions;

export const getUsers = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(`${SERVICE_URL}/users`);
    // console.log("response: ", response);
    const { data: users } = response;
    dispatch(receiveService({ users, loading: false }));
  } catch (err) {
    dispatch(setLoading(false));
  }
};

export default userSlice.reducer;
