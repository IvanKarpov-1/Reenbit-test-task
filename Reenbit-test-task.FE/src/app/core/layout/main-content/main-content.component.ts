import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-content',
  imports: [RouterOutlet],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.css',
  host: {
    '[style.flex]': '"1"',
  },
})
export class MainContentComponent {}
