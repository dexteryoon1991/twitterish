import { API } from "./api"
import { Post, UserStatus } from "./redux"

export interface EmailAndPassword {
  email: string
  password: string
}

export interface Credential extends EmailAndPassword {
  uid: string
}

export interface SignupProps extends EmailAndPassword {
  name: string
  profileImg?: string
}

export interface FirebaseUser {
  email: string
  uid: string
  name: string
  profileImg?: string
}
export interface Auth extends UserStatus {
  signIn: (signinProps: EmailAndPassword) => void
  signUp: (signupProps: SignupProps) => void
  signOut: () => void
  isProcessing: boolean
}

export interface Posting {
  createPost: (post: Post) => Promise<void>
  editPost: (post: Post) => Promise<void>
  deletePost: (id: string) => Promise<void>
}
