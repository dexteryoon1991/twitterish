import { useAuth } from "@/context"
import { Button, Typo, View } from "@/core"
import { Colors } from "@/lib"
import { Inquiry, momentFormat } from "@/types"
import moment from "moment"
import { useRouter } from "next/router"
import React, { useCallback, useState } from "react"
import Modal from "../Modal"
import FullInquiry from "./FullInquiry"

export default function InquiryItem(props: Inquiry) {
  const { body, email, createdAt, id, password, title } = props
  const { isLoggedIn } = useAuth()
  const router = useRouter()

  const [passwordCheck, setPasswordCheck] = useState(false)
  const passwordHandler = useCallback(() => setPasswordCheck((prev) => !prev), [])

  const [isFull, setIsFull] = useState(false)
  const fullHandler = useCallback(() => setIsFull((prev) => !prev), [])

  const onDetail = useCallback(() => {
    if (!isLoggedIn) {
      console.log("need password")
      return passwordHandler()
    }
    console.log("no password needed")
    fullHandler()
  }, [isLoggedIn, passwordHandler, fullHandler])
  return (
    <>
      <Button
        css={{ columnGap: 10, alignItems: "center", justifyContent: "space-between", flexDirection: "row", border: `1px  solid ${Colors.LIGHTGRAY}` }}
        onClick={onDetail}>
        <View direction={"row"} css={{ columnGap: 10, alignItems: "center" }}>
          {title} by {email} <Typo size="SMALL">{moment(createdAt, momentFormat).fromNow()}</Typo>
        </View>
        <View css={{ backgroundColor: Colors.BLUE, padding: 5, borderRadius: 5, color: Colors.WHITE }}>상세보기</View>
      </Button>
      <Modal state={passwordCheck} closeFn={passwordHandler} title="비밀번호를 입력하세요.">
        wats ur password
      </Modal>
      <Modal state={isFull} closeFn={fullHandler} title={title}>
        <FullInquiry {...props} />
      </Modal>
    </>
  )
}
