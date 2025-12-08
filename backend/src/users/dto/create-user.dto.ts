export class CreateUserDto {
  name: string;
  email: string;
  password?: string;
  role?: string;
  googleId?: string;
  facebookId?: string;
}