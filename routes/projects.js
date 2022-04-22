const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController.js");
const checkAuth = require('../middleware/checkAuth.js');


// CheckAuth can be used in routes to verify cookie and relation to employeeID. 
// After, the employeeID will be saved in req.eid and it will continue to the controller, otherwise it does not continue

router.get("/members/:pid", checkAuth, projectController.getMembers);

router.get("/project-details/:pid", projectController.getProjectDetails);

router.get("/tasks/:pid", projectController.getTasks);

router.get("/task-details/:tid", projectController.getTaskDetails);
router.get("/details/:id", checkAuth, projectController.getDetails);
router.get("/setActivity/:pid/:tid", checkAuth, projectController.setActivity);


// router.post("/project/add", projectController.createProject);
router.post("/:projectId", checkAuth, projectController.filterTasks)
router.post("/add/:depId", checkAuth, projectController.addProject);
router.post("/update/:id", checkAuth, projectController.updateProject);
router.post("/delete/:id", checkAuth, projectController.deleteProject);



module.exports = router;