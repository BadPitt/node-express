const assert = require('assert');

module.exports = class Qestion {
    constructor() {
        this._code = undefined;
        this._theme = undefined;
        this._body = undefined;
        this._question = undefined;
        this._answer = undefined;
        this._detailedAnswer = undefined;
        this._classification = undefined;
    }

    static builder() {
        return {
            _question: new Qestion(),
            code(code) {
                this._question._code = code;
                return this;
            },
            theme(theme) {
                this._question._theme = theme;
                return this;
            },
            body(body) {
                this._question._body = body;
                return this;
            },
            question(question) {
                this._question._question = question;
                return this;
            },
            answer(answer) {
                this._question._answer = answer;
                return this;
            },
            detailedAnswer(detailedAnswer) {
                this._question._detailedAnswer = detailedAnswer;
                return this;
            },
            classification(classification) {
                this._question._classification = classification;
                return this;
            },
            listener(listener) {
                this._question._listener = listener;
                return this;
            },
            build() {
                assert.notDeepEqual(null, this._question._code);
                assert.notDeepEqual(null, this._question._theme);
                assert.notDeepEqual(null, this._question._body);
                assert.notDeepEqual(null, this._question._question);
                assert.notDeepEqual(null, this._question._answer);
                assert.notDeepEqual(null, this._question._detailedAnswer);
                assert.notDeepEqual(null, this._question._classification);
                assert.notDeepEqual(null, this._question._listener);

                this._question._listener.onCreate(this._question);

                return this._question;
            }
        }
    }
}