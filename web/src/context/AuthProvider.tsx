import { useState, useCallback, useContext, createContext, useEffect, PropsWithChildren } from "react"
import { useAppSelector, selectUser, useAppDispatch, userHandler } from "@/redux"
import { API, Auth, EmailAndPassword, PasswordAndUid, SendEmail, SignupProps, UserApi } from "@/types"
import { useMutation, useQueryClient } from "react-query"
import axios from "axios"
import { useRouter } from "next/router"

const initialData: Auth = {
  signIn: () => {},
  signUp: () => {},
  signOut: () => {},
  isProcessing: false,
  isLoggedIn: false,
  updatePassword: async () => ({ success: false }),
}
const data = createContext(initialData)

export function AuthProvider({ children }: PropsWithChildren) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const router = useRouter()
  const user = useAppSelector(selectUser)
  useEffect(() => {
    console.log(user && isLoggedIn ? user : "need to login")
  }, [user, isLoggedIn])

  const withCredentials = true
  const queryClient = useQueryClient()
  const cache = (props?: string) => queryClient.invalidateQueries([user.uid, props])
  const dispatch = useAppDispatch()

  const fetchFn = useMutation({
    mutationFn: async (): Promise<UserApi> => {
      const { data } = await axios.get("user", { withCredentials })
      return data
    },
    onSuccess: (res) => {
      const { success, message, payload } = res
      if (!success) {
        return alert(message)
      }
      if (payload?.user) {
        setIsLoggedIn(true)
        cache()
        dispatch(userHandler(payload.user))
      }
    },
  })

  const [accessToken, setAccessToken] = useState("")

  useEffect(() => {
    const getAccessToken = () => {
      if (typeof localStorage !== "undefined") {
        const token = localStorage.getItem("accessToken")
        if (token) {
          axios.defaults.headers.common.Authorization = `Bearer ${token}`
          setAccessToken(token)
        }
      }
    }

    return () => getAccessToken()
  }, [])

  const fetchUser = useCallback(() => {
    fetchFn.mutate()
  }, [fetchFn])

  useEffect(() => {
    axios.defaults.baseURL = process.env.NEXT_PUBLIC_API!
  }, [])

  useEffect(() => {
    if (accessToken) {
      fetchUser()
      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
    }
  }, [accessToken])

  const signinFn = useMutation({
    mutationFn: async (signinProps: EmailAndPassword): Promise<UserApi> => {
      const { data } = await axios.post("user/signin", signinProps)
      return data
    },
    onSuccess: (res) => {
      setIsProcessing(false)
      const { success, message, payload } = res
      if (!success) {
        return alert(message)
      }
      cache()
      if (payload) {
        const { user, accessToken } = payload
        localStorage.setItem("accessToken", accessToken!)
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
        dispatch(userHandler(user))
        setAccessToken(accessToken!)
        setIsLoggedIn(true)
        router.push({ pathname: "/" })
        alert("어서오세요!")
      }
    },
  })

  const signIn = useCallback(
    (signinProps: EmailAndPassword) => {
      setIsProcessing(true)
      signinFn.mutate(signinProps)
    },
    [signinFn]
  )

  const signupFn = useMutation({
    mutationFn: async (signupProps: SignupProps): Promise<UserApi> => {
      const { data } = await axios.post("user", signupProps)
      return data
    },
    onSuccess: (res) => {
      setIsProcessing(false)
      const { success, message, payload } = res
      if (!success) {
        return alert(message)
      }
      cache("user")
      queryClient.invalidateQueries("users")
      if (payload) {
        const { user, accessToken } = payload
        localStorage.setItem("accessToken", accessToken!)
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
        dispatch(userHandler(user))
        setAccessToken(accessToken!)
        setIsLoggedIn(true)
        alert("환영합니다!")
        router.push({ pathname: "/" })
      }
    },
  })

  const signUp = useCallback(
    (signupProps: SignupProps) => {
      setIsProcessing(true)
      signupFn.mutate(signupProps)
    },
    [signupFn]
  )

  const signoutFn = useMutation({
    mutationFn: async (): Promise<API> => {
      setIsProcessing(true)
      console.log("signing out")
      const { data } = await axios.get("user/signout", { withCredentials })
      return data
    },
    onSuccess: (res) => {
      setIsProcessing(false)
      console.log(res)
      const { success, message } = res
      if (!success) {
        return alert(message)
      }
      setIsLoggedIn(false)
      localStorage.clear()
      axios.defaults.headers.common.Authorization = null
      alert("로그아웃 되었습니다.")
      dispatch(userHandler())
    },
  })

  const signOut = useCallback(() => {
    setIsProcessing(true)
    signoutFn.mutate()
  }, [signoutFn])

  const updatePasswordFn = useMutation({
    mutationFn: async (props: PasswordAndUid): Promise<UserApi> => {
      const { data } = await axios.post("user/resetpassword", props)
      return data
    },
    onMutate: () => setIsProcessing(true),
    onSuccess: (res) => {
      console.log(res)
      setIsProcessing(false)
      const { success, message, payload } = res
      if (!success) {
        return alert(message)
      }
      queryClient.invalidateQueries([user.uid])
      if (payload) {
        const { user, accessToken } = payload
        localStorage.setItem("accessToken", accessToken!)
        setAccessToken(accessToken!)
        dispatch(userHandler(user))
        setIsLoggedIn(true)
        alert("비밀번호가 변경되었습니다.")
        router.push({ pathname: "/" })
      }
    },
  })

  const updatePassword = useCallback(
    async (props: PasswordAndUid): Promise<API> => {
      try {
        await updatePasswordFn.mutate(props)
        return { success: true }
      } catch (error: any) {
        return { success: false, message: error.message }
      }
    },
    [updatePasswordFn]
  )

  return <data.Provider value={{ signIn, signOut, signUp, isProcessing, isLoggedIn, updatePassword }}>{children}</data.Provider>
}

export function useAuth() {
  return useContext(data)
}
