// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { bcrypt, dbService, useJwt } from "@/lib"
import mailer from "@/lib/mailer"
import { API, Collection, SendEmail, Credential } from "@/types"
import { getDoc, getDocs } from "firebase/firestore"
import type { NextApiRequest, NextApiResponse } from "next"

type Data = API
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { action } = req.query as { action?: "resetpassword" }
  const { email, name, body } = req.body as SendEmail
  if (!action) {
    return res.send({ success: false, message: "this is normal inquiry" })
  }
  const docRef = dbService.collection(Collection.CREDENTIAL).where("email", "==", email)
  const docSnap = await getDocs(docRef)
  const users = docSnap.docs.map((doc) => ({ ...doc.data() })) as Credential[]

  if (users.length === 0) {
    return res.send({ success: false, message: "존재하지 않는 유저입니다." })
  }

  let user: Credential | null = null
  if (!name) {
    return res.send({ success: false, message: "이름을 입력해주세요." })
  } else {
    const found = users.find((target) => target.name === name)
    if (found) {
      user = found
    } else return res.send({ success: false, message: "계정의 이름이 올바르지 않습니다." })
  }

  if (user == null) {
    return res.send({ success: false, message: "존재하지 않는 유저입니다." })
  }

  const verificationCode = await bcrypt.getUid(6)
  const { accessToken } = await useJwt.getAccessToken({ uid: user.uid }, "10m")
  //   const onClick = () => navigator.clipboard.writeText(verificationCode)
  const html = `
  아래의 인증번호를 입력해주세요. <br />
  <button style='width: 200px; height: 50px; borderRadius: 5px;'>${verificationCode}</button>
  `
  try {
    const { success, message } = await mailer({ to: email, subject: "비밀번호 재설정을 위한 인증번호", html })
    if (!success) {
      return res.send({ success, message })
    }

    await dbService.collection(Collection.USER).doc(user.uid).collection(Collection.VERIFICATIONCODE).doc("verification").set({ verificationCode, accessToken })
    return res.send({ success: true })
  } catch (error: any) {
    return res.send({ success: false, message: error.message })
  }
  //   await sendEmailViaNodemailer({ to: email, subject: "비밀번호 재설정을 위한 인증번호", html })
}
