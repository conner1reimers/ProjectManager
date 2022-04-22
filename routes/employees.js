const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController.js");
const checkAuth = require('../middleware/checkAuth.js');

      // ^^^^
// CheckAuth can be used in routes to verify cookie and relation to employeeID. 
// After, the employeeID will be saved in req.eid and it will continue to the controller, otherwise it does not continue

// router.get("/...", checkAuth, employeeController.getLimitedData);



// router.get("/deadlines/:eid", projectController.getMembers);
router.get("/account", checkAuth, employeeController.account);
router.get("/list", checkAuth, employeeController.listEmployees);
router.get("/:id/:depid", checkAuth, employeeController.singleEmployee)


router.post("/create/:depID", checkAuth, employeeController.createEmployee);
router.post("/update/:id/:depId", checkAuth, employeeController.updateEmployeeManager);

// router.post("/update", checkAuth, employeeController.updateEmployee);

router.post("/auth", employeeController.auth)
router.post("/clockIn", checkAuth, employeeController.clockIn)
router.post("/clockOut", checkAuth, employeeController.clockOut)
router.post("/delete/:depId", checkAuth, employeeController.deleteEmployee);

router.post("/add", checkAuth, employeeController.addEmployee);

router.post("/activity/:id/:depId", checkAuth, employeeController.getActivity)



//router.post("/update", employeeController.update)

//! post /clockIn
//! post /clockOut
//! get /delete
//! post /update
//! get /list

//~ post /transer
//~ get /activity

module.exports = router;