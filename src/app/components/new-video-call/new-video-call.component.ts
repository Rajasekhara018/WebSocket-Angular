import { Component, ElementRef, ViewChild } from '@angular/core';
import * as SockJS from 'sockjs-client';
import { Client, Stomp } from '@stomp/stompjs';

@Component({
  selector: 'app-new-video-call',
  templateUrl: './new-video-call.component.html',
  styleUrls: ['./new-video-call.component.scss']
})
export class NewVideoCallComponent {
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('screenPreview') screenPreview!: ElementRef<HTMLVideoElement>;

  private localStream!: MediaStream;
  private peerConnection!: RTCPeerConnection;
  private stompClient!: Client;
  public peerConnectionReady = false;
  private screenStream: MediaStream | null = null;
  private isScreenSharing = false;
  private readonly iceServers = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  };

  ngOnInit(): void {

    this.initWebSocket();
  }
  // 
  private initWebSocket() {
    const socket = new SockJS('http://localhost:3001/chat-socket');
    this.stompClient = new Client({
      brokerURL: 'ws://localhost:3001/chat-socket/websocket',
      connectHeaders: {},
      debug: str => console.log(str),
      onConnect: (frame) => {
        this.stompClient.subscribe('/topic/signal', (message) => {
          const signal = JSON.parse(message.body);
          this.handleSignal(signal);
        });
        this.createPeerConnection();
        this.sendOffer();
      }
    });
    this.stompClient.activate();
    this.createPeerConnection();
    this.sendOffer();
  }
  private sendOffer() {
    const offerOptions = {
      offerToReceiveVideo: true,
      offerToReceiveAudio: true
    };

    this.peerConnection.createOffer(offerOptions).then(offer => {
      return this.peerConnection.setLocalDescription(offer);
    }).then(() => {
      this.sendSignal('offer', this.peerConnection.localDescription);
    }).catch(error => {
      console.error('Error creating offer:', error);
    });
  }
  private sendSignal(type: string, data: any) {
    this.stompClient.publish({
      destination: '/app/signal',
      body: JSON.stringify({
        type: type,
        sender: 'user1',
        receiver: 'user2',
        data: data
      })
    });
  }

  private handleSignal(signal: any) {
    switch (signal.type) {
      case 'offer':
        this.handleOffer(signal);
        break;
      case 'answer':
        this.handleAnswer(signal);
        break;
      case 'candidate':
        this.handleCandidate(signal);
        break;
    }
  }

  private handleOffer(signal: any) {
    this.peerConnection.setRemoteDescription(new RTCSessionDescription(signal.data)).then(() => {
      return this.peerConnection.createAnswer();
    }).then(answer => {
      return this.peerConnection.setLocalDescription(answer);
    }).then(() => {
      this.sendSignal('answer', this.peerConnection.localDescription);
    }).catch(error => {
      console.error('Error handling offer:', error);
    });
  }

  private handleAnswer(signal: any) {
    this.peerConnection.setRemoteDescription(new RTCSessionDescription(signal.data)).catch(error => {
      console.error('Error handling answer:', error);
    });
  }

  private handleCandidate(signal: any) {
    const candidate = new RTCIceCandidate(signal.data);
    this.peerConnection.addIceCandidate(candidate).catch(error => {
      console.error('Error adding candidate:', error);
    });
  }

  private sendIceCandidate(candidate: RTCIceCandidate) {
    this.stompClient.publish({
      destination: '/app/signal',
      body: JSON.stringify({
        type: 'candidate',
        sender: 'user1',
        receiver: 'user2',
        data: candidate
      })
    });
  }
  startCall() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        this.localStream = stream;
        this.localVideo.nativeElement.srcObject = stream;
        this.localVideo.nativeElement.srcObject = stream;
        // only now connect WebSocket (onConnect will be safe)
        this.initWebSocket();
      })
      .catch(error => {
        console.error('Error accessing webcam:', error);
      });
  }
  private createPeerConnection() {
    if (!this.localStream) {
      console.error('localStream not initialized yet');
      return;
    }

    this.peerConnection = new RTCPeerConnection(this.iceServers);
    this.peerConnectionReady = true;

    this.localStream.getTracks().forEach(track => {
      this.peerConnection.addTrack(track, this.localStream);
    });

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendSignal('candidate', event.candidate);
      }
    };

    this.peerConnection.ontrack = (event) => {
      this.remoteVideo.nativeElement.srcObject = event.streams[0];
    };
  }



  showScreenPreview!: boolean;
  shareScreen() {
    navigator.mediaDevices.getDisplayMedia({ video: true })
      .then(stream => {
        const trackLabel = stream.getVideoTracks()[0].label;

        // Check if the user shared their full screen (optional check)
        if (trackLabel.toLowerCase().includes('screen')) {
          this.showScreenPreview = false;  // Use this flag in HTML
        } else {
          this.showScreenPreview = true;
          if (this.screenPreview?.nativeElement) {
            this.screenPreview.nativeElement.srcObject = stream;
          }
        }
      });
  }

  private replaceVideoTrack(screenStream: MediaStream) {
    const screenTrack = screenStream.getTracks()[0];
    const sender = this.peerConnection.getSenders().find(s => s.track?.kind === 'video');
    if (sender) {
      sender.replaceTrack(screenTrack);
    }
    this.isScreenSharing = true;
  }

  public stopScreenSharing() {
    const screenTrack = this.screenStream?.getTracks()[0];
    if (screenTrack) {
      screenTrack.stop();
      this.isScreenSharing = false;
    }
  }

  ngOnDestroy() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }
    if (this.screenStream) {
      this.screenStream.getTracks().forEach(track => track.stop());
    }
  }
  stopCall() {
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnectionReady = false;
    }

    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }

    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.deactivate();
    }

    this.localVideo.nativeElement.srcObject = null;
    this.remoteVideo.nativeElement.srcObject = null;
  }

  stopRecording() {
    console.log('Stopping recording...'); // ✅ Add debug log
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop(); // ⬅️ triggers onstop
    } else {
      console.warn('MediaRecorder is not recording or already stopped');
    }

  }

  mediaRecorder!: MediaRecorder;
  recordedChunks: Blob[] = [];

  startRecording(stream: MediaStream) {
    this.recordedChunks = [];
    this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      debugger
      const recordedBlob = new Blob(this.recordedChunks, { type: 'video/webm' });
      this.uploadToServer(recordedBlob);
    };

    this.mediaRecorder.start();
  }
  uploadToServer(blob: Blob) {
    const formData = new FormData();
    formData.append('video', blob, 'call_recording.webm');
    fetch('http://localhost:3001/api/upload', {
      method: 'POST',
      body: formData
    }).then(response => {
      if (response.ok) {
        console.log('Upload successful!');
      } else {
        console.error('Upload failed.');
      }
    });
  }

}
