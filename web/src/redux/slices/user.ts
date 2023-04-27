import { FirebaseUser, User, UserStatus } from "@/types"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"

type Props = User | FirebaseUser
const initialState: Props = {
  email: "",
  name: "",
  profileImg: "",
  uid: "",
}

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userHandler(state, action: PayloadAction<User | FirebaseUser | undefined>) {
      const user = action.payload
      return user ? { ...user } : { ...initialState }
    },
  },
})

export const user = slice.reducer

export const selectUser = (state: RootState) => state.user

export const { userHandler } = slice.actions
