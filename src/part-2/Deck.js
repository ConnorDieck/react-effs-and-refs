import React, { useState, useEffect, useRef } from "react";
import Card from "./Card";
import axios from "axios";

const Deck = () => {
	const timerId = useRef();
	const [ deck, setDeck ] = useState(null);
	const [ cards, setCards ] = useState([]);
	const [ autoDraw, setAutoDraw ] = useState(false);

	// This will load an object with the deck id only upon first render
	useEffect(
		function fetchDeckWhenMounted() {
			async function fetchDeck() {
				try {
					const deckResult = await axios.get("http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1");
					setDeck(deckResult.data);
				} catch (e) {
					return e;
				}
			}
			fetchDeck();
		},
		[ setDeck ] // MQ: Don't fully understand why this is here
	);

	// if autodraw is true, draw one card every second
	useEffect(
		() => {
			const drawCard = async () => {
				if (deck.remaining > 0) {
					try {
						const cardResult = await axios.get(
							`http://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=1`
						);

						setDeck(cardResult.data);
						console.log(deck.remaining);

						if (deck.remaining === 0) {
							setAutoDraw(false);
							throw new Error("no cards remaining!");
						}

						setCards([ ...cards, cardResult.data.cards[0] ]);
					} catch (err) {
						alert(err);
					}
				} else {
					alert(`Error: no cards remaining!`);
				}
			};

			if (autoDraw && !timerId.current) {
				timerId.current = setInterval(async () => {
					await drawCard();
				}, 1000);
			}

			return () => {
				clearInterval(timerId.current);
				timerId.current = null;
			};
		},
		[ autoDraw, setAutoDraw, deck ] // MQ: Don't fully understand why these are here
	);

	const toggleAutoDraw = () => {
		setAutoDraw(auto => !auto);
	};

	return (
		<div className="Deck">
			{deck ? (
				<button onClick={toggleAutoDraw}>{autoDraw ? "Stop" : "Keep"} drawing cards!</button>
			) : (
				<i>(loading deck...)</i>
			)}
			<div className="Deck-cards">
				{cards.map(card => (
					<Card image={card.image} value={card.value} suit={card.suit} code={card.code} key={card.code} />
				))}
			</div>
		</div>
	);
};

export default Deck;
