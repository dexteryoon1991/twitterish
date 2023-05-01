import React, { FormEvent, useCallback, useEffect, useState, useRef, useMemo, ChangeEvent } from "react"
import { View, Button } from "@/core"
import Input from "../Input"
import ActivityIndicator from "../ActivityIndicator"
import { useInquiry } from "@/context"
import { Inquiry } from "@/types"
import InquiryItem from "./InquiryItem"

export default function SearchInquiry() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [inquiries, setInquiries] = useState<Inquiry[]>([])

  const [email, setEmail] = useState("yoon.tec.info@gmail.com")
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

  useEffect(() => {
    focusOnEmail()
  }, [focusOnEmail])

  const { findInquiry } = useInquiry()
  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (emailText) {
        return alert(emailText)
      }
      setIsProcessing(true)
      const { success, message, payload } = await findInquiry(email)
      setIsProcessing(false)
      if (!success) {
        return alert(message)
      }
      if (payload) {
        setInquiries(payload.inquiries)
      }
    },
    [email, emailText, findInquiry]
  )
  return (
    <>
      <View css={{ display: "grid", gridTemplateColumns: "2fr 1fr", columnGap: 10 }} as="form" onSubmit={onSubmit}>
        <Input
          props={{
            value: email,
            onChange: onChangeEmail,
            ref: emailRef,
            placeholder: "Enter Your Email",
          }}
          inputType="email"
          onPressIcon={focusOnEmail}
        />
        <Button colors="BLUE">나의 문의 찾기</Button>
      </View>
      {isProcessing && (
        <View type="fullPage" position={"fixed"} css={{ top: 0, left: 0, backgroundColor: "rgba(0,0,0,.1)" }}>
          <ActivityIndicator />
        </View>
      )}
      {inquiries.length > 0 && (
        <View css={{ rowGap: 10 }}>
          {inquiries?.map((inquiry) => (
            <InquiryItem key={inquiry.id} {...inquiry} />
          ))}
        </View>
      )}
    </>
  )
}
