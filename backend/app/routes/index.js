const Router = require('express').Router;
const userController = require('../controllers/userController')();
module.exports = Router({mergeParams: true})
	.post("/company/user/", async (req, res ,next) => userController.addUser(req, res, next))
	.get("/company/:name/users/", (req, res) => userController.getUsers(req, res))
	.put("/company/user/", (req, res) => userController.editUser(req, res))
	.delete("/company/user/", (req, res) => userController.removeUser(req, res));
