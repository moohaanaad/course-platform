import { deleteFile } from "../multer/deletefille.js"


export const globalErrorHandling = (error, req, res, next) => {
    if (req.file) {
        deleteFile(req.file.key)
    } else if (req.files) {
        req.files.map(file => deleteFile(file.key))
    }
    if (req.file?.key) deleteFile(req.file.key)
        console.log(error);  
    return res.status(error.cause || 500).json({ message: error.message || error, success: false })
}