import { GetDetailCodeDto } from "src/code/dto/code.dto";
import { EvaluateCode, PreviewCodeDto } from "../dto/evaluate.dto";
import { Code } from "@prisma/client";

export interface EvaluateServiceInterface {
    evaluateFunction(payload: EvaluateCode): Promise<boolean>; 
    previewCode(payload: PreviewCodeDto): Promise<boolean>;
    getDetailCode(payload: GetDetailCodeDto): Promise<Code>;
}