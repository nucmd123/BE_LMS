import * as bcrypt from 'bcrypt'

const saltOrRounds = 10

export const hash = async (data: string | Buffer): Promise<string> => {
  const salt = await bcrypt.genSalt(saltOrRounds)
  return await bcrypt.hash(data, salt)
}

export const compare = async (data: string | Buffer, encrypted: string): Promise<boolean> => {
  return await bcrypt.compare(data, encrypted)
}
