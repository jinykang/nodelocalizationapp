var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  //다국어 환경 변경적용
  //req.i18n.changeLanguage("en");

  //다국어 정보조회 
  //var test = req.t('greeting');
  
  //다국어 정보출력1 
  //console.log("다국어 데이터:",test);

  res.render('index', { title: 'Express' });
});

router.get('/changelang', function(req, res, next) {

  var langCode = req.query.lang;

  //다국어 환경 변경적용
  req.i18n.changeLanguage(langCode);
  req.session.langCode = langCode;


  //다국어 정보조회 
  var test = req.t('greeting');
  
  //다국어 정보출력1 
  console.log("다국어 데이터:",test);

  res.redirect("/");
  //res.render('index', { title: 'Express' });
});



module.exports = router;
