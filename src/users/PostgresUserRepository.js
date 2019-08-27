const TABLE_NAME = 'users';
const SCHEMA = 'public';

module.exports = class PostgresUserRepository {
    constructor({ datasource }) {
        this.datasource = datasource;
    }

    init() {
        const CONDITION = `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='${SCHEMA}' AND table_name='${TABLE_NAME}');`;
        const START_SCRIPTS = [
            `create table ${SCHEMA}.${TABLE_NAME}(login varchar, password varchar, name varchar, surname varchar);`,
            `insert into ${SCHEMA}.${TABLE_NAME}(login, password, name, surname) values('user', '@dm1n', 'Adam', 'Black');`
        ];
        this.datasource
            .transaction((client) => {
                return client
                    .query(CONDITION)
                    .then(async result => {
                        //console.dir(result);
                        if (result && result.rows && result.rows[0] && !result.rows[0].exists) {
                            console.log('Data does not exist');
                            for (let script of START_SCRIPTS) {
                                console.log(`Query is ${script}`);
                                await client
                                        .query(script)
                                        .catch((e) => {
                                            console.error(e);
                                        });
                            }
                        } else {
                            console.log('Data already exists');
                        }
                    })
            })
            .catch((e) => {
                console.error(e);
            });
    }

    onCreate(user) {
        const {_login:login, _password:password, _name:name, _surname:surname} = user;
        return this.datasource.query(`insert into ${SCHEMA}.${TABLE_NAME}(login, password, name, surname) values('${login}', '${password}', '${name}', '${surname}');`);
    }

    getAllUsers() {
        return this.datasource.query(`select * from ${SCHEMA}.${TABLE_NAME};`);
    }

    getUser(login) { 
        return this.datasource.query(`select * from ${SCHEMA}.${TABLE_NAME} where login='${login}';`);
    }
}