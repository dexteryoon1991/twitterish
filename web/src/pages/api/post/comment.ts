// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { bcrypt, dbService, jwtAuth } from "@/lib"
import { API, Collection, User, Comment, CommentApi, momentFormat, CommentProps } from "@/types"
import { getDoc, getDocs } from "firebase/firestore"
import moment from "moment"
import type { NextApiRequest, NextApiResponse } from "next"

type Data = CommentApi
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  console.log(req.body)
  let postId = ""

  const body = req.body as { postId: string }
  postId = body.postId
  if (req.query.postId) {
    postId = req.query.postId as string
  }

  const docRef = dbService.collection(Collection.POST).doc(postId).collection(Collection.COMMENT)

  const { method } = req

  if (method === "GET") {
    const docSnap = await getDocs(docRef)
    const docs = docSnap.docs.map((doc) => ({ ...doc.data() })) as Comment[]

    return res.send({ success: true, comments: docs ?? [] })
  } else {
    const { authenticated, uid, message } = await jwtAuth(req)
    if (!authenticated || !uid) {
      return res.send({ success: false, message })
    }
    if (method === "POST") {
      const comment = req.body as Comment
      const id = await bcrypt.getUid(8)
      const createdAt = moment().format(momentFormat)
      try {
        await docRef.doc(id).set({ ...comment, id, createdAt })
        return res.send({ success: true })
      } catch (error: any) {
        return res.send({ success: false, message: error.message })
      }
    } else if (method === "PATCH") {
      const { id, body } = req.body as CommentProps

      try {
        await docRef.doc(id as string).update({ body })
        return res.send({ success: true })
      } catch (error: any) {
        return res.send({ success: false, message: error.message })
      }
    } else if (method === "DELETE") {
      const { id } = req.query as { id: string }
      try {
        await docRef.doc(id).delete()
        return res.send({ success: true })
      } catch (error: any) {
        return res.send({ success: false, message: error.message })
      }
    }
  }
}
