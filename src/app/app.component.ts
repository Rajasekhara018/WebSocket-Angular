import { Component } from '@angular/core';
import { ChatBotComponent } from './components/chat-bot/chat-bot.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'WebSocket-Angular';
  constructor(private dialog: MatDialog) { }
  openChatbot() {
    this.dialog.open(ChatBotComponent,
      {
        width: '400px',
        height: '500px',
        position: { right: '8px', bottom: '8px' },
        hasBackdrop: false        
      });
  }
}
