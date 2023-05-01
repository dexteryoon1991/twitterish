import { SupItem, WriteSup } from "@/components"
import { useAuth } from "@/context"
import { View } from "@/core"
import { selectUser, useAppSelector } from "@/redux"
import { MyPostApi } from "@/types"
import axios from "axios"
import React from "react"
import { useQuery, useQueryClient } from "react-query"

export default function My(props: MyPostApi) {
  const { isLoggedIn } = useAuth()

  const { uid } = useAppSelector(selectUser)
  const queryClient = useQueryClient()
  const queryKey = [uid, "post"]
  const { data } = useQuery(
    queryKey,
    async (): Promise<MyPostApi> => {
      const { data } = await axios.get("fetch/myposts", { withCredentials: true })
      return data
    },
    { initialData: props, onSuccess: (res) => console.log(res) }
  )

  if (!isLoggedIn) {
    return null
  }
  return (
    <View css={{ padding: 10, rowGap: 30, maxWidth: 600, margin: "0 auto", width: "calc(100% - 20px)" }}>
      <WriteSup />
      {data?.payload?.posts?.map((post, index) => (
        <SupItem key={index} {...post} />
      ))}
    </View>
  )
}

export const getServerSideProps = async () => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API}/fetch/myposts`, { withCredentials: true })
  return { props: data }
}
