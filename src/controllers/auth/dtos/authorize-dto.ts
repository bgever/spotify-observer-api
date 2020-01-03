import { IsNotEmpty, ValidateIf } from 'class-validator';

export class AuthorizeDto {

  /** Authorization code to start a new session. */
  @ValidateIf(o => !o.jwt)
  @IsNotEmpty({ groups: ['new-session'] })
  code?: string;

  /** JSON Web Token (JWT) of an existing session. */
  @ValidateIf(o => !o.code)
  @IsNotEmpty({ groups: ['existing-session'] })
  jwt?: string;
}
