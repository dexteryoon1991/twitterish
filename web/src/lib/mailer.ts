import { API } from "@/types"
import * as nodemailer from "nodemailer"

export interface MailOptions {
  to?: string
  subject?: string
  html?: any
}
const mailOptions = (props: MailOptions) => {
  return {
    ...props,
  }
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_ID!,
    pass: process.env.MAIL_PASS!,
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_KEY!,
  },
})

export default async (props: MailOptions): Promise<API> => {
  try {
    const result = await transporter.sendMail(mailOptions(props))
    console.log(result, "result")
    return { success: true }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}
