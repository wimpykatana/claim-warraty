import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import * as mongoose from 'mongoose';
import { hash } from 'bcryptjs';
import { CreateUserRequest } from './dto/create-user.request';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private userModel: mongoose.Model<User>,
  ) {}

  async findAllUser(): Promise<User[]> {
    const users = await this.userModel.find();
    return users;
  }

  async createUser(data: CreateUserRequest) {
    try {
      await new this.userModel({
        ...data,
        password: await hash(data.password, 10),
      }).save();
      return { isErorr: false, message: 'User created successfully' };
    } catch (error) {
      return { isErorr: true, message: error.message };
    }
  }

  async getUser(query: mongoose.FilterQuery<User>) {
    const user = (await this.userModel.findOne(query)).toObject();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(query: mongoose.FilterQuery<User>, data: Partial<User>) {
    return this.userModel.findOneAndUpdate(query, data);
  }

  async findOneUserByID(id: string): Promise<User> {
    const res = await this.userModel.findById(id);

    if (!res) {
      throw new NotFoundException('User not found');
    }
    return res;
  }

  async deleteUserById(id: string): Promise<User> {
    const res = await this.userModel.findByIdAndDelete(id);
    if (!res) {
      throw new NotFoundException('User not found');
    }
    return res;
  }
}
