/**
 * Socket Event Types
 */

export interface SocketEvents {
  // Connection events
  connect: void;
  disconnect: void;
  "connect_error": Error;
  
  // Notification events
  "notification:new": NotificationEvent;
  "notification:read": NotificationReadEvent;
  
  // Typing indicator
  "user:typing": TypingEvent;
  
  // User presence
  "user:online": UserPresenceEvent;
  "user:offline": UserPresenceEvent;
  
  // Post events
  "post:created": PostEvent;
  "post:updated": PostEvent;
  "post:deleted": PostDeletedEvent;
  
  // Like/Comment events
  "post:liked": PostInteractionEvent;
  "post:unliked": PostInteractionEvent;
  "comment:added": CommentEvent;
  
  // Message events
  "message:new": MessageEvent;
  "message:delivered": MessageDeliveredEvent;
}

export interface NotificationEvent {
  id: string;
  type: string;
  title: string;
  message: string;
  actorId: string;
  timestamp: number;
}

export interface NotificationReadEvent {
  notificationId: string;
  userId: string;
  timestamp: number;
}

export interface TypingEvent {
  userId: string;
  conversationId: string;
  isTyping: boolean;
}

export interface UserPresenceEvent {
  userId: string;
  timestamp: number;
  lastSeen?: number;
}

export interface PostEvent {
  id: string;
  userId: string;
  content: string;
  timestamp: number;
}

export interface PostDeletedEvent {
  postId: string;
  userId: string;
  timestamp: number;
}

export interface PostInteractionEvent {
  postId: string;
  userId: string;
  timestamp: number;
}

export interface CommentEvent {
  commentId: string;
  postId: string;
  userId: string;
  content: string;
  timestamp: number;
}

export interface MessageEvent {
  id: string;
  senderId: string;
  conversationId: string;
  content: string;
  timestamp: number;
}

export interface MessageDeliveredEvent {
  messageId: string;
  conversationId: string;
  timestamp: number;
}
