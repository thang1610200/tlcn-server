import { User } from '@prisma/client';
import { Profile } from '../dtos/profile-user.dto';
import { ProfileResponse } from '../dtos/profile-user-response.dto';
import { UpdateProfile } from '../dtos/update-profile.dto';
import { UpdateAvatarDto } from '../dtos/update-avatar.dto';
import { UpdateRoleDto } from '../dtos/update-role.dto';
import { SetPasswordDto } from '../dtos/set-password.dto';
import { UpdatePasswordDto } from '../dtos/update-password.dto';

export interface UserServiceInterface {
    getProfileByEmail(payload: Profile): Promise<User>;
    buildResponse(data: User): ProfileResponse;
    updateProfile(payload: UpdateProfile): Promise<ProfileResponse>;
    findByEmail(email: string): Promise<User>;
    updateAvatar(payload: UpdateAvatarDto): Promise<object>;
    registerInstructor(payload: Profile): Promise<ProfileResponse>;
    getAllUser(): Promise<User[]>;
    updateRole(payload: UpdateRoleDto): Promise<string>;
    deleteUser(payload: Profile): Promise<string>;
    setPassword(payload: SetPasswordDto): Promise<ProfileResponse>;
    hashPassword(password: string): Promise<string>;
    updatePassword(payload: UpdatePasswordDto): Promise<ProfileResponse>;
    compare(email: string, currentPassword: string): Promise<string>;
}
