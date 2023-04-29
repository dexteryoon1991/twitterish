// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { bcrypt, dbService, jwtAuth, useJwt } from "@/lib"
import { Collection, User, VerificationCodeApi } from "@/types"
import { getDoc, getDocs } from "firebase/firestore"
import type { NextApiRequest, NextApiResponse } from "next"

type Data = VerificationCodeApi
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { email } = req.query as { email: string }

  const docRef = dbService.collection(Collection.USER).where("email", "==", email)

  const docSnap = await getDocs(docRef)
  const docs = docSnap.docs.map((doc) => ({ ...doc.data() })) as User[]

  if (docs.length === 0) {
    return res.send({ success: false, message: "존재하지 않는 유저입니다." })
  }
  const { uid } = docs[0]

  const tokenRef = dbService.collection(Collection.USER).doc(uid).collection(Collection.VERIFICATIONCODE)
  const getSnap = await getDocs(tokenRef)
  const getData = getSnap.docs.map((doc) => ({ ...doc.data() })) as any[]
  if (!getData || getData.length === 0) {
    return res.send({ success: false, message: "인증번호를 다시 발급해 주세요." })
  } else {
    const userRef = tokenRef.doc("verification")

    const userSnap = await getDoc(userRef)
    const { verificationCode, accessToken } = userSnap.data() as { verificationCode: string; accessToken: string }
    const { success, message } = await useJwt.verifyToken(accessToken)
    if (!success) {
      return res.send({ success: false, message: message === "jwt expired" ? "인증번호를 다시 발급해 주세요." : message })
    }
    if (!verificationCode) {
      return res.send({ success: false, message: "인증번호가 존재하지 않습니다." })
    } else return res.send({ success: true, verificationCode: verificationCode, uid })
  }
}
