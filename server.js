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

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Credentials", true);
	res.setHeader(
		"Access-Control-Allow-Headers",
		"*, Origin, set-cookie, X-Requested-With, Content-Type, Accept, Authorization, append, delete,entries,foreach,get,has,keys,set,values"
	);
	res.setHeader("Access-Control-Max-Age", "86400");
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, PATCH, DELETE, OPTIONS"
	);
	res.setHeader("Access-Control-Max-Age", 86400);
	if (req.method === "OPTIONS") {
		return res.status(200).end();
	} else {
		next();
	}
});

app.use('/api/project', projectsRoutes);
app.use('/api/department', departmentRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/task', taskRoutes);

// For all request not /api/.....
app.get(/^\/(?!(api)).*/, async function (req, res, next) {
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
		if(!results[0])
			authError = true;
	} else
		authError = true;

    res.sendFile(authError ? "login.html" : "main.html", fileOptions)
	//res.sendFile("main.html", fileOptions)
});

// SPECIAL ERROR HANDLING MIDDLEWARE FUNCTION - only runs when an error is thrown
app.use((error, req, res, next) => {
	if (req.file) {
		fs.unlink(req.file.path, (err) => {
			console.log(err);
		});
	}

	if (res.headerSent) {
		return next(error);
	}
	res.status(error.code || 500); // 500 means something went wrong on the server
	res.json({ message: error.message || "THERE WAS AN ERROR" });
});


app.listen(port, () => {
	console.log(`running on ${port}`)
})



