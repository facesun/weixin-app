/**
 * @author zhaolin
 */
var logger = require('../logger.js');
var mysql = require('mysql');
var fs = require('fs');

var dbconn = null;
var connInfo = {
		  host: '',
		  user: '',
		  port: "",
		  password: '',
		  database: "subscribe",
		  charset: "",
		  insecureAuth: true
};
function readConfig(){
	fs.readFile('/home/zhaolin/config/dbconfig.properties',function(err,data){
		if(err) throw err;
		console.log(data);
	});
};
readConfig();
//connectInit();
/**
 * 初始化，DB连接
 * 
 * @param connection
 */
function connectInit() {
  dbconn = mysql.createConnection(connInfo);
  logger.info("connect to db :" + JSON.stringify(connInfo));
  dbconn.query('set interactive_timeout=200*3600');
  dbconn.query('set wait_timeout=200*60*60');
  dbconn.on('error',
		  function(err) {
	    if (!err.fatal) {
	      return;
	    }
	    if (err.code == 'PROTOCOL_CONNECTION_LOST' || err.code == 'ECONNREFUSED') {
	      logger.error(' db connect lost, reconnet ing :' + err.code + " : " + err.stack);
	      connectInit(connInfo);
	      dbconn.connect();
	    } else {
	      throw err;
	    }
	  });
}
/**
 * 执行sql
 * 
 * @param sql
 * @param callback
 * @returns
 */
function doQuery(sql, callback) {
  logger.info(sql);
  dbconn.query({
    sql: sql,
    nestTables: true
  },
  function(err, results) {
    if (err) {
      logger.error("execute sql error:" + sql + " ERROR CODE:" + err.code);
    } else {
      logger.info(sql + " : SUCCESS");
      if (callback) {
        callback(results);
      }
    }
  });
};
/**
 * 执行数据库链接
 */
exports.execute = doQuery;