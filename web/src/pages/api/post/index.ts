// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { dbService } from "@/lib"
import { API, Collection, Post } from "@/types"
import { getDoc, getDocs } from "firebase/firestore"
import type { NextApiRequest, NextApiResponse } from "next"

interface Data extends API {
  pyaload?: { posts: any }
}
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { method } = req
  const postRef = dbService.collection(Collection.POST)

  if (method === "GET") {
    const posts = await postRef.onSnapshot((snap) => snap.docs.map((doc) => ({ ...doc.data() })))
    return res.send({ success: true, pyaload: { posts: posts ?? [] } })
  } else if (method === "POST") {
    const post = req.body as Post

    try {
      await postRef.add(post)
      return res.send({ success: true })
    } catch (error: any) {
      return res.send({ success: false, message: error.message })
    }
  }
}
