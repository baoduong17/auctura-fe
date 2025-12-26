export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    fullName?: string;
    picture?: string;
    avatarId: string | null;
    gender?: 'MALE' | 'FEMALE';
    role: 'USER' | 'ADMIN';
    birthday?: string;
    phoneNumber?: string;
    createdAt?: string;
    updatedAt?: string;
}

export type UserRole = 'USER' | 'ADMIN';
export type Gender = 'MALE' | 'FEMALE';

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType?: string;
    refreshExpiresIn?: number;
    scope?: string;
    sessionState?: string;
}

export interface AuthState {
    user: User | null;
    tokens: AuthTokens | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface RegisterFormDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    birthday?: string;
    gender?: Gender;
}

export interface LoginFormDto {
    email: string;
    password: string;
}

export interface GoogleTokenFormDto {
    idToken: string;
}

export interface AppleTokenFormDto {
    identityToken: string;
    authorizationCode: string;
}

export interface RefreshTokenFormDto {
    refreshToken: string;
}

export interface ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export interface UpdateProfileDto {
    firstName?: string;
    lastName?: string;
    avatarId?: string | null;
    birthday?: string;
    gender?: Gender;
    phoneNumber?: string;
}

export interface AuthResultDto {
    token: {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        tokenType: string;
        refreshExpiresIn: number;
        scope: string;
        sessionState: string;
    };
    user: User;
}

export interface CurrentUserDto extends User { }
