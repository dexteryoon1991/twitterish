// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { dbService } from "@/lib"
import { Collection, Comment, FetchLikeAndCommentApi, LikeProp, User } from "@/types"
import { getDoc, getDocs } from "firebase/firestore"
import type { NextApiRequest, NextApiResponse } from "next"

type Data = FetchLikeAndCommentApi
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { id } = req.query as { id: string }
  const docRef = dbService.collection(Collection.POST).doc(id)

  const likeRef = docRef.collection(Collection.LIKE)
  try {
    const getLikes = await getDocs(likeRef)
    const likes = getLikes.docs.map((doc) => ({ ...doc.data() })) as User[]
    try {
      const commentRef = docRef.collection(Collection.COMMENT)
      const getComments = await getDocs(commentRef)
      const comments = getComments.docs.map((doc) => ({ ...doc.data() })) as Comment[]

      return res.send({ success: true, payload: { likes, comments } })
    } catch (error: any) {
      return res.send({ success: false, message: error.message })
    }
  } catch (error: any) {
    return res.send({ success: false, message: error.message })
  }
}
