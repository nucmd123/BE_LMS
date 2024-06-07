export interface JwtPayload {
  iss?: string | undefined
  sub?: string | number | undefined
  aud?: string | string[] | undefined
  exp?: number | undefined
  nbf?: number | undefined
  iat?: number | undefined
  jti?: string | undefined
}

export interface ITokenPayload extends JwtPayload {
  email?: string | undefined
}
