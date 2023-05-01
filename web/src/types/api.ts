import { FirebaseUser, LikeProp } from "./context"
import { Post, User } from "./redux"

export interface API {
  success: boolean
  message?: string
}

export enum Collection {
  USER = "user",
  POST = "post",
  TOKEN = "token",
  CREDENTIAL = "credential",
  VERIFICATIONCODE = "verificationcode",
  LIKE = "like",
  COMMENT = "comment",
  INQUIRY = "inquiry",
}

export interface UserApi extends API {
  payload?: {
    user: FirebaseUser
    accessToken?: string
  }
}

export interface PostApi extends API {
  pyaload?: { posts: Post[] }
}

export interface VerificationCodeApi extends API {
  verificationCode?: string
  uid?: string
}

export interface Comment {
  body: string
  createdAt?: string
  createdBy: User
  id?: string
}

export interface CommentApi extends API {
  comments?: Comment[]
}

export interface FetchLikeAndCommentApi extends API {
  payload?: { likes: User[]; comments: Comment[] }
}

export interface CommentProps extends Comment {
  postId: string
}

export interface MyPostApi extends API {
  payload?: {
    posts: Post[]
  }
}
