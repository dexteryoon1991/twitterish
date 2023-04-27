import { selectUser, useAppSelector } from "@/redux"
import { API, Post, Posting } from "@/types"
import axios from "axios"
import { useState, useCallback, useContext, createContext, useEffect, PropsWithChildren } from "react"
import { useMutation, useQueryClient } from "react-query"

const initialData: Posting = {
  createPost: async () => {
    return { success: false }
  },
  deletePost: () => {},
  editPost: () => {},
  isProcessing: false,
}
const data = createContext(initialData)

export function PostProvider({ children }: PropsWithChildren) {
  const { uid } = useAppSelector(selectUser)
  const queryClient = useQueryClient()

  const [isProcessing, setIsProcessing] = useState(false)
  const cache = () => queryClient.invalidateQueries([uid, "post"])

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
    (post: Post) => {
      editFn.mutate(post)
    },
    [editFn]
  )

  const deleteFn = useMutation({
    mutationFn: async (id: string): Promise<API> => {
      setIsProcessing(true)
      const { data } = await axios.patch(`post?id=${id}`)
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
    (id: string) => {
      deleteFn.mutate(id)
    },
    [deleteFn]
  )

  return <data.Provider value={{ createPost, editPost, deletePost, isProcessing }}>{children}</data.Provider>
}

export function usePost() {
  return useContext(data)
}
