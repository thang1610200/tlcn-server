export interface OutputFormatTF {
    question: string;
    answer: string;
    explain?: string;
}

export interface OutputFormatMC extends OutputFormatTF {
    option1?: string;
    option2?: string;
    option3?: string;
}
