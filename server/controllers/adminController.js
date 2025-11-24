//adminController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import profileModel from "../models/profileModel.js";
import familyModel from "../models/familyModel.js";
import testModel from "../models/testModel.js";

// =============== ADMIN ACCOUNTS ==================
// Manage all the admin accounts

async function getAdmins(req, res){

}

// To choose - either from userId or email
async function getSingleAdmin(req, res){

}

// To choose - either from userId or email
async function updateAdmin(req , res){

}

// To choose - either from userId or email
async function deleteAdmin(req, res){

}


// =============== USER ACCOUNTS ==================
// Manage all the test user accounts

//Get all the users - user.role = "USER"
async function getAllUsers(req, res){

}

async function getUser(req, res){

}

async function updateUser(req , res){

}

async function getProfile(req, res){

}

async function updateProfile(req, res){

}

async function getFamily(req, res){

}

async function updateFamily(req, res){

}

async function deleteFamily(req, res){

}

async function getTest(req, res){

}

async function gradeTest(req, res){

}


export default {
    getAdmins,
    getSingleAdmin,
    updateAdmin,
    deleteAdmin,
    getAllUsers,
    getUser,
    updateUser,
    getProfile,
    updateProfile,
    getFamily,
    updateFamily,
    deleteFamily,
    getTest,
    gradeTest
  };