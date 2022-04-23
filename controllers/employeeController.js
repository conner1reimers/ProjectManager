const mysql = require('../mysql/mysql.js');
const parseCookies = require('../util/parseCookies.js');
const fs = require('fs');
const nodemailer = require("nodemailer");

const getDeadlines = (req, res, next) => {
    const eid = req.params.eid; // gets employee id from url
    
};


const account = (req, res, next) => {

	try {
		let firstname, lastname, departments = [], isClockedIn, activeSession
		const employeeQuery = 
			`SELECT first_name, current_project, current_task, current_activity, last_name, is_clocked_in, 
			p.name as project_name, t.name as task_name from employees e 
			LEFT OUTER JOIN projects p on p.project_id = current_project 
			LEFT OUTER JOIN tasks t on t.task_id = current_task 
			where e.is_deleted = 0 and employee_id = ?`;
			
		const departmentQuery = 
			`SELECT DISTINCT name, department_id 
			FROM departments d 
			join works_in w on d.department_id = w.did where w.eid = ? and w.access != 'overseer' and d.is_deleted = 0`


		const sqlStatement2 = {
			sql: employeeQuery,
			values: [req.eid]
		};
		const sqlStatement3 = {
			sql: departmentQuery,
			values: [req.eid, req.eid]
		};


		const results2 = mysql.query(sqlStatement2);
		results2.then((rows) => {
			if(rows.length >= 1) {
				firstname = rows[0].first_name;
				lastname = rows[0].last_name;
				isClockedIn = rows[0].is_clocked_in;
				if(rows[0].current_activity) {
					activeSession = {
						project: {
							name: rows[0].project_name,
							id: rows[0].current_project
						},
						task: {
							name: rows[0].task_name,
							id: rows[0].current_task
						}
					}
				} else 
					activeSession = { project: {}, task: {} }
			} else {
				throw "employee nodejs error"
			}
			
		}).catch(err => { return next({ msg: "Failed to get account data." }); });

		const results3 = mysql.query(sqlStatement3);
		results3.then((rows) => {
			if(rows.length >= 1) {
				const rowsLength = Object.keys(rows).length;
				for(let i=0; i<rowsLength; i++) {
					departments[i] = {
						name: rows[i].name,
						id: rows[i].department_id
					}
				}
				res.status(200).json({firstname, lastname, id: req.eid, departments, isClockedIn, activeSession});
			} else {
				throw "department nodejs error"
			}
		}).catch(err => { return next({ msg: "Failed to get account data." }); });
	} catch(e) {
		console
    	return next({ msg: "Failed to get account data." });
	}
};


const createEmployee = async (req, res, next) => {
	const {firstname, lastname, role, wage} = req.body;
	const depID = req.params.depID
	const username = req.body.username.toLowerCase();
	const email = req.body.email.toLowerCase();
	const managerID = req.eid;
	let eid;

	const managerSQL = {
		sql: "select * from works_in where eid = ? and did = ?",
		values: [managerID, depID]
	};

	const managerResult = mysql.query(managerSQL);
	managerResult.then((rows) => {
		if(rows[0].access != "manager") {
			return next({ msg: "You are not authorized" });
		}
	});

	const employeeSQL = {
		sql: "INSERT INTO employees (first_name, last_name, username, wage, email) VALUES (?, ?, ?, ?, ?)",
		values: [firstname, lastname, username, wage, email]
	}



	
	mysql.beginTransaction(function(err) {
			try {
				if(err) return next({ msg: "Database connection failure" });
		
				const employeeResults = mysql.query(employeeSQL);
				employeeResults.then((rows) => {
					if(rows.affectedRows === 0) {
						throw "Failed to create employee, make sure inputs are correct.";
					}
				})

				const newSQL = {
					sql: "select employee_id from employees where username = ? and email = ?",
					values: [username, email]
				}

				mysql.query(newSQL)
					.then((rows) => {
						if(!rows[0]) throw "error creating employee"
						else {
							eid = rows[0].employee_id;
						}
				})

				.then(() => {
					const finalSQL = {
						sql: "insert into works_in (eid, did, role, access) values (?, ?, ?, 'standard')",
						values: [eid, depID, role]
					}

					mysql.query(finalSQL)
						.then((rows) => {
							if(rows.affectedRows === 0) {
								throw "failed to create employee...";
							} else {
								/*let transporter = nodemailer.createTransport({
									service: "outlook",
									auth: {
									  user: "testcomp123469@outlook.com",
									  pass: "Nu*_rzuU6M'LFUx",
									}
								});
								
								try {
									let info = transporter.sendMail({
										from: "testcomp123469@outlook.com", // sender address
										to: req.body.email, // list of receivers
										subject: "Hello ✔", // Subject line
										text: "Hello world", // plain text body
										html: "<b>Hello world</b>", // html body
									});
								} catch (err) {
									res.status(400).json({ msg: "error sending email" });
								}*/



								mysql.commit();
								res.status(200).json({});
							}
						})
				})
				
				.catch((err) => {
					console.log(err);
					mysql.rollback();
					return next({ msg: "Error adding employee" });
				});
			} catch (error) {
				mysql.rollback();
				return next({ msg: "Error adding employee" });
			}
	});
}

const auth = (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;
	let employeeID;
	
	const query = "SELECT * FROM employees WHERE is_deleted = 0 AND username = ? AND password = ?";
	const sqlStatement = {
		sql: query,
		values: [username, password]
	};
	
	let authError = false;
	mysql.beginTransaction(function(err) {

		if(err) return next({ msg: "Database connection failure" });

		const results = mysql.query(sqlStatement);
		results.then((rows) => {
			console.log(rows[0]);
			if(!rows[0]) throw "The username or password entered was incorrect";
			else employeeID = rows[0].employee_id;
		})

		.then(() => {
			let cookieAuthToken;
			const cookieQuery = "INSERT INTO cookies (eid) values (?)";
			const cookieQueryValues = {
				sql: cookieQuery,
				values: [employeeID]
			}
			mysql.query(cookieQueryValues)
				.then((sqlRes) => {
					if(sqlRes && sqlRes.affectedRows === 0) {
						throw "Failed to create auth token.";
					}
				});
			
			const getCookieSQL = {
				sql: "select auth_token from cookies c where c.eid = ?",
				values: [employeeID]
			};

			mysql.query(getCookieSQL)
				.then((rows) => {
					if(rows.length >= 1) {
						cookieAuthToken = rows[0].auth_token;
						console.log(cookieAuthToken)

						res.cookie('SID', cookieAuthToken, {expires: new Date(Date.now() + 1296000000)}) // setting cookie to expire in 15 days
						mysql.commit();
						res.status(200).json({});
					} else {
						throw "Failed to create cookie.";
					}
						
				});
			
		})
		.catch((err) => {
			console.log(err);
			mysql.rollback();
			return next({ msg: "login failed" });
		});
	});

}

const clockIn = (req, res, next) => {
	const body = req.body; // { project: {name: name, id:id}, task: {name: name, id:id} };
	
	mysql.beginTransaction(function(err) {
		if(err) return next({ msg: "Failed to clock-in" });

		let projectID;

		if(body.task && !body.project) {
			throw "Failed to clock-in, invalid activity";
		} else if (body.project && body.task) {	
			const query = {
				sql: "select * from task_in_project where pid = ? and tid = ?",
				values: [body.project.id,body.task.id]
			}
			mysql.query(query)
				.then((rows) => {
					if(!rows[0]) {
						throw "Current task is not in the project"
					}
				})
				.catch((err) => {
					console.log(err);
					mysql.rollback();
					return next({ msg: "Auth Failed" });
				});
		}
		
		const tid = body.task ? body.task.id : '0';
		const pid = body.project ? body.project.id : '0';
		
		const activity = tid+pid
		const sqlClockInStatement = {
			sql: "update employees set is_clocked_in = 1, clock_in_time = CURRENT_TIMESTAMP, current_activity = ?, current_project = ?, current_task = ? where employee_id = ?",
			values: [tid + pid, body.project ? body.project.id : 0, body.task ? body.task.id : 0, req.eid]
		}
		
		console.log(sqlClockInStatement.sql);

		mysql.query(sqlClockInStatement)
			.then((rows) => {
				if(rows.affectedRows === 0) {
					console.log(rows)
					throw "Failed to clock-in";
				}
				mysql.commit();
				res.status(200).json(body);
			})
			.catch((err) => {
				mysql.rollback();
				return next({ msg: err });
			});
	});

}

const clockOut = (req, res, next) => {
	mysql.beginTransaction(function(err) {
		if(err) return next({ msg: "Failed to clock-out" });

		const query = "update employees set is_clocked_in = 0, employees.current_activity = null";
		const sqlStatement = {
			sql: query,
			values: []
		};

		mysql.query(sqlStatement)
			.then((rows) => {
				if(rows.affectedRows === 0) {
					throw "Failed to clock-out";
				}
				mysql.commit();
				res.status(200).send();
			})
			.catch((err) => {
				mysql.rollback();
				return next({ msg: err });
			});
	});
}


function getEmployeeList(departmentId) {
  	const query1 =  //gets all employees in department
  	    "select d.name as dep_name, d.manager_id, e.employee_id, e.first_name as employee_first_name, e.last_name as employee_last_name, w.role, w.access \
  	    from departments d \
  	    join works_in w \
  	    on w.did = d.department_id \
  	    join employees e \
  	    on e.employee_id = w.eid \
  	    where d.department_id = ? and e.is_deleted = 0";
	
    const sqlStatement1 = {
        sql: query1,
        values: [depId]
    }
    return mysql.query(sqlStatement1);
}

const listEmployees = (req, res, next) => {
	let employees = [];

	getEmployeeList(req.param.depId)
		.then(rows => {
			if(rows.length >= 1) {
				const rowsLength = Object.keys(rows).length;
				for(let i=0; i<rowsLength; i++) {
					employees[i] = {
						firstname: rows[i].first_name,
						lastname: rows[i].first_name
					}
				}
			}
		})
		.catch(err => {}); 
	res.send();
}

const deleteEmployee = (req, res, next) => {

	const managerSQL = {
		sql: "select * from works_in where eid = ? and did = ?",
		values: [req.eid, req.params.depId]
	};

	mysql.query(managerSQL)
	.then((rows) => {
		if(rows.length >= 1) {
			if(rows[0].access != "manager" && rows[0].access != "overseer") {
				return next({ msg: "Not authorized to delete employee" });	
			}
		} else {
			return next({ msg: "Unable to verify authority" });	
		}
	});

	if(req.body.departmentOnly) {
		const employeeSQL = {
			sql: "delete from works_in where eid = ? and did = ?",
			values: [req.body.id, req.params.depId]
		};
		mysql.query(employeeSQL)
			.then((rows) => {
				if(rows.affectedRows != 0) {
					res.status(200).json({});
				} else {
					return next({ msg: "error deleting employee from department" });
				}
			});
	} else {
		const employeeSQL = {
			sql: "update employees set is_deleted = 1 where employee_id = ?",
			values: [req.body.id]
		};
	
		mysql.query(employeeSQL)
		.then((rows) => {
			if(rows.affectedRows != 0) {
				res.status(200).json({});
			} else {
				return next({ msg: "error deleting employee" });
			}
		});
	}
}


const singleEmployee = (req, res, next) => {
	try {
		let employeeSql = {
			sql: `select e.first_name, e.last_name, e.email, e.username, e.wage, w.role, w.did, w.access 
				from employees e join works_in w on w.eid = e.employee_id where e.employee_id = ? and w.did = ?`,
			values: [req.params.id, req.params.depid]
		}
		
		if(req.eid != req.params.id) {

			const managerSQL = {
				sql: 'select access from works_in where eid = ?',
				values: [req.eid]
			}
			
			mysql.query(managerSQL)
				.then((rows) => {
					if(!rows[0]) throw "Could not find employee"
					else if(rows[0].access != "manager" && rows[0].access != "overseer") {
						throw "You do not have access to this employee"
					} 
				})
		}

		mysql.query(employeeSql)
			.then((rows) => {
				if(!rows[0]) throw "Could not find employee"
				const foundEmployee = {
					firstname: rows[0].first_name,
					lastname: rows[0].last_name,
					email: rows[0].email,
					username: rows[0].username,
					department: rows[0].did,
					wage: rows[0].wage,
					access: rows[0].access,
					role: rows[0].role
				}
				res.status(200).json(foundEmployee);
			})

	} catch(err) {
		return next({ msg: err });
	}

}

const updateEmployeeManager = (req, res, next) => {
	const body = req.body;


	const managerSqlStatement = {
		sql: "select access from works_in where eid = ? and did = ?",
		values: [req.eid, req.params.depId]
	}

	mysql.query(managerSqlStatement)
		.then((rows) => {
			if(!rows[0]) return next({msg: "error getting employee"})
			else if(rows[0].access != "manager" && rows[0].access != "overseer") {
				return next({msg: "You do not have access to update this employee"})
			} else {
				const columnMap = {
					firstname: 'first_name',
					lastname: 'last_name',
					username: 'username',
					wage: 'wage',
					email: 'email',
					access: 'access',
					role: 'role'
				}
			
				let employeeQuerySql = "update employees set ";
				Object.keys(body).forEach((key, i) => {
					if(key != "id" && key != "access" && key != "role" && key != "wage") {
						employeeQuerySql += columnMap[key] + "='" +  body[key] + "',";
					} else if (key === "wage") {
						employeeQuerySql += columnMap[key] + "=" +  body[key] + ",";
					}
				});
				employeeQuerySql = employeeQuerySql.substring(0, employeeQuerySql.length - 1) + " where employee_id = ?";
			
				let worksInQuerySql = "update works_in set ";
				Object.keys(body).forEach((key, i) => {
					if(key != "id" && key != "firstname" && key != "lastname" && key != "email" && key != "username" && key != "wage") {
						worksInQuerySql += columnMap[key] + "='" +  body[key] + "',";
					}
				});
				worksInQuerySql = worksInQuerySql.substring(0, worksInQuerySql.length - 1) + " where eid = ? and did = ?";
			
				const employeeUpdateSql = {
					sql: employeeQuerySql,
					values: [req.params.id]
				};
				const worksInUpdateSql = {
					sql: worksInQuerySql,
					values: [req.params.id, req.params.depId]
				};
			
				mysql.beginTransaction(function(err) {
					try {
					
						if(err) return next({ msg: "Database connection failure" });
			
						if(employeeQuerySql.length > 43 && worksInQuerySql.length > 46) {
							const results = mysql.query(employeeUpdateSql);
							results.then((rows) => {
								if(rows.affectedRows === 0) {
									throw "Failed update employee 1.";
								}
							})
							.then(() => {
								mysql.query(worksInUpdateSql)
									.then((rows) => {
										if(rows.affectedRows != 0) {
											mysql.commit();
											res.status(200).json({});
										} else {
											mysql.rollback();
											res.status(500).json({ msg: "error updating employee" });
										}
									});
							})
							.catch((errr) => {
								mysql.rollback();
								return next({ msg: errr });
							});
						} else if(employeeQuerySql.length > 43) {
							mysql.query(employeeUpdateSql)
								.then((rows) => {
									if(rows.affectedRows === 0) {
										throw "Failed to update employee 2.";
									} else {
										mysql.commit();
										res.status(200).json({});
									}
								})
								.catch((errr) => {
									mysql.rollback();
									return next({ msg: errr });
								});
							
						} else if (worksInQuerySql.length > 46) {
							mysql.query(worksInUpdateSql)
								.then((rows) => {
									if(rows.affectedRows != 0) {
										mysql.commit();
										res.status(200).json({});
									} else {
										mysql.rollback();
										return next({ msg: "error updating employee" });
									}
								})
								.catch((errr) => {
									mysql.rollback();
									return next({ msg: errr });
								});
			
						}
						
				
						
				
					} catch (error) {
						mysql.rollback();
						return next({ msg: error });
					}
				})
			}
		})
	
	
	
}


const addEmployee = (req, res, next) => {
	const {firstname, lastname, role, wage, department, access} = req.body;
	const username = req.body.username.toLowerCase();
	const email = req.body.email.toLowerCase();

	const managerSQL = {
		sql: "select * from works_in where eid = ? and did = ?",
		values: [req.eid, department]
	};

	const managerResult = mysql.query(managerSQL);
	managerResult.then((rows) => {
		if(rows[0].access != "manager" && rows[0].access != "overseer") {
			return next({ msg: "You are not authorized" });
		}
	});

	const employeeSQL = {
		sql: "INSERT INTO employees (first_name, last_name, username, wage, email) VALUES (?, ?, ?, ?, ?)",
		values: [firstname, lastname, username, wage, email]
	}

	let eid;
	mysql.beginTransaction(function(err) {
			try {
				if(err) return next({ msg: "Database connection failure" });
		
				const employeeResults = mysql.query(employeeSQL);
				employeeResults.then((rows) => {
					if(rows.affectedRows === 0) {
						throw "Failed to create employee, make sure inputs are correct.";
					}
				})

				const newSQL = {
					sql: "select employee_id from employees where username = ? and email = ?",
					values: [username, email]
				}

				mysql.query(newSQL)
					.then((rows) => {
						if(!rows[0]) throw "error creating employee"
						else eid = rows[0].employee_id;
					}
			)

				.then(() => {
					const finalSQL = {
						sql: "insert into works_in (eid, did, role, access) values (?, ?, ?, ?)",
						values: [eid, department, role, access]
					}

					mysql.query(finalSQL)
						.then((rows) => {
							console.log('add');
							try {
								console.log(`Client/image/pfp/${eid}.png`)
								const pfp = req.body.pfp;
								const pfpBuffer = Buffer.from(pfp, 'base64');
								console.log(pfp)
								console.log(`Client/images/pfp/${eid}.png`)
								fs.writeFile(`Client/images/pfp/${eid}.png`, pfpBuffer, (err) => {
									console.log(err);
								});
							} catch(err) {
								res.status(400).json({error: err});
							}

							if(rows.affectedRows === 0) {
								throw "failed to create employee...";
							} else {
								mysql.commit();
								res.status(200).json({});
							}
						})
				})
				
				.catch((err) => {
					console.log(err);
					mysql.rollback();
					return next({ msg: "Error adding employee" });
				});
			} catch (error) {
				mysql.rollback();
				return next({ msg: "Error adding employee" });
			}
	});
}

const getActivity = (req, res, next) => {

	const sqlStatement = {
		sql: `select ((UNIX_TIMESTAMP(current_timestamp) - UNIX_TIMESTAMP(start_time))/60) as time_diff, em.first_name, em.last_name, e.start_time, e.end_time, e.pid, e.tid, p.name as proj_name, t.name as task_name 
			from employee_activity e 
			join projects p on p.project_id = e.pid
			join tasks t on t.task_id = e.tid
			join employees em on em.employee_id = e.eid
			where eid = ? order by time_diff asc`,
		values: [req.eid]
	}

	let timePeriod = req.body.timePeriod == 0 ? Number.MAX_VALUE : req.body.timePeriod;

	let activity = [];

	mysql.query(sqlStatement)
		.then((rows) => {
			if(!rows[0]) {
				res.status(200).json({
					id: req.eid,
					firstname: "no",
					lastname: "information",
					activity: []
				})
			} else {
				for(let i=0; i<rows.length; i++) {
					if(rows[i].time_diff < timePeriod) {

						activity.push({
							project: rows[i].proj_name,
							task: rows[i].task_name,
							startTime: rows[i].start_time,
							endTime: rows[i].end_time
						})
					}
				}
				res.status(200).json({
					id: req.eid,
					firstname: rows[0].first_name,
					lastname: rows[0].last_name,
					activity: activity
				});
			}
		})
		.catch((err) => {
			return next({ msg: "Error getting activity" });
		});
	
	
	
}

exports.getDeadlines = getDeadlines;
exports.account = account;

exports.createEmployee = createEmployee;
exports.auth = auth;
exports.clockIn = clockIn;
exports.clockOut = clockOut;

exports.addEmployee = addEmployee;
exports.listEmployees = listEmployees;
exports.deleteEmployee = deleteEmployee;
exports.singleEmployee = singleEmployee;
exports.updateEmployeeManager = updateEmployeeManager;
exports.getActivity = getActivity;





/*
	mysql.beginTransaction(function(err) {
		if(err) return next({ msg: "" });
		const results = mysql.query(sqlStatement);
		results.then((rows) => {

		})
		.then(() => {
			
		})
		.catch((err) => {
			mysql.rollback();
			return next({ msg: "Auth Failed" });
		});
	});
*/

