import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class UploadService {
  // Client S3 configuré pour Tigris — instancié une seule fois (Singleton NestJS)
  private readonly s3 = new S3Client({
    region: 'auto', // Tigris gère la région automatiquement
    endpoint: process.env.TIGRIS_ENDPOINT, // https://t3.storage.dev
    credentials: {
      accessKeyId: process.env.TIGRIS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.TIGRIS_SECRET_ACCESS_KEY!,
    },
  });

  async uploadToTigris(file: Express.Multer.File): Promise<{ url: string }> {
    // Nom unique : timestamp + nom original nettoyé (espaces → tirets)
    const key = `uploads/${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;

    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: process.env.TIGRIS_BUCKET!,
          Key: key, // le "chemin" du fichier dans le bucket
          Body: file.buffer, // les octets bruts de l'image
          ContentType: file.mimetype, // 'image/jpeg', 'image/png', etc.
        }),
      );
      console.log('BUCKET:', process.env.TIGRIS_BUCKET);
      console.log('ENDPOINT:', process.env.TIGRIS_ENDPOINT);

      // URL publique Tigris — format : https://<bucket>.fly.storage.tigris.dev/<key>
      const url = `https://${process.env.TIGRIS_BUCKET}.t3.storage.dev/${key}`;
      return { url };
    } catch (error) {
      console.error('TIGRIS ERROR:', error); // ← ajouter
      throw new InternalServerErrorException("Échec de l'upload vers Tigris");
    }
  }
}
