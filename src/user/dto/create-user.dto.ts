import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

const props = {
  minLength: 6,
  minNumbers: 1,
  minSymbols: 1,
  minUppercase: 1,
  minLowercase: 1,
};

export class CreateUser {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword({ ...props })
  password: string;
}
