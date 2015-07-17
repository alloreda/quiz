
var models=require('../models/models.js');



var  stats={
	n_preguntas:0,
	n_comments:0,
	comments_preg :0,
	preg_nocomments :0,
	preg_comments:0
}
	calculos=[];
errors=[]; 
exports.calculate=function(req,res, next){ //encadenación es para asegurar que todos los métodos acaban y nos devuelven el resultado antes de que acabe la ejecución de calculo; recuerda que son funciones asíncronas.
	models.Quiz.count()
	.then(function(n_preguntas){
		stats.n_preguntas=n_preguntas;
		return models.Comment.count()})
	.then (function(n_comments){
		stats.n_comments=n_comments;
		 return models.Comment.aggregate('QuizId', 'count', { distinct: true })})
	
	.then (function(preg_comments){
		stats.preg_comments=preg_comments;
		stats.preg_nocomments=stats.n_preguntas-stats.preg_comments;
			if (stats.n_preguntas>0){
				stats.comments_preg=(stats.n_comments /stats.n_preguntas).toFixed(2);
			}else{
				stats.comments_preg=0;
			}
	})
	.catch(function (error) { next(error) })
	.finally(function() {next()})

   };

   //GET /quizes/statistics
   exports.show=function(req,res){
 	res.render('quizes/statistics', {n_preguntas:stats.n_preguntas , n_comments: stats.n_comments , comments_preg:stats.comments_preg  , preg_nocomments:stats.preg_nocomments  , preg_comments: stats.preg_comments, errors:[]});
 
    };

	
		


