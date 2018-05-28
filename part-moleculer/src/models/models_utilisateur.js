const uuidv4 = require('uuid/v4');

var fields_reducers = {
	"firstname": (value) => value.length > 0,
	"lastname": (value) => value.length > 0,
	"email": (value) => value.length > 0,
	"channel": (value) => value >= 0,
};

var models_utlisateur = function(params) {
	this.id = params.id || uuidv4();
	this.firstname = params.firstname || "";
	this.lastname = params.lastname || "";
	this.email = params.email || "";
	this.channel = params.channel || 0;
}

models_utlisateur.prototype.create = function() {
	var valid = true;
	var keys = Object.keys(fields_reducers);
	for (var i = 0; i < keys.length; i++)
	{
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

module.exports = models_utlisateur;