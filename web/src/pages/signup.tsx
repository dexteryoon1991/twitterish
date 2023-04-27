import React, { useCallback, useState, useEffect, useMemo, useRef, ChangeEvent, FormEvent } from "react"
import { View, Typo, Button } from "@/core"
import { useAuth } from "@/context"
import { Input } from "@/components"
import { useRouter } from "next/router"

export default function Signup() {
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

  const [name, setName] = useState("")
  const onNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }, [])
  const nameRef = useRef<HTMLInputElement | null>(null)
  const focusOnName = useCallback(() => {
    nameRef.current?.focus()
  }, [])
  const nameText = useMemo(() => {
    if (!name) {
      return "이름을 입력하세요."
    }
    return null
  }, [name])

  useEffect(() => {
    focusOnEmail()
  }, [])

  const { signUp, isLoggedIn } = useAuth()
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
      if (nameText != null) {
        focusOnName()
        return alert(nameText)
      }
      signUp({ email, password, name })
    },
    [email, password, signUp, emailText, passwordText, focusOnEmail, focusOnPassword]
  )

  const router = useRouter()
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
        <Typo weight="BOLD" size="LARGE" color={"BLUE"}>
          Please Tell us about you
        </Typo>
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
        <Input
          props={{
            type: "text",
            value: name,
            onChange: onNameChange,
            ref: nameRef,
            placeholder: "Enter Your Name",
          }}
          onPressIcon={focusOnName}
          inputType="name"
        />
        {passwordText != null && (
          <Typo color="RED" size="SMALL">
            {passwordText}
          </Typo>
        )}
        <Button type="submit" colors={"BLUE"}>
          Sign up
        </Button>
      </View>
    </View>
  )
}
