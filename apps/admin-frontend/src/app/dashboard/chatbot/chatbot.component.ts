import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements AfterViewChecked {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  isChatOpen = false;
  
  private initialMessages: { type: string; text: string; time: string }[] = [];

  messages = [...this.initialMessages];

  isTyping = false;
  indicatorText = 'Escribiendo...';
  inputText = '';
  private needsScroll = false;

  get hasAiResponse(): boolean {
    return this.messages.some(msg => msg.type === 'ai');
  }

  ngAfterViewChecked() {
    if (this.needsScroll) {
      this.scrollToBottom();
      this.needsScroll = false;
    }
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
    if (this.isChatOpen) {
      this.needsScroll = true;
    }
  }

  closeChat() {
    this.isChatOpen = false;
  }

  clearChat() {
    if (this.messages.length === 0) return;
    
    this.isTyping = true;
    this.indicatorText = 'Borrando chat...';
    this.needsScroll = true;
    
    setTimeout(() => {
      this.messages = [];
      this.isTyping = false;
      this.indicatorText = 'Escribiendo...';
    }, 1200);
  }

  private scrollToBottom(): void {
    try {
      const el = this.messageContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    } catch(err) { }
  }

  sendMessage(text: string) {
    if (!text.trim()) return;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add user message
    this.messages.push({
      type: 'user',
      text: text,
      time: timeString
    });
    
    this.inputText = '';
    this.isTyping = true;
    this.needsScroll = true;
    
    // Simulate AI response
    setTimeout(() => {
      this.isTyping = false;
      this.messages.push({
        type: 'ai',
        text: '¡Esa es una idea fantástica! Vamos a empezar nuestro viaje...',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      this.needsScroll = true;
    }, 1500);
  }

  onInputEnter(event: Event) {
    event.preventDefault();
    this.sendMessage(this.inputText);
  }

  onInputChange(event: Event) {
    this.inputText = (event.target as HTMLInputElement).value;
  }
}
