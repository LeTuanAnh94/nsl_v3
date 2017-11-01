/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/
   verify:{
   		student_link:'http://localhost:1337/student/verify',
   		teacher_link:'http://localhost:1337/teacher/verify',
   },
   passport:{
   		facebook:{
   			clientID: "1981357885487132", 
			clientSecret: "f2fe1dfa7625333b16b8e76c29943538", 
			callbackURL: "http://localhost:1337/login/facebook/callback",
			profileFields: ['id','name', 'picture.width(320).height(320)']
   		},
   		google:{
   			clientID: '511258496559-eign3di3tgdb84iv6ckv8qv55ou1l0e8.apps.googleusercontent.com',
		    clientSecret: 'PQKGgPikobqLUIcJkal6uflO',
		    callbackURL: "http://localhost:1337/login/google/callback",
			profileFields: ['id','email','name','displayName','picture']
   		}
   },
  models: {
    connection: 'someMysqlServer'
  },
  hookTimeout: 1800000
};
