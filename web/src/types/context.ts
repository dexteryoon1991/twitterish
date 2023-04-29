import { API, Comment, CommentProps, UserApi } from "./api"
import { Post, User, UserStatus } from "./redux"

export interface EmailAndPassword {
  email: string
  password: string
}

export interface Credential extends EmailAndPassword {
  uid: string
  name: string
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
export interface PasswordAndUid {
  password: string
  uid: string
}

export interface Auth extends UserStatus {
  signIn: (signinProps: EmailAndPassword) => void
  signUp: (signupProps: SignupProps) => void
  signOut: () => void
  isProcessing: boolean
  updatePassword: (props: PasswordAndUid) => Promise<UserApi>
}

export interface LikeProp {
  id: string
  user: User
}

export interface CommentIds {
  id: string
  postId: string
}

export interface EditComment extends CommentIds {
  body: string
}
export interface Posting {
  createPost: (post: Post) => Promise<API>
  editPost: (post: Post) => Promise<API>
  deletePost: (id: string) => Promise<API>
  likePost: (props: LikeProp) => Promise<API>
  createComment: (props: CommentProps) => Promise<API>
  editComment: (props: EditComment) => Promise<API>
  deleteComment: (props: CommentIds) => Promise<API>
  isProcessing: boolean
}

export interface SendEmail {
  email: string
  body?: string
  name?: string
}

export interface UseEmail {
  sendEmail: (props: SendEmail) => Promise<API>
  sendResetPasswordEmail: (props: SendEmail) => Promise<API>
  isSending: boolean
}
