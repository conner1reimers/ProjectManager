const express = require("express");
const router = express.Router();
const departmentController = require("../controllers/departmentController.js");
const checkAuth = require('../middleware/checkAuth.js');

      // ^^^^
// CheckAuth can be used in routes to verify cookie and relation to employeeID. 
// After, the employeeID will be saved in req.eid and it will continue to the controller, otherwise it does not continue

// router.get("/...", checkAuth, employeeController.getLimitedData);

router.get("/:departmentID", checkAuth, departmentController.getInfo);
router.post("/projects/:departmentID", checkAuth, departmentController.filterProjects);
router.get("/members/:depId", checkAuth, departmentController.getMembers);


router.get("/details/:id", checkAuth, departmentController.getDetails);
router.post("/add/:depId", checkAuth, departmentController.createDepartment);
router.post("/update/:id", checkAuth, departmentController.updateDepartment);
router.post("/delete/:id", checkAuth, departmentController.deleteDepartment);

module.exports = router;


