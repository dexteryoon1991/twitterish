import { selectUser, useAppSelector } from "@/redux"
import { API, Post, Posting } from "@/types"
import axios from "axios"
import { useState, useCallback, useContext, createContext, useEffect, PropsWithChildren } from "react"
import { useMutation, useQueryClient } from "react-query"

const initialData: Posting = {
  createPost: () => {},
  deletePost: () => {},
  editPost: () => {},
}
const data = createContext(initialData)

export function PostProvider({ children }: PropsWithChildren) {
  const { uid } = useAppSelector(selectUser)
  const queryClient = useQueryClient()

  const cache = (target: string) => queryClient.invalidateQueries([uid, target])

  const createFn = useMutation({
    mutationFn: async (post: Post): Promise<API> => {
      const { data } = await axios.post("post", post)
      return data
    },
    onSuccess: (res) => {
      console.log(res)
      const { success, message } = res
      if (!success) {
        alert(message)
      }
      cache("post")
    },
  })

  const createPost = useCallback(
    (post: Post) => {
      createFn.mutate(post)
    },
    [createFn]
  )

  const editFn = useMutation({
    mutationFn: async (post: Post): Promise<API> => {
      const { data } = await axios.patch("post", post)
      return data
    },
    onSuccess: (res) => {
      console.log(res)
      const { success, message } = res
      if (!success) {
        alert(message)
      }
      cache("post")
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
      const { data } = await axios.patch(`post?id=${id}`)
      return data
    },
    onSuccess: (res) => {
      console.log(res)
      const { success, message } = res
      if (!success) {
        alert(message)
      }
      cache("post")
    },
  })
  const deletePost = useCallback(
    (id: string) => {
      deleteFn.mutate(id)
    },
    [deleteFn]
  )

  return <data.Provider value={{ createPost, editPost, deletePost }}>{children}</data.Provider>
}

export function usePost() {
  return useContext(data)
}
