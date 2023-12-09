import { Course, Topic, User, UserProgress } from '@prisma/client';
import { CreateTopicDto } from '../dto/create-topic.dto';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateValueCourse } from '../dto/update-course.dto';
import { CourseResponse } from '../dto/course-response.dto';
import { GetCourseUserDto } from '../dto/get-course-user.dto';
import { GetCourseBySlugDto } from '../dto/get-course-slug.dto';
import { UpdateStatusDto } from '../dto/update-status.dto';
import { DeleteCourseDto } from '../dto/delete-course.dto';
import { UpdatePictureCourse } from '../dto/update-picture.dto';
import { FilterCourseDto } from '../dto/filter-course-publish.dto';
import { GetDetailCourseDto } from '../dto/get-detail-course.dto';
import { GetProgressCourseDto } from '../dto/get-progress-course.dto';

export interface CourseServiceInterface {
    slugify(string, separator): string;
    findByTitleTopic(payload: string): Promise<Topic>;
    createTopic(payload: CreateTopicDto): Promise<Topic>;
    createCourse(payload: CreateCourseDto): Promise<Course>;
    findByNameCourse(payload: string): Promise<Course>;
    findAllTopic(): Promise<Topic[]>;
    updateCourse(payload: UpdateValueCourse): Promise<CourseResponse>;
    getAllCourse(payload: GetCourseUserDto): Promise<Course[]>;
    buildResponseCourse(payload: any): CourseResponse;
    getCourseBySlug(payload: GetCourseBySlugDto): Promise<Course>;
    updateStatusCourse(payload: UpdateStatusDto): Promise<CourseResponse>;
    deleteCourse(payload: DeleteCourseDto): Promise<string>;
    updatePictureCourse(payload: UpdatePictureCourse): Promise<CourseResponse>;
    getAllCoursePublish(payload: FilterCourseDto): Promise<Course[]>;
    filterCoursePublish(payload: FilterCourseDto): Promise<Course[]>;
    getDetailCourse(payload: GetDetailCourseDto): Promise<Course>;
    getUserProgressCourse(payload: GetProgressCourseDto): Promise<Course>;
    getDetailCourseAuth(payload: GetProgressCourseDto): Promise<Course>;
    getAllUserOfInstructor(payload: GetCourseUserDto): Promise<UserProgress[]>;
    getAllUserOfCourse(payload: GetProgressCourseDto): Promise<UserProgress[]>;
    countCourseOfUser(payload: GetCourseUserDto): Promise<number>;
    countUserOfInstructor(payload: GetCourseUserDto): Promise<number>;
    findUserByEmail(email: string): Promise<User>;
    getAllCourseAdmin(): Promise<Course[]>
}
