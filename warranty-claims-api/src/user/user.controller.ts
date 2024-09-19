import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schema/user.schema';
import { CreateUserRequest } from './dto/create-user.request';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/guards/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('users')
@UseGuards(RolesGuard)
export class UserController {
  constructor(private userService: UserService) {}

  //get all users
  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles('staff')
  async findAllUser() {
    try {
      return this.userService.findAllUser();
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error:
            'Could not retrieve users at this time. Please try again later.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //get a user by id
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('staff')
  async getUserByID(
    @Param('id')
    id: string,
  ): Promise<User> {
    try {
      return this.userService.findOneUserByID(id);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error:
            'Could not retrieve user at this time. Please try again later.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //create a new user
  @Post()
  async createUser(
    @Body()
    user: CreateUserRequest,
  ) {
    try {
      return this.userService.createUser(user);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Could not create user at this time. Please try again later.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //delete a user by id
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('staff')
  async deleteUserByID(@Param('id') id: string): Promise<User> {
    try {
      return this.userService.deleteUserById(id);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Could not delete user at this time. Please try again later.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
