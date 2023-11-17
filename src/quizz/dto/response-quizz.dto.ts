export interface QuizzResponse {
    token: string;
    question: string;
    answer: string;
    option: string[];
    position: number;
    isPublished: boolean;
    explain: string;
}