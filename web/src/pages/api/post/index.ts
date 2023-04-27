// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { dbService, jwtAuth, storage } from "@/lib"
import { API, Collection, Post, PostApi } from "@/types"
import { getDoc, getDocs } from "firebase/firestore"
import { uploadString, getDownloadURL } from "firebase/storage"
import moment from "moment"
import type { NextApiRequest, NextApiResponse } from "next"

type Data = PostApi

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { method } = req
  const postRef = dbService.collection(Collection.POST)

  if (method === "GET") {
    const month = moment().format("MM")
    const postSnap = await getDocs(postRef)
    const posts = postSnap.docs.map((doc) => ({ ...doc.data() })) as Post[]

    return res.send({ success: true, pyaload: { posts: posts ?? [] } })
  } else {
    const { authenticated, message, uid } = await jwtAuth(req)
    if (!authenticated || !uid) {
      return res.send({ success: false, message })
    }
    if (method === "POST") {
      const post = req.body as Post

      let img = ""
      if (post.img) {
        const base64 = post.img.split(",")[1]
        try {
          const path = `post/${uid}/${new Date().getTime()}`
          const imgRef = storage.ref(path)
          await uploadString(imgRef, base64, "base64")
          img = await getDownloadURL(imgRef)
        } catch (error: any) {
          return res.send({ success: false, message: error.message })
        }
      }

      try {
        await postRef.add(post)
        return res.send({ success: true })
      } catch (error: any) {
        return res.send({ success: false, message: error.message })
      }
    }
  }
}
