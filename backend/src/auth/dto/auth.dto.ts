import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address of the user',
    required: true
  })
  @IsEmail({}, { message: 'Please provide a valid email' })
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user - minimum 8 characters',
    required: true,
    minimum: 8
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsNotEmpty()
  password!: string;
}

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address of the user',
    required: true
  })
  @IsEmail({}, { message: 'Please provide a valid email' })
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class AuthResponse {
  @ApiProperty({
    example: 'User successfully registered',
    description: 'Response message'
  })
  message: string;

  @ApiProperty({
    example: '123',
    description: 'User ID',
    required: false
  })
  userId?: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
    required: false
  })
  access_token?: string;

  constructor(message: string, userId?: string, access_token?: string) {
    this.message = message;
    this.userId = userId;
    this.access_token = access_token;
  }
}