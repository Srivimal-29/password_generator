import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

const WORD_LIST = [
    "apple", "banana", "cherry", "dragon", "eagle", "falcon", "guitar", "hammer", 
    "island", "jungle", "kangaroo", "lemon", "mango", "ninja", "ocean", "panda", 
    "quantum", "rocket", "shadow", "tiger", "umbrella", "vampire", "wizard", "xenon", 
    "yacht", "zebra", "brave", "clever", "silent", "happy", "rapid", "smooth", "wild",
    "blue", "green", "crimson", "silver", "gold", "velvet", "crystal", "stone", "water",
    "fire", "earth", "wind", "cloud", "storm", "winter", "summer", "autumn", "spring",
    "battery", "horse", "staple", "correct", "coffee", "mountain", "river", "valley"
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  length: number = 12;
  quantity: number = 1;
  genType: string = 'random';
  uppercase: boolean = false;
  numbers: boolean = false;
  specialCharacters: boolean = false;
  excludeAmbiguous: boolean = false;
  
  personalName: string = '';
  personalNumber: string = '';
  capitalizeFirst: boolean = true;
  
  generatedPasswords = signal<string[] | null>(null);

  generatePassword() {
    let results: string[] = [];
    
    for (let i = 0; i < this.quantity; i++) {
        if (this.genType === 'passphrase' || this.genType === 'personalized') {
            let name = this.personalName.trim();
            let num = this.personalNumber.trim();
            
            if (name || num) {
                if (this.capitalizeFirst && name.length > 0) {
                    name = name.charAt(0).toUpperCase() + name.slice(1);
                }
                
                const symbols = "!@#$%^&*()-_+={}[]|\\:;\"'";
                let symStr = "";
                for(let s = 0; s < 4; s++) {
                    symStr += symbols.charAt(Math.floor(Math.random() * symbols.length));
                }
                
                results.push(`${name}${symStr}${num}`);
            } else {
                let wordCount = Math.max(Math.floor(this.length / 4), 3);
                let words = [];
                for (let w = 0; w < wordCount; w++) {
                    words.push(WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]);
                }
                results.push(words.join("-"));
            }
        } else {
            let characters = "abcdefghijklmnopqrstuvwxyz";
            if (this.uppercase) characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            if (this.numbers) characters += "0123456789";
            if (this.specialCharacters) characters += "!@#$%^&*()-_+={}[]|\\:;\"'";
            
            if (this.excludeAmbiguous) {
                const ambiguous = "l1IO0";
                characters = characters.split('').filter(c => !ambiguous.includes(c)).join('');
            }
            
            if (characters.length === 0) characters = "abcdefghijklmnopqrstuvwxyz";
            
            let pwd = "";
            for (let c = 0; c < this.length; c++) {
                pwd += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            results.push(pwd);
        }
    }
    
    this.generatedPasswords.set(results);
  }
  
  resetForm() {
    this.generatedPasswords.set(null);
  }
}
