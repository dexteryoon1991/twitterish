// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { dbService, jwtAuth } from "@/lib"
import { Collection, UpdateNameApi } from "@/types"
import type { NextApiRequest, NextApiResponse } from "next"

type Data = UpdateNameApi
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { authenticated, message, uid } = await jwtAuth(req)
  if (!authenticated || !uid) {
    return res.send({ success: false, message })
  }

  const { name } = req.body as { name: string }
  console.log(name)

  const docRef = dbService.collection(Collection.USER).doc(uid)
  const credentialRef = dbService.collection(Collection.CREDENTIAL).doc(uid)

  try {
    await docRef.update({ name })
    await credentialRef.update({ name })

    return res.send({ success: true, name })
  } catch (error: any) {
    return res.send({ success: false, message: error.message })
  }
}
