import { Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-profile-picture',
  imports: [NgOptimizedImage],
  templateUrl: './profile-picture.component.html',
  styleUrl: './profile-picture.component.css',
})
export class ProfilePictureComponent {
  picture = input<string>();
  size = input<number>(4);
}
