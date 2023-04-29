import { Input } from "@/components"
import { useAuth } from "@/context"
import { Button, Typo, View } from "@/core"
import { VerificationCodeApi } from "@/types"
import axios from "axios"
import { GetServerSidePropsContext } from "next"
import { useRouter } from "next/router"
import React, { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useQuery } from "react-query"

export default function Verify(props: VerificationCodeApi) {
  const router = useRouter()

  const [isVerified, setIsVerified] = useState(true)

  const { email } = router.query as { email: string }

  const { data } = useQuery({
    queryKey: [email, "resetpassword"],
    queryFn: async (): Promise<VerificationCodeApi> => {
      const { data } = await axios.get(`user/verificationcode`, { params: { email } })
      return data
    },
    initialData: props,
  }) as { data: VerificationCodeApi }

  const [verificationCode, setVerificationCode] = useState("")
  const verificationCodeRef = useRef<HTMLInputElement | null>(null)
  const focusOnVerificationCode = useCallback(() => {
    verificationCodeRef.current?.focus()
  }, [])
  const onChangeVerificationCode = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(e.target.value)
  }, [])

  const [password, setPassword] = useState("")
  const passwordRef = useRef<HTMLInputElement | null>(null)
  const focusOnPassword = useCallback(() => {
    passwordRef.current?.focus()
  }, [])
  const onChangePassword = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }, [])
  const passwordText = useMemo(() => {
    if (!password) {
      return "비밀번호를 입력하세요."
    }
    if (password.length < 6) {
      return "비밀번호는 6자리 이상이어야 합니다."
    }
    if (password.length > 18) {
      return "비밀번호는 18자리 이하이어야 합니다."
    }
    return null
  }, [password])

  const [confirmPassword, setConfirmPassword] = useState("")
  const confirmPasswordRef = useRef<HTMLInputElement | null>(null)
  const focusOnConfirmPassword = useCallback(() => {
    confirmPasswordRef.current?.focus()
  }, [])
  const onChangeConfirmPassword = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
  }, [])
  const confirmPasswordText = useMemo(() => {
    if (!password) {
      return "비밀번호를 입력하세요."
    }
    if (password.length < 6) {
      return "비밀번호는 6자리 이상이어야 합니다."
    }
    if (password.length > 18) {
      return "비밀번호는 18자리 이하이어야 합니다."
    }
    if (!confirmPassword) {
      return "비밀번호를 한 번 더 입력하세요."
    }
    if (password !== confirmPassword) {
      return "비밀번호가 일치하지 않습니다."
    }
    return null
  }, [password, confirmPassword])

  const { updatePassword } = useAuth()

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!isVerified) {
        if (!verificationCode) {
          return alert("인증번호를 입력해주세요.")
        }
        if (verificationCode !== data?.verificationCode) {
          return alert("인증번호가 일치하지 않습니다.")
        }
        return setIsVerified(true)
      }

      if (passwordText) {
        return alert(passwordText)
      }
      if (confirmPasswordText) {
        return alert(confirmPasswordText)
      }

      try {
        await updatePassword({ password, uid: data?.uid! })
      } catch (error: any) {
        return alert(error.message)
      }
    },
    [password, confirmPassword, passwordText, confirmPasswordText, focusOnPassword, focusOnConfirmPassword, isVerified, data]
  )

  useEffect(() => {
    focusOnVerificationCode()
  }, [])

  useEffect(() => {
    if (verificationCode === data?.verificationCode) {
      setIsVerified(true)
      alert("인증되었습니다. 새로운 비밀번호를 입력해주세요.")
      focusOnPassword()
    } else setIsVerified(false)
  }, [data?.verificationCode, verificationCode])
  return (
    <View css={{ justifyContent: "center", alignItems: "center", height: "calc(100vh - 120px)" }}>
      <View as="form" onSubmit={onSubmit} css={{ rowGap: 20 }}>
        {isVerified ? (
          <>
            <View css={{ rowGap: 5 }}>
              <Typo weight="BOLD" size="LARGE" color="BLUE">
                새로운 비밀번호를 입력해주세요.
              </Typo>
            </View>

            <View css={{ rowGap: 10 }}>
              <Input
                props={{
                  value: password,
                  onChange: onChangePassword,
                  ref: passwordRef,
                  placeholder: "Enter New Password",
                  type: "password",
                }}
                inputType="password"
                onPressIcon={focusOnPassword}
              />

              {passwordText != null && (
                <Typo color="RED" size="SMALL">
                  {passwordText}
                </Typo>
              )}

              <Input
                props={{
                  value: confirmPassword,
                  onChange: onChangeConfirmPassword,
                  ref: confirmPasswordRef,
                  placeholder: "Confirm Psssword",
                  type: "password",
                }}
                inputType="password"
                onPressIcon={focusOnConfirmPassword}
              />

              {confirmPassword && confirmPasswordText != null && (
                <Typo color="RED" size="SMALL">
                  {confirmPasswordText}
                </Typo>
              )}
            </View>

            <Button colors="BLUE" type="submit">
              비밀번호 변경
            </Button>
          </>
        ) : (
          <>
            <View css={{ rowGap: 5 }}>
              <Typo css={{ fontSize: 13 }}>비밀번호 재설정을 위해 </Typo>
              <Typo weight="BOLD" size="LARGE" color="BLUE">
                인증번호를 입력해주세요.{" "}
              </Typo>
            </View>
            <Input
              props={{
                value: verificationCode,
                onChange: onChangeVerificationCode,
                ref: verificationCodeRef,
                placeholder: "Enter Verification Code from Email",
              }}
              inputType="password"
              onPressIcon={focusOnVerificationCode}
            />
            <Button colors="BLUE" type="submit">
              인증하기
            </Button>
          </>
        )}
      </View>
    </View>
  )
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { email } = ctx.query as { email: string }
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API}/user/verificationcode`, { params: { email } })
  return { props: data }
}
