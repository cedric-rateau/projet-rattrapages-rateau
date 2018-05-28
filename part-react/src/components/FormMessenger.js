
import React from 'react';

import UsernameDisplay from "./UsernameDisplay";
import Message from "./Message";
import Channel from "./Channel";
import '../App.css';

const FormMessenger = (props) => {
	const styleChild = {
		position: "absolute",
		top: "50%",
		width: "50%",
		transform: "translateX(50%)"
	}
	return (
		<div
			style={
				 {
				 	height: 150,
				 	width: "100%",
				 	position: "relative",
				 	backgroundColor: "transparent"
				 }
			 }
		>
			{
				!props.usernameValid ?
					<div style={styleChild}>
						<UsernameDisplay username={props.username} tagline="Votre nom est"/>
						<UsernameDisplay username={props.lastname} tagline="Votre prénom est"/>
						<UsernameDisplay username={props.email} tagline="Votre email est"/>
						Ecrivez votre nom
						<input
							onKeyPress={(e) => {
								if (e.key === "Enter") {
									props.onClickValidUserName();
								}
							}}
							type="text"
							value={props.username}
							onChange={props.onChangeUserName}
						/>
						<br/>
						Ecrivez votre prénom
						<input
							onKeyPress={(e) => {
								if (e.key === "Enter") {
									props.onClickValidUserName();
								}
							}}
							type="text"
							value={props.username}
							onChange={props.onChangeUserName}
						/>
						<br/>
						Ecrivez votre émail
						<input
							onKeyPress={(e) => {
								if (e.key === "Enter") {
									props.onClickValidEmail();
								}
							}}
							type="text"
							value={props.username}
							onChange={props.onChangeUserName}
						/>
						<br/>
						Administrateur
						<input
							type="checkbox"
							onChange={props.onClickValidAdmin}
						/>
						<button
							onClick={props.onClickValidUserName}
						>
							Valider
						</button>
					</div>
				:
					<div style={styleChild}>
						<UsernameDisplay username={props.username+' '+props.lastname}/>
						tagline="Bonjour"
						{
							!props.adminValid ?
								<div>
									<Message/>
								</div>
							:
								<span>
									<span>
										<Message/>
									</span>
									<span>
										<Channel/>
									</span>
								</span>
						}
						<div>
							<button onClick={props.onClickDeconnexion}>
								Deconnexion
							</button>
						</div>
					</div>
			}
		</div>
	);
}

export default FormMessenger;
