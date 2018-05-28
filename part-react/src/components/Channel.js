import React from "react";
import UsernameDisplay from "./UsernameDisplay";

const Channel = (props) => {
	return(
		<div
			style={{
				padding: 5
			}}
		>
			Channel:
				<input
					type="number"
					name="quantity"
					min="-25"
					max="25"
					value={!props.channel ? props.channel : 0}
					onChange={props.onChangeChannel}
				/>
		</div>
	);
}

const getRandomColor = () => {
	return Math.floor(Math.random() * 255) + 1
}

export default UsernameDisplay;