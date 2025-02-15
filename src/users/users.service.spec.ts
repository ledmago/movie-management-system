import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { UsersRepository } from './users.repository';
import { UserRole } from './user.constants';
import * as bcrypt from 'bcrypt';
import { UserFormatter } from './user.formatter';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.schema';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;
  let authenticationService: AuthenticationService;
  let usersRepository: UsersRepository;
  let userModel: Model<User>;

  const mockAuthenticationService = {
    generateToken: jest.fn().mockReturnValue({
      accessToken: 'test-access-token',
      refreshToken: 'test-refresh-token',
    }),
    verifyAsync: jest.fn().mockResolvedValue({ id: '1' }),
  };

  const mockUsersRepository = {
    findByUsername: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
  };

  const mockUserModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: AuthenticationService,
          useValue: mockAuthenticationService,
        },
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    authenticationService = module.get<AuthenticationService>(AuthenticationService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    userModel = module.get<Model<User>>(getModelToken(User.name));

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    const loginDto = {
      username: 'testuser',
      password: 'password123',
    };

    const mockUser = {
      id: '1',
      username: 'testuser',
      hash: 'hashedpassword',
      isActive: true,
      firstName: 'Test',
      lastName: 'User',
      role: UserRole.CUSTOMER,
    };

    beforeEach(() => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    });

    it('should successfully login user', async () => {
      mockUsersRepository.findByUsername.mockResolvedValue(mockUser);

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('user');
      expect(mockUsersRepository.findByUsername).toHaveBeenCalledWith({
        username: loginDto.username,
      });
    });

    it('should throw error when user not found', async () => {
      mockUsersRepository.findByUsername.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow();
    });

    it('should throw error when user is inactive', async () => {
      mockUsersRepository.findByUsername.mockResolvedValue({
        ...mockUser,
        isActive: false,
      });

      await expect(service.login(loginDto)).rejects.toThrow();
    });
  });

  describe('register', () => {
    const registerDto = {
      username: 'newuser',
      password: 'password123',
      firstName: 'New',
      lastName: 'User',
      age: 25,
    };

    beforeEach(() => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
    });

    it('should successfully register new user', async () => {
      mockUsersRepository.findByUsername.mockResolvedValue(null);
      mockUsersRepository.create.mockResolvedValue({
        id: '1',
        ...registerDto,
        hash: 'hashedpassword',
        isActive: true,
        role: UserRole.CUSTOMER,
      });

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('user');
      expect(mockUsersRepository.create).toHaveBeenCalled();
    });

    it('should throw error when username already exists', async () => {
      mockUsersRepository.findByUsername.mockResolvedValue({ id: '1' });

      await expect(service.register(registerDto)).rejects.toThrow();
    });
  });

  describe('verifyUserByToken', () => {
    const mockToken = 'valid-token';
    const mockUser = {
      id: '1',
      username: 'testuser',
      isActive: true,
    };

    it('should successfully verify user token', async () => {
      mockUsersRepository.findById.mockResolvedValue(mockUser);

      const result = await service.verifyUserByToken(mockToken);

      expect(result).toEqual(mockUser);
      expect(mockUsersRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should throw error when user not found', async () => {
      mockUsersRepository.findById.mockResolvedValue(null);

      await expect(service.verifyUserByToken(mockToken)).rejects.toThrow();
    });

    it('should throw error when user is inactive', async () => {
      mockUsersRepository.findById.mockResolvedValue({
        ...mockUser,
        isActive: false,
      });

      await expect(service.verifyUserByToken(mockToken)).rejects.toThrow();
    });
  });
});
