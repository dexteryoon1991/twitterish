// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { dbService } from "@/lib"
import { Collection } from "@/types"
import { getDoc } from "firebase/firestore"
import type { NextApiRequest, NextApiResponse } from "next"

type Data = any
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const docRef = dbService.collection(Collection.CREDENTIAL).doc("51WCU11rxMpKq7wcZaiU")
  const docSnap = await getDoc(docRef)
  const data = docSnap.data()
  return res.send({ payload: data })
}
