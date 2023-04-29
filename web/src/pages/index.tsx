import { SupItem, WriteSup } from "@/components"
import { useAuth } from "@/context"
import { View } from "@/core"
import { Post, PostApi } from "@/types"
import axios from "axios"
import { useEffect, useState } from "react"
import { useQuery } from "react-query"

export default function Home(props: PostApi) {
  const { isLoggedIn } = useAuth()
  const { data } = useQuery({
    queryKey: "post",
    queryFn: async (): Promise<PostApi> => {
      const { data } = await axios.get("post")
      return data
    },
    initialData: props,
    refetchOnWindowFocus: true,
  })

  const [posts, setPosts] = useState<Post[]>([])
  useEffect(() => {
    if (data?.pyaload?.posts) {
      const target = data?.pyaload?.posts.sort()
    }
    setPosts(data?.pyaload?.posts ? data.pyaload.posts : [])
    console.log(data?.pyaload?.posts)
  }, [data])

  return (
    <View css={{ padding: 10, rowGap: 30, maxWidth: 600, margin: "0 auto", width: "calc(100% - 20px)" }}>
      {isLoggedIn && <WriteSup />}
      {props?.pyaload?.posts?.map((post, index) => (
        <SupItem key={index} {...post} />
      ))}
    </View>
  )
}

export const getServerSideProps = async () => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API}/post`)
  return {
    props: data,
  }
}
