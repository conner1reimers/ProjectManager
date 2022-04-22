const mysql = require('../mysql/mysql.js');



const taskDetails = (req, res, next) => {
    const tid = req.params.id;

    const sqlStatement = {
        sql: "select * from tasks where task_id = ? and is_deleted = 0",
        values: [tid]
    }

    mysql.query(sqlStatement)
        .then((rows) => {
            if(!rows[0]) res.status(401).json({msg: "Could not get any info for the task"});
            else {
                const task = {
                    id: rows[0].task_id,
                    name: rows[0].name,
                    deadline: JSON.stringify(rows[0].due_date).substring(1, JSON.stringify(rows[0].due_date).indexOf('T')),
                    priority: rows[0].priority,
                    status: rows[0].status,
                    description: rows[0].description
                }
                res.status(200).json(task);
            }
        })

}


const updateStatus = (req, res, next) => {
    const findEmployeeQuery = {
		sql: "select * from works_in where eid = ? and did = ?",
		values: [req.eid, req.params.depid]
	}
    
    mysql.query(findEmployeeQuery)
        .then((rows) => {
            if(!rows[0]) 
                return next ({msg: "employee not in department"});
            else if(rows[0].access != "manager" && rows[0].access != "overseer") 
                return next ({msg: "You do not have access to delete this department"});
            else {
                    const updateStatusSql = {
                        sql: "update tasks set status = ?, pid = ? where task_id = ?",
                        values: [req.body.status, req.params.projid, req.params.id]
                    }
            
                    mysql.query(updateStatusSql)
                    .then((rows) => {
                        if(rows.affectedRows == 0) 
                            return next({msg: "update error"});
                        else
                            res.status(200).json({});
                    })
                    .catch((error => {
                        console.log(error);
                        return next(error);
                    })) 
                }
            
        })
        .catch((err) => {
            return next({msg: "db error"});
    });

    

    

    
}


// const addTask = (req, res, next) => {
//     const managerSqlStatement = {
// 		sql: "select * from works_in where eid = ? and did = ?",
// 		values: [req.eid, req.params.depid]
// 	}

//     const insertTaskSql = {
// 		sql: "insert into tasks (name, description, due_date, priority, status) values (?, ?, ?, ?, ?)",
// 		values: [req.body.name, req.body.description, req.body.deadline, req.body.priority, req.body.status]
// 	}

//     let taskID;
//     const taskIDquery = {
//         sql: "select task_id from tasks where name = ? and description = ?",
//         values: [req.body.name, req.body.description]
//     }

//     let taskProjectQuery;


//     try {
//         mysql.query(managerSqlStatement)
//             .then((rows) => {
//                 if(!rows[0]) 
//                     {console.log(99); return next({msg: "employee not in department"});}
//                 else if(rows[0].access != "manager" && rows[0].access != "overseer") 
//                     {console.log(99); return next({msg: "You do not have access to delete this department"});}
//             })
//             .catch((err) => {
//                 {console.log(99); return next({msg: "db error"})}
//         })
//         .then(async () => { return await mysql.query(insertTaskSql)})
//         .then((rows) => {
//             if(rows.affectedRows == 0) {console.log(99); return next({msg: "db error"});}
//         })
//         .then(async () => { return await mysql.query(taskIDquery); })
//         .then((rows) => {
//             if(!rows[0]) {console.log(99); return next({msg: "db error"});}
//             else {
                
//                 else {
//                     taskID = rows[0].task_id;
//                     taskProjectQuery = {
//                         sql: "insert into task_in_project (tid, pid) values (?, ?)",
//                         values: [taskID, req.params.projid]
//                     }
//                 }
//             }
//         })
//         .then(async () => { return await mysql.query(taskProjectQuery); })
//         .then((rows) => {
//             if(rows.affectedRows == 0) {console.log(99); return next({msg: "db error"});}
//             else {
//                 res.status.json({});
//             }
            
            
//         })
//         .catch(err => { console.log(99); return next({ msg: "Failed to get task data." })} )
//     } catch (err) { console.log(err); }
// }



const addTask = (req, res, next) => {
    const managerSqlStatement = {
		sql: "select * from works_in where eid = ? and did = ?",
		values: [req.eid, req.params.depId]
	}
    

    mysql.query(managerSqlStatement)
        .then((rows) => {
            if(!rows[0]) 
                throw "employee not in department";
            else if(rows[0].access != "manager" && rows[0].access != "overseer") {
				throw "You do not have access to create task";
			}
        

            const insertTaskSql = {
            	sql: "insert into tasks (name, description, due_date, priority, status) values (?, ?, ?, ?, ?)",
            	values: [req.body.name, req.body.description, req.body.deadline, req.body.priority, req.body.status]
            }


            mysql.beginTransaction(function(error) {
                mysql.query(insertTaskSql)
                    .then((rows) => {
                        if(rows.affectedRows === 0) 
                            throw "Failed creating task.";

                        let taskID;
                        const taskIDquery = {
                            sql: "select task_id from tasks where name = ? and description = ? and is_deleted = 0",
                            values: [req.body.name, req.body.description]
                        }
                
                        mysql.query(taskIDquery)
                            .then((rows) => {
                                if(!rows[0]) 
                                    throw "there was an error in creation";
                                else 
                                    taskID = rows[0].task_id;

                                const projectDepQuery = {
                                    sql: "insert into task_in_project (pid, tid) values (?, ?)",
                                    values: [req.params.projectId, taskID]
                                }
                            
                                mysql.query(projectDepQuery)
                                    .then((rows) => {
                                        if(rows.affectedRows != 0) {
                                            mysql.commit();
                                            res.status(200).json({});
                                        } else {
                                            console.log(err);
                                            res.status(401).json({msg: "error inserting to task_in_department"})
                                        }
                                    })
                            })
                            .catch((err) => {
                                console.log(err);
                                res.status(401).json({msg: err})
                            });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(401).json({msg: err})
                });

            });

        })
        .catch((err) => {
            console.log(err);
            res.status(401).json({msg: err})
        });
};      



const deleteTask = (req, res, next) => {

    const managerSqlStatement = {
        sql: "select * from works_in where eid = ? and did = ?",
        values: [req.eid, req.params.did]
    }

    mysql.query(managerSqlStatement)
        .then((rows) => {
            if(!rows[0]) res.status(401).json({msg: "employee not in department"})
            else if(rows[0].access != "manager" && rows[0].access != "overseer") {
                res.status(401).json({msg: "You do not have access to delete this department"})
            } else {
                const deleteQuery = {
                    sql: "update tasks set is_deleted = 1 where task_id = ?",
                    values: [req.params.id]
                }
            
                mysql.query(deleteQuery)
                    .then((rows2) => {
                        if(rows2.affectedRows != 0) {
                            res.status(200).json({})
                        } else {
                            res.status(401).json({msg: "Could not delete project"})
                        }
                    })
            }
        })
        .catch((err) => {
            res.status(401).json({msg: "db error"})
    });

    

};



exports.updateStatus = updateStatus;
exports.taskDetails = taskDetails;
exports.addTask = addTask;
exports.deleteTask = deleteTask;

