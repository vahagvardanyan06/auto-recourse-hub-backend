export interface FileStorigeService {
  saveFile (file : Express.Multer.File, productId : string) : Promise<string>
}