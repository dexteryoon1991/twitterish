import { Input } from "@/components"
import { useAuth } from "@/context"
import { Button, Typo, View } from "@/core"
import { useRouter } from "next/router"
import React, { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react"

export default function Signin() {
  const { signIn, isLoggedIn } = useAuth()

  const [email, setEmail] = useState("")
  const onEmailChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }, [])
  const emailRef = useRef<HTMLInputElement | null>(null)
  const focusOnEmail = useCallback(() => {
    emailRef.current?.focus()
  }, [])

  const emailText = useMemo(() => {
    if (!email) {
      return "이메일을 입력하세요."
    }
    const pattern = /[a-zA-Z0-9]+/
    if (!pattern.test(email)) {
      return "영어 또는 숫자로만 입력해주세요."
    }
    if (!email.includes("@")) {
      return "'@'를 반드시 포함해야 합니다."
    }
    const surfixes = email.split("@")[1]
    if (!surfixes.includes(".")) {
      return "'올바른 이메일 형식이 아닙니다.'"
    }
    return null
  }, [email])

  const [password, setPassword] = useState("")
  const onPasswordChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }, [])
  const passwordRef = useRef<HTMLInputElement | null>(null)
  const focusOnPassword = useCallback(() => {
    passwordRef.current?.focus()
  }, [])
  const passwordText = useMemo(() => {
    if (!password) {
      return "비밀번호를 입력하세요."
    }
    if (password.length < 6) {
      return "6자리 이상이어야 합니다."
    }
    if (password.length > 18) {
      return "18자리 이하이어야 합니다."
    }
    return null
  }, [password])

  useEffect(() => {
    focusOnEmail()
  }, [])

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (emailText != null) {
        focusOnEmail()
        return alert(emailText)
      }
      if (passwordText != null) {
        focusOnPassword()
        return alert(passwordText)
      }
      signIn({ email, password })
    },
    [email, password, signIn, emailText, passwordText, focusOnEmail, focusOnPassword]
  )

  const router = useRouter()
  const onRegi = useCallback(() => {
    router.push({ pathname: "/signup" })
  }, [router])

  useEffect(() => {
    if (isLoggedIn) {
      alert("접근할 수 없는 페이지 입니다.")
      router.push({ pathname: "/" })
    }
  }, [isLoggedIn, router])

  if (isLoggedIn) {
    return null
  }
  return (
    <View css={{ justifyContent: "center", alignItems: "center", height: "calc(100vh - 120px)" }}>
      <View as="form" onSubmit={onSubmit} css={{ rowGap: 10 }}>
        <View>
          <Typo weight="BOLD" size="LARGE" color={"BLUE"}>
            Please Sign in
          </Typo>
          <Typo css={{ fontSize: 14 }}>with Email and password</Typo>
        </View>
        <Input
          props={{
            type: "text",
            value: email,
            onChange: onEmailChange,
            ref: emailRef,
            placeholder: "Enter Your Email",
          }}
          onPressIcon={focusOnEmail}
          inputType="email"
        />
        {emailText != null && (
          <Typo color="RED" size="SMALL">
            {emailText}
          </Typo>
        )}
        <Input
          props={{
            type: "password",
            value: password,
            onChange: onPasswordChange,
            ref: passwordRef,
            placeholder: "Enter Your Password",
          }}
          onPressIcon={focusOnPassword}
          inputType="password"
        />
        {passwordText != null && (
          <Typo color="RED" size="SMALL">
            {passwordText}
          </Typo>
        )}
        <Button type="submit" colors={"BLUE"}>
          Sign in
        </Button>
      </View>
      <View css={{ flexDirection: "row", marginTop: 20, columnGap: 10, alignItems: "center" }}>
        <Typo css={{ fontSize: 14 }}>Not a member?</Typo>
        <Button css={{ padding: 0, border: "none" }} onClick={onRegi}>
          <Typo color="BLUE" weight={"BOLD"}>
            Signup Now
          </Typo>
        </Button>
      </View>
    </View>
  )
}
