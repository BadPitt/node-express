const awilix = require('awilix');
const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY
});
container.register({
    userController: awilix.asClass(require('./users/UserController')).singleton(),
    questionController: awilix.asClass(require('./questions/QuestionsController')).singleton(),

    userService: awilix.asClass(require('./users/UserService')).singleton(),
    newQuestionUseCase: awilix.asClass(require('./questions/NewQuestionUseCase')).singleton(),
});

container.register({
    classificationService: awilix.asClass(require('./classification/ClassificationService')).singleton()
});

/**
 * Postgres DB
 */
const { Pool } = require('pg');
const Config = require('./Config');
if (Config.db.DB === 'postgresql') {
    container.register({
        userRepository: awilix.asClass(require('./users/PostgresUserRepository')).singleton(),
        questionRepository: awilix.asClass(require('./questions/PostgresQuestionRepository')).singleton(),
        datasource: awilix.asClass(require('./db/Datasource'))
            .disposer(datasource => datasource.close())
            .singleton(),
        pool: awilix.asFunction(() => {
                return new Pool({
                    user: Config.db.DB_USER,
                    password: Config.db.DB_PASSWORD,
                    host: Config.db.DB_HOST,
                    port: Config.db.DB_PORT,
                    database: Config.db.DB_NAME,

                    max: 10,
                    min: 10,
                    connectionTimeoutMillis: Config.db.DB_CONNECT_TIMEOUT,
                    idleTimeoutMillis: Config.db.DB_IDLE_TIMEOUT,
                });
            })
            .disposer(datasource => datasource.close())
            .singleton(),

        // connectionString: awilix.asValue(CONN_STR),
        // timeout: awilix.asValue(TIMEOUT)
    });
}

for (let beanName in container.cradle) {
    let bean = container.cradle[beanName];
    if (bean && bean.init && typeof bean.init === 'function') {
        console.log(`Initialization of ${beanName}`);
        bean.init();
    }
}


module.exports = container;