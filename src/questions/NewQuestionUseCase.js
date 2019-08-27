const Question = require('./Question');
const QUESTIONS = require('./question.json');

module.exports = class NewQuestionUseCase {
    constructor({questionRepository, classificationService}) {
        this.listener = questionRepository;
        this.classificationService = classificationService;
    }

    async init() {
        for (let question of QUESTIONS) {
            await this.createNewQuestion(question);
        }
    }

    async createNewQuestion({code, theme, body, question, answer, detailedAnswer}) {
        try {
            let questionByCode = await this.listener.getQuestionByCode(code);
            let isQuestionExists = questionByCode && questionByCode.length;
            if (isQuestionExists) {
                console.log('Question exists', questionByCode);
                return questionByCode;
            }

            let classification = await this.classificationService.classify({code, theme, body, question, answer, detailedAnswer});

            let _question = Question.builder()
                .code(code)
                .theme(theme)
                .body(body)
                .question(question)
                .answer(answer)
                .detailedAnswer(detailedAnswer)
                .classification(classification)
                .listener(this.listener)
                .build();

            console.log('Question was created', _question);
            return _question;
        } catch(e) {
            console.error('An error occurred', e);
            throw e;
        }
    }
}