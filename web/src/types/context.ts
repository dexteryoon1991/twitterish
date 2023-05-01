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

export interface IdAndName {
  uid: string
  name: string
}

export interface IdAndImg {
  uid: string
  profileImg: string
}
export interface Auth extends UserStatus {
  signIn: (signinProps: EmailAndPassword) => void
  signUp: (signupProps: SignupProps) => void
  signOut: () => void
  isProcessing: boolean
  updatePassword: (props: PasswordAndUid) => Promise<UserApi>
  updateName: (name: string) => Promise<UpdateNameApi>
  updateProfileImg: (profileImg: string) => Promise<UpdateProfileImgApi>
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

export interface UpdateNameApi extends API {
  name?: string
}
export interface UpdateProfileImgApi extends API {
  profileImg?: string
}

export interface Inquiry {
  email: string
  body: string
  title?: string
  id?: string
  createdAt?: string
  password?: string
}
export interface IdAndBody {
  id: string
  body: string
}

export interface Inquiries {
  createInquiry: (inquiry: Inquiry) => Promise<API>
  updateInquiry: (props: IdAndBody) => Promise<API>
  deleteInquiry: (id: string) => Promise<API>
  answerInquiry: (props: SendEmail) => Promise<API>
  findInquiry: (email: string) => Promise<InquiryApi>
  inquiryQueryKey: any[]
}

export interface InquiryApi extends API {
  payload?: { inquiries: Inquiry[] }
}
