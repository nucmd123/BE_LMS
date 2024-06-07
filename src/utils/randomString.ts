import { randomBytes } from 'crypto'

export default function randomString() {
  return randomBytes(64).toString('base64url')
}
