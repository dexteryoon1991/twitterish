import { FirebaseUser } from "./context"
import { User } from "./redux"

export interface API {
  success: boolean
  message?: string
}

export enum Collection {
  USER = "user",
  POST = "post",
  TOKEN = "token",
  CREDENTIAL = "credential",
}

export interface UserApi extends API {
  payload?: {
    user: FirebaseUser
    accessToken?: string
  }
}
