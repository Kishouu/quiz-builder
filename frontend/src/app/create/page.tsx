'use client';

import { useState } from 'react';
import { createQuiz } from '@/services/api';
import { QuestionType, Question, BackendQuestion } from '@/types/quiz';

const FRONTEND_TO_BACKEND_TYPE_MAP: Record<QuestionType, BackendQuestion['type']> = {
  boolean: 'BOOLEAN',
  input: 'INPUT',
  checkbox: 'CHECKBOX',
};

export default function CreateQuizPage() {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);

  const addQuestion = () => {
    setQuestions((qs) => [
      ...qs,
      {
        id: Date.now().toString(),
        type: 'boolean',
        text: '',
        correctAnswer: false,
        options: [],
      },
    ]);
  };

  const updateQuestion = (index: number, updatedQuestion: Partial<Question>) => {
    setQuestions((qs) => {
      const newQs = [...qs];
      newQs[index] = { ...newQs[index], ...updatedQuestion };
      return newQs;
    });
  };

  const removeQuestion = (index: number) => {
    setQuestions((qs) => qs.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Quiz title is required');
      return;
    }

    if (questions.length === 0) {
      alert('Please add at least one question');
      return;
    }

    try {
      const formattedQuestions: BackendQuestion[] = questions.map((q) => ({
        type: FRONTEND_TO_BACKEND_TYPE_MAP[q.type],
        text: q.text,
        options: q.options && q.options.length > 0 ? q.options : undefined,
        answer: q.correctAnswer,
      }));

      await createQuiz({ title, questions: formattedQuestions });
      alert('Quiz created!');
      setTitle('');
      setQuestions([]);
    } catch (err) {
      alert('Failed to create quiz');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-2xl mx-auto space-y-6">
      <div>
        <label className="block font-bold mb-1">Quiz Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full"
          required
        />
      </div>

      <div>
        <h2 className="font-bold mb-2">Questions</h2>
        {questions.map((q, i) => (
          <QuestionEditor
            key={q.id}
            question={q}
            onChange={(upd) => updateQuestion(i, upd)}
            onRemove={() => removeQuestion(i)}
          />
        ))}

        <button
          type="button"
          onClick={addQuestion}
          className="mt-3 px-3 py-1 bg-blue-600 text-white rounded"
        >
          Add Question
        </button>
      </div>

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Create Quiz
      </button>
    </form>
  );
}

function QuestionEditor({
  question,
  onChange,
  onRemove,
}: {
  question: Question;
  onChange: (update: Partial<Question>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="border p-3 mb-4 rounded relative">
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-2 right-2 text-red-600 font-bold"
      >
        Remove
      </button>

      <div>
        <label className="block mb-1">Question Text</label>
        <input
          type="text"
          value={question.text}
          onChange={(e) => onChange({ text: e.target.value })}
          className="border p-1 w-full"
          required
        />
      </div>

      <div className="mt-2">
        <label>Question Type</label>
        <select
          value={question.type}
          onChange={(e) => {
            const newType = e.target.value as QuestionType;
            onChange({
              type: newType,
              options: newType === 'checkbox' ? [] : undefined,
              correctAnswer:
                newType === 'boolean' ? false : newType === 'input' ? '' : [],
            });
          }}
          className="border p-1"
        >
          <option value="boolean">Boolean (True/False)</option>
          <option value="input">Input (Short text)</option>
          <option value="checkbox">Checkbox (Multiple choice)</option>
        </select>
      </div>

      {question.type === 'checkbox' && (
        <CheckboxQuestionEditor question={question} onChange={onChange} />
      )}

      {question.type === 'boolean' && (
        <BooleanQuestionEditor question={question} onChange={onChange} />
      )}

      {question.type === 'input' && (
        <InputQuestionEditor question={question} onChange={onChange} />
      )}
    </div>
  );
}

function BooleanQuestionEditor({
  question,
  onChange,
}: {
  question: Question;
  onChange: (update: Partial<Question>) => void;
}) {
  return (
    <div className="mt-2">
      <label>Correct Answer</label>
      <div>
        <label>
          <input
            type="radio"
            checked={question.correctAnswer === true}
            onChange={() => onChange({ correctAnswer: true })}
          />{' '}
          True
        </label>
        <label className="ml-4">
          <input
            type="radio"
            checked={question.correctAnswer === false}
            onChange={() => onChange({ correctAnswer: false })}
          />{' '}
          False
        </label>
      </div>
    </div>
  );
}

function InputQuestionEditor({
  question,
  onChange,
}: {
  question: Question;
  onChange: (update: Partial<Question>) => void;
}) {
  return (
    <div className="mt-2">
      <label>Correct Answer (short text)</label>
      <input
        type="text"
        value={typeof question.correctAnswer === 'string' ? question.correctAnswer : ''}
        onChange={(e) => onChange({ correctAnswer: e.target.value })}
        className="border p-1 w-full"
      />
    </div>
  );
}

function CheckboxQuestionEditor({
  question,
  onChange,
}: {
  question: Question;
  onChange: (update: Partial<Question>) => void;
}) {
  const options = question.options || [];
  const correctAnswers = Array.isArray(question.correctAnswer) ? question.correctAnswer : [];

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    onChange({ options: newOptions });
  };

  const addOption = () => {
    onChange({ options: [...options, ''] });
  };

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    const removedOption = options[index];
    const newCorrectAnswers = correctAnswers.filter((ans) => ans !== removedOption);
    onChange({ options: newOptions, correctAnswer: newCorrectAnswers });
  };

  const toggleCorrectAnswer = (option: string) => {
    let newCorrectAnswers = [...correctAnswers];
    if (newCorrectAnswers.includes(option)) {
      newCorrectAnswers = newCorrectAnswers.filter((o) => o !== option);
    } else {
      newCorrectAnswers.push(option);
    }
    onChange({ correctAnswer: newCorrectAnswers });
  };

  return (
    <div className="mt-2">
      <label>Options</label>
      {options.map((opt, i) => (
        <div key={i} className="flex items-center mb-1">
          <input
            type="text"
            value={opt}
            onChange={(e) => updateOption(i, e.target.value)}
            className="border p-1 flex-grow"
          />
          <input
            type="checkbox"
            checked={correctAnswers.includes(opt)}
            onChange={() => toggleCorrectAnswer(opt)}
            className="ml-2"
          />
          <button
            type="button"
            onClick={() => removeOption(i)}
            className="ml-2 text-red-600"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addOption}
        className="mt-1 px-3 py-1 bg-gray-300 rounded"
      >
        Add Option
      </button>
    </div>
  );
}
