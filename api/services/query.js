var mysql = {
	selectTeacherHasMostCourse: function (number) {
		var query = 'SELECT c.teacher,u.fullname,(select count(*) from mall.course where mall.course.teacher = c.teacher and mall.course.status ="active") as total ' + 
					'FROM mall.course as c, mall.teacher as u ' +
					'WHERE c.teacher = u.id ' +
					'GROUP BY c.teacher ' +
					'ORDER BY total DESC ' +
					'LIMIT '+ number;
		var db = sails.config.connections.someMysqlServer.database;
		String.prototype.replaceAll = function(search, replacement) {
		    var target = this;
		    return target.replace(new RegExp(search, 'g'), replacement);
		};
		query = query.replaceAll('mall',db);
		return query;
	}
}
module.exports = mysql