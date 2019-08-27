const User = require('./User');

module.exports = class UserService {
    constructor({ userRepository }) {
        this.repository = userRepository;
    }

    getAllUsers() { 
        return this.repository.getAllUsers();
    }

    getUser(login) { 
        return this.repository.getUser(login);
    }
    
    createUser(userDto) {
        return Promise.resolve()
            .then(() => User.builder()
                .name(userDto.name)
                .surname(userDto.surname)
                .login(userDto.login)
                .password(userDto.password)
                .listener(this.repository)
                .build()
            );
    }
}