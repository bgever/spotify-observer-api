import { IsNotEmpty } from 'class-validator';

export class AuthorizeDto {

  /** Authorization code to start a new session. */
  @IsNotEmpty({ groups: ['new-session'] })
  code?: string;

  /** JSON Web Token (JWT) of an existing session. */
  @IsNotEmpty({ groups: ['existing-session'] })
  jwt?: string;
}
