var express = require('express');
var router = express.Router();
const SSH = require('ssh2').Client;


// const sshConfig = {
//     host: '103.60.127.85',
//     port: 22,
//     username: 'root',
//     password: 'o2webserver~', // 또는 키파일 사용 가능
// };

const sshConfig = {
  host: "",
  port: "",
  username: "",
  password: "",
}



/* GET home page. */
router.post('/config', function(req, res, next) {
    sshConfig.host = req.body.host;
    sshConfig.port = req.body.port;
    sshConfig.username = req.body.username;
    sshConfig.password = req.body.pw;
    
    res.send("<script>location.href='/GUI';</script>");
});


router.get('/start', function(req, res, next) {
  const conn = new SSH();
  
  const command = 'ls ~'; // 실행할 SSH 명령
  
  conn.on('ready', () => {
    conn.exec(command, (err, stream) => {
      if (err) {
        res.send(err)
      }

      let result = [];

      stream
        .on('data', (data) => {
          const lsList = data.toString('utf8').split("\n")

          lsList.map((value) => {
              if(value){
                  result.push(value);
              }
              
          })
        })
        .on('close', (code, signal) => {
          conn.end();
          res.send(result);
        });
    });
  }).connect(sshConfig);
});





module.exports = router;