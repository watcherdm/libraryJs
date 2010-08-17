/*
ObjectDB is an attempt to write a javascript wrapper for 
objToDb:
	@param obj : Object to convert into a database (or table)
	@param name : What do we name this table
*/
function objectToDb(obj, name){
	keyTypes = {
		PRIMARY:"PRIMARY KEY"
	}
	
	sortOrder = {
		A:"ASC",
		D:"DESC"
	}
	/*
	
	*/
	function getType(val){
			if(isArray(val)||isObject(val)){
				return "INTEGER"; 	//foreign key id
			}else if(isNull(val)){
				return "NULL";
			}else if(isNaN(val)){
				return "TEXT"; 	//SQLite TEXT
			}else if(isFloat(val)){
				return "REAL";	//SQLite REAL
			}else{
				return "INTEGER";	//SQLite INT
			}
	}
	this.getType = function(){return getType};
	function field(name, type, key, sort)
	{
		this.name = name;
		this.type = type;
		this.key = key;
		this.sort = sort;
	};
	function table(name, fields)
	{
		this.name = name;
		this.fields = fields;
		this.addField = function(field){this.fields.push(field);}
		this.fieldsTxt = function()
		{
			var out = [];
			for(f in this.fields){
				out.push(fields[f].name + " " + fields[f].type + " " + fields[f].key + " " + fields[f].sort);
			}
			return out.join(",");
		}
	};
	this.tableModel = function(){return table};
	this.wdb = {
		db:		null,
		open : 	function() {
						var dbSize = 5 * 1024 * 1024;
						this.db = openDatabase('ObjectDB', '1.0', 'Object Database', dbSize);
					},
		hasTable:	function(table) {
						var cmd = 'SELECT  COUNT(*) FROM ' + table;
						this.db.transaction(function(tx) {
							tx.executeSql(cmd)}, this.onSuccess, this.onError
						);
					},
		onError:	function(tx, e) {
						console.log("something went wrong: " + e.message );
					},
		onSuccess:	function(tx,r) {
						console.log(r);
					},
		maketable:	function(table) {
						var cmd = 'CREATE TABLE ' + table.name + ' (' + table.fieldsTxt() + ')';
						console.log(cmd);
						this.db.transaction(function(tx) {
							tx.executeSql('CREATE TABLE ' + table.name + ' (' + table.fieldsTxt() + ')', [])
						}, this.onSuccess, this.onError
						);
					},
		addrecord:	function(table,fields, record) {
						var q = [];
						for (var i = 0; i < fields.length; i++) q.push("?");
						this.db.transaction(function(tx) {
							tx.executeSql('INSERT INTO ' + table + '(' + fields.join(',') + ') VALUES (' + q.join(",") + ')',
								record,
								this.onSuccess,
								this.onError);
						});
					},
		delrecord:	function(table,id) {
						this.db.transaction(function(tx) {
							tx.executeSql('DELETE FROM ' + table + ' WHERE ID=?', id);
						});
					}
	};
	
	// this.tables[t].add = function(t){return false;/* needs love here */};
	this.main = function(obj,name){
		if(obj){
			var fields = [];
			for(i in obj){
				var t = this.getType(obj[i]);
				var id = (i=="ID")?this.k.PRIMARY:"";
				if(i=="ID"){
					var t = "INTEGER";
				}
				var s = this.s.A;
				var f = new field(i, t, id, s);
				fields.push(f);
			}
			var t = new table(name, fields);
			this.wdb.open();
			this.wdb.maketable(t);
			return obj;
		}else{
			return false;
		}
	};
	
	this.addRecord = addRecord;

	function addRecord(table, obj){
		if(obj){
			if(wdb.hasTable(table)){
				
			}
			var fields = [];
			for(i in obj){
				
			}
		}
	}
	
	this.main(obj, name);
}

function dbTest()
{
	testdb = {ID:0,intField:5,fltField:1.3,strField:"field"}
	this.context = new objectToDb
	// any test functions that need to be run should be added this method just like the testBase method has been below.
	this.testBase = testBase;
	function testBase()
	{
		return assert(this.context);
	}
	function testFail()
	{
		return assert(1==0);
	}
	function runTests(context)
	{
		for(m in context)
		{
			var r = (typeof(context[m])=="function")?context[m]():'noop';
			switch(r){
				case true:
					console.log(m + " passed");
					break;
				case false:
					console.error(m + " failed");
					break;
				default:
					break;
			}
		}
		return true;
	}
	function assert(condition)
	{
		if(!condition)
		{
			return false;
		}
		return true;
	}
	function veryAlike(str1, str2)
	{
		str1 = str1.replace(/\s+/g, '');
		str2 = str2.replace(/\s+/g, '');
		return (str1==str2);
	}
	this.runTests = runTests(this);
	return this;
}
