/** DB model for the user information. */
export interface UserModel {
  profile?: any; // TODO: Specify type.
  auth?: {
    refreshToken: string;
    scope: string;
  };
  logins?: Array<{ at: Date }>;
}
