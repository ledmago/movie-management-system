import { User, UserDocument } from './users.schema';

export type FormattedUser = Omit<User, 'hash'>
export class UserFormatter {
    static formatUser({ hash, ...user}: UserDocument): FormattedUser {
        return user
    }
}