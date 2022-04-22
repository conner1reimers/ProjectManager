const express     			= require('express');
const bodyParser 			= require('body-parser');
const departmentRoutes     	= require('./routes/department.js');
const projectsRoutes     	= require('./routes/projects.js');
const employeeRoutes     	= require('./routes/employees.js');
const taskRoutes       	    = require('./routes/task.js');


const mysql = require('./mysql/mysql.js');
const parseCookies = require('./util/parseCookies');

const app = express();

let port = process.env.PORT || 5000;


const fileOptions = { root: __dirname + "/Client" };
app.use(express.static(fileOptions.root));
app.use(express.json());



app.use('/api/project', projectsRoutes);
app.use('/api/department', departmentRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/task', taskRoutes);

// For all request not /api/.....
app.get(/^\/(?!(api)).*/, async function (req, res, next) {
	const clientIpAddr = req.socket.remoteAddress.substring(7);
    const cookies = parseCookies(req.headers.cookie);

	let authError = false;

	if(cookies.SID) {
		const query = `	SELECT auth_token
					 	FROM cookies
						WHERE auth_token = ?`;

		
		const sqlStatement = {
			sql: query,
			values: [cookies.SID]
		}

		const results = await mysql.query(sqlStatement);
		// Was it a valid token
		console.log(clientIpAddr)
		if(!results[0])
			authError = true;
	} else
		authError = true;

    res.sendFile(authError ? "login.html" : "main.html", fileOptions)
	//res.sendFile("main.html", fileOptions)
});




app.listen(port, () => {
	console.log(`running on ${port}`)
})




/*
app.get("/", function(req, res){
	const clientIpAddr = req.socket.remoteAddress;
    const cookies = parseCookies(req.headers.cookie);

	const query = 
		'SELECT c.ip_address, c.auth_token, e.employee_id \
		FROM employees e, cookies c \
        join employee_cookie ec on ec.cookie_token = c.auth_token \
		WHERE e.employee_id = ec.eid AND c.auth_token = ? AND c.ip_address = ?'
	
	const sqlStatement = {
        sql: query,
        values: [cookies,clientIpAddr]
    }

	const results = msql.query(sqlStatement);

	let employeeId, authToken, ipaddr;
	
    results.then((rows) => {
        employeeId = rows[0].employee_id;
        authToken = rows[0].auth_token;
        ipaddr = rows[0].ip_address;

    });

	// if(employeeId) {
	// 	res.sendFile("main.html");
	// } else {
	// 	res.sendFile("login.html", fileOptions);
	// }

	res.sendFile("index.html");

});

app.use('/project', projectsRoutes);
app.use('/department', departmentRoutes);
app.use('/employee', employeeRoutes);

server.listen(port, function(){
	console.log('listening on *:' + port);
});
*/
