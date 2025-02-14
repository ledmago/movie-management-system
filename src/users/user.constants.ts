export enum UserRole {
    MANAGER = 'manager',
    CUSTOMER = 'customer'
  }

  export const TOKEN_TTL = 3600; // 1 saat

  export interface RequestWithUser extends Request {
    user?: any;
  }