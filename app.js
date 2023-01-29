var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var session = require('express-session'); 

//다국어 팩키지 참조
const i18next = require('i18next');
const i18Backend = require('i18next-node-fs-backend');
const i18nextMiddleware = require('i18next-http-middleware');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


var app = express();

app.use(session({
  resave: true,
  saveUninitialized: false,
  secret: "mysecret",
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));


i18next
    .use(i18Backend)
    .use(i18nextMiddleware.LanguageDetector)
    .init({
        backend: {
            loadPath: __dirname + '/locales/{{lng}}/{{ns}}.json',
        },
        fallbackLng: 'en',
        preload: ['en', 'ko'],
        saveMissing: true,
    });
app.use(i18nextMiddleware.handle(i18next));



//다국어 세션적용 미들웨어 라우팅 메소드
app.use(function (req, res, next) {
  
  if(req.session.langCode == undefined){
    req.session.langCode = "ko";
    req.i18n.changeLanguage("ko");
  }else{
    req.i18n.changeLanguage(req.session.langCode);
  }

  res.locals.langCode = req.session.langCode == undefined ? "ko" : req.session.langCode;

  next();
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);


//뷰페이지 다국어 키워드 변경 미들웨어 기능추가
app.use(function (req, res, next) {
  res.locals.t = function (key) {
      return i18nextMiddleware.t(key);
  };
  next();
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
