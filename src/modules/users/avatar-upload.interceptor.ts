import { BadRequestException } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { randomUUID } from 'crypto'
import { diskStorage } from 'multer'
import { extname, join } from 'path'

/*
  image/png
  image/jpeg
  image/webp
  image/apng
  image/avif
  image/bmp
  image/gif
  image/vnd.microsoft.icon
  image/svg+xml
  image/tiff
*/

export const AVATAR_IMG_DIR = join(process.cwd(), 'public/avatar')
const FILE_SIZE_LIMIT = 1000000 /* bytes, fileSize: 1 MB */
const allowMimeTypes = ['image/jpeg', 'image/png']

export default function AvatarInterceptor(field: string) {
  return FileInterceptor(field, {
    fileFilter: async (req, file, cb) => {
      if (allowMimeTypes.includes(file.mimetype)) return cb(null, true)
      return cb(new BadRequestException(`Only ${allowMimeTypes.toString()} images can be uploaded`), false)
    },
    limits: {
      fileSize: FILE_SIZE_LIMIT,
    },
    storage: diskStorage({
      destination: (req, file, cb) => {
        cb(null, AVATAR_IMG_DIR)
      },
      filename: (req, file, cb) => {
        const filename = `${file.fieldname}-${randomUUID()}${extname(file.originalname)}`
        cb(null, filename)
      },
    }),
  })
}
