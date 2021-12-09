import React, { useState, useEffect } from "react";
import Card from "./Card";
import axios from "axios";

const Deck = () => {
	const [ deck, setDeck ] = useState(null);
	const [ cards, setCards ] = useState([]);

	// This will load an object with the deck id only upon first render
	useEffect(function fetchDeckWhenMounted() {
		async function fetchDeck() {
			try {
				const deckResult = await axios.get("http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1");
				setDeck(deckResult.data);
			} catch (e) {
				return e;
			}
		}
		fetchDeck();
	}, []);

	const drawCard = async () => {
		if (deck.remaining > 0) {
			try {
				const cardResult = await axios.get(`http://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=1`);
				setDeck(cardResult.data);
				console.log(deck.remaining);
				setCards([ ...cards, cardResult.data.cards[0] ]);
			} catch (err) {
				throw err;
			}
		} else {
			alert(`Error: no cards remaining!`);
		}
	};

	return (
		<div className="Deck">
			<div>
				{deck ? (
					<button onClick={async () => await drawCard()}>Gimme a Card!</button>
				) : (
					<i>(loading deck...)</i>
				)}
			</div>
			<div className="Deck-cards">
				{cards.map(card => (
					<Card image={card.image} value={card.value} suit={card.suit} code={card.code} key={card.code} />
				))}
			</div>
		</div>
	);
};

export default Deck;
