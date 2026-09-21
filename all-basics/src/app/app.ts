import { Component, computed, input, numberAttribute, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Holder } from './holder/holder';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Holder],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  parentValue = signal(0);
 
  increment() {
    this.parentValue.update(a => a+1);
  }
  
}
