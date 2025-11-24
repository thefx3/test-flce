//adminController.js
import userModel from "../models/userModel.js";
import profileModel from "../models/profileModel.js";
import familyModel from "../models/familyModel.js";
import testModel from "../models/testModel.js";

// =============== ADMIN ACCOUNTS ==================
// Manage all the admin accounts

async function getAdmins(req, res){
    try {
      const admins = await userModel.getAdmins();
      res.json(admins);
    } catch (err){
      res.status(500).json({ message: "Internal error" });
    }
  }
  
async function getSingleAdmin(req, res){
    try {
        const adminId = Number(req.params.id); 
        const admin = Number.isNaN(adminId) ? null : await userModel.getSingleAdminById(adminId);

        if (!admin) return res.status(404).json({ message: "Admin not found"});

        res.json(admin);
    } catch(err) {
        res.status(500).json({ message: "Internal error" });
    }
}

async function updateAdmin(req, res){
    try {
      const id = Number(req.params.id);
      const data = req.body;
  
      // Optionnel : vérifier que l’admin existe
      const admin = await userModel.getSingleAdminById(id);
      if (!admin) return res.status(404).json({ message: "Admin not found" });
  
      const updated = await userModel.updateAdmin(id, data);
      res.json(updated);
  
    } catch (err){
      res.status(500).json({ message: "Internal error" });
    }
  }
  
  async function deleteAdmin(req, res){
    try {
      const id = Number(req.params.id);

      await userModel.deleteUserById(id);
      res.json({ message: "Admin deleted" });
  
    } catch (err){
      res.status(500).json({ message: "Internal error" });
    }
  }
  

// =============== USER ACCOUNTS ==================
// Manage all the test user accounts

//Get all the users - user.role = "USER"
async function getAllUsers(req, res){
    try {
      const users = await userModel.getAllUsers();
      res.json(users);
    } catch (err){
      res.status(500).json({ message: "Internal error" });
    }
  }
  
async function getUser(req, res){
    try {
        const id = Number(req.params.id);
        const user = Number.isNaN(id) ? null : await userModel.getSingleUserById(id); 

        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.role !== "USER") return res.status(403).json({ message: "Not a test user" });

        res.json(user);
    } catch (err){
        res.status(500).json({ message: "Internal error" });
    }
}

async function updateUser(req , res){
    try {
        const id = Number(req.params.id);
        const data = req.body;
    
        const user = Number.isNaN(id) ? null : await userModel.getSingleUserById(id);
        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.role !== "USER") return res.status(403).json({ message: "Not a test user" });
    
        const updated = await userModel.updateUser(id, data);
        res.json(updated);
    
      } catch (err){
        res.status(500).json({ message: "Internal error" });
      }
}


async function getProfile(req, res){
    try {
      const id = Number(req.params.id);
  
      const profile = await profileModel.getProfileByUserId(id);
      if (!profile) return res.status(404).json({ message: "Profile not found" });
  
      res.json(profile);
    } catch (err){
      res.status(500).json({ message: "Internal error" });
    }
  }
  

async function updateProfile(req, res){
    try {
      const id = Number(req.params.id);
      const data = req.body;

      const profile = await profileModel.getProfileByUserId(id);
      if (!profile) return res.status(404).json({ message: "Profile not found" });
  
      const updated = await profileModel.updateProfile(id, data);
      res.json(updated);
    } catch (err){
      res.status(500).json({ message: "Internal error" });
    }
}
  
async function getFamilies(req, res){
    try {
      const userId = Number(req.params.userId);
      const families = Number.isNaN(userId) ? [] : await familyModel.listFamilies(userId);
      if (!families.length) return res.status(404).json({ message: "Families not found"});
  
      res.json(families);
    } catch (err){
      res.status(500).json({ message: "Internal error" });
    }
}
  
async function updateFamily(req, res){
    try {
      const { familyId, userId } = req.params;
      const parsedFamilyId = Number(familyId);
      const parsedUserId = Number(userId);
      const data = req.body;


      const family = Number.isNaN(parsedFamilyId) ? null : await familyModel.getFamily(parsedFamilyId);
      if (!family) return res.status(404).json({ message: "Family not found"});
      if (!Number.isNaN(parsedUserId) && family.userId !== parsedUserId) {
        return res.status(403).json({ message: "Family does not belong to this user" });
      }
  
      const updated = await familyModel.updateFamily(parsedFamilyId, data);
      res.json(updated);
  
    } catch (err){
      res.status(500).json({ message: "Internal error" });
    }
  }
  
async function deleteFamily(req, res){
    try {
      const { familyId, userId } = req.params;
      const parsedFamilyId = Number(familyId);
      const parsedUserId = Number(userId);

      const family = Number.isNaN(parsedFamilyId) ? null : await familyModel.getFamily(parsedFamilyId);
      if (!family) return res.status(404).json({ message: "Family not found"});
      if (!Number.isNaN(parsedUserId) && family.userId !== parsedUserId) {
        return res.status(403).json({ message: "Family does not belong to this user" });
      }
  
      await familyModel.deleteFamilyById(parsedFamilyId);
      res.json({ message: "Family deleted" });
  
    } catch (err){
      res.status(500).json({ message: "Internal error" });
    }
}
  
async function getTest(req, res){
    try {
      const { userId, testId } = req.params;
      const parsedTestId = Number(testId);
      const parsedUserId = Number(userId);
      const test = Number.isNaN(parsedTestId) ? null : await testModel.getTestById(parsedTestId);

      if (!test) return res.status(404).json({ message: "Test not found"});
      if (!Number.isNaN(parsedUserId) && test.userId !== parsedUserId) {
        return res.status(403).json({ message: "Test does not belong to this user" });
      }
  
      res.json(test);
    } catch (err){
      res.status(500).json({ message: "Internal error" });
    }
}
  
async function gradeTestAuto(req, res){
    try {
      const { userId, testId } = req.params;
      const parsedTestId = Number(testId);
      const parsedUserId = Number(userId);
      const data = req.body;

      const test = Number.isNaN(parsedTestId) ? null : await testModel.getTestById(parsedTestId);
      if (!test) return res.status(404).json({ message: "Test not found"});
      if (!Number.isNaN(parsedUserId) && test.userId !== parsedUserId) {
        return res.status(403).json({ message: "Test does not belong to this user" });
      }
  
      const graded = await testModel.gradeAuto(parsedTestId, data); 
      res.json(graded);
  
    } catch (err){
      res.status(500).json({ message: "Internal error" });
    }
  }
  
async function gradeTestManual(req, res){
    try {
      const { userId, testId } = req.params;
      const parsedTestId = Number(testId);
      const parsedUserId = Number(userId);
      const data = req.body;

      const test = Number.isNaN(parsedTestId) ? null : await testModel.getTestById(parsedTestId);
      if (!test) return res.status(404).json({ message: "Test not found"});
      if (!Number.isNaN(parsedUserId) && test.userId !== parsedUserId) {
        return res.status(403).json({ message: "Test does not belong to this user" });
      }
  
      const graded = await testModel.gradeManual(parsedTestId, data); 
      res.json(graded);
  
    } catch (err){
      res.status(500).json({ message: "Internal error" });
    }
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
    getFamilies,
    updateFamily,
    deleteFamily,
    getTest,
    gradeTestAuto,
    gradeTestManual
  };
