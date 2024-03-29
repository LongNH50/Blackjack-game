import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Card, GameService } from './app.service';
import { CommonModule } from '@angular/common';
import { DialogModule } from '@angular/cdk/dialog';
import { DialogContentComponent } from './dialog-content/dialog-content.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, DialogModule, DialogContentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  // providers: [DialogContentComponent]
})
export class AppComponent implements OnInit{
  title = 'blackjack-game';

  playerCards: Card[] = [];
  dealerCards: Card[] = [];
  playerScore: number = 0;
  dealerScore: number = 0;
  gameOver: boolean = false;
  message: string = '';
  dealerSecondCardRevealed: boolean = false;

  constructor(private gameService: GameService, private dialog: MatDialog) {}
  ngOnInit(): void {
    this.startGame()
  }

  showMessage(message: string) {
    this.dialog.open(DialogContentComponent, {
      data: { message: message }
    });
  }
  

  startGame() {
    this.gameService.initializeDeck();
    this.playerCards = [this.gameService.dealCard(), this.gameService.dealCard()];
    this.dealerCards = [this.gameService.dealCard(), this.gameService.dealCard()];
    this.gameOver = false;
    this.message = '';
    this.dealerSecondCardRevealed = false;
    this.calculateScores();

    if (this.isBlackjack(this.playerCards) || this.isBlackjack(this.dealerCards)) {
      this.dealerSecondCardRevealed = true; // Reveal dealer's second card
      if (this.isBlackjack(this.playerCards) && this.isBlackjack(this.dealerCards)) {
        this.message = 'Push. Both you and dealer have Blackjack!';
      } else if (this.isBlackjack(this.playerCards)) {
        this.message = 'Blackjack! You win!';
      } else if (this.isBlackjack(this.dealerCards)) {
        this.message = 'Dealer has Blackjack. You lose.';
      }
      this.gameOver = true;
      this.showMessage(this.message)

    }
  }

  calculateScores() {
    this.playerScore = this.calculateScore(this.playerCards);
    this.dealerScore = this.calculateScore(this.dealerCards);
  }

  calculateScore(cards: Card[]): number {
    let totalScore = 0;
    let aceCount = 0;

    for(let card of cards){
      totalScore += card.value;
      if(card.display === 'ace'){
        aceCount++;
      }
    }

    while(aceCount > 0 && totalScore > 21){
      totalScore -= 10;
      aceCount--;
    }
    return totalScore;
  }

  hit() {
    if (!this.gameOver) {
      this.playerCards.push(this.gameService.dealCard());
      this.calculateScores();

      if (this.playerScore > 21) {
        this.gameOver = true;
        this.message = 'Bust! You lose.';
        this.showMessage(this.message)
        this.stand()
      }
    }
  }

  stand() {
    this.dealerSecondCardRevealed = true;
    if (!this.gameOver) {
      while (this.dealerScore < 17) {
          this.dealerCards.push(this.gameService.dealCard());
          this.calculateScores();
      }

      if (this.dealerScore > 21) {
        this.message = 'Dealer busts. You win!';
      } else if (this.dealerScore === this.playerScore) {
        this.message = 'Push.';
      } else if (this.dealerScore > this.playerScore) {
        this.message = 'Dealer wins!';
      } else {
        this.message = 'You win!';
      }
      this.showMessage(this.message)


      this.gameOver = true;
    }
  }

  isBlackjack(cards: Card[]):boolean {
    if(cards.length === 2){
      return ((cards[0].value === 10 && cards[1].display === 'ace')) || (cards[0].display === 'ace' && cards[1].value === 10)
    }

    return false;
  }

}

