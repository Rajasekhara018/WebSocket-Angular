import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebRtcService {
  private stompClient: any
  private socket!: WebSocket;
  localStream!: MediaStream;
  remoteStream = new MediaStream();
  public messages: Subject<any> = new Subject();

  connect() {
    debugger
    const url = '//localhost:3001/chat-socket';
    const socket = new SockJS(url);
    this.stompClient = Stomp.over(socket)
  }
  peerConnection!: RTCPeerConnection;
  socket$!: WebSocket;
  config: RTCConfiguration = {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302'
        ]
      }
    ]
  };
  sendMessage(message: any) {
    // // this.socket.send(JSON.stringify(message));
    // this.stompClient.connect({}, ()=>{
    //   this.stompClient.subscribe(`/topic/signaling`, (messages: any) => {
    //     const message = JSON.parse(messages);
    //     switch (message.type) {
    //       case 'answer':
    //         this.handleReceivedAnswer(message);
    //         break;
    //       case 'ice':
    //         this.handleReceivedIceCandidate(message);
    //         break;
    //       default:
    //         console.log('Received unknown message type:', message.type);
    //     }

    //   })
    // })
     // Ensure this URL is correct and reachable
     this.socket$ = new WebSocket('ws://localhost:3001/chat-socket/');

     this.socket$.onopen = () => {
       console.log('WebSocket connection is open.');
       this.initWebRTC();
     };
 
     this.socket$.onmessage = (event: MessageEvent) => {
       const message = JSON.parse(event.data);
 
       switch (message.type) {
         case 'answer':
           this.handleReceivedAnswer(message);
           break;
         case 'ice':
           this.handleReceivedIceCandidate(message);
           break;
         default:
           console.log('Received unknown message type:', message.type);
       }
     };
  }
  async initWebRTC() {
    debugger
    this.peerConnection = new RTCPeerConnection(this.config);

   if(this.localStream){
    this.localStream.getTracks().forEach(track => {
      this.peerConnection.addTrack(track, this.localStream);
    });
   }
  }
  handleReceivedAnswer(answer: RTCSessionDescription) {
    debugger
    console.log(answer)
    this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
      .then(() => console.log('Remote description set successfully.'))
      .catch(error => console.error('Error setting remote description:', error));
  }
  handleReceivedIceCandidate(iceCandidateData: any) {
    debugger
   
      if (iceCandidateData.type === 'ice') {
        let iceCandidate = new RTCIceCandidate({
          candidate: iceCandidateData.candidate,
          sdpMid: iceCandidateData.sdpMid,
          sdpMLineIndex: iceCandidateData.sdpMLineIndex
        });
        this.peerConnection.addIceCandidate(iceCandidate)
          .then(() => {
            console.log('ICE candidate added successfully.');
          })
          .catch((error) => {
            console.error('Error adding ICE candidate:', error);
          });
      } else {
        console.error('Received unknown message type:', iceCandidateData.type);
      }
    } 
  }
