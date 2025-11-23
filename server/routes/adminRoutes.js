//adminRoute.js
import { Router } from "express";
import authController from "../controllers/adminController.js";
import authRequired from "../auth/adminRequired.js";

const router = Router();

//ACCOUNTS CONTROLLER
//Manage all the "admin" accounts 
// getAdmin

// Add a new user - only SUPER ADMIN already in authController


// Update an user - only SUPER ADMIN (name, lastname, password, etc...)


// Get all the information about the user 


// Delete an user - only SUPER ADMIN


// ---------------------------------------------------------------

//USERS CONTROLLER 
//Manage all the "user" accounts - who take the test
// getUser

//Create an user 

//Update an user 


// Get all the information the user


// Delete an user 

export default router;
