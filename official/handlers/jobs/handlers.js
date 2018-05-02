/* handlers.js
* Honeyscape
*"function handlers for job management"
*By:Zach Banducci, Tyrone Criddle, Fernando Corral
*/

// Important query handler for database
const database = require('../database');

// Import neccesary query files
const jobs = require('./query');
const account = require('../account/query');
const supplies = require('../supplies/query');

// Function handler for creating a user job
function create(request, reply) {
	database.runQueryPromise(account.isSupplier(request.params))
		.then( (results) => {
			console.log(results);
			if (results[0]) throw 'no-page';
			database.runQueryPromise(jobs.add(request.payload, request.params));
		}).then( () => {
			return reply({
				title: "Job created"
			}).code(200);//Returns code 200 if job creation is successful
		}).catch( (error) => {
			if(error === 'no-page') {
				return reply().code(400);//Returns code 400 if unable to create job because of a bad request
			} else {
				console.log(error);
				return reply().code(400);//If server runs into an error return code 400
			}
		});
}

//Function handler for editing a user job
function editJob(request, reply) {
	database.runQueryPromise(jobs.edit(request.payload, request.params))
	.then( () => {

		let string = "";
		let data;
		try {
			data = JSON.parse(request.payload.supplies);
		} catch (error) {
			data = request.payload.supplies;
		}
		for (let i = 0; i < data.length; i++) {
			string += '(';
			string += request.params.job_id + ', ';
			string += data[i]['supply_id'] + ')';
			if(i != data.length-1) {
				string += ',';
			}
		}

		console.log(string);
		database.runQueryPromise(supplies.addToList(string))
		.then(() => {})
		.catch((error) => {
			console.log(error);
			throw error;
		});
			return reply({
				message: "Job Modified"
			}).code(200);//Returns code 200 if succcesful job edit
		}).catch( (error) => {
			if(error) {
				console.log(error);
				return reply().code(400);//If server runs into an error return code 400
			}
	})
}

// Delete job related to job_id
function remove(request, reply) {
	database.runQueryPromise(jobs.remove(request.params))
	.then((results) => {
		return reply().code(200);
	}).catch((error) => {
		console.log(error)
		return reply().code(400);
		// If server runs into an error return code 400
	});
};

function retrieveAll(request, reply) {
	database.runQueryPromise(account.isSupplier(request.params))
		.then( (results) => {
			if (results[0].isSupplier) throw 'no-page';
			database.runQueryPromise(jobs.retrieveAll(request.params));
		}).then( (results) => {
			return reply(results).code(200);
		}).catch( (error) => {
			if (error === 'no-page') {
				return reply().code(400);
			} else {
				console.log(error);
				return reply().code(400);
			}
		});
}

module.exports = {
	create,
	remove,
	retrieveAll,
	editJob,
};
