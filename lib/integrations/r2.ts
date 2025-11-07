"server-only";
import config from "@/ostack.config";
import {
  S3Client,
  PutObjectCommand,
  type PutObjectCommandOutput,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "WEUR",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY!,
    secretAccessKey: process.env.R2_SECRET_KEY!,
  },
});

export async function putObject(
  buffer: Buffer | Uint8Array,
  key: string,
  contentType: string = "image/*",
  metadata: Record<string, string> = {}
): Promise<PutObjectCommandOutput> {
  return await s3Client.send(
    new PutObjectCommand({
      Bucket: config.r2Bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      Metadata: {
        ...metadata,
      },
    })
  );
}

export async function deleteObject(key: string) {
  return await s3Client.send(
    new DeleteObjectCommand({
      Bucket: config.r2Bucket,
      Key: key,
    })
  );
}
