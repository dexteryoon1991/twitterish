import { WriteSup } from "@/components"
import { View } from "@/core"
import axios from "axios"

export default function Home(props: any) {
  console.log(props, "from home")
  return (
    <View>
      <WriteSup />
    </View>
  )
}

export const getServerSideProps = async () => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API}/post`)
  return {
    props: data,
  }
}
