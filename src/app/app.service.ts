import { Injectable } from '@angular/core';

export interface Card {
  value: number;
  display: string;
  suit: string;
  img: string;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  deck: Card[] = [];

  constructor() {
    this.initializeDeck();
  }

  initializeDeck() {
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const values = [
      { display: '2', value: 2 },
      { display: '3', value: 3 },
      { display: '4', value: 4 },
      { display: '5', value: 5 },
      { display: '6', value: 6 },
      { display: '7', value: 7 },
      { display: '8', value: 8 },
      { display: '9', value: 9 },
      { display: '10', value: 10 },
      { display: 'jack', value: 10 },
      { display: 'queen', value: 10 },
      { display: 'king', value: 10 },
      { display: 'ace', value: 11 }
    ];

    this.deck = [];
    for (let suit of suits) {
      for (let value of values) {
        const imagePath = `assets/Playing Cards/Playing Cards/PNG-cards-1.3/${value.display}_of_${suit.toLowerCase()}.png`;
        this.deck.push({ ...value, suit, img: imagePath });
      }
    }

    this.shuffleDeck();
  }

  shuffleDeck() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  dealCard(): Card {
    return this.deck.pop()!;
  }
}
