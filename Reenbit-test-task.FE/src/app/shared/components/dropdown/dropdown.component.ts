import {
  Component,
  ElementRef,
  HostListener,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-dropdown',
  imports: [NgClass],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css',
})
export class DropdownComponent {
  isDropdownOpen = output<boolean>();
  isOpen = signal<boolean>(false);
  closeOnClickInside = input<boolean>(false);
  isShowActivatorButtonOnOuterHover = input<boolean>(false);
  outerHoveringState = input<boolean>(false);

  private readonly activator =
    viewChild.required<ElementRef>('dropdownActivator');

  private readonly content = viewChild.required<ElementRef>('dropdownContent');

  toggleDropdown() {
    this.isOpen.update((value) => !value);
    this.isDropdownOpen.emit(this.isOpen());
  }

  @HostListener('document:click', ['$event'])
  toggleDropdownOutside(event: MouseEvent) {
    if (!this.isOpen()) {
      return;
    }

    const target = event.target as HTMLElement;
    const clickedInside = this.content()?.nativeElement.contains(target);
    const clickedOnActivator = this.activator()?.nativeElement.contains(target);

    if ((!clickedInside || this.closeOnClickInside()) && !clickedOnActivator) {
      this.toggleDropdown();
    }
  }
}
