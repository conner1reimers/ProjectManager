const mysql = require('../mysql/mysql.js');

const getMembers = (req, res, next) => {
    const pid = req.params.pid; // gets projectid from url
    

    const query = 
        "select e.name, e.employee_id \
        from employees e \
        join assigned_to w on w.eid = e.employee_id \
        where w.pid = ?"

    const sqlStatement = {
        sql: query,
        values: [pid]
    }

    const results = msql.query(sqlStatement);


    results.then((rows) => {
        console.log(rows);
        res.status(200).json(rows);
    });   
   
    
    
};

const getProjectDetails = (req, res, next) => {
    const pid = req.params.pid; // gets projectid from url
    
    let budget;
    let employees = [];
    let expenses = [];


    const q1 = 
        "select p.budget, e.employee_id, e.name \
        from projects p \
        join assigned_to w on w.pid = p.project_id \
        join employees e on e.employee_id = w.eid \
        where p.project_id = ? and e.is_deleted = 0"
    
    const q2 = 
        "select ex.cost, ex.description \
        from projects p \
        join expense_in_project eip on eip.pid = p.project_id \
        join expense ex on ex.expense_id = eip.eid \
        where p.project_id = ?"


    const sqlStatement = {
        sql: q1,
        values: [pid]
    }

    const sqlStatement2 = {
        sql: q2,
        values: [pid]
    }

    const results1 = msql.query(sqlStatement);

    results1.then((rows) => {
        budget = rows[0].budget;
        const rowsLength = Object.keys(rows).length;


        for(let i=0; i<rowsLength; i++) {
            employees[i] = {
                name: rows[i].name,
                id: rows[i].employee_id
            }
        }
    });

    const results2 = msql.query(sqlStatement2);

    results2.then((rows) => {
        const rowsLength = Object.keys(rows).length;

        for(let i=0; i<rowsLength; i++) {
            expenses[i] = {
                cost: rows[i].cost,
                description: rows[i].description
            }
        }

        res.status(200).json({budget, employees, expenses});

        
    });


    
};


const getTasks = (req, res, next) => {
    const taskid = req.params.tid; // gets taskid from url
    

    const query = 
        "select t.description, t.due_date, t.status, e.employee_id, e.name \
        from tasks t \
        join working_on_task w on w.tid = t.task_id \
        join employees e on e.employee_id = w.eid \
        join task_in_project tp on tp.tid = t.task_id \
        where tp.pid = ? and e.is_deleted = 0";

    const sqlStatement = {
        sql: query,
        values: [taskid]
    }

    const results = msql.query(sqlStatement);


    results.then((rows) => {
        res.status(200).json(rows);
    });
    
    
   
    
    
};



const getTaskDetails = (req, res, next) => {
    const taskid = req.params.tid; // gets taskid from url
    

    const query = "select * from tasks where task_id = ? and is_deleted = 0"

    const sqlStatement = {
        sql: query,
        values: [taskid]
    }

    const results = msql.query(sqlStatement);


    results.then((rows) => {
        res.status(200).json(rows);
    });
    
};


const createProject = (req, res, next) => {
    const {name, description, dueDate, budget} = req.body;

    const projectQuery = "INSERT INTO projects SET ?";
	const projectQueryValues = {
		name: name,
		description: description,
        due_date: dueDate,
        budget: budget
	};

    const projectResults = mysql.query(projectQuery, projectQueryValues);
	projectResults.then((rows) => {
		console.log('creating project')
	});


    

};


const getDetails = (req, res, next) => {
    const managerSqlStatement = {
		sql: `select name, due_date, description 
                from projects
                where project_id = ?`,
		values: [req.params.id]
	}

    mysql.query(managerSqlStatement)
        .then((rows) => {
            if(!rows[0]) res.status(401).json({msg: "employee not in department"})
            else if(!rows[0].name) {
				res.status(401).json({msg: "You do not have access to this project"})
			} else {
                console.log(JSON.stringify(rows[0].due_date).substring(1, JSON.stringify(rows[0].due_date).indexOf('T')))
                const returnProject = {
                    name: rows[0].name,
                    deadline: JSON.stringify(rows[0].due_date).substring(1, JSON.stringify(rows[0].due_date).indexOf('T')),
                    description: rows[0].description
                }
                res.status(200).json(returnProject)
            }
        })
        .catch((err) => {
            res.status(401).json({msg: "db error"})
    });
    /*
    const managerSqlStatement = {
		sql: `select p.name as project_name, p.project_id, p.due_date, p.description from employees e, projects p
            join works_in w on e.employee_id = w.eid
            join project_in_department pd on pd.did = w.did
            where e.employee_id = ? and p.project_id = ? and p.is_deleted = 0`,
		values: [req.eid, req.params.id]
	}

    console.log(req.eid, req.params.id)

    mysql.query(managerSqlStatement)
        .then((rows) => {
            if(!rows[0]) res.status(401).json({msg: "employee not in department"})
            else if(!rows[0].project_name) {
				res.status(401).json({msg: "You do not have access to this project"})
			} else {
                const returnProject = {
                    name: rows[0].project_name,
                    deadline: rows[0].due_date,
                    description: rows[0].description,
                    id: rows[0].project_id
                }
                res.status(200).json(returnProject)
            }
        })
        .catch((err) => {
            res.status(401).json({msg: "db error"})
    });*/
    
};


const addProject = (req, res, next) => {

    if(req.body.name.length < 3) {
        return next({msg: "name not long enough"})
    }

    const managerSqlStatement = {
		sql: "select * from works_in where eid = ? and did = ?",
		values: [req.eid, req.params.depId]
	}

    mysql.query(managerSqlStatement)
        .then((rows) => {
            if(!rows[0]) 
                throw "employee not in department";
            else if(rows[0].access != "manager" && rows[0].access != "overseer") {
				throw "You do not have access to delete this department";
			}
        

            const projectQuery = {
                sql: "insert into projects(name, description, due_date) values (?, ?, ?)",
                values: [req.body.name, req.body.description, req.body.deadline]
            }


            mysql.beginTransaction(function(error) {
                mysql.query(projectQuery)
                    .then((rows) => {
                        if(rows.affectedRows === 0) 
                            throw "Failed creating project.";

                        let projectID;
                        const projectIDquery = {
                            sql: "select project_id from projects where name = ? and is_deleted = 0 and description = ?",
                            values: [req.body.name, req.body.description]
                        }
                
                        mysql.query(projectIDquery)
                            .then((rows) => {
                                if(!rows[0]) 
                                    throw "there was an error in creation";
                                else 
                                    projectID = rows[0].project_id;

                                const projectDepQuery = {
                                    sql: "insert into project_in_department(pid, did) values (?, ?)",
                                    values: [projectID, req.params.depId]
                                }
                            
                                mysql.query(projectDepQuery)
                                    .then((rows) => {
                                        if(rows.affectedRows != 0) {
                                            mysql.commit();
                                            res.status(200).json({});
                                        } else {
                                            res.status(401).json({msg: "error inserting to projectInDepartment"})
                                        }
                                    })
                            })
                            .catch((err) => {
                                res.status(401).json({msg: err})
                            });
                })
                .catch((err) => {
                    res.status(401).json({msg: err})
                });

            });

        })
        .catch((err) => {
            res.status(401).json({msg: err})
        });
};      



const deleteProject = (req, res, next) => {
    const projectSql = {
        sql: "select * from project_in_department where pid = ?",
        values: [req.params.id]
    }

    let depID; 
    mysql.query(projectSql)
        .then((rows) => {
            if(!rows[0]) res.status(401).json({msg: "can't find project"});
            else {
                depID = rows[0].did;
            }
        })
        .catch((err) => {
            res.status(401).json({msg: "db error"})
    })

    .then(() => {
        const managerSqlStatement = {
            sql: "select * from works_in where eid = ? and did = ?",
            values: [req.eid, depID]
        }

        mysql.query(managerSqlStatement)
            .then((rows) => {
                if(!rows[0]) res.status(401).json({msg: "employee not in department"})
                else if(rows[0].access != "manager" && rows[0].access != "overseer") {
                    res.status(401).json({msg: "You do not have access to delete this department"})
                }
            })
            .catch((err) => {
                res.status(401).json({msg: "db error"})
        });

        const deleteQuery = {
            sql: "update projects set is_deleted = 1 where project_id = ?",
            values: [req.params.id]
        }

        mysql.query(deleteQuery)
            .then((rows) => {
                if(rows.affectedRows != 0) {
                    res.status(200).json({})
                } else {
                    res.status(401).json({msg: "Could not delete project"})
                }
            })
    })
    .catch((err) => {
        res.status(401).json({msg: "db error"})
    })
    
};

const updateProject = (req, res, next) => {
    const body = req.body;
    const projectSql = {
        sql: "select * from project_in_department where pid = ?",
        values: [req.params.id]
    }

    let depID; 
    mysql.query(projectSql)
        .then((rows) => {
            console.log(rows)
            if(!rows[0]) 
                throw "can't find project";
            
            depID = rows[0].did;
            const managerSqlStatement = {
                sql: "select * from works_in where eid = ? and did = ?",
                values: [req.eid, depID]
            }
    
            mysql.query(managerSqlStatement)
                .then((rows) => {
                    console.log(rows);
                    if(!rows[0]) 
                        throw "employee not in department";
                    else if(rows[0].access != "manager" && rows[0].access != "overseer") {
                        throw "You do not have access to delete this department";
                    }

                    const columnMap = {
                        name: 'name',
                        description: 'description',
                        deadline: 'due_date'
                    }
            
                    let updateProjectSql = "update projects set ";
                    Object.keys(body).forEach((key, i) => {
                        updateProjectSql += columnMap[key] + "='" +  body[key] + "',";
                    });
            
                    updateProjectSql = updateProjectSql.substring(0, updateProjectSql.length - 1) + " where project_id = ?";
                    
                    console.log(updateProjectSql)
            
                    const updateProjectQuery = {
                        sql: updateProjectSql,
                        values: [req.params.id]
                    }
            
                    mysql.query(updateProjectQuery)
                        .then((rows) => {
                            if(rows.affectedRows != 0) {
                                res.status(200).json({})
                            } else {
                                res.status(401).json({msg: "Could not delete project"})
                            }
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


        })
        .catch((err) => {
            res.status(401).json(err);
        })

    
};

const filterTasks = (req, res, next) => {
    // const findEmployeeQuery = {
	// 	sql: "select * from works_in where eid = ? and did = ?",
	// 	values: [req.eid, req.params.depId]
	// }
    
    // mysql.query(findEmployeeQuery)
    //     .then((rows) => {
    //         if(!rows[0]) res.status(401).json({msg: "employee not in department"})
    //     })
    //     .catch((err) => {
    //         res.status(401).json({msg: "db error"})
    // });

    const projectId = req.params.projectId ? req.params.projectId : '1625DC5EC000003';

    const body = req.body;
    const bodyKeys = Object.keys(body);
    // let where = body.keys ? 'where ' : '';

    let where = 'where ';

    for(let i=bodyKeys.length-1; i>=0; i--) {
        if(body[bodyKeys[i]].length == 0) {
            bodyKeys.splice(i, 1);
        }
    }

    console.log(bodyKeys)
    bodyKeys.forEach((key, i) => {
        body[key].forEach((filter, j) => {
            if(key === 'duedate') {
                switch(filter) {
                    case 'overdue': {
                        where += `due_date < current_date()`;
                    } break;
                    case 'dueToday': {
                        where += `due_date = current_date()`;
                    } break;
                    case 'noDueDate': {
                        where += `due_date = null`;
                    } break;
                }
            } else{
                if(filter === 'all') {
                    where += "1=1"
                } else
                    where += `${key} = '${filter}'`;
            }
                

            if(j !== body[key].length - 1)
                where += ' or ';
        })   

        if(i !== bodyKeys.length - 1)
            where += ` and `;
        
    });

    console.log(where)
    
    let filterSql = {
        sql: 'select * from tasks t join task_in_project tp on tp.tid = t.task_id ' + where + ' and tp.pid = ? and t.is_deleted = 0',
        values: [projectId]
    }

    let departmentSql = {
        sql: 'select * from departments d join works_in w on w.did = d.department_id where w.eid = ?',
        values: [req.eid]
    }

    let projectSql = {
        sql: 'select name from projects where project_id = ?',
        values: [projectId]
    }

    let projectName;
    let tasks = [];



    try {
        mysql.query(filterSql)
            .then((rows) => {
                if(!rows[0]) {console.log(1)}
                else {
                    rows.forEach((tsk) => {
                        tasks.push({
                            id: tsk.task_id,
                            name: 'Task ' + tsk.name,
                            deadline: tsk.due_date,
                            description: tsk.description,
                            priority: tsk.priority,
                            status: tsk.status
                        });
                    });
                    
                }
                
            })
            .catch((err) => {
                return next({msg: "db error"})
        })
        .then(async () => { return await mysql.query(projectSql); })
        .then((rows) => {
            if(!rows[0]) {console.log(99); return next({msg: "db error"});}
            else {
                projectName = rows[0].name;
                
            }
        })
        .then(async () => { return await mysql.query(departmentSql); })
        .then((rows) => {
            if(!rows[0]) {console.log(99); return next({msg: "db error"});}
            
            res.json({
                name: projectName,
                tasks: tasks,
                id: projectId,
                department: {
                    name: rows[0].name,
                    id: rows[0].department_id
                },
                access: rows[0].access
            })
        })
        // .catch(err => { console.log(99); return next({ msg: "Failed to get task data." })} )
    } catch (err) { console.log(err); }

}

const setActivity = (req, res, next) => {
    const {pid, tid} = req.params;
    let activitySql;

    if(tid === "undefined" && pid === "undefined") {

        console.log('None');
        activitySql = {
            sql: "update employees set current_project = 0, current_task = 0, current_activity = 0 where employee_id = ?",
            values: [req.eid]
        }
        
    } else if(tid === "undefined") {
        console.log('Just project')
        activitySql = {
            sql: "update employees set current_project = ?, current_task = 0, current_activity = ? where employee_id = ?",
            values: [pid, pid, req.eid]
        }
    } else {
        console.log('Both')
        activitySql = {
            sql: "update employees set current_project = ?, current_task = ?, current_activity = ? where employee_id = ?",
            values: [pid, tid, tid+pid, req.eid]
        }
    }

    mysql.query(activitySql)
        .then((rows) => {
            if(rows.affectedRows == 0) 
                return next({msg: "error setting activity"});
            else
                res.status(200).json({});
        })
        .catch(() => {
            return next({msg: "error setting activity"});
        })
}





exports.getMembers = getMembers;
exports.getTasks = getTasks;
exports.getTaskDetails = getTaskDetails;
exports.getProjectDetails = getProjectDetails;
exports.createProject = createProject;

exports.getDetails = getDetails;
exports.addProject = addProject;
exports.updateProject = updateProject;
exports.deleteProject = deleteProject;
exports.filterTasks = filterTasks;
exports.setActivity = setActivity;



