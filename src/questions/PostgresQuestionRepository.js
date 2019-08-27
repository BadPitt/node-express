const TABLE_NAME = 'questions';
const SCHEMA = 'public';

module.exports = class PostgresQuestionRepository {
    constructor({ datasource }) {
        this.datasource = datasource;
    }

    init() {
        const CONDITION = `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='${SCHEMA}' AND table_name='${TABLE_NAME}');`;
        const START_SCRIPTS = [
            `create table ${SCHEMA}.${TABLE_NAME}(code varchar primary key, theme varchar, body varchar, question varchar, answer varchar, detailed_answer varchar, answer_categories varchar, text_categries varchar);`
        ];
        this.datasource
            .transaction((client) => {
                return client
                    .query(CONDITION)
                    .then(async result => {
                        //console.dir(result);
                        if (result && result.rows && result.rows[0] && !result.rows[0].exists) {
                            console.log('Questions don\'t exist');
                            for (let script of START_SCRIPTS) {
                                console.log(`Query is ${script}`);
                                await client
                                        .query(script)
                                        .catch((e) => {
                                            console.error(e);
                                        });
                            }
                        } else {
                            console.log('Questions already exist');
                        }
                    })
            })
            .catch((e) => {
                console.error(e);
            });
    }

    onCreate(questionObject) {
        const {_code:code, _theme:theme, _body:body, _question:question, _answer:answer, _detailedAnswer:detailedAnswer, _classification:classification} = questionObject;
        return this.datasource.query(
            `insert into ${SCHEMA}.${TABLE_NAME}(code, theme, body, question, answer, detailed_answer, answer_categories, text_categries) ` +
            `values('${code}', '${theme}', '${body}', '${question}', '${answer}', '${detailedAnswer}', '${classification.answerCategories}', '${classification.textCategories}');`
        );
    }

    getAllQuestions() {
        return this.datasource.query(`select * from ${SCHEMA}.${TABLE_NAME};`);
    }

    getQuestionByTheme(theme) { 
        return this.datasource.query(`select * from ${SCHEMA}.${TABLE_NAME} where theme='${theme}';`);
    }

    getQuestionByCode(code) { 
        return this.datasource.query(`select * from ${SCHEMA}.${TABLE_NAME} where code='${code}';`);
    }
}