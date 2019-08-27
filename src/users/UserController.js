module.exports = class UserController {

    constructor({ userService }) {
        this.userService = userService;
    }

    getAllUsers(req, res) {
        return this.userService.getAllUsers()
                .then((result) => {
                    res.json(result);
                    res.end();
                })
                .catch(error => {
                    console.error(error);
                    res.end();
                });
    }

    getUser(req, res) {
        return this.userService.getUser(req.params.login)
                .then((result) => {
                    res.json(result);
                    res.end();
                })
                .catch(error => {
                    console.error(error);
                    res.end();
                });
    }

    createUser(req, res) {
        let userDto = req.body;

        console.log(userDto);
        return this.userService.createUser(userDto)
                .then(() => res.json({success: true}))
                .catch(error => {
                    console.error(error);
                    res.end();
                });
    }
};