import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class FileTypeValidationPipe implements PipeTransform {
    async transform(value: Express.Multer.File) {
        const fileName = value.originalname.split(".");
        const MIME_TYPES = ['vtt', 'srt'];

        if (!MIME_TYPES.includes(fileName[fileName.length - 1])) {
            throw new BadRequestException(
                'The file should be either vtt, or srt.',
            );
        }

        return value;
    }
}
