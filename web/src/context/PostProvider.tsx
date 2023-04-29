import { selectUser, useAppSelector, user } from "@/redux"
import { API, LikeProp, Post, Posting, Comment, User, momentFormat, CommentProps, CommentIds, EditComment } from "@/types"
import axios from "axios"
import moment from "moment"
import { useRouter } from "next/router"
import { useState, useCallback, useContext, createContext, useEffect, PropsWithChildren } from "react"
import { useMutation, useQueryClient } from "react-query"

const initialData: Posting = {
  createPost: async () => {
    return { success: false }
  },
  deletePost: async () => {
    return { success: false }
  },
  editPost: async () => {
    return { success: false }
  },
  likePost: async () => ({ success: false }),
  createComment: async () => ({ success: false }),
  editComment: async () => ({ success: false }),
  deleteComment: async () => ({ success: false }),
  isProcessing: false,
}
const data = createContext(initialData)

export function PostProvider({ children }: PropsWithChildren) {
  const { uid } = useAppSelector(selectUser)
  const queryClient = useQueryClient()

  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  const cache = () => {
    console.log("caching")
    queryClient.invalidateQueries({ queryKey: ["post", uid] })
    router.replace(router.asPath)
  }

  const createFn = useMutation({
    mutationFn: async (post: Post): Promise<API> => {
      setIsProcessing(true)
      const { data } = await axios.post("post", post)
      return data
    },
    onSuccess: (res) => {
      setIsProcessing(false)
      console.log(res)
      const { success, message } = res
      if (!success) {
        alert(message)
      }
      cache()
    },
  })

  const createPost = useCallback(
    async (post: Post): Promise<API> => {
      try {
        await createFn.mutate(post)
        return { success: true }
      } catch (error: any) {
        return { success: false, message: error.message }
      }
    },
    [createFn]
  )

  const editFn = useMutation({
    mutationFn: async (post: Post): Promise<API> => {
      setIsProcessing(true)
      const { data } = await axios.patch("post", post)
      return data
    },
    onSuccess: (res) => {
      console.log(res)
      setIsProcessing(false)
      const { success, message } = res
      if (!success) {
        alert(message)
      }
      cache()
    },
  })
  const editPost = useCallback(
    async (post: Post): Promise<API> => {
      try {
        await editFn.mutate(post)
        return { success: true }
      } catch (error: any) {
        return { success: false }
      }
    },
    [editFn]
  )

  const deleteFn = useMutation({
    mutationFn: async (id: string): Promise<API> => {
      setIsProcessing(true)
      const { data } = await axios.delete(`post?id=${id}`)
      return data
    },
    onSuccess: (res) => {
      console.log(res)
      setIsProcessing(false)
      const { success, message } = res
      if (!success) {
        alert(message)
      }
      cache()
    },
  })
  const deletePost = useCallback(
    async (id: string): Promise<API> => {
      try {
        await deleteFn.mutate(id)
        return { success: true }
      } catch (error: any) {
        return { success: false }
      }
    },
    [deleteFn]
  )

  const likePostFn = useMutation({
    mutationFn: async (props: any): Promise<API> => {
      const { data } = await axios.post("post/like", props)
      return data
    },
    onSuccess: (res) => {
      console.log(res)
    },
  })

  const likePost = useCallback(
    async (props: LikeProp): Promise<API> => {
      const { success, message } = await likePostFn.mutateAsync(props)
      if (!success) {
        return { success, message }
      }
      queryClient.invalidateQueries("like")
      return { success }
    },
    [likePostFn, queryClient]
  )

  const createCommentFn = useMutation({
    mutationFn: async (props: CommentProps): Promise<API> => {
      const { data } = await axios.post("post/comment", props)
      return data
    },
  })

  const createComment = useCallback(
    async (props: CommentProps): Promise<API> => {
      const { success, message } = await createCommentFn.mutateAsync(props)
      if (!success) {
        return { success, message }
      }
      return { success }
    },
    [createCommentFn]
  )

  const editCommentFn = useMutation(async (props: EditComment): Promise<API> => {
    const { data } = await axios.patch("post/comment", props)
    return data
  })

  const editComment = useCallback(
    async (props: EditComment): Promise<API> => {
      const { success, message } = await editCommentFn.mutateAsync(props)
      if (!success) {
        return { success, message }
      }
      return { success }
    },
    [editCommentFn]
  )

  const deleteCommentFn = useMutation(async (props: CommentIds): Promise<API> => {
    const { id, postId } = props
    const { data } = await axios.delete(`post/comment?id=${id}&postId=${postId}`)
    return data
  })

  const deleteComment = useCallback(
    async (props: CommentIds): Promise<API> => {
      const { success, message } = await deleteCommentFn.mutateAsync(props)
      if (!success) {
        return { success, message }
      }
      return { success }
    },
    [deleteCommentFn]
  )

  return (
    <data.Provider value={{ createPost, editPost, deletePost, isProcessing, likePost, createComment, editComment, deleteComment }}>{children}</data.Provider>
  )
}

export function usePost() {
  return useContext(data)
}
