const mysql = require('../mysql/mysql.js');
const parseCookies = require('../util/parseCookies');
// const getInfo = (req, res, next) => {
//     const depId = req.params.depId; // department projectid from url
    
//     let departmentName;
//     let employees = [];
//     let projects = [];

//     // const query = 
//     //     "select d.department_id, d.name, e.employee_id, e.name, \
//     //     p.project_id, p.name, p.description, p.due_date, p.status \
//     //     from departments d \
//     //     join works_in w \
//     //     on w.did = d.department_id \
//     //     join employees e \
//     //     on e.employee_id = w.eid \
//     //     join works_on wo \
//     //     on wo.eid = e.employee_id \
//     //     join projects p \
//     //     on p.project_id = wo.pid \
//     //     where d.department_id = ?"

//     const query1 =  //gets all employees in department
//         "select d.name as dep_name, e.employee_id, e.name as employee_name \
//         from departments d \
//         join works_in w \
//         on w.did = d.department_id \
//         join employees e \
//         on e.employee_id = w.eid \
//         where d.department_id = ?"
    
//     const query2 = //gets all projects in department
//         "select p.project_id, p.name, p.description, p.due_date, p.status \
//         from departments d \
//         join project_in_department w \
//         on w.did = d.department_id \
//         join projects p \
//         on p.project_id = w.pid \
//         where d.department_id = ?"
    



//     const sqlStatement1 = {
//         sql: query1,
//         values: [depId]
//     }
//     const sqlStatement2 = {
//         sql: query2,
//         values: [depId]
//     }

//     const results1 = msql.query(sqlStatement1);

//     results1.then((rows) => {
//         console.log(rows)
//         departmentName = rows[0].dep_name;
//         const rowsLength = Object.keys(rows).length;

//         for(let i=0; i<rowsLength; i++) {
//             employees[i] = {
//                 name: rows[i].employee_name,
//                 id: rows[i].employee_id
//             }
//         }
//     });
//     const results2 = msql.query(sqlStatement2);


//     results2.then((rows) => {
//         const rowsLength = Object.keys(rows).length;
//         for(let i=0; i<rowsLength; i++) {
//             projects[i] = {
//                 name: rows[i].name,
//                 id: rows[i].project_id,
//                 deadline: rows[i].due_date,
//                 status: rows[i].status
//             }
//         }

//         res.status(200).json({departmentName, employees, projects});
//     });


    
    
    
// };


const getInfo = (req, res, next) => {
    try {
        const depId = req.params.departmentID;
        let employees = [];
        let projects = [];
        let subdepartments = [];


        const sqlStatement1 = {
            sql: `select * from works_in w join employees e on w.eid = e.employee_id where w.did = ? and w.access != 'overseer' and e.is_deleted = 0`,
            values: [depId]
        }

        const sqlStatement2 = {
            sql: `select * from project_in_department pd join projects p on p.project_id = pd.pid where pd.did = ? and p.is_deleted = 0`,
            values: [depId]
        }

        const sqlStatement3 = {
            sql: `select * from departments d join works_in w on w.did = d.department_id where d.department_id = ? and w.eid = ? and d.is_deleted = 0`,
            values: [depId, req.eid]
        }

        const sqlStatement4 = {
            sql: `select * from departments where is_deleted = 0 and subdepartment_of = ?`,
            values: [depId]
        }


        mysql.query(sqlStatement1)
            .then((rows) => {
                if(!rows[0]) { employees = []};
                for(let i=0; i<rows.length; i++) {
                    employees[i] = {
                        firstname: rows[i].first_name,
                        lastname: rows[i].last_name,
                        id: rows[i].employee_id, 
                        role: rows[i].role
                    }
                }
            })
            .then(async () => { return await mysql.query(sqlStatement2); })
            .then((rows) => {
                if(!rows[0]) projects = [];
                for(let i=0; i<rows.length; i++) {
                    projects[i] = {
                        name: rows[i].name,
                        description: rows[i].description,
                        id: rows[i].project_id, 
                        deadline: rows[i].due_date,
                        numberOfTask: rows[i].total_task_count,
                        numberOfCompleteTask: rows[i].completed_task_count
                    }
                }
            })
            .then(async () => { return await mysql.query(sqlStatement4); })
            .then((rows) => {
                if(!rows[0]) subdepartments = [];
                for(let i=0; i<rows.length; i++) {
                    subdepartments[i] = {
                        name: rows[i].name,
                        description: rows[i].description,
                        id: rows[i].department_id
                    }
                }
            })
            .then(async () => { return await mysql.query(sqlStatement3) } )
            .then((rows) => {
                console.log(rows);
                if(!rows[0]) {console.log(69);res.status(401).json({ msg: "Failed to get department data." }); next();}
                else {
                    res.status(200).json({
                        name: rows[0].name,
                        id: depId,
                        access: rows[0].access,
                        employees: employees,
                        subdepartments: subdepartments,
                        projects: projects
                    })
                }
            })
            .catch(err => { console.log(2);res.status(401).json({ msg: "Failed to get department data." }); next();} )

    
    } catch (error) {        
        res.status(401).json({ msg: "Failed to get department data." });
        next();
    }
};

const getMembers = (req, res, next) => {
    const depId = req.params.depId; // department projectid from url
    
    const query = 
        "select e.first_name, e.last_name, e.employee_id \
        from employees e \
        join works_in w on w.eid = employee_id \
        where w.did = ? and e.is_deleted = 0";

    const sqlStatement = {
        sql: query,
        values: [depId]
    };

    const results = msql.query(sqlStatement);
    results.then((rows) => {
        res.status(200).json(rows);
    });
}



const getDetails = (req, res, next) => {
    const managerSqlStatement = {
		sql: "select * from works_in where eid = ? and did = ?",
		values: [req.eid, req.params.id]
	}

    console.log(req.eid, req.params.id)
    mysql.query(managerSqlStatement)
        .then((rows) => {
            console.log(rows)
            if(!rows[0]) 
                throw "employee not in department";

            const depSqlStatement = {
                sql: "select department_id, description, name from departments where is_deleted = 0 and department_id = ?",
                values: [req.params.id]
            }

            mysql.query(depSqlStatement)
                .then((rows) => {
                    if(!rows[0]) 
                        throw "department not found";
                    else if(rows[0].name) {
                        const departmentReturn = {
                            name: rows[0].name,
                            id: rows[0].department_id,
                            description: rows[0].description
                        }

                        // SUCCESS
                        res.status(200).json(departmentReturn);
                    } else {
                        throw "department not found"
                    }
                })
                .catch((err) => {
                    res.status(401).json({msg: err});
                });
        })
        .catch((err) => {
            console.log(err);
            res.status(401).json({msg: err});
        });

}


// req.body = {
//     name: 'name',
//     manager: 'id',
//     description: 'description',
// },

const createDepartment = (req, res, next) => {
    // if(req.eid != req.body.manager) res.status(401).json({msg: "You don't have that access"});

    if(req.body.name.length < 3) {
        return next({msg: "name not long enough"})
    }
    const managerSqlStatement = {
		sql: "select * from works_in where eid = ? and did = ?",
		values: [req.eid, req.params.depId]
	}

    let employeeAccess;
    let createdDepID;


    mysql.query(managerSqlStatement)
        .then((rows) => {
            if(!rows[0]) 
                throw "employee not in department";
            else if(rows[0].access != "manager" && rows[0].access != "overseer") {
				throw "You do not have access";
			} else {
                employeeAccess = rows[0].access;
            }


            mysql.beginTransaction(function(err) {
                try {
                    const departmentSQL = {
                        sql: "insert into departments(name, description, subdepartment_of) values (?, ?, ?)",
                        values: [req.body.name, req.body.description, req.params.depId]
                    }
    
                    mysql.query(departmentSQL)
                        .then((rows) => {
                            if(rows.affectedRows === 0) {
                                throw "Failed to update employee.";
                            }

                            const departmentIdSQL = {
                                sql: "select department_id from departments where is_deleted = 0 and name = ? and description = ?",
                                values: [req.body.name, req.body.description]
                            }

                            mysql.query(departmentIdSQL)
                                .then((rows) => {
                                    if(!rows[0]) throw "department not created"
                                    else createdDepID = rows[0].department_id;
                                    
                                    const worksInSQL = {
                                        sql: `insert into works_in(eid, did, access) 
                                                values 
                                                (?, ?, 'overseer'),
                                                (?, ?, 'manager')`,
                                        values: [req.eid, createdDepID, req.body.manager, createdDepID]
                                    }
            
                                    mysql.query(worksInSQL)
                                        .then((rows) => {
                                            console.log("Rows affected", rows.affectedRows)
                                            if(rows.affectedRows != 0) {
                                                mysql.commit();
                                                res.status(200).json({});
                                            } else throw "error inserting to works_in";
                                        })
                                        .catch((errr) => {
                                            mysql.rollback();
                                            res.status(401).json({msg: errr})
                                        })
                                })
                                .catch((errr) => {
                                    mysql.rollback();
                                    res.status(401).json({msg: errr})
                                })
        
                        })
                        .catch((errr) => {
                            mysql.rollback();
                            res.status(401).json({msg: errr})
                        })
    
                    
    
                    
    
                } catch (error) {
                    mysql.rollback();
                    res.status(401).json({msg: error})
                }
            });


        })
        .catch((err) => {
            res.status(401).json({msg: err})
        })

}

const updateDepartment = (req, res, next) => {
    let body = req.body;

    const managerSqlStatement = {
		sql: "select * from works_in where eid = ? and did = ?",
		values: [req.eid, req.params.id]
	}


    mysql.query(managerSqlStatement)
        .then((rows) => {
            console.log('Update')
            console.log(rows)
            if(!rows[0]) {
                throw "employee not in department";
            } else if(rows[0].access != "manager" && rows[0].access != "overseer") {
                throw "You do not have access to update this department";
            }

            const columnMap = {
                name: 'name',
                description: 'description'
            }
    
            let departmentQuerySQL = "update departments set ";
            Object.keys(body).forEach((key, i) => {
                departmentQuerySQL += columnMap[key] + "='" +  body[key] + "',";
            });
    
            departmentQuerySQL = departmentQuerySQL.substring(0, departmentQuerySQL.length - 1) + " where department_id = ?";
    
            const departmentQuery = {
                sql: departmentQuerySQL,
                values: [req.params.id]
            };
    
            mysql.query(departmentQuery)
                .then((rows) => {
                    if(rows.affectedRows != 0) {
                        res.status(200).json({})
                    } else {
                        res.status(401).json({msg: "Could not update department"})
                    }
                });

        }).catch((err)=>{
            res.status(401).json({msg: err});
        })
}


const deleteDepartment = (req, res, next) => {
    const managerSqlStatement = {
		sql: "select * from works_in where eid = ? and did = ?",
		values: [req.eid, req.params.id]
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

    const deleteSqlStatement = {
		sql: "update departments set is_deleted = 1 where department_id = ?",
		values: [req.params.id]
	}

    mysql.query(deleteSqlStatement)
        .then((rows) => {
            if(rows.affectedRows === 0) res.status(401).json({msg: "could not delete from db"})
            else {
                res.status(200).json({});
            }
        })
        .catch((err) => {
            res.status(401).json({msg: "db error"})
        });
}


const filterProjects = (req, res, next) => {

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
                where += `${key} = '${filter}'`;
            }
                

            if(j !== body[key].length - 1)
                where += ' or ';
        })   

        if(i !== bodyKeys.length - 1)
            where += ` and `;
        
    });

    const projectQuery = {
        sql: `select p.name as project_name, p.description as project_description, p.due_date as deadline, 
            p.project_id as projid, p.completed_task_count as complete_tasks, p.total_task_count as total_tasks, d.name as department_name, w.access 
            from projects p 
            join project_in_department pd on pd.pid = p.project_id 
            join departments d on d.department_id = pd.did
            join works_in w on w.did = pd.did
            ${where} ${where.length > 6 ? 'and' : ''} pd.did = ? and w.eid = ?`,
        values: [req.params.departmentID, req.eid]
    }

    console.log(projectQuery.sql)

    let projects = [];

    mysql.query(projectQuery)
        .then((rows) => {
            if(rows && rows.length > 0) {
                for(let i=0; i<rows.length; i++) {
                    projects.push({
                        deadline: rows[i].deadline,
                        description: rows[i].project_description,
                        id: rows[i].projid,
                        name: rows[i].project_name,
                        numberOfCompleteTask: rows[i].complete_tasks,
                        numberOfTask: rows[i].total_tasks,
                    });
                }

                res.status(200).json({
                    id:         req.params.departmentID,
                    name:       rows[0].department_name,
                    projects:   projects,
                    access:     rows[0].access
                });

            } else {
                res.status(200).json({
                    id:         req.params.departmentID,
                    name:       "unspecified",
                    projects:   projects,
                    access:     'standard'
                });
            }
        })
    

    
}


exports.getInfo = getInfo;
exports.getMembers = getMembers;

exports.filterProjects = filterProjects;

exports.getDetails = getDetails;
exports.createDepartment = createDepartment;
exports.updateDepartment = updateDepartment;
exports.deleteDepartment = deleteDepartment;

