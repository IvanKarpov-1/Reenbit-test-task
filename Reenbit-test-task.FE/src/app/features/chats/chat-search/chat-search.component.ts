import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { debounceTime, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChatsService } from '../chats.service';

@Component({
  selector: 'app-chat-search',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './chat-search.component.html',
  styleUrl: './chat-search.component.css',
})
export class ChatSearchComponent implements OnInit {
  searchTerm = new FormControl('', { nonNullable: true });
  isLoading = signal<boolean>(false);
  private readonly chatsService = inject(ChatsService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.searchTerm.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => this.isLoading.set(true)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((searchTerm) => {
        this.chatsService.searchChat(searchTerm);
        this.isLoading.set(false);
      });
  }

  reset() {
    this.searchTerm.reset();
    this.chatsService.searchChat(undefined);
  }
}
