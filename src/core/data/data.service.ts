import { Injectable, OnModuleInit } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';

import { UserModel } from './models/user-model';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost';

/**
 * Handles interactions with the MongoDB database.
 */
@Injectable()
export class DataService implements OnModuleInit {

  private _mongo: MongoClient;
  private _dbInstance: Db;

  constructor() {
    this._mongo = new MongoClient(MONGO_URI, { useUnifiedTopology: true });
  }

  async onModuleInit() {
    // Attempt to connect to the database to be aware of connection issues on startup.
    return await this._db();
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
    return (await this._users()).findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          auth: {
            refreshToken,
            scope
          },
          profile, // TODO,
        },
        $push: { logins: { at: new Date() } }
      },
      { upsert: true });
  }

  async findRefreshToken(userId: string) {
    return (await (await this._users()).findOne({ _id: userId }, { projection: { refreshToken: 1 } }))
      .auth.refreshToken;
  }
}
