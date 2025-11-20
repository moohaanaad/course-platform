import path from "path"
import fs from "fs"

export const deleteFile = (filePath) => {
    try {
        const fullPath = path?.resolve(filePath)
    const defaultProfile = ["uploads/User/default-male.jpg", "uploads/User/default-female.png"]
    if (fs.existsSync(fullPath) && ![...defaultProfile].includes(filePath)) {
        fs.unlinkSync(fullPath)
    }
    } catch (error) {
        return true
    }
}