const assert = require('assert');

module.exports = class User {
    constructor() {
        this._name = undefined;
        this._surname = undefined;
        this._login = undefined;
        this._password = undefined;
    }


    static builder() {
        return {
            _user: new User(),
            name(name) {
                this._user._name = name;
                return this;
            },
            surname(surname) {
                this._user._surname = surname;
                return this;
            },
            login(login) {
                this._user._login = login;
                return this;
            },
            password(password) {
                this._user._password = password;
                return this;
            },
            listener(listener) {
                this._user._listener = listener;
                return this;
            },
            build() {
                assert.notDeepEqual(null, this._user._name);
                assert.notDeepEqual(null, this._user._surname);
                assert.notDeepEqual(null, this._user._login);
                assert.notDeepEqual(null, this._user._password);
                assert.notDeepEqual(null, this._user._listener);

                this._user._listener.onCreate(this._user);

                return this._user;
            }
        }
    }
}