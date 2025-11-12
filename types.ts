
export interface ColleagueMessage {
  id: string;
  author: string;
  text: string;
}

export interface MediaItem {
  id:string;
  type: 'image' | 'video';
  dataUrl: string; // Base64 encoded data URL
  name: string;
}

export interface PageData {
  recipientName: string;
  recipientGender?: 'male' | 'female';
  mainMessage: string;
  colleagueMessages: ColleagueMessage[];
  mediaItems: MediaItem[];
}

declare global {
  interface Window {
    QRCode: any;
  }
}
