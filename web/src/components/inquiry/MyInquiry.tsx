import { Typo, View } from "@/core"
import { selectUser, useAppSelector } from "@/redux"
import { Inquiry, InquiryApi } from "@/types"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { useQuery } from "react-query"
import InquiryItem from "./InquiryItem"

export default function MyInquiry() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])

  const { uid, email } = useAppSelector(selectUser)
  const { data } = useQuery([uid, "inquiry"], async (): Promise<InquiryApi> => {
    const { data } = await axios.get("inquiry", { params: { email } })
    return data
  })
  useEffect(() => {
    setInquiries(data?.payload?.inquiries ? data.payload.inquiries : [])
  }, [data])
  return (
    <>
      {inquiries.length > 0 && (
        <View css={{ rowGap: 10 }}>
          <Typo weight="BOLD">나의 문의 내역</Typo>
          {inquiries?.map((inquiry) => (
            <InquiryItem key={inquiry.id} {...inquiry} />
          ))}
        </View>
      )}
    </>
  )
}
