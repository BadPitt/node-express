module.exports = class QuestionsController {

    constructor({ newQuestionUseCase, questionRepository }) {
        this.newQuestionUseCase = newQuestionUseCase;
        this.questionRepository = questionRepository;
    }

    getAllQuestions(req, res) {
        return this.questionRepository.getAllQuestions()
                .then((result) => {
                    console.log(result);
                    res.json(result);
                    res.end();
                })
                .catch(error => {
                    console.error(error);
                    res.end();
                });
    }

    getQuestionByTheme(req, res) {
        return this.questionRepository.getQuestionByTheme(req.params.theme)
                .then((result) => {
                    res.json(result);
                    res.end();
                })
                .catch(error => {
                    console.error(error);
                    res.end();
                });
    }

    createNewQuestion(req, res) {
        let question = req.body;

        console.log(question);
        return this.newQuestionUseCase.createNewQuestion(question)
                .then(() => res.json({success: true}))
                .catch(error => {
                    console.error(error);
                    res.end();
                });
    }
};