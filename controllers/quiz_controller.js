
var models=require('../models/models.js');

//Autoload - factoriza el código si ruta incluye :quizId
exports.load =function(req, res, next, quizId) {
	models.Quiz.find(quizId).then (function(quiz) {

				if (quiz) {
					req.quiz=quiz;
								errors=[]; //prueba
					next();
				} else { next(new Error('No existe quizId=' + quizId));}
			}
		). catch(function(error) {next(error);});
};

//GET/quizes
exports.index=function(req,res){
 var busqueda=req.query.search;



if  (busqueda) {
	texto  = busqueda.replace(" ", "%");
	texto  ='%'+ texto +'%';
	models.Quiz.findAll({where: ["lower(pregunta) like ?", texto], order: [['pregunta', 'DESC']]}).then(function(quizes){
		res.render('quizes/index.ejs',{quizes:quizes, errors:[]});
	}
	).catch(function(error){next(error);})
}else {
	models.Quiz.findAll().then(function(quizes){
		res.render('quizes/index.ejs',{quizes:quizes, errors:[]});
	}
	).catch(function(error){next(error);})
}
};


//GET /quizes/:id
exports.show=function(req,res){
		res.render('quizes/show',{quiz:req.quiz});
};

//GET /quizes/:id/answer
exports.answer=function(req,res){
	var resultado='Incorrecto';
	if(req.query.respuesta === req.quiz.respuesta){
			resultado='Correcto';
	} 
	res.render('quizes/answer', { quiz:req.quiz , respuesta:resultado, errors:[] });
};

//GET /quizes/autor
exports.autor=function(req,res){
	res.render('quizes/autor', {autor:'Aranzazu Lloreda', errors:[]});
};


//GET /quizes/new
exports.new=function(req,res){
	var quiz=models.Quiz.build({pregunta:"Pregunta", respuesta:"Respuesta"});// crea objeto quiz
	res.render('quizes/new', {quiz:quiz, errors:[]});
};

//POST /quizes/create
exports.create=function(req,res){
	var quiz=models.Quiz.build(req.body.quiz);// crea objeto quiz

	quiz.validate().then(
			function(err){
				if (err){
					res.render('quizes/new', { quiz:quiz, errors:err.errors});
				} else{
					quiz.save({fields:["pregunta", "respuesta"]}).then (function(){res.redirect('/quizes')})	//guarda en DB los campos pregunta y respuesta de quiz
				} //res.redirect:redireccion http a lista de preguntas
			}
	);
	
};

