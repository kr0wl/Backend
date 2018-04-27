const query = {
	retrieveAll: params =>
		`SELECT
			Name,
			Description,
			Priority,
			Creation_Date,
			Estimated_Date
		FROM Task
		WHERE Account_ID = ${params.id};`,
	create: payload =>
		`INSERT INTO Task (
			Account_ID,
			Name,
			Description,
			Priority,
			Creation_Date,
			Estimated_Date
		) VALUES (
			'${payload.account_id}',
			'${payload.taskname}',
			'${payload.description}',
			'${payload.priority}',
			'${payload.creation_date}',
			'${payload.estimated_date}'
		);`,
	edit: payload =>
		`UPDATE Task
			SET Name = ${payload.taskname},
			Description = ${payload.description},
			Priority = ${payload.priority},
			Creation_Date = ${payload.creation_date},
			Estimated_Date = ${payload.estimated_date}
			WHERE Task_ID = ${payload.task_id};`,
	complete: payload =>
		`UPDATE Task
			SET Completion_Date = ${payload.completion_date}
			WHERE ID = ${payload.id};`,
	remove: payload =>
		`DELETE FROM Task
			WHERE ID = ${payload.id};`
};

module.exports = query;
