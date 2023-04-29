// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { dbService, jwtAuth } from "@/lib"
import { API, Collection, LikeProp, User } from "@/types"
import { getDoc } from "firebase/firestore"
import type { NextApiRequest, NextApiResponse } from "next"

type Data = API
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { authenticated, uid, message } = await jwtAuth(req)
  if (!authenticated || !uid) {
    return res.send({ success: false, message })
  }

  const { id, user } = req.body as LikeProp

  const docRef = dbService.collection(Collection.POST).doc(id).collection(Collection.LIKE).doc(user.uid)

  const docSnap = await getDoc(docRef)
  const doc = docSnap.data() as User

  if (doc) {
    try {
      await docRef.delete()
      return res.send({ success: true })
    } catch (error: any) {
      return res.send({ success: false, message: error.message })
    }
  } else {
    try {
      await docRef.set(user)
      return res.send({ success: true })
    } catch (error: any) {
      return res.send({ success: false, message: error.message })
    }
  }
}
