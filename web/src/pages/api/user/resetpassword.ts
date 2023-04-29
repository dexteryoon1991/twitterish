// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { bcrypt, dbService, useJwt } from "@/lib"
import { UserApi, Collection, PasswordAndUid, User } from "@/types"
import { getDoc } from "firebase/firestore"
import type { NextApiRequest, NextApiResponse } from "next"

type Data = UserApi
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { uid, password: newPassword } = req.body as PasswordAndUid

  const docRef = dbService.collection(Collection.CREDENTIAL).doc(uid)

  const userRef = dbService.collection(Collection.USER).doc(uid)

  const password = await bcrypt.hash(newPassword)
  try {
    await docRef.update({ password })

    await userRef.collection(Collection.VERIFICATIONCODE).doc("verification").delete()

    const { accessToken, refreshToken } = await useJwt.getTokens({ uid })
    const userSnap = await getDoc(userRef)
    const user = userSnap.data() as User
    await userRef.collection(Collection.TOKEN).doc("refreshToken").set({ refreshToken })

    return res.send({ success: true, payload: { user, accessToken } })
  } catch (error: any) {
    return res.send({ success: false, message: error.message })
  }
}
