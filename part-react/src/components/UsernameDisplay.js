
import React from "react";


const UsernameDisplay = (props) => (
	<div
		style={{
			padding: 5
		}}
	>
		{
			props.tagline ?
				`${props.tagline} : ${props.username}`
			:
				props.username
		}
	</div>
)

export default UsernameDisplay;
