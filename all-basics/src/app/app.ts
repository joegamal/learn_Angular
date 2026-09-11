import { Component, numberAttribute, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  value1 = 0;
  value2 = 0;
  value3 = 0;

  increment() {
    this.value1++;
  }
  increment2() {
    this.value1++;
    this.value2++;
  }

  increment3() {
    this.value1++;
    this.value2++;
    this.value3++;
  }
  
}
