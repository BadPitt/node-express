module.exports = function() {
    const Config = require('./Config');
    const DIContainer = require('./DIContainer');
    const express = require('express');
    const cors = require('cors');
    const http = require('http');
    const morgan = require('morgan');

    const app = express();
    const server = http.createServer(app);

    const env = app.get('env');
    console.log(env);


    /**
     * Middleware
     */
    app.use(cors()); // TODO: debug condition
    app.use(morgan('dev', {immediate: true, stream: process.stdout}));
    app.use(express.json());
    app.use(express.static('front/build'));


    /**
     * Controllers
     */
    const userController = DIContainer.cradle.userController;
    app.get('/user/:login', (req, res) => userController.getUser(req, res));
    app.get('/user/', (req, res) => userController.getAllUsers(req, res));
    app.post('/user/', (req, res) => userController.createUser(req, res));

    const questionController = DIContainer.cradle.questionController;
    app.get('/question/:theme', (req, res) => questionController.getQuestionByTheme(req, res));
    app.get('/question-all', (req, res) => questionController.getAllQuestions(req, res));
    app.post('/question/', (req, res) => questionController.createNewQuestion(req, res));

    /**
     * Run
     */
    app.addListener("close", async () => {
        await DIContainer.dispose()
            .then(() => {
                console.log('All dependencies disposed, you can exit now')
            })
            .catch((e) => console.error(e));
    });
    const port = Config.webServer.APP_PORT;
    server.listen(port, () => console.log(`Application listening at port ${port}`));
}