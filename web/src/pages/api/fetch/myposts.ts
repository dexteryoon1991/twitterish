// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { dbService, jwtAuth } from "@/lib"
import { Collection, Comment, FetchLikeAndCommentApi, LikeProp, MyPostApi, Post, User } from "@/types"
import { getDoc, getDocs } from "firebase/firestore"
import type { NextApiRequest, NextApiResponse } from "next"

type Data = MyPostApi
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { authenticated, uid, message } = await jwtAuth(req)
  if (!authenticated || !uid) {
    return res.send({ success: false, message })
  }
  const userRef = dbService.collection(Collection.CREDENTIAL).doc(uid)
  const userSnap = await getDoc(userRef)
  const user = userSnap.data()

  if (!user) {
    return res.send({ success: false, message: "유저를 찾을 수 없습니다." })
  }

  const { email, name } = user as User

  const docRef = dbService.collection(Collection.POST).where("createdBy", "==", { name, email, uid })
  const docSnap = await getDocs(docRef)
  const posts = docSnap.docs.map((doc) => ({ ...doc.data() })) as Post[]

  return res.send({ success: true, payload: { posts } })
}
