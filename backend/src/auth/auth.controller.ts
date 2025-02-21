import { Controller, Post, Body, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LoginDto, RegisterDto, AuthResponse } from './dto/auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto, description: 'User registration credentials' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: AuthResponse
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
    schema: {
      example: {
        message: 'Password must be at least 8 characters long',
        error: 'Bad Request',
        statusCode: 400
      }
    }
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Email already exists',
    schema: {
      example: {
        message: 'Email already exists',
        error: 'Conflict',
        statusCode: 409
      }
    }
  })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponse> {
    try {
      const user = await this.authService.register(registerDto.email, registerDto.password);
      return new AuthResponse(
        'User registered successfully',
        user.id.toString(),
      );
    } catch (error: any) {
      throw new BadRequestException(error?.message || 'Registration failed');
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto, description: 'User login credentials' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    type: AuthResponse
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid credentials',
    schema: {
      example: {
        message: 'Invalid credentials',
        error: 'Unauthorized',
        statusCode: 401
      }
    }
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    try {
      const result = await this.authService.login(loginDto.email, loginDto.password);
      return new AuthResponse(
        'Login successful',
        undefined,
        result.access_token
      );
    } catch (error: any) {
      throw new BadRequestException(error?.message || 'Login failed');
    }
  }
}