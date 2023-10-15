import { User } from "@prisma/client";
import { Profile } from "../dtos/profile-user.dto";
import { ProfileResponse } from "../dtos/profile-user-response.dto";
import { UpdateProfile } from "../dtos/update-profile.dto";


export interface UserServiceInterface {
    getProfileByEmail(payload: Profile): Promise<ProfileResponse>;
    buildResponse(data: User): ProfileResponse;
    updateProfile(payload: UpdateProfile): Promise<ProfileResponse>;
    findByEmail(email: string): Promise<User>;
}