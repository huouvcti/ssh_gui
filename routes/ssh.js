var express = require('express');
const { Client } = require('ssh2');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    // const sshConfig = {
    //     host: '103.60.127.85',
    //     port: 22,
    //     username: 'root',
    //     password: 'o2webserver~', // 또는 키파일 사용 가능
    // };


    const sshConfig = {
        host: req.query.host,
        port: req.query.port,
        username: req.query.username,
        password: req.query.pw,
    }
    
      const command = 'ls'; // 실행할 SSH 명령
    
      const conn = new Client();
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
              res.send(result); // 결과를 클라이언트로 전송
            });
        });
      }).connect(sshConfig);
});

module.exports = router;