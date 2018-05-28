const uuidv4 = require('uuid/v4');

var fields_reducers = {
	"firstname": (value) => value.length > 0,
	"message": (value) => value.length > 0,
};

var models_message = function(params) {
	this.id = params.id || uuidv4();
	this.firstname = params.firstname|| "";
	this.message = params.message || "";
}

models_message.prototype.create = function() {
	var valid = true;
	var keys = Object.keys(fields_reducers);
	for (var i = 0; i < keys.length; i++)
	{
		console.log(this[keys[i]]);
		if ( typeof this[keys[i]] == typeof undefined ) {
			valid = false;
		}
		else
		{
			if ( !fields_reducers[keys[i]](this[keys[i]]) )
			{
				valid = false;
			}
		}
	}
	if (valid) {
		return this;
	} else {
		return undefined;
	}
}

module.exports = models_message;