import { Component, Input, signal, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-holder',
  imports: [],
  templateUrl: './holder.html',
  styleUrl: './holder.css',
})


export class Holder {


  @Input() value: WritableSignal<number> = signal(0);

  increment() {
    this.value.update(a => a+1);
  }

}
