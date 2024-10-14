import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { WebRtcService } from 'src/app/services/web-rtc.service';

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.scss']
})
export class VideoCallComponent {
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;

  localStream!: MediaStream;
  remoteStream!: MediaStream;
  peerConnection!: RTCPeerConnection;

  constructor(
    private webSocketService: WebRtcService,
  ) { }

  ngAfterViewInit(): void {
    this.initWebSocket();
  }

  async startCall() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      this.localVideo.nativeElement.srcObject = this.localStream;

      this.setupPeerConnection();

      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      this.webSocketService.sendMessage({
        type: 'offer',
        sdp: offer.sdp,
      });
    } catch (error) {
      console.error('Error accessing media devices.', error);
    }
  }

  initWebSocket() {
    this.webSocketService.connect();
    this.webSocketService.messages.subscribe((message) => {
      this.handleSignalMessage(message);
    });
  }

  setupPeerConnection() {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    this.peerConnection.ontrack = (event) => {
      if (!this.remoteStream) {
        this.remoteStream = new MediaStream();
        this.remoteVideo.nativeElement.srcObject = this.remoteStream;
      }
      this.remoteStream.addTrack(event.track);
    };

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.webSocketService.sendMessage({
          type: 'ice',
          candidate: event.candidate,
        });
      }
    };

    this.localStream.getTracks().forEach((track) => {
      this.peerConnection.addTrack(track, this.localStream);
    });
  }

  async handleSignalMessage(message: any) {
    if (message.type === 'offer') {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(message));
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      this.webSocketService.sendMessage({ type: 'answer', sdp: answer.sdp });
    } else if (message.type === 'answer') {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(message));
    } else if (message.type === 'ice') {
      if (message.candidate) {
        await this.peerConnection.addIceCandidate(new RTCIceCandidate(message.candidate));
      }
    }
  }
}