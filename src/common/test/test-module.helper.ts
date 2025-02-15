import { ModuleMetadata, Type } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

export interface MockProviders {
  [key: string]: any;
}

export async function createTestingModule<T>(
  targetClass: Type<T>,
  mockProviders: MockProviders,
): Promise<{
  module: TestingModule;
  instance: T;
  mocks: MockProviders;
}> {
  const providers = Object.entries(mockProviders).map(([key, value]) => ({
    provide: key,
    useValue: value,
  }));

  const moduleMetadata: ModuleMetadata = {
    controllers: [targetClass],
    providers: [...providers],
  };

  const module = await Test.createTestingModule(moduleMetadata).compile();
  const instance = module.get<T>(targetClass);

  return {
    module,
    instance,
    mocks: mockProviders,
  };
}