import fs from 'fs'
import multer, { diskStorage } from 'multer'
import path from 'path'
import randomstring from 'randomstring'


export const fileValidationType = {
    image: ['image/png', 'image/jpeg'],
    file: ['application/pdf']
}

export const fileupload = ({ mainFolder, partFolder, allowTypes = fileValidationType.image }) => {
    const storage = diskStorage({

        destination: (req, file, cb) => {
            
            const fullPath = path.resolve(`uploads/${mainFolder}/${partFolder}`)
            
            fs.mkdirSync(fullPath, { recursive: true })
            
            cb(null, `uploads/${mainFolder}/${partFolder}`)
        },

        filename: (req, file, cb) => {
            cb(null, randomstring.generate() + file.originalname)
        }
    })

    const fileFilter = (req, file, cb) => {
        if (!allowTypes.includes(file.mimetype)) {
            return cb(new Error('invalid file format', 400), false)
        }
        req.allowTypes = allowTypes

        return cb(null, true)
    }

    return multer({ storage, fileFilter })
}