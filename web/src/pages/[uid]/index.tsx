import { SupItem } from "@/components"
import { View } from "@/core"
import { MyPostApi } from "@/types"
import axios from "axios"
import { GetServerSidePropsContext } from "next"
import { useRouter } from "next/router"
import React from "react"
import { useQuery } from "react-query"

export default function UserPage(props: MyPostApi) {
  const { query } = useRouter()
  const { uid } = query as { uid: string }

  const queryKey = [uid, "post"]
  const { data } = useQuery(
    queryKey,
    async (): Promise<MyPostApi> => {
      const { data } = await axios.get("fetch/userposts", { params: { uid } })
      return data
    },
    { initialData: props, onSuccess: (res) => console.log(res) }
  )

  return (
    <View css={{ padding: 10, rowGap: 30, maxWidth: 600, margin: "0 auto", width: "calc(100% - 20px)" }}>
      {data?.payload?.posts?.map((post, index) => (
        <SupItem key={index} {...post} />
      ))}
    </View>
  )
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { uid } = ctx.query as { uid: string }

  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API}/fetch/userposts`, { params: { uid } })

  return { props: data }
}
