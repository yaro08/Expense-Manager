import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BadRequestException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should successfully register a user', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const mockUser = { id: 1, ...registerDto };

      mockAuthService.register.mockResolvedValue(mockUser);

      const result = await controller.register(registerDto);

      expect(result).toEqual({
        message: 'User registered successfully',
        userId: '1',
        access_token: undefined,
      });
      expect(authService.register).toHaveBeenCalledWith(
        registerDto.email,
        registerDto.password,
      );
    });

    it('should throw BadRequestException when registration fails', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockAuthService.register.mockRejectedValue(new Error('Registration failed'));

      await expect(controller.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('login', () => {
    it('should successfully login a user', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const mockLoginResponse = {
        access_token: 'jwt-token',
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(loginDto);

      expect(result).toEqual({
        message: 'Login successful',
        userId: undefined,
        access_token: 'jwt-token',
      });
      expect(authService.login).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
    });

    it('should throw BadRequestException when login fails', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockAuthService.login.mockRejectedValue(new Error('Login failed'));

      await expect(controller.login(loginDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});