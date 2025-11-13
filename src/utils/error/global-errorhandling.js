import { deleteFile } from "../multer/deletefille.js"


export const globalErrorHandling = (error, req, res, next) => {
    if (req.file) {
        deleteFile(req.file.path)
    } else if (req.files) {
        req.files.map(file => deleteFile(file))
    }
    if (req.file?.path) deleteFile(req.file.path)
        console.log(error);
        
    return res.status(error.cause || 500).json({ message: error.message || error, success: false })
}