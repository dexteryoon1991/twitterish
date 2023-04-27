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
  })

  const [posts, setPosts] = useState<Post[]>([])
  useEffect(() => {
    setPosts(data?.pyaload?.posts ? data.pyaload.posts : [])
    console.log(data)
  }, [data])

  return (
    <View css={{ padding: 10, rowGap: 30 }}>
      {isLoggedIn && <WriteSup />}
      {posts?.length > 0 && posts.map((post) => <SupItem key={post.id} {...post} />)}
    </View>
  )
}

export const getServerSideProps = async () => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API}/post`)
  return {
    props: data,
  }
}
