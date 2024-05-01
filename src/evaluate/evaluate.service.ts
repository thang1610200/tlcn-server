import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ExecException, exec } from 'child_process';
import { EvaluateServiceInterface } from './interfaces/evaluate.service.interface';
import { EvaluateCode, PreviewCodeDto } from './dto/evaluate.dto';
import { join } from "path";
import * as fs from 'fs';
import { v4 } from 'uuid'
import { QuizzService } from 'src/quizz/quizz.service';
import { PrismaService } from 'src/prisma.service';
import { GetDetailCodeDto } from 'src/code/dto/code.dto';
import { Code, Exercise, FileCode, FileTest, LabCode } from '@prisma/client';

@Injectable()
export class EvaluateService implements EvaluateServiceInterface {
    constructor(private readonly quizService: QuizzService,
                private readonly prismaService: PrismaService
    ) {}
    
    async previewCode(payload: PreviewCodeDto): Promise<boolean> {
        const code = await this.getDetailCode(payload);

        const codeFile: {
            codeFile: string;
            codeFileName: string;
        }[] = code.file.map((item, index) => {
            return {
                codeFileName: `${item.fileName}.${item.mime}`,
                codeFile: payload.codeFile[index]
            }
        });

        try {
            const data: EvaluateCode = {
                lang: code.labCode.lab,
                testFile: btoa(code.fileTest.content),
                testFileName: `${code.fileTest.fileName}.${code.fileTest.mime}`,
                code: codeFile
            }

            return await this.evaluateFunction(data);
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async evaluateFunction(payload: EvaluateCode): Promise<boolean> {
        const folder = v4();
        const directoryPath = join(
            __dirname,
            "..",
            "/evaluate",
            `/${folder}`
        );

        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
        }

        //let codeFileName;
        //let testFileName;
        let dockerCommand;
        let result: boolean;

        switch(payload.lang) {
            case "Php": 
                fs.writeFileSync(join(directoryPath, payload.testFileName), atob(payload.testFile), 'utf-8');
                payload.code.forEach((item) => {
                    fs.writeFileSync(join(directoryPath, item.codeFileName), atob(item.codeFile), 'utf-8');
                });

                dockerCommand = `docker run --rm -i --network none -v ${directoryPath}:/code -w /code tlcn-server-coderunner_php /bin/bash -c "phpunit ${payload.testFileName}"`;

                let execEvaluatePhp = new Promise((resolve, reject) => {
                    exec(dockerCommand, (err: ExecException, stdout: string, stderr: string) => {
                        if(err) {
                            reject(err);
                        }

                        resolve(stdout);
                    });
                });

                try {
                    await execEvaluatePhp;
                    result = true;
                }
                catch(err) {
                    result = false;
                }

                fs.rmSync(directoryPath, {
                    recursive: true,
                    force: true
                });
                break;
            case 'Python':
                fs.writeFileSync(join(directoryPath, payload.testFileName), atob(payload.testFile), 'utf-8');
                payload.code.forEach((item) => {
                    fs.writeFileSync(join(directoryPath, item.codeFileName), atob(item.codeFile), 'utf-8');
                });

                dockerCommand = `docker run --rm -i --network none -v ${directoryPath}:/code -w /code tlcn-server-coderunner_python /bin/bash -c "python3 -m unittest ${payload.testFileName}"`;

                let execEvaluatePython = new Promise((resolve, reject) => {
                    exec(dockerCommand, (err: ExecException, stdout: string, stderr: string) => {
                        if(err) {
                            reject(err);
                        }

                        resolve(stdout);
                    });
                });

                try {
                    await execEvaluatePython;
                    result = true;
                }
                catch(err) {
                    result = false;
                }

                fs.rmSync(directoryPath, {
                    recursive: true,
                    force: true
                });
                break;
            case 'Java':
                let fileArray = [];
                fs.writeFileSync(join(directoryPath, payload.testFileName), atob(payload.testFile), 'utf-8');
                payload.code.forEach((item) => {
                    fs.writeFileSync(join(directoryPath, item.codeFileName), atob(item.codeFile), 'utf-8');

                    fileArray.push(item.codeFileName);
                });

                dockerCommand = `docker run --rm -i --network none -v ${directoryPath}:/code -w /code tlcn-server-coderunner_java /bin/bash -c "javac -cp $CLASSPATH:. ${payload.testFileName} ${fileArray.join(" ")} && java -cp $CLASSPATH:. junit.textui.TestRunner ${payload.testFileName}"`;

                let execEvaluateJava = new Promise((resolve, reject) => {
                    exec(dockerCommand, (err: ExecException, stdout: string, stderr: string) => {
                        if(err) {
                            reject(err);
                        }
                        resolve(stdout);
                    });
                });

                try {
                    await execEvaluateJava;
                    result = true;
                }
                catch(err) {
                    result = false;
                }

                fs.rmSync(directoryPath, {
                    recursive: true,
                    force: true
                });
                break;
        }

        return result;
    }

    async getDetailCode(payload: GetDetailCodeDto): Promise<Code & {file: FileCode[]; fileTest: FileTest, labCode: LabCode, exercise: Exercise}> {
        const user = await this.quizService.findUserByEmail(payload.email);
        const course = await this.quizService.findCourseBySlug(payload.course_slug, user.id);
        const chapter = await this.quizService.findChapterByToken(payload.chapter_token, course.id);
        const exercise = await this.quizService.findExcersie(chapter.id, payload.exercise_token);

        try {
            const code = await this.prismaService.code.findFirst({
                where: {
                    exerciseId: exercise.id,
                    token: payload.code_token
                },
                include: {
                    labCode: true,
                    file: true,
                    fileTest: true,
                    exercise: true
                }
            });
            
            if(!code) {
                throw new NotFoundException();
            }

            return code;
        }
        catch {
            throw new InternalServerErrorException();
        }
    }
}
