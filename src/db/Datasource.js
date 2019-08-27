module.exports = class Datasource {
    constructor({ pool }) {
        this.pool = pool;
    }

    transaction(func) {
        return this.pool.connect()
            .then(async client => {
                    await client.query('BEGIN');

                    try {
                        await func(client);

                        await client.query('COMMIT');
                    } catch (e) {
                        await client.query('ROLLBACK');
                        throw e;
                    }
                }
            )
            .catch(e => {
                console.error(e);
            });
    }

    query(sql) {
        return this.pool.connect()
            .then(client => client.query(sql)
                .then(res => {
                    console.log(res);
                    client.release();
                    return res.rows;
                })
                .catch(e => {
                    client.release();
                    console.error(e.stack);
                })
            );
    }

    close() {
        return this.pool.end();
    }
};