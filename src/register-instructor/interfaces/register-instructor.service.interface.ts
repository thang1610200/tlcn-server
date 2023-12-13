import { RegisterInstructor, User } from "@prisma/client";
import { RegisterInstructorInterface } from "../dto/register-instructor.dto";

export interface RegisterInstructorServiceInterface {
    findUserByEmail(email: string): Promise<User>;
    addRegisterInstructor(payload: RegisterInstructorInterface): Promise<string>;
    findAll(): Promise<RegisterInstructor[]>;
}