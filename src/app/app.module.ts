import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponent } from './components/chat/chat.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { ChatBotComponent } from './components/chat-bot/chat-bot.component';
import { VideoCallComponent } from './components/video-call/video-call.component';
import { VideoShareComponent } from './components/video-share/video-share.component';


@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    ChatBotComponent,
    VideoCallComponent,
    VideoShareComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MaterialModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
