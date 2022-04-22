const parseCookies = require('../util/parseCookies');
const mysql = require('../mysql/mysql.js');



module.exports = (req, res, next) => {
    const clientIpAddr = req.socket.remoteAddress.substring(7);
    const cookies = parseCookies(req.headers.cookie);
    let employeeID;

    console.log('auth check');
	if(cookies.SID) {	
		const query = `	SELECT auth_token, eid
					 	FROM cookies
						WHERE auth_token = ?`;
		const sqlStatement = {
			sql: query,
			values: [cookies.SID]
		}
		const results = mysql.query(sqlStatement);

        results.then((rows) => {
            if(!rows[0]) 
                return res.status(403).json({
                    message: 'You are unauthorized'
                });
            else {
                req.eid = rows[0].eid;
                console.log('auth check success');
                next();
            }
        })
        
	} else {
        return res.status(403).json({
            message: 'You are unauthorized'
        });
    }
}