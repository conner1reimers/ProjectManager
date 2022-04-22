const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController.js");
const checkAuth = require('../middleware/checkAuth.js');


// type either expense or task

// router.post("/:id/:depid/:projid", checkAuth, taskController.filterTasks);

router.get('/details/:id/:pid/:did', checkAuth, taskController.taskDetails);

router.post("/updateStatus/:id/:projid/:depid", checkAuth, taskController.updateStatus);
router.post("/add/:projectId/:depId", checkAuth, taskController.addTask);
router.post("/delete/:id/:pid/:did", checkAuth, taskController.deleteTask);
router.post("/delete/:id/:pid/:did", checkAuth, taskController.deleteTask);




// router.post("/add", checkAuth, taskController.addTask)
// router.post("/delete", checkAuth, taskController.filterTasks)
// router.post("/update", checkAuth, taskController.filterTasks)
// router.post("/:id/:depid", checkAuth, taskController.filterTasks)


module.exports = router;