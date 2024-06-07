import { BadRequestException } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { randomUUID } from 'crypto'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { AVATAR_DIR } from 'src/constants'
import { validateBufferMIMEType } from 'validate-image-type'

const FILE_SIZE_LIMIT = 1000000 /* bytes, fileSize: 1 MB */
const allowMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

export default function AvatarInterceptor(avatarField: string) {
  return FileInterceptor(avatarField, {
    fileFilter: async (req, file, cb) => {
      // const result = await validateBufferMIMEType(file.buffer, { allowMimeTypes })

      // if (result.ok) {
      //   return cb(null, true)
      // } else if (result.error) {
      //   console.log(result.error)
      //   return cb(new BadRequestException(`Only ${allowMimeTypes.toString()} images can be uploaded`), false)
      // }

      if (allowMimeTypes.includes(file.mimetype)) return cb(null, true)
      return cb(new BadRequestException(`Only ${allowMimeTypes.toString()} images can be uploaded`), false)
    },
    limits: {
      fileSize: FILE_SIZE_LIMIT,
    },
    storage: diskStorage({
      destination: (req, file, cb) => {
        cb(null, AVATAR_DIR)
      },
      filename: (req, file, cb) => {
        const filename = `${file.fieldname}-${randomUUID()}${extname(file.originalname)}`
        cb(null, filename)
      },
    }),
  })
}
