import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Message from "./components/Message";
import FormMessenger from "./components/FormMessenger";
import Channel from "./components/Channel";

import axios from "axios";

/*
	1 # - npm install --save axios
	1 # - npm install -g surge
*/

class App extends Component {

	state = {
		firstName: "",
		lastName: "",
		email: "",
		username_valid: false,
		admin_valid: false,
		message: "",
		error: false,
		messages: [],
		channel: 1,
	}

	_onChange_firstName(e) {
		this.setState({
			firstName: e.target.value
		});
	}

	_onChange_lastName(e) {
		this.setState({
			lastName: e.target.value
		});
	}

	_onChange_email(e) {
		this.setState({
			email: e.target.value
		});
	}

	_onClick_deconnexion() {
		this.setState({
			firstName: "",
			username_valid: false
		});
	}

	_onChange_channel(e) {
		this.setState({
			channel: e.target.value
		});
	}

	_onClick_valid_username() {
		this.setState({
			username_valid: true
		});
	}

	_onClick_valid_admin() {
		this.setState({
			admin_valid: true
		});
	}

	_onChange_message(e) {
		console.log(e.target.value);
		this.setState({
			message: e.target.value
		});
	}

	_onClick_valid_message() {
		this._post_channel_message(this.state.channel)
			.then(() => {
				this.setState({
					message: "",
				});
			})
	}


	componentDidMount() {
		this.interval = setInterval(() => {
			if (this.state.channel && this.state.username_valid) {
				this._fetch_channel_messages(this.state.channel)
				.then((result) => {
					var filtered = result.messages.filter((item) => item.username.length > 0 && item.message.length > 0)
					this.setState({
						error: result.error,
						messages: filtered
					});
				})
			}
		}, 1500);
	}

	componentWillUnmount() {
		if (this.interval) {
			clearInterval(this.interval);
		}
	}

	_post_channel_message(channel) {
		return axios
		.post(
			`http://trainings.nanoapp.io/api/messenger/channel/${channel}`,
			{
				username: this.state.username,
				message: this.state.message
			}

		)
		.then(function (response) {
			console.log("_post_channel_message ", response);
			return {
				error: response.status !== 200,
			};
		})
		.catch(function (error) {
			console.log(error);
		});
	}

	_fetch_channel_messages(channel) {
		return axios
		.get(`http://trainings.nanoapp.io/api/messenger/channel/${channel}`)
		.then(function (response) {
			console.log("_fetch_channel_messages ", response);
			return {
				error: response.status !== 200,
				messages: response.data
			};
		})
		.catch(function (error) {
			console.log(error);
		});
	}


	render() {
		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h1 className="App-title">Welcome to Hell</h1>
				</header>
				<div
					style={{
						position: "absolute",
						top: 190,
						left: 0,
						right: 0,
						bottom: 0,
					}}
				>
					<FormMessenger
						username={this.state.username}
						lastname={this.state.lastname}
						email={this.state.email}
						message={this.state.message}
						channel={this.state.channel}
						usernameValid={this.state.username_valid}
						adminValid={this.state.admin_valid}
						onChangeUserName={this._onChange_firstName.bind(this)}
						onChangeLastName={this._onChange_lastName.bind(this)}
						onChangeEmail={this._onChange_email.bind(this)}
						onClickValidUserName={this._onClick_valid_username.bind(this)}
						onClickValidAdmin={this._onClick_valid_admin.bind(this)}
						onChangeMessage={this._onChange_message.bind(this)}
						onClickValidMessage={this._onClick_valid_message.bind(this)}
						onChangeChannel={this._onChange_channel.bind(this)}

						onClickDeconnexion={this._onClick_deconnexion.bind(this)}
					/>
					<ul>
						{
							this.state.username_valid ?
								this.state.messages.map((item, index) => {

									return (
										<Message
											key={item.id}
											username={item.username}
											message={item.message}
										/>
									);

								})
							:
								null
						}
					</ul>
				</div>
			</div>
		);
	}

}

export default App;
