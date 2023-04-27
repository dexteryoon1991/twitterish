import { FirebaseUser } from "./context"

export interface UserStatus {
  isLoggedIn: boolean
}

export interface Post {
  body: string
  img?: string
  createdAt: string
  createdBy: User
  id: any
  comments?: any[]
  likes?: User[]
}

export interface Posts {
  posts: Post[]
}

export interface User extends FirebaseUser {}

export const momentFormat = "MMMM Do YYYY, h:mm:ss a"
