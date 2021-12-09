import React from "react";

const Card = ({ image, value, suit, code }) => {
	return (
		<div className="Card">
			<img src={image} />
			<p>
				value={value}, suit={suit}, code={code}
			</p>
		</div>
	);
};

export default Card;
