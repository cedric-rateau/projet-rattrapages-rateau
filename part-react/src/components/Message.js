import React from 'react';
import UsernameDisplay from "./UsernameDisplay";

const getRandomColor = () => {
	return Math.floor(Math.random() * 255) + 1
}

const Message = (props) => {
	return (
		<div
			style={{
				height: 35,
				padding: 15,
				backgroundColor: `rgba(${getRandomColor()}, ${getRandomColor()}, ${getRandomColor()}, ${getRandomColor()} )`
			}}
		>
			<h1>Message</h1>
			<input
				onKeyPress={(e)=>{
					if (e.key==="Envoyer"){
						props.onClickValidMessage();
					}
				}}
				type="text"
				value={props.message}
				onChange={props.onChangeMessage}
			/>
			<button
				onClick={props.onClickValidMessage}
			>
				Envoyer
			</button>
		</div>
	);
}

export default Message;
