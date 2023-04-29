import { ActivityIndicator, Input } from "@/components"
import { useAuth, useEmail } from "@/context"
import { Button, Typo, View } from "@/core"
import { useRouter } from "next/router"
import React, { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react"

export default function LostNfound() {
  const { isLoggedIn } = useAuth()
  const router = useRouter()
  useEffect(() => {
    if (isLoggedIn) {
      alert("접근할 수 없는 페이지 입니다.")
      router.push({ pathname: "/" })
    }
  }, [router, isLoggedIn])
  if (isLoggedIn) {
    return null
  }

  const [email, setEmail] = useState("dexteryoon@icloud.com")
  const emailRef = useRef<HTMLInputElement | null>(null)
  const focusOnEmail = useCallback(() => {
    emailRef.current?.focus()
  }, [])
  const onChangeEmail = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
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

  const [name, setName] = useState("Dexter The Admin")
  const nameRef = useRef<HTMLInputElement | null>(null)
  const focusOnName = useCallback(() => {
    nameRef.current?.focus()
  }, [])
  const onChangeName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
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

  const { isSending, sendResetPasswordEmail } = useEmail()

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (emailText) {
        focusOnEmail()
        return alert(emailText)
      }
      if (nameText) {
        focusOnName()
        return alert(nameText)
      }

      try {
        const res = await sendResetPasswordEmail({ email, name })
        router.push({ pathname: "/lost&found/verify", query: { email } })
      } catch (error: any) {
        console.log(error)
      }
    },
    [email, name, emailText, nameText, sendResetPasswordEmail, focusOnEmail, focusOnName, router]
  )
  return (
    <View css={{ justifyContent: "center", alignItems: "center", height: "calc(100vh - 120px)" }}>
      {isSending ? (
        <ActivityIndicator />
      ) : (
        <View as="form" onSubmit={onSubmit} css={{ rowGap: 10 }}>
          <View>
            <Typo css={{ fontSize: 14 }}> Please provider your </Typo>
            <Typo weight="BOLD" size="LARGE" color={"BLUE"}>
              Email and Name
            </Typo>
          </View>
          <Input
            props={{
              type: "text",
              value: email,
              onChange: onChangeEmail,
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
              type: "text",
              value: name,
              onChange: onChangeName,
              ref: nameRef,
              placeholder: "Enter Your Name",
            }}
            onPressIcon={focusOnName}
            inputType="name"
          />
          {nameText != null && (
            <Typo color="RED" size="SMALL">
              {nameText}
            </Typo>
          )}
          <Button type="submit" colors={"BLUE"}>
            Sign in
          </Button>
        </View>
      )}
    </View>
  )
}
