import { API, SendEmail, UseEmail } from "@/types"
import axios from "axios"
import React, { createContext, PropsWithChildren, useCallback, useContext, useState } from "react"
import { useMutation, useQueryClient } from "react-query"

const initialState: UseEmail = {
  sendEmail: async () => ({ success: false }),
  sendResetPasswordEmail: async () => ({ success: false }),
  isSending: false,
}
const data = createContext(initialState)
export function EmailProvider({ children }: PropsWithChildren) {
  const [isSending, setIsSending] = useState(false)
  const queryClient = useQueryClient()
  const cache = useCallback(() => {
    queryClient.invalidateQueries("email")
  }, [queryClient])

  const emailFn = useMutation({
    mutationFn: async (props: SendEmail): Promise<API> => {
      const { data } = await axios.post("email", props)
      return data
    },
    onMutate: () => setIsSending(true),
    onSuccess: (res) => {
      const { success, message } = res
      if (!success) {
        setIsSending(false)
        return alert(message)
      }
      cache()
      alert("메일을 전송했습니다.")
      setIsSending(false)
    },
  })

  const sendEmail = useCallback(
    async (props: SendEmail): Promise<API> => {
      try {
        emailFn.mutate(props)
        return { success: true }
      } catch (error: any) {
        return { success: false, message: error.message }
      }
    },
    [emailFn]
  )

  const resetPwdFn = useMutation({
    mutationFn: async (props: SendEmail): Promise<API> => {
      const { data } = await axios.post("email?action=resetpassword", props)
      return data
    },
    onMutate: () => setIsSending(true),
    onSuccess: (res) => {
      setIsSending(false)
      console.log(res)
      const { success, message } = res
      if (!success) {
        return alert(message)
      }
      cache()
      console.log("이메일로 인증번호가 전송되었습니다.")
    },
  })

  const sendResetPasswordEmail = useCallback(
    async (props: SendEmail) => {
      try {
        resetPwdFn.mutate(props)
        return { success: true }
      } catch (error: any) {
        return { success: false, message: error.message }
      }
    },
    [resetPwdFn]
  )

  return <data.Provider value={{ isSending, sendEmail, sendResetPasswordEmail }}>{children}</data.Provider>
}

export function useEmail() {
  return useContext(data)
}
