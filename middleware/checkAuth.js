const parseCookies = require('../util/parseCookies');
const mysql = require('../mysql/mysql.js');



module.exports = (req, res, next) => {
    const clientIpAddr = req.socket.remoteAddress.substring(7);
    const cookies = req.cookies;
    let employeeID;

    console.log('auth check');
	if(cookies.SID) {	
		const query = `SELECT auth_token, eid
					 	FROM cookies
						WHERE auth_token = ?`;
		const sqlStatement = {
			sql: query,
			values: [cookies.SID]
		}
		const results = mysql.query(sqlStatement);

        results.then((rows) => {
            if(!rows[0]) {
                console.log(rows)
                return res.status(403).json({
                    message: 'You are unauthorized'
                });
            }
                
            else {
                req.eid = rows[0].eid;
                next();
            }
        }).catch((err) => {
            console.log(err)
        })
        
	} else {
        return res.status(403).json({
            message: 'You are unauthorized'
        });
    }
}