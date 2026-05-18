import { Router, Request, Response } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../config/supabase.config';
import { ResponseBuilder } from '../models/response.model';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)) {
      cb(null, true);
      return;
    }
    cb(new Error('Only JPEG and PNG images are allowed'));
  },
});

const EXTENSION_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
};

const VALID_TYPES = new Set(['profile', 'id_front', 'id_back']);
const VALID_PROPERTIES = new Set(['plaza', 'century']);

router.post('/guest-photo', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json(ResponseBuilder.error('MISSING_FILE', 'Image file is required'));
    }

    const type = String(req.body.type || 'document');
    const property = String(req.body.property || 'general');

    if (!VALID_TYPES.has(type)) {
      return res.status(400).json(ResponseBuilder.error('INVALID_TYPE', 'Upload type must be profile, id_front, or id_back'));
    }

    if (property !== 'general' && !VALID_PROPERTIES.has(property)) {
      return res.status(400).json(ResponseBuilder.error('INVALID_PROPERTY', 'Property must be plaza or century'));
    }

    const extension = EXTENSION_BY_MIME[req.file.mimetype] || 'jpg';
    const today = new Date().toISOString().split('T')[0];
    const filePath = `${property}/${today}/${type}-${uuidv4()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from('guest-photos')
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload failed:', uploadError);
      return res.status(500).json(ResponseBuilder.internalError('Failed to upload image'));
    }

    const { data: signedData, error: signedError } = await supabase.storage
      .from('guest-photos')
      .createSignedUrl(filePath, 60 * 60 * 24 * 365);

    if (signedError) {
      console.error('Signed URL creation failed:', signedError);
      return res.status(500).json(ResponseBuilder.internalError('Failed to prepare image URL'));
    }

    res.status(201).json(ResponseBuilder.success({
      path: filePath,
      url: signedData.signedUrl,
      bucket: 'guest-photos',
    }, 'Image uploaded successfully'));
  } catch (error: any) {
    console.error('Upload failed:', error);

    if (error?.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json(ResponseBuilder.error('FILE_TOO_LARGE', 'Image must be 5MB or smaller'));
    }

    res.status(500).json(ResponseBuilder.internalError(error?.message || 'Failed to upload image'));
  }
});

export default router;
