import bcryptjs from "bcryptjs"
import crypto from "crypto"

const bcrypt = {
  hash: async (password: string): Promise<string> => {
    return await bcryptjs.hashSync(password, 12)
  },
  compare: async (password: string, originalPwd: string): Promise<boolean> => {
    return await bcryptjs.compare(password, originalPwd)
  },
  getUid: (length?: number): string => crypto.randomBytes(length ?? 16).toString("hex"),
}

export default bcrypt
