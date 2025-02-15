import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    login: jest.fn(),
    register: jest.fn(),
    verifyUserByToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call usersService.login with correct parameters', async () => {
      const loginDto = {
        username: 'testuser',
        password: 'password123',
      };

      await controller.login(loginDto);
      expect(usersService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('register', () => {
    it('should call usersService.register with correct parameters', async () => {
      const registerDto = {
        username: 'newuser',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        age: 25,
      };

      await controller.register(registerDto);
      expect(usersService.register).toHaveBeenCalledWith(registerDto);
    });
  });
});
