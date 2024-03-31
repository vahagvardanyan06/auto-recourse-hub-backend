import { Injectable, BadRequestException, CallHandler, ExecutionContext } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

@Injectable()
export class ImagesInterceptor extends FilesInterceptor('images', 7) {
  constructor() {
    super(
      diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueSuffix + path.extname(file.originalname));
        },
      }),
    );
  }

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const files = request.body;
    
    if (!files || !files.length) {
      throw new BadRequestException('No images uploaded');
    }

    for (const file of files) {
      if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
        throw new BadRequestException('Only JPEG and PNG images are allowed');
      }
    }

    return next.handle();
  }
}
