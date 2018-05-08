const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

let userSchema = Schema({
	name: String,
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		validate: {
			validator: validator.isEmail,
			message: '{VALUE} is not a valid email.'
		}
	},
	password: {type: String, required: true, minlength: 6},
	//too be used for authenication/security
	tokens: [{
		access: {type: String, required: true},
		token: {type: String, required: true}
	}],
	surveys: [{type: Schema.Types.ObjectId, ref: 'Survey'}]
});

const UserModel = mongoose.model('User', userSchema);

class User
{
	constructor(myModel)
	{
		if (typeof myModel === "undefined")
		{
			myModel = new UserModel();
		}
		if (typeof myModel.id === "undefined")
		{
			myModel = new UserModel(myModel);
		}
		this._model = myModel;
	}

	get name()
	{
		return this._model.name;
	}

	set name(value)
	{
		this._model.name = value;
	}

	static async findByName(mname)
	{
		const findRes = await UserModel.find({name: mname});
		return findRes.map(userModel => new User(userModel));
	}

	static deleteAll()
	{
		return UserModel.deleteMany({});
	}

	get email()
	{
		return this._model.email;
	}

	set email(value)
	{
		this._model.email = value;
	}

	get password()
	{
		return this._model.password;
	}

	set password(value)
	{
		return this._model.password;
	}

	save()
	{
		return this._model.save();
	}
}
  
module.exports.User = User;
