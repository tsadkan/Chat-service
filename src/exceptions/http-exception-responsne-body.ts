export class HttpResponseBody {
  statusCode: number;
  timeStamp: string = new Date().toISOString();
  path: string;
  message: string;
  error?: string | Array<string>;
}
