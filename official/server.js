/* server.js
* Honeyscape
*"Defined routes http endpoints"
*By:Zach Banducci, Tyrone Criddle, Fernando Corral
*/
const Hapi = require('hapi');
const server = new Hapi.Server();
const account_handler = require('./account/handlers');
const job_handler = require('./jobs/handlers');
const review_handler = require('./reviews/handlers');
const supply_handler = require('./supplies/handlers');
const supplier_handler = require('./suppliers/handlers');
const task_handler = require('./tasks/handlers');
const cookie = require('hapi-auth-cookie');
const query = require('./query');

server.connection({ port: 5000, host: "0.0.0.0",
	routes: {
		cors: {
			origin: ["*"],
			headers: ["Access-Control-Allow-Origin","Access-Control-Allow-Headers","Content-Type"],
			credentials: true
		}
	},
});

const scheme = function (server, options) {
	return {
		authenticate: function (request, h) {

			const authorization = request.headers.authorization;
			if (!authorization) {
				throw Boom.unauthorized(null, 'Custom');
			}
			return h.authenticated({ credentials: { user: 'john' } });
		}
	};
};

server.auth.scheme('cookie', scheme)

server.auth.strategy('session', 'cookie', {
	password: 'oatmeal-raisin',
	cookie: 'chocolate-chip'
})

//Account Management Routes***************************************************************************

//Login route
server.route({
	method: 'PUT',
	path: '/login',
	handler: account_handler.login
});

//Creates account
server.route({
	method: "POST",
	path: "/signup",
	handler: account_handler.register
});

//Makes changes to user account
server.route({
	method: "POST",
	path: "/account",
	handler: account_handler.edit
})

//Changes user password
server.route({
	method: "POST",
	path: '/changepassword',
	handler: account_handler.changePassword
});

//Returns info about user based on user ID
server.route({
	method: "GET",
	path: '/userpage/{id}',
	handler: account_handler.retrieve
});
// End of Account Management Routes***************************************************************************


// Supplier Management routes********************************************************************************

// Views a supplier's page if a supplier id is provided and shows all 
server.route({
	method: "GET",
	path: "/suppliers/{supplier_id?}",
	handler: supplier_handler.view
});

server.route({
	method: "GET",
	path: "/suppliers/supply/{supply_name}",
	handler: supplier_handler.viewAllSuppliersName
});

server.route({
	method: "GET",
	path: "/suppliers/supplyID/{supply_id}",
	handler: supplier_handler.viewAllSuppliersID
});
// End of Supplier Management routes********************************************************************************


// Supply Management routes ********************************************************************************
server.route({
	method: "GET",
	path: '/supplies',
	handler: supply_handler.retrieveTypes
});

server.route({
	method: "POST",
	path: "/suppliers/addsupplies",
	handler: supply_handler.create
});

server.route({
	method: "DELETE",
	path: '/suppliers/remove',
	handler: supply_handler.remove
});

server.route({
	method: "POST",
	path: "/suppliers/edit",
	handler: supply_handler.editPrice
});

server.route({
	method: "GET",
	path: '/suppliers/{id}/supplies',
	handler: supply_handler.view
});
// End of Supply Management routes ********************************************************************************

//Reviews Management routes ********************************************************************************
server.route({
	method: "GET",
	path: '/suppliers/{id}/reviews',
	handler: review_handler.retrieveAll
});

server.route({
	method: "PUT",
	path: '/suppliers/{id}/reviews',
	handler: review_handler.publish
});


server.route({
	method: "DELETE",
	path: '/suppliers/{id}/reviews',
	handler: review_handler.remove
});
//End of Reviews Management routes ********************************************************************************


//Jobs Management routes ********************************************************************************
server.route({
	method: "POST",
	path: '/jobs/create/{id}',
	handler: job_handler.create
});

server.route({
	method: "PUT",
	path: '/jobs/{job_id}',
	handler: job_handler.editJob
});

server.route({
	method: 'GET',
	path: '/jobs/{id}',
	handler: job_handler.retrieveAll
});

server.route({
	method: "DELETE",
	path: '/jobs/{job_id}',
	handler: job_handler.remove
});

server.route({
	method: "POST",
	path: '/jobs/{job_id}/addsupplies',
	handler: supply_handler.addToJob
});
//End of Jobs Management routes ********************************************************************************



//Tasks Management routes ********************************************************************************
server.route({
	method: "GET",
	path: '/jobs/{job_id}/tasks',
	handler: task_handler.retrieve
});

server.route({
	method: "POST",
	path: '/tasks/{account_id}',
	handler: task_handler.create
});

server.route({
	method: "PUT",
	path: '/tasks/{task_id}',
	handler: task_handler.edit
});

server.route({
	method: "DELETE",
	path: '/jobs/{job_id}/tasks',
	handler: task_handler.remove
});

server.route({
	method: "PATCH",
	path: "/jobs/{job_id}/tasks",
	handler: task_handler.complete
});
//End of Tasks Management routes ********************************************************************************

server.start(err => {
	if (err) {
		throw err;
	}
	console.log(`Server running at: ${server.info.uri}`);
});
