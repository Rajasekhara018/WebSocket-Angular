import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { VideoCallComponent } from './components/video-call/video-call.component';
import { VideoShareComponent } from './components/video-share/video-share.component';
import { NewVideoCallComponent } from './components/new-video-call/new-video-call.component';

const routes: Routes = [
  { path: 'chat/:userId', component: ChatComponent },
  // { path: '', component: VideoCallComponent },
  { path: '', component: NewVideoCallComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
