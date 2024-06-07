import { SetMetadata } from '@nestjs/common'

/**
 * bypass jwt global
 */
export const IS_PUBLIC_KEY = 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)
