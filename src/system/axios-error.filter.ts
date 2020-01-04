import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import * as AxiosError from 'axios-error';

const MAX_RESPONSE_DATA = 256;

@Catch(AxiosError)
export class AxiosErrorFilter implements ExceptionFilter {

  private readonly _logger = new Logger(AxiosErrorFilter.name);

  catch(exception: AxiosError, host: ArgumentsHost) {
    this._logger.error(
      `Unhandled ${exception}`,
      `${exception.config.method.toUpperCase()} ${exception.config.url}
${exception.stack}
RESPONSE DATA (first ${MAX_RESPONSE_DATA} characters):
${JSON.stringify(exception.response.data).substr(0, MAX_RESPONSE_DATA)}`
    );
  }
}
