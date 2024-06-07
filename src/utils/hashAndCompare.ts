import * as bcrypt from 'bcrypt'

const saltOrRounds = 10

export const hash = async (data: string | Buffer): Promise<string> => {
  return await bcrypt.hash(data, saltOrRounds)
}

export const compare = async (data: string | Buffer, encrypted: string): Promise<boolean> => {
  return await bcrypt.compare(data, encrypted)
}
