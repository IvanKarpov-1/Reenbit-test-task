import { Component, HostListener, output } from '@angular/core';

const SIDEBAR_MIN_WIDTH = 350;
const SIDEBAR_MAX_WIDTH = 600;

@Component({
  selector: 'app-divider',
  standalone: true,
  imports: [],
  templateUrl: './divider.component.html',
  styleUrl: './divider.component.css',
})
export class DividerComponent {
  resizeSidebar = output<number>();
  private isResizing = false;
  private sidebarWidth = 400;

  onMouseDown(event: MouseEvent) {
    this.isResizing = true;
    event.preventDefault();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isResizing) {
      this.sidebarWidth = Math.max(
        SIDEBAR_MIN_WIDTH,
        Math.min(event.clientX, SIDEBAR_MAX_WIDTH)
      );
      this.resizeSidebar.emit(this.sidebarWidth);
    }
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.isResizing = false;
  }
}
