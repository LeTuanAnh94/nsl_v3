// /**
//  * UserController
//  *
//  * @description :: Server-side logic for managing users
//  * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
//  */

// var checkRole = require('../services/checkRole.js').check;
// module.exports = {
// 	registerUser: function (req, res) {
// 		var newUser = {
// 				email: req.body.email.trim(),
// 				fullname: req.body.fullname.trim(),
// 				password: req.body.password.trim(),
// 				avatar:'/images/avatar-default.png'
// 		};
// 		User.find({
// 			email: req.body.email.trim()
// 		}).then(function (users) {
// 			if(users.length != 0 && users[0].isActive){
// 				return res.json({message:'email_exist'})
// 			}
// 			if(!users.length){
// 				User.create(newUser).then(function(user){
// 					require('../services/verifyEmail.js').sendVerify(user, function(err){
// 						if(err){
// 							return res.json({message:'error'});
// 						}else{
// 							return res.json({message:'success'})
// 						}
// 					});
// 				});
// 			}else{
// 				User.update({id:users[0].id},newUser).then(function(user){
// 					require('../services/verifyEmail.js').sendVerify(user[0], function(err){
// 						if(err){
// 							return res.json({message:'error'});
// 						}else{
// 							return res.json({message:'success'})
// 						}
// 					});
// 				});
// 			}
			
// 		});
// 	},
// 	verifyUser: function(req, res){
// 		if(!req.query) return res.notFound();
// 		if(!req.query.verifycode) return res.notFound();
// 		require('../services/verifyEmail.js').verifyCode(req.query.verifycode, function(id){
// 			if(!id) return res.notFound();
// 			User.find({
// 				id: parseInt(id)
// 			}).then(function (users) {
// 				if(users.length != 0){
// 					if(users[0].isActive) return res.notFound();
// 					User.update({
// 						id: parseInt(id)
// 					},{
// 						isActive: true
// 					}).then(function(user){
// 						return res.view('index/verifyUser.ejs');
// 					}).catch(function(err){
// 						return res.badRequest(err);
// 					});
// 				}else{
// 					return res.notFound();
// 				}
// 			})
			
// 		});
// 	},
// 	myprofile: function(req, res){
// 		if(checkRole(req) == 'guest') return res.json({message:'error'});
// 		var userId = req.session.passport.user.id;
// 		User.findOne({
// 			select:['id','avatar','fullname','job','description','teacherDescription','teacherStatus','teacherUpdateDate'],
// 			where:{
// 				id: userId
// 			}
// 		}).exec(function(err,user){
// 			return res.json({user:user});
// 		})
// 	},
// 	edit: function(req, res){
// 		if(checkRole(req) == 'guest') return res.json({message:'error'});
// 		var userId = req.session.passport.user.id;
// 		// check displayName
// 		User.update({id: userId},{
// 			fullname: req.body.fullname,
// 			job: req.body.job,
// 			description: req.body.description
// 		}, function(err, user){
// 			if(err)	return res.json({message:"error"});
// 			if(!user[0]) return res.json({message:"error"});
// 			if(!req.body.isUpload) return res.json({message:'success'});
// 			var fs = require('fs');
// 			var path = require('path');
// 			var folderPicuture = path.join(__dirname, '../../assets/Avatars/' + userId);
// 			var myMkdirSync = function(dir){
// 			    if (fs.existsSync(dir)){
// 			        return
// 			    }

// 			    try{
// 			        fs.mkdirSync(dir)
// 			    }catch(err){
// 			        if(err.code == 'ENOENT'){
// 			            myMkdirSync(path.dirname(dir)) //create parent dir
// 			            myMkdirSync(dir) //create dir
// 			        }
// 			    }
// 			}
// 			myMkdirSync(folderPicuture);
// 			fs.writeFile(folderPicuture + '/picture.png', req.body.avatar.replace(/^data:image\/png;base64,/, ""), 'base64', function(err) {
// 		        if(err){
// 		        	res.json({message:'have_error', err:err});
// 		        }
// 		        else{
// 		        	var picture = '/Avatars/' + userId + '/picture.png';
// 		        	User.update({id:userId},{
// 		        		avatar:picture
// 		        	},function(err, user){
// 		        		if(err) return res.json({message:'have_error'});
// 		            	return res.json({message:'success'} );
// 		        	})
// 		        }
// 		    });
// 		});
// 	},
// 	submitApproveTeacher: function(req, res){
// 		if(checkRole(req) != 'member') return res.json({message:'error'});
// 		var userId = req.session.passport.user.id;
// 		var teacherStatus = 'not';
// 		//Check user đăng ký bằng email không và trạng thái teacher status của user	
// 		var checkUser = function(){
// 			return new Promise(function(fullfill, reject){
// 				User.findOne({id:userId}).exec(function(err, user){
// 					if(err) return reject(err);
// 					if(!user) return reject('user_not_found')
// 					if(!user.email){
// 						return reject('not_have_email');
// 					}else{
// 						teacherStatus = user.teacherStatus;
// 						return fullfill();
// 					}
// 				})
// 			});
// 		}
// 		//Xử lý đơn đăng ký
// 		var handle = function(){
// 			return new Promise(function(fullfill, reject){
// 				if(teacherStatus != 'success'){
// 					var updateUserObj = {teacherStatus:teacherStatus,teacherDescription:req.body.teacherDescription}
// 					if(teacherStatus == 'not' || teacherStatus == 'reject'){
// 						updateUserObj.teacherStatus = 'waiting';
// 						updateUserObj.teacherUpdateDate = new Date();
// 					}
// 					User.update({id:userId},updateUserObj)
// 					.exec(function(err, users){
// 						if(err) return reject(err);
// 						return fullfill();
// 					});
// 				}else{
// 					return reject('is_teacher');
// 				}
// 			});
// 		}
// 		checkUser().then(handle).then(function(){
// 			return res.json({message:'success'});
// 		}).catch(function(err){
// 			console.log(err)
// 			return res.json({message:'error'});
// 		});
// 	},
// 	listTeacher: function(req, res){
// 		if(checkRole(req) != 'admin') return res.json({message:'error'});
// 		var teacherStatus = req.body.teacherStatus;
// 		var count = 0;
// 		var teachers = [];
// 		let countTeacher = function(){
// 	    	return new Promise(function(fullfill, reject){
// 	    		User.count({
// 						where:{
// 							teacherStatus:teacherStatus,
// 							email:{'contains':req.body.email}
// 						}
// 					}).exec(function(err, found){
// 	    			if(err) return reject(err);
// 	    			count = found;
// 	    			return fullfill();
// 	    		})
// 	    	})
// 	    }
// 	    let getTeachers = function(){
// 	    	return new Promise(function(fullfill, reject){
// 	    		User.count({teacherStatus:teacherStatus}).exec(function(err, found){
// 	    			User.find({
// 						select:['id','fullname','email','avatar','description','job','role','teacherDescription','teacherStatus'],
// 						where:{
// 							teacherStatus:teacherStatus,
// 							email:{'contains':req.body.email}
// 						},
// 						skip: req.body.skip,
// 			  			limit: req.body.limit,
// 						sort:'teacherUpdateDate'
// 					}).exec(function(err, lists){
// 						if(err) return reject(err);
// 						teachers = lists;
// 						return fullfill();
// 					});
// 	    		})
// 	    	})
// 	    }
// 	    countTeacher().then(getTeachers).then(function(){
// 	    	res.json({teachers:teachers,count:count,message:'success'});
// 	    }).catch(function(err){
// 	    	res.json({message:'error'})
// 	    })
		
// 	},
// 	updateAcountToTeacherRole: function(req, res){
// 		if(checkRole(req) != 'admin') return res.json({message:'error'});
// 		User.update({email:req.body.email},{role:'teacher',teacherStatus:'success'}).exec(function(err, users){
// 			if(err) return res.json({message:'error'});
// 			return res.json({message:'success'});
// 		});
// 	},
// 	rejectAcountToTeacherRole: function(req, res){
// 		if(checkRole(req) != 'admin') return res.json({message:'error'});
// 		User.update({email:req.body.email},{role:'member',teacherStatus:'reject'}).exec(function(err, users){
// 			if(err) return res.json({message:'error'});
// 			return res.json({message:'success'});
// 		});
// 	}
// };

