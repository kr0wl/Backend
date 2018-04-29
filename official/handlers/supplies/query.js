const query = {
	create: payload =>
		`INSERT INTO Supplies (
			Supply_ID,
			Supplier_ID,
			Price
		)  Values (
			'${payload.supply_id}',
			'${payload.supplier_id}',
			'${payload.price}'
		);`,
	view: params =>
		`SELECT Supplier_ID supplier_id, i.Name product_name, Price, a.name supplier_name, i.supply_id
		FROM Supplies s NATURAL JOIN Item i INNER JOIN Account a
		ON s.Supplier_ID = a.ID
		WHERE a.ID = ${params.supplier_id};`,
	retrieve: job_ID =>
		`SELECT Supply_ID as id, Supplier_ID as supplierId, Name as name
   		FROM Job j natural join SupplyList s natural join Item i natural join Supplies
		WHERE j.Job_ID = ${job_ID};`,
	retrieveBySupplier: payload =>
		`SELECT Supply_ID as id, Name as name
   		FROM Item i natural join Supplies
		WHERE Supplies.Supplier_ID = ${payload.supplier_id};`,
	addToList: payloadstring =>
		`INSERT INTO SupplyList(
			Job_ID,
			Quantity,
			Supply_ID
		) Values
		${payloadstring}
		ON DUPLICATE KEY UPDATE Quantity = Quantity + values(Quantity);
		;`,
	retrieveAll: () => 
		`SELECT *
		FROM Item;`,
	remove: payload =>
		`DELETE FROM SupplyList
		WHERE JobList_ID = '${payload.list_id}';`,
	removeAsSupplier: payload =>
		`DELETE FROM Supplies
		WHERE Supplier_ID = ${payload.id}
		AND Supply_ID = ${payload.supply_id};`,
	removeFromSupplyListAsSupplier: payload =>
		`DELETE FROM SupplyList
		WHERE Supplier_ID = ${payload.id}
		AND Supply_ID = ${payload.supply_id};`
};

module.exports = query;