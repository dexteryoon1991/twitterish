import { WriteSup } from "@/components"
import { useAuth } from "@/context"
import { View } from "@/core"
import axios from "axios"

export default function Home(props: any) {
  const { isLoggedIn } = useAuth()
  return <View css={{ padding: 10 }}>{isLoggedIn && <WriteSup />}</View>
}

export const getServerSideProps = async () => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API}/post`)
  return {
    props: data,
  }
}
