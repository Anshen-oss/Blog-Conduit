import { Test, TestingModule } from '@nestjs/testing';
import { UploadService } from './upload.service';

// On mock le SDK S3 pour ne pas faire de vrais appels Tigris en test
jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn().mockImplementation(() => ({
    send: jest.fn().mockResolvedValue({}), // simule un upload réussi
  })),
  PutObjectCommand: jest.fn(),
}));

describe('UploadService', () => {
  let service: UploadService;

  // Fichier simulé — même structure que ce que Multer injecte
  const mockFile = {
    originalname: 'test image.jpg',
    mimetype: 'image/jpeg',
    buffer: Buffer.from('fake-image-data'),
    size: 1024,
  } as Express.Multer.File;

  beforeEach(async () => {
    process.env.TIGRIS_BUCKET = 'conduit-blog-uploads';
    process.env.TIGRIS_ENDPOINT = 'https://fly.storage.tigris.dev';
    process.env.TIGRIS_ACCESS_KEY_ID = 'test-key';
    process.env.TIGRIS_SECRET_ACCESS_KEY = 'test-secret';

    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadService],
    }).compile();

    service = module.get<UploadService>(UploadService);
  });

  it('doit uploader un fichier et retourner une URL Tigris', async () => {
    const result = await service.uploadToTigris(mockFile);

    expect(result.url).toContain('conduit-blog-uploads');
    expect(result.url).toContain('t3.storage.dev'); // ← ancienne URL corrigée
    expect(result.url).toMatch(/^https:\/\//);
  });

  it('doit nettoyer les espaces dans le nom de fichier', async () => {
    const result = await service.uploadToTigris(mockFile);
    // "test image.jpg" → "test-image.jpg" dans la clé
    expect(result.url).not.toContain(' ');
    expect(result.url).toContain('test-image.jpg');
  });
});
