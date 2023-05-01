import React, { createContext, PropsWithChildren, useCallback, useContext } from "react"
import { API, IdAndBody, Inquiries, Inquiry, InquiryApi, SendEmail } from "@/types"
import { useMutation, useQueryClient } from "react-query"
import axios from "axios"

const initialState: Inquiries = {
  createInquiry: async () => ({ success: false }),
  updateInquiry: async () => ({ success: false }),
  deleteInquiry: async () => ({ success: false }),
  answerInquiry: async () => ({ success: false }),
  findInquiry: async () => ({ success: false }),
  inquiryQueryKey: [],
}
const data = createContext(initialState)

export function InquiryProvider({ children }: PropsWithChildren) {
  const inquiryQueryKey = ["inquiry"]
  const queryClient = useQueryClient()
  const url = "inquiry"

  const createFn = useMutation(async (inquiry: Inquiry): Promise<API> => {
    const { data } = await axios.post(url, inquiry)
    return data
  })

  const createInquiry = useCallback(
    async (inquiry: Inquiry): Promise<API> => {
      const { success, message } = await createFn.mutateAsync(inquiry)
      if (!success) {
        alert(message)
        return { success }
      }
      queryClient.invalidateQueries(inquiryQueryKey)
      alert("문의가 등록되었습니다.")
      return { success }
    },
    [inquiryQueryKey, queryClient, createFn]
  )

  const updateFn = useMutation(async (props: IdAndBody): Promise<API> => {
    const { data } = await axios.patch(url, props)
    return data
  })

  const updateInquiry = useCallback(
    async (props: IdAndBody): Promise<API> => {
      const { success, message } = await updateFn.mutateAsync(props)
      if (!success) {
        alert(message)
        return { success }
      }
      queryClient.invalidateQueries(inquiryQueryKey)
      alert("문의가 수정되었습니다.")
      return { success }
    },
    [updateFn, inquiryQueryKey, queryClient]
  )

  const deleteFn = useMutation(async (id: string): Promise<API> => {
    const { data } = await axios.delete(`${url}?id=${id}`)
    return data
  })

  const deleteInquiry = useCallback(
    async (id: string): Promise<API> => {
      const { success, message } = await deleteFn.mutateAsync(id)
      if (!success) {
        alert(message)
        return { success }
      }
      queryClient.invalidateQueries(inquiryQueryKey)
      alert("문의가 삭제되었습니다.")
      return { success }
    },
    [inquiryQueryKey, queryClient, deleteFn]
  )

  const answerFn = useMutation(async (props: SendEmail): Promise<API> => {
    const { data } = await axios.post(`email?action=answerinquiry`, props)
    return data
  })

  const answerInquiry = useCallback(
    async (props: SendEmail): Promise<API> => {
      const { success, message } = await answerFn.mutateAsync(props)
      if (!success) {
        alert(message)
        return { success }
      }
      return { success }
    },
    [queryClient, inquiryQueryKey, answerFn]
  )

  const findFn = useMutation(async (email: string): Promise<InquiryApi> => {
    const { data } = await axios.get("inquiry", { params: { email } })
    return data
  })

  const findInquiry = useCallback(
    async (email: string): Promise<InquiryApi> => {
      return await findFn.mutateAsync(email)
    },
    [findFn]
  )

  return <data.Provider value={{ createInquiry, updateInquiry, deleteInquiry, inquiryQueryKey, answerInquiry, findInquiry }}>{children}</data.Provider>
}

export function useInquiry() {
  return useContext(data)
}
