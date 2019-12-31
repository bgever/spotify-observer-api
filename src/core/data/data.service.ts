import { Injectable } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';

import { UserModel } from './models/user-model';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost';

/**
 * Handles interactions with the MongoDB database.
 */
@Injectable()
export class DataService {

  private _mongo: MongoClient;
  private _dbInstance: Db;

  constructor() {
    this._mongo = new MongoClient(MONGO_URI);
  }

  private async _db() {
    if (!this._mongo.isConnected()) {
      const mongoClient = await this._mongo.connect();
      this._dbInstance = mongoClient.db('data');
    }
    return this._dbInstance;
  }

  private async _users() {
    return (await this._db()).collection<UserModel>('users');
  }

  async storeAccess(userId: string, refreshToken: string, scope: string, profile: any) {
    (await this._users()).findOneAndUpdate(
      { _id: userId },
      {
        auth: {
          refreshToken,
          scope
        },
        profile, // TODO,
        $push: { logins: { at: new Date() } }
      },
      { upsert: true });
  }

  async findRefreshToken(userId: string) {
    return (await (await this._users()).findOne({ _id: userId }, { projection: { refreshToken: 1 } }))
      .auth.refreshToken;
  }
}
