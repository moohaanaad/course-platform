import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config()

const digitalOcean = new S3Client({
  region: process.env.SPACES_REGION,
  endpoint: process.env.SPACES_ENDPOINT,
  credentials: {
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET,
  },
});

export default digitalOcean;