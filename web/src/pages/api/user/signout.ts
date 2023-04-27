// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { dbService, jwtAuth } from "@/lib"
import { API, Collection } from "@/types"
import type { NextApiRequest, NextApiResponse } from "next"

type Data = API

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { authenticated, message, uid } = await jwtAuth(req)
  if (!authenticated || !uid) {
    return res.send({ success: false, message })
  }
  const docRef = dbService.collection(Collection.USER).doc(uid).collection(Collection.TOKEN).doc("refreshToken")
  try {
    await docRef.delete()
    return res.send({ success: true })
  } catch (error: any) {
    return res.send({ success: false, message: error.message })
  }
}
