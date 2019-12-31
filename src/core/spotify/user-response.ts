/**
 * User information.
 * @see https://developer.spotify.com/documentation/web-api/reference/users-profile/get-current-users-profile/
 */
export interface UserResponse {
  /** E.g. `"SE"` */
  country: string;
  /** E.g. `"JM Wizzler"` */
  display_name: string;
  /** Note, not validated! E.g. `"email@example.com"` */
  email: string;
  explicit_content: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  external_urls:
  {
    /** E.g. `"https://open.spotify.com/user/wizzler"` */
    spotify: string;
  };
  followers:
  {
    /** E.g. `null` */
    href: string;
    /** E.g. `3829` */
    total: number;
  };
  /** E.g. `"https://api.spotify.com/v1/users/wizzler"` */
  href: string;
  /** E.g. `"wizzler"` */
  id: string;
  images: Array<{
    height: number | null;
    width: number | null;
    /** E.g. `"https://fbcdn-profile-a.akamaihd.net/hprofile-ak-frc3/t1.0-1/1970403_10152215092574354_1798272330_n.jpg"` */
    url: string;
  }>;
  /** E.g. `"premium"` */
  product: string;
  /** E.g. `"user"` */
  type: string;
  /** E.g. `"spotify:user:wizzler"` */
  uri: string;
}
