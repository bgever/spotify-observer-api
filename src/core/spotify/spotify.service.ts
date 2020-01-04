import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { UserResponse } from './user-response';

/**
 * Handles interactions with the Spotify API.
 */
@Injectable()
export class SpotifyService {

  async getUser(accessToken: string) {
    // Call user info API to determine user ID.
    const userResponse = await axios.get<UserResponse>('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    return userResponse.data;
  }
}
