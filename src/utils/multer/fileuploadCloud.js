import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import randomstring from 'randomstring';
import digitalOcean from "./cloud.config.js";


export const fileValidationTypes = {
    image: ['image/png', 'image/jpeg', 'application/pdf'],
    file: ['application/pdf'],
    course: ['video/mp4','application/pdf'],
    video: ['video/mp4', 'video/mov', 'video/avi', 'video/mkv']
}


export const fileuploadPublic = ({ mainFolder, partFolder, allowTypes = fileValidationTypes.image }) => {
    
    
    const storage = multerS3({
        s3: digitalOcean,
        bucket: process.env.SPACES_BUCKET,
        acl: 'public-read',
        contentDisposition: 'inline',
        contentType: (req, file, cb) => {
            cb(null, file.mimetype);
        },
        key: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const fileName = randomstring.generate() + ext;
            const fullPath = `uploads/${mainFolder}/${partFolder}/${fileName}`;
            cb(null, fullPath);
        },
    });

    
    const fileFilter = (req, file, cb) => {
        if (allowTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('File type not allowed'), false);
        }
    };

    return multer({ storage, fileFilter });
};

export const fileuploadPrivate = ({ mainFolder, partFolder, allowTypes = fileValidationTypes.image }) => {
    
    
    const storage = multerS3({
        s3: digitalOcean,
        bucket: process.env.SPACES_BUCKET,
        contentDisposition: 'inline',
        contentType: (req, file, cb) => {
            cb(null, file.mimetype);
        },
        key: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const fileName = randomstring.generate() + ext;
            const fullPath = `uploads/${mainFolder}/${partFolder}/${fileName}`;
            cb(null, fullPath);
        },
    });

    
    const fileFilter = (req, file, cb) => {
        if (allowTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('File type not allowed'), false);
        }
    };

    return multer({ storage, fileFilter });
};