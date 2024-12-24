import { Component } from '@angular/core';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown.component';

@Component({
  selector: 'app-chat-actions',
  imports: [DropdownComponent],
  templateUrl: './chat-actions.component.html',
  styleUrl: './chat-actions.component.css',
})
export class ChatActionsComponent {}
