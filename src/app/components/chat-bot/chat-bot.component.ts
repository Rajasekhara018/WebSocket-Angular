import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.scss']
})
export class ChatBotComponent {
  userMessage: string | null = '';
  replayMsg!: string;
  isSpace = false;
  chatbot!: ChatbotMsgObj;
  grettingMessage!: Array<string>;
  targetString!: string;
  welcomeMesg = new Array<string>();
  currentIndex = 0;
  typedStrings = new Array<string>();
  userName = "User";
  userMessage1!: string;
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<ChatBotComponent>) { }

  ngOnInit(): void {
    this.chatbot = new ChatbotMsgObj();
    this.replayMsg = "";
    this.userMessage = "";
    this.greetmsges();
  }
  closePopup() {
    this.replayMsg = "";
    this.dialogRef.close();
  }
  greetmsges() {

    this.grettingMessage = ["Hello " + this.userName + "!" + ". Welcome to Axis Bank. How can I help you today? ",
    "Good day! " + this.userName + ".  I am Axis Bank's merchant acquisition assistant. How may I be of service to you?",
    "Hey! " + this.userName + ". I'm your friendly merchant acquisition chatbot. What can I do for you?",
    "Greetings! " + this.userName + ". It's a pleasure to have you here at Axis Bank. Let's work together to boost your merchant acquisitions!",
    "Hi! " + this.userName + ". I'm here to make your merchant acquisition journey easier. What can I assist you with today?",
    "Hello " + this.userName + ". Welcome to Axis Bank. How can I assist you with merchant acquisition today? "];
    let index = Math.floor(Math.random() * this.grettingMessage.length)
    this.welcomeMesg = this.grettingMessage[index].split(". ");
    this.typingEffect();

  }
  typingEffect(): void {
    this.targetString = this.welcomeMesg[this.currentIndex];
    let index = 0;
    const typingInterval = setInterval(() => {
      this.typedStrings[this.currentIndex] = this.targetString?.substr(0, index);
      index++;
      if (index > this.targetString.length) {
        clearInterval(typingInterval);
        this.currentIndex++;
        if (this.currentIndex < this.welcomeMesg.length) {
          setTimeout(() => {
            this.typingEffect();
          }, 100);
        }
      }
    }, 50);
  }
  startChat(msg: any) {
    this.userMessage1 = msg;
    this.userMessage = null;
    this.replayMsg = "Hello , Good Evening...";
  }
}

export class ChatbotMsgObj {
  typedStrings!: string;
  messages: Array<MessageObj>;
  messageArray: Array<MessageObj>;
  typedString!: string;
  constructor() {
    this.messages = new Array<MessageObj>();
    this.messageArray = new Array<MessageObj>();
  }
}
export class MessageObj {
  question!: string;
  answer!: string;

}

