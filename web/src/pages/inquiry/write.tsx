import { Confirm, Input, Modal, TextArea } from "@/components"
import { useInquiry, useAuth } from "@/context"
import { Button, Typo, View } from "@/core"
import { Colors } from "@/lib"
import React, { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useAppSelector, selectUser } from "@/redux"
import { useRouter } from "next/router"

export default function Inquiry() {
  const [title, setTitle] = useState("")
  const onChangeTitle = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }, [])
  const titleRef = useRef<HTMLInputElement | null>(null)
  const focusOnTitle = useCallback(() => {
    titleRef.current?.focus()
  }, [])

  const [password, setPassword] = useState("")
  const onChangePassword = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }, [])
  const passwordRef = useRef<HTMLInputElement | null>(null)
  const focusOnPassword = useCallback(() => {
    passwordRef.current?.focus()
  }, [])
  const passwordText = useMemo(() => {
    if (!password) {
      return "비밀번호를 입력해주세요."
    }
    if (password.length < 6) {
      return "비밀번호는 6자리 이상이어야 합니다."
    }
    if (password.length > 18) {
      return "비밀번호는 18자리 이하이어야 합니다."
    }
    return null
  }, [password])

  const [email, setEmail] = useState("")
  const onChangeEmail = useCallback((e: ChangeEvent<HTMLInputElement>) => {
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

  const [body, setBody] = useState("")
  const onChangeBody = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value)
  }, [])
  const bodyRef = useRef<HTMLTextAreaElement | null>(null)
  const focusOnBody = useCallback(() => {
    titleRef.current?.focus()
  }, [])
  const bodyText = useMemo(() => {
    if (!body) {
      return "문의내용을 입력해 주세요."
    }
    return null
  }, [body])

  const [confirm, setConfirm] = useState(false)
  const confirmHandler = useCallback(() => {
    setConfirm((prev) => !prev)
  }, [])

  const { isLoggedIn } = useAuth()
  const user = useAppSelector(selectUser)
  useEffect(() => {
    if (isLoggedIn) {
      setEmail(user.email)
      focusOnBody()
    } else focusOnEmail()
  }, [isLoggedIn, user])

  const router = useRouter()
  const { createInquiry } = useInquiry()
  const onSubmit = useCallback(
    async (e?: FormEvent<HTMLFormElement>) => {
      e?.preventDefault()
      if (emailText) {
        focusOnEmail()
        return alert(emailText)
      }
      if (!isLoggedIn && passwordText) {
        focusOnPassword()
        return alert(passwordText)
      }
      if (!title) {
        return confirmHandler()
      }
      if (bodyText) {
        focusOnBody()
        return alert(bodyText)
      }
      const { success } = await createInquiry({ email, body, title })
      if (success) {
        setBody("")
        setTitle("")
        router.push({ pathname: "/inquiry" })
      }
    },
    [title, email, body, emailText, focusOnEmail, bodyText, focusOnBody, focusOnTitle, confirmHandler, createInquiry, isLoggedIn, focusOnPassword, router]
  )

  return (
    <View type="page">
      <View as="form" onSubmit={onSubmit} css={{ rowGap: 10 }}>
        <View css={{ columnGap: 10, display: "grid", gridTemplateColumns: !isLoggedIn ? "1fr 1fr" : "1fr" }}>
          <View>
            <Input
              props={{
                value: email,
                onChange: onChangeEmail,
                ref: emailRef,
                placeholder: "답변 받으실 이메일을 입력해 주세요.",
              }}
              inputType="email"
              style={{ flex: 1 }}
              onPressIcon={focusOnEmail}
            />
            {email && emailText && (
              <Typo color="RED" size={"SMALL"}>
                {emailText}
              </Typo>
            )}
          </View>
          {!isLoggedIn && (
            <View>
              <Input
                props={{
                  type: "password",
                  value: password,
                  onChange: onChangePassword,
                  ref: passwordRef,
                  placeholder: "비밀번호를 입력해주세요.",
                }}
                inputType="password"
                onPressIcon={focusOnPassword}
                style={{ flex: 1 }}
              />
              {password && passwordText && (
                <Typo color="RED" size={"SMALL"}>
                  {passwordText}
                </Typo>
              )}
            </View>
          )}
        </View>
        <Input
          props={{
            value: title,
            onChange: onChangeTitle,
            ref: titleRef,
            placeholder: "제목을 입력해주세요.",
          }}
          //   inputType="title"
          onPressIcon={focusOnTitle}
        />
        <TextArea
          props={{
            value: body,
            onChange: onChangeBody,
            ref: bodyRef,
            placeholder: "문의하실 내용을 입력해 주세요.",
            style: { padding: 10, width: "calc(100% - 20px)", height: 200 },
          }}
          style={{ borderRadius: 5, borderColor: Colors.LIGHTGRAY }}
        />
        <Button colors={"BLUE"} type="submit">
          문의하기
        </Button>
      </View>
      <Modal state={confirm} closeFn={confirmHandler} title="제목이..?!?!">
        <Confirm
          closeFn={confirmHandler}
          message="제목을 입력하지 않으셨습니다. '제목없음'으로 보내시겠습니까?"
          okBtn={{
            onPress: () => {
              setTitle("제목없음")
              confirmHandler()
              onSubmit()
            },
            colors: "BLUE",
          }}
        />
      </Modal>
    </View>
  )
}
