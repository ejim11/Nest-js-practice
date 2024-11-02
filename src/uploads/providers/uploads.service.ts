import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Upload } from '../upload.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UploadToAwsProvider } from './upload-to-aws.provider';
import { ConfigService } from '@nestjs/config';
import { UploadFile } from '../interfaces/upload-file.interface';
import { FileTypes } from '../enums/file-types.enum';

@Injectable()
export class UploadsService {
  constructor(
    /**
     * injecting the upload repository
     */
    @InjectRepository(Upload)
    private readonly uploadsRepository: Repository<Upload>,

    /**
     * injecting the upload to aws provider
     */
    private readonly uploadToAwsProvider: UploadToAwsProvider,

    /**
     * injecting config service
     */
    private readonly configService: ConfigService,
  ) {}

  public async uploadFile(file: Express.Multer.File) {
    // throw error for unsupported mimetype
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype)) {
      throw new BadRequestException('mime type not supported');
    }

    try {
      // upload the file to the aws s3 bucket and a url has been generated
      const name = await this.uploadToAwsProvider.fileUpload(file);

      // Generate a new entry in the db (will contain the cloudfront url)
      const uploadFile: UploadFile = {
        name: name,
        path: `${this.configService.get('appConfig.awsCloudFrontUrl')}/${name}`,
        type: FileTypes.IMAGE,
        mime: file.mimetype,
        size: file.size,
      };

      // creating a new upload instance of the entity
      const upload = this.uploadsRepository.create(uploadFile);
      return await this.uploadsRepository.save(upload);
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}
