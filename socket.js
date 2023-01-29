var os = require('os');
const SocketIO = require('socket.io');
var i18n = require('i18next');

//소켓통신 모듈
module.exports = (server) => {

    //express서버와 socket.io연결
    const io = SocketIO(server, { path: '/socket.io' });


    //socket 연결이 완료된 상태에서의 기능처리
    io.on('connection', (socket) => {

        //소켓Req객체
        const req = socket.request;

        //접속 클라이언트 IP주소
        const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const socketID = socket.id;
        let chatNickName = "";

        //소켓 다국어  환경 전환 
        //i18n.changeLanguage("en");

        //console.log('새로운 클라이언트 접속!', userIP, socket.id, req.ip);

        //소켓 연결해제
        socket.on('disconnect', () => {
            clearInterval(socket.interval);
        });

        //소켓 에러발생시 로깅
        socket.on('error', (error) => {
            console.error(error);
        });

  
        //그룹채팅 메시지 전송
        socket.on('sendmsg', function (message) {
         
            //소켓 다국어  환경 전환 
            //i18n.changeLanguage("ko");

            var serverSendMsg = i18n.t("greeting");
            socket.emit('receivemsg',serverSendMsg);
              
        });


    });
};