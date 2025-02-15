import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/redis/redis.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let jwtService: JwtService;
  let redisService: RedisService;

  const mockJwtService = {
    sign: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const mockRedisService = {
    setWithTtl: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: RedisService, useValue: mockRedisService },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
    jwtService = module.get<JwtService>(JwtService);
    redisService = module.get<RedisService>(RedisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateToken', () => {
    it('should generate access and refresh tokens', () => {
      const user = {
        _id: 'user123',
        username: 'testuser',
      };

      mockJwtService.sign
        .mockReturnValueOnce('mock-access-token')
        .mockReturnValueOnce('mock-refresh-token');

      const result = service.generateToken({ user });

      expect(result).toEqual({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      });

      expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
      expect(mockJwtService.sign).toHaveBeenNthCalledWith(
        1,
        { id: user._id, username: user.username },
        { expiresIn: '30m' },
      );
      expect(mockJwtService.sign).toHaveBeenNthCalledWith(
        2,
        { id: user._id, username: user.username },
        { expiresIn: '3d' },
      );
    });
  });

  describe('storeTokenInRedis', () => {
    it('should store token in Redis with TTL', async () => {
      const tokenKey = 'token123';
      const userId = 'user123';
      const ttl = 1800;

      await service.storeTokenInRedis(tokenKey, userId, ttl);

      expect(mockRedisService.setWithTtl).toHaveBeenCalledWith(
        tokenKey,
        userId,
        ttl,
      );
    });
  });

  describe('verifyAsync', () => {
    it('should verify JWT token and return payload', async () => {
      const token = 'valid-token';
      const payload = {
        id: 'user123',
        username: 'testuser',
      };

      mockJwtService.verifyAsync.mockResolvedValue(payload);

      const result = await service.verifyAsync(token);

      expect(result).toEqual(payload);
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(token);
    });

    it('should throw error for invalid token', async () => {
      const token = 'invalid-token';
      mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

      await expect(service.verifyAsync(token)).rejects.toThrow('Invalid token');
    });
  });
});
