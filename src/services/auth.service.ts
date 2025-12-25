// services/auth.service.ts
import { apiClient } from './api.config';
import type {
    RegisterFormDto,
    LoginFormDto,
    GoogleTokenFormDto,
    AppleTokenFormDto,
    RefreshTokenFormDto,
    ChangePasswordDto,
    UpdateProfileDto,
    AuthResultDto,
    CurrentUserDto,
} from '@/types/auth';

export const authService = {
    async register(data: RegisterFormDto): Promise<AuthResultDto> {
        const response = await apiClient.post('/auths/register', data);
        return response.data;
    },

    async login(data: LoginFormDto): Promise<AuthResultDto> {
        const response = await apiClient.post('/auths/login', data);
        return response.data;
    },

    async loginWithGoogle(data: GoogleTokenFormDto): Promise<AuthResultDto> {
        const response = await apiClient.post('/auths/google', data);
        return response.data;
    },

    async loginWithApple(data: AppleTokenFormDto): Promise<AuthResultDto> {
        const response = await apiClient.post('/auths/apple', data);
        return response.data;
    },

    async refreshToken(data: RefreshTokenFormDto): Promise<AuthResultDto> {
        const response = await apiClient.post('/auths/refresh-token', data);
        return response.data;
    },

    async getCurrentUser(): Promise<CurrentUserDto> {
        const response = await apiClient.get('/auths/me');
        return response.data;
    },

    async changePassword(data: ChangePasswordDto): Promise<void> {
        const response = await apiClient.put('/auths/change-password', data);
        return response.data;
    },

    async updateProfile(data: UpdateProfileDto): Promise<CurrentUserDto> {
        const response = await apiClient.put('/users/update-profile', data);
        return response.data;
    },
};
