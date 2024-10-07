import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadsService {
  public async uploadFile(file: Express.Multer.File) {
    // upload the fiile to the aws s3 bucket and a url has been generated
    // Generate a new entry in the db (will contain the cloudfront url)
  }
}
