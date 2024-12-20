import { Component } from '@angular/core';
import Peer from 'peerjs';
@Component({
  selector: 'app-video-share',
  templateUrl: './video-share.component.html',
  styleUrls: ['./video-share.component.scss']
})
export class VideoShareComponent {
  private peer: Peer;
  peerIdShare!: string;
  peerId!: string;
  private lazyStream: any;
  currentPeer: any;
  private peerList: Array<any> = [];

  constructor() {
    this.peer = new Peer();
  }

  ngOnInit(): void {
    this.getPeerId();
  }

  private getPeerId = () => {
    this.peer.on('open', (id) => {
      this.peerId = id;
    });

    this.peer.on('call', (call) => {
      navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      }).then((stream) => {
        this.lazyStream = stream;

        call.answer(stream);
        call.on('stream', (remoteStream) => {
          if (!this.peerList.includes(call.peer)) {
            this.streamRemoteVideo(remoteStream);
            this.currentPeer = call.peerConnection;
            this.peerList.push(call.peer);
          }
        });
      }).catch(err => {
        console.log(err + 'Unable to get media');
      });
    });
  }

  connectWithPeer(): void {
    this.callPeer(this.peerIdShare);
  }

  private callPeer(id: string): void {
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    }).then((stream) => {
      this.lazyStream = stream;

      const call = this.peer.call(id, stream);
      call.on('stream', (remoteStream) => {
        if (!this.peerList.includes(call.peer)) {
          this.streamRemoteVideo(remoteStream);
          this.currentPeer = call.peerConnection;
          this.peerList.push(call.peer);
        }
      });
    }).catch(err => {
      console.log(err + 'Unable to connect');
    });
  }

  private streamRemoteVideo(stream: any): void {
    const video = document.createElement('video');
    video.classList.add('video');
    video.srcObject = stream;
    video.play();

    // Make sure the remote-video container exists
    const remoteVideoContainer = document.getElementById('remote-video');
    if (remoteVideoContainer) {
      // Append the video element to the container
      remoteVideoContainer.appendChild(video);
      console.log('Video element successfully appended to the remote-video container.');
    } else {
      console.error('Error: Element with ID "remote-video" does not exist in the DOM.');
    }
  }

  screenShare(): void {
    this.shareScreen();
  }

  private shareScreen(): void {
    navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30, max: 60 }
      },
      audio: true
    })
    .then((stream) => {
      const videoTrack = stream.getVideoTracks()[0];
      videoTrack.onended = () => {
        // this.stopScreenShare();
      };

      const sender = this.currentPeer.getSenders().find((s:any) => s.track.kind === videoTrack.kind);
      sender.replaceTrack(videoTrack);
    }).catch(err => {
      console.log('Unable to get display media ' + err);
    });
  }

  private stopScreenShare(): void {
    const videoTrack = this.lazyStream.getVideoTracks()[0];
    const sender = this.currentPeer.getSenders().find((s:any) => s.track.kind === videoTrack.kind);
    sender.replaceTrack(videoTrack);
  }
}
