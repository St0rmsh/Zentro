import { axiosInstance } from "@/shared/lib/axios";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type MessageMediaType = "image" | "video";

export interface MessageSender {
  _id: string;
  username: string;
  fullname: string;
  avatar?: string;
}

export interface Message {
  _id: string;
  sender: string | MessageSender;
  recipient: string;
  content: string;
  mediaUrl?: string;
  mediaType?: MessageMediaType;
  readAt?: string;
  createdAt: string;
}

export interface ConversationLastMessage {
  _id: string;
  content: string;
  mediaUrl?: string;
  mediaType?: MessageMediaType;
  sender: string;
  createdAt: string;
  readAt?: string;
}

export interface ConversationSummary {
  partnerId: string;
  username: string;
  fullname: string;
  avatar?: string;
  lastMessage: ConversationLastMessage;
  unreadCount: number;
}

export interface UserSearchResult {
  _id: string;
  username: string;
  fullname: string;
  avatar?: string;
  bio?: string;
}

/* -------------------------------------------------------------------------- */
/* Response Types                                                             */
/* -------------------------------------------------------------------------- */

interface InboxResponse {
  data: ConversationSummary[];
}

interface ConversationResponse {
  data: {
    messages: Message[];
  };
}

interface MessageResponse {
  data: Message;
}

interface UserSearchResponse {
  users: UserSearchResult[];
}

/* -------------------------------------------------------------------------- */
/* Payload Types                                                              */
/* -------------------------------------------------------------------------- */

export interface SendMessagePayload {
  content?: string;
  mediaUrl?: string;
  mediaType?: MessageMediaType;
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function normalizeContent(content: string) {
  return content.trim();
}

function validateMessageContent(content: string) {
  const normalized = normalizeContent(content);

  if (!normalized) {
    throw new Error("Message cannot be empty.");
  }

  return normalized;
}

function validateMediaPayload(payload: SendMessagePayload) {
  if (!payload.mediaUrl && !payload.mediaType) {
    return;
  }

  if (payload.mediaUrl && !payload.mediaType) {
    throw new Error("Media type is required when sending media.");
  }

  if (payload.mediaType && !payload.mediaUrl) {
    throw new Error("Media URL is required when sending media.");
  }
}

/* -------------------------------------------------------------------------- */
/* Message Service                                                            */
/* -------------------------------------------------------------------------- */

export const messageService = {
  /**
   * Get all conversations for the authenticated user.
   */
  getInbox: async (): Promise<ConversationSummary[]> => {
    const response =
      await axiosInstance.get<InboxResponse>("/messages/inbox");

    return response.data.data ?? [];
  },

  /**
   * Get messages between the authenticated user and another user.
   */
  getConversation: async (userId: string): Promise<Message[]> => {
    if (!userId.trim()) {
      throw new Error("User ID is required.");
    }

    const response =
      await axiosInstance.get<ConversationResponse>(
        `/messages/${userId}`
      );

    return response.data.data?.messages ?? [];
  },

  /**
   * Send a text message.
   *
   * Existing backend endpoint:
   * POST /messages/:userId
   */
  send: async (
    userId: string,
    content: string
  ): Promise<Message> => {
    if (!userId.trim()) {
      throw new Error("Recipient is required.");
    }

    const normalizedContent = validateMessageContent(content);

    const response =
      await axiosInstance.post<MessageResponse>(
        `/messages/${userId}`,
        {
          content: normalizedContent,
        }
      );

    return response.data.data;
  },

  /**
   * Send a message with optional media.
   *
   * This uses the same endpoint as send().
   * Your backend must support mediaUrl/mediaType for this to work.
   */
  sendMessage: async (
    userId: string,
    payload: SendMessagePayload
  ): Promise<Message> => {
    if (!userId.trim()) {
      throw new Error("Recipient is required.");
    }

    const normalizedContent = payload.content
      ? normalizeContent(payload.content)
      : "";

    const normalizedPayload: SendMessagePayload = {
      ...payload,
      ...(payload.content !== undefined
        ? { content: normalizedContent }
        : {}),
    };

    if (
      !normalizedPayload.content &&
      !normalizedPayload.mediaUrl
    ) {
      throw new Error(
        "Message must contain text or media."
      );
    }

    validateMediaPayload(normalizedPayload);

    const response =
      await axiosInstance.post<MessageResponse>(
        `/messages/${userId}`,
        normalizedPayload
      );

    return response.data.data;
  },

  /**
   * Mark all messages from a user as read.
   */
  markRead: async (userId: string): Promise<void> => {
    if (!userId.trim()) {
      throw new Error("User ID is required.");
    }

    await axiosInstance.patch(`/messages/${userId}/read`);
  },

  /**
   * Search users for starting a new conversation.
   */
  searchUsers: async (
    query: string,
    limit = 8
  ): Promise<UserSearchResult[]> => {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      return [];
    }

    const safeLimit = Math.min(
      Math.max(limit, 1),
      20
    );

    const response =
      await axiosInstance.get<UserSearchResponse>(
        "/search/users",
        {
          params: {
            q: normalizedQuery,
            limit: safeLimit,
          },
        }
      );

    return response.data.users ?? [];
  },
};