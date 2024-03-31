import { Injectable } from "@nestjs/common";
import * as AWS from "aws-sdk";
import { ManagedUpload } from "aws-sdk/clients/s3";

@Injectable()
export class S3Service {
  private s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: "AKIA5FTZEXMMDGBQ2O5I",
      secretAccessKey: "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",
      // region : 'Europe (Frankfurt) eu-central-1',
      // s3BucketEndpoint: false,
      // endpoint: "https://s3.amazonaws.com"
    });
    console.log(this.s3);
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
    console.log(String(name));

    try {
      let s3Response = await this.s3.upload(params).promise();
      return s3Response;
    } catch (e) {
      console.log(e, "error");
    }
  }

  async deleteFIle(bucket: string, deletedKey: String) {
    const params = {
      Bucket: bucket,
      Key: String(deletedKey),
    };
    console.log(String(deletedKey), "deletedKey");

    return this.s3.deleteObject(params).promise();
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
