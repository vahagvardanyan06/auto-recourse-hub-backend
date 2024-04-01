import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as AWS from "aws-sdk";
import { ManagedUpload } from "aws-sdk/clients/s3";

@Injectable()
export class S3Service {
  private s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: "AKIA5FTZEXMMNHRR46JY",
      secretAccessKey: "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",
      // region : 'Europe (Frankfurt) eu-central-1',
      // s3BucketEndpoint: false,
      // endpoint: "https://s3.amazonaws.com"
    });
  }

  async getObject(
    bucketName: string,
    key: string
  ): Promise<AWS.S3.GetObjectOutput> {
    const params = {
      Bucket: bucketName,
      Key: key,
    };

    return await this.s3.getObject(params).promise();
  }

  async s3_upload(file: any, bucket: any, name: any, mimetype: any) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ACL: "public-read",
      ContentType: mimetype,
      ContentDisposition: "inline",
      CreateBucketConfiguration: {
        LocationConstraint: "ap-south-1",
      },
    };

    try {
      let s3Response = await this.s3.upload(params).promise();
      return s3Response;
    } catch (e) {
      console.log(e);
      
      throw new HttpException("Error to upload in AWS", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async deleteFIle(bucket: string, deletedKey: String) {
    const params = {
      Bucket: bucket,
      Key: `3.jpg`
    };
   this.s3.deleteObject(params, (err : any, data : any) => {
      if (err) {
        console.log(data);
        console.log(err);
        return;
      }
      console.log(data);
    }).promise();
  }

  async updateFile(
    file: any,
    bucket: string,
    deletedKey: string,
    newkey: string,
    mimetype: string
  ): Promise<ManagedUpload.SendData> {
    const params = {
      Bucket: bucket,
      Key: String(deletedKey),
    };
    this.s3.deleteObject(params).promise();
    return await this.s3_upload(file, bucket, newkey, mimetype);
  }
}
