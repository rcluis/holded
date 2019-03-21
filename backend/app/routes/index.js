const Router = require('express').Router;
const userController = require('../controllers/userController')();
module.exports = Router({mergeParams: true})
	.post("/company/user/", async (req, res ,next) => userController.addUser(req, res, next))
	.get("/company/:id/users/", async (req, res, next) => userController.getUsers(req, res, next))
	.put("/company/user/", async (req, res, next) => userController.editUser(req, res, next))
	.delete("/company/user/", async (req, res, next) => userController.removeUser(req, res, next));
