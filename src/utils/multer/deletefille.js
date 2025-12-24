import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import digitalOcean from "./cloud.config.js";

export const deleteFile = async(key) => {
    try {
  const command = new DeleteObjectCommand({
    Bucket: process.env.SPACES_BUCKET,
    Key: key,
  });

  await digitalOcean.send(command);
    
    } catch (error) {
      console.log(error.message);
      
        return true
    }
}