import { IsEmail, IsStrongPassword } from 'class-validator';
import { Role } from '../schema/user.schema';

export class CreateUserRequest {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  role: Role;
}
