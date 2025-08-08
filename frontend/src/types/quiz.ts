export type QuestionType = 'boolean' | 'input' | 'checkbox';

export interface Question {
  id?: string;
  type: QuestionType;
  text: string;
  options?: string[];
  correctAnswer: boolean | string | string[];
}

export interface Quiz {
  id?: string;
  title: string;
  questions: Question[];
}

export type BackendQuestion = {
  type: string; 
  text: string;
  options?: string[];
  answer: string | boolean | string[];
};

export type BackendQuiz = {
  id?: string;
  title: string;
  questions: {
    type: string; 
    text: string;
    options?: string[];
    answer: string | boolean | string[];
  }[];
};
