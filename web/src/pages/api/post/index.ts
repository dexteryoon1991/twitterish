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
    const postSnap = await getDocs(postRef.orderBy("createdAt", "desc"))
    const posts = postSnap.docs.map((doc) => ({ ...doc.data() })) as Post[]

    return res.send({ success: true, pyaload: { posts: posts ?? [] } })
  } else {
    const { authenticated, message, uid } = await jwtAuth(req)
    if (!authenticated || !uid) {
      return res.send({ success: false, message })
    }
    const post = req.body as Post
    const time = new Date().getTime()
    if (method === "POST") {
      const docId = `${uid}${time}`
      let img = ""
      if (post.img) {
        const base64 = post.img.split(",")[1]
        try {
          const path = `post/${uid}/${time}`
          const imgRef = storage.ref(path)
          await uploadString(imgRef, base64, "base64")
          img = await getDownloadURL(imgRef)
        } catch (error: any) {
          return res.send({ success: false, message: error.message })
        }
      }

      try {
        await postRef.doc(docId).set({ ...post, id: docId })
        return res.send({ success: true })
      } catch (error: any) {
        return res.send({ success: false, message: error.message })
      }
    } else if (method === "PATCH") {
      const { body, img, id } = post
      console.log(id)
      try {
        await postRef.doc(id).update({ body, img })
        return res.send({ success: true })
      } catch (error: any) {
        return res.send({ success: false, message: error.message })
      }
    } else if (method === "DELETE") {
      const { id } = req.query as { id: string }
      try {
        await postRef.doc(id).delete()
        return res.send({ success: true })
      } catch (error: any) {
        return res.send({ success: false, message: error.message })
      }
    }
  }
}
