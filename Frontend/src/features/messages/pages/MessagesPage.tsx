import {
  FormEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ArrowLeft,
  Bot,
  Check,
  CheckCheck,
  ChevronDown,
  Copy,
  Image as ImageIcon,
  MessageCircle,
  MoreVertical,
  Paperclip,
  Reply,
  Search,
  Send,
  Smile,
  Sparkles,
  SquarePen,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { useAppSelector } from "@/shared/hooks";
import { socketService } from "@/shared/lib/socket";
import {
  messageService,
  Message,
  ConversationSummary,
  UserSearchResult,
} from "../services/message.service";

/* -------------------------------------------------------------------------- */
/* Constants                                                                   */
/* -------------------------------------------------------------------------- */

const ZENTRO_AI_USERNAME = "zentro-ai";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function timeAgo(dateString: string) {
  const timestamp = new Date(dateString).getTime();

  if (Number.isNaN(timestamp)) {
    return "";
  }

  const diffMs = Math.max(0, Date.now() - timestamp);
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours}h`;

  const days = Math.floor(hours / 24);

  if (days < 7) return `${days}d`;

  return new Date(dateString).toLocaleDateString([], {
    day: "numeric",
    month: "short",
  });
}

function formatMessageTime(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatConversationDate(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const now = new Date();

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const messageDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const difference = Math.round(
    (today.getTime() - messageDate.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  if (difference === 0) return "Today";
  if (difference === 1) return "Yesterday";

  return date.toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year:
      date.getFullYear() !== now.getFullYear()
        ? "numeric"
        : undefined,
  });
}

function getInitials(name?: string) {
  if (!name?.trim()) return "?";

  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0][0]?.toUpperCase() ?? "?";
  }

  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function getMessageSenderId(message: Message) {
  return typeof message.sender === "string"
    ? message.sender
    : message.sender?._id;
}

function getMessagePreview(conversation: ConversationSummary) {
  const { lastMessage } = conversation;

  if (lastMessage.content?.trim()) {
    return lastMessage.content;
  }

  if (lastMessage.mediaType === "image") {
    return "📷 Image";
  }

  if (lastMessage.mediaType === "video") {
    return "🎥 Video";
  }

  return "Attachment";
}

function isSameDay(first: string, second: string) {
  const firstDate = new Date(first);
  const secondDate = new Date(second);

  return (
    firstDate.toDateString() === secondDate.toDateString()
  );
}

function isNearBottom(element: HTMLElement, threshold = 120) {
  return (
    element.scrollHeight -
      element.scrollTop -
      element.clientHeight <=
    threshold
  );
}

function isZentroAI(conversation: ConversationSummary | UserSearchResult | null): boolean {
  if (!conversation) return false;
  return ("username" in conversation && conversation.username === ZENTRO_AI_USERNAME);
}

/* -------------------------------------------------------------------------- */
/* Avatar                                                                     */
/* -------------------------------------------------------------------------- */

function Avatar({
  src,
  name,
  size = "md",
  online = false,
  isAI = false,
}: {
  src?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
  online?: boolean;
  isAI?: boolean;
}) {
  const sizeClass = {
    sm: "h-9 w-9 text-xs",
    md: "h-11 w-11 text-sm",
    lg: "h-14 w-14 text-base",
  }[size];

  return (
    <div className="relative shrink-0">
      {isAI ? (
        <div
          className={`${sizeClass} flex items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 ring-2 ring-background shadow-lg shadow-violet-500/20`}
        >
          <Sparkles className="h-[45%] w-[45%] text-white" />
        </div>
      ) : src ? (
        <img
          src={src}
          alt={name || "User"}
          className={`${sizeClass} rounded-full object-cover ring-2 ring-background`}
        />
      ) : (
        <div
          className={`${sizeClass} flex items-center justify-center rounded-full border border-primary/10 bg-primary/10 font-semibold text-primary ring-2 ring-background`}
        >
          {getInitials(name)}
        </div>
      )}

      {online && !isAI && (
        <span
          className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-emerald-500"
          aria-label="Online"
        />
      )}

      {isAI && (
        <span
          className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-background bg-violet-500"
          aria-label="AI"
        >
          <Bot className="h-2.5 w-2.5 text-white" />
        </span>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Conversation List                                                          */
/* -------------------------------------------------------------------------- */

function ConversationList({
  conversations,
  activeId,
  search,
  loading,
  onSelect,
}: {
  conversations: ConversationSummary[];
  activeId: string;
  search: string;
  loading: boolean;
  onSelect: (userId: string) => void;
}) {
  const filteredConversations = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return conversations;
    }

    return conversations.filter((conversation) => {
      const fullname =
        conversation.fullname?.toLowerCase() || "";

      const username =
        conversation.username?.toLowerCase() || "";

      const message =
        conversation.lastMessage?.content?.toLowerCase() || "";

      return (
        fullname.includes(value) ||
        username.includes(value) ||
        message.includes(value)
      );
    });
  }, [conversations, search]);

  // Separate AI conversations from regular ones, pin AI at top
  const sortedConversations = useMemo(() => {
    const ai = filteredConversations.filter(c => c.username === ZENTRO_AI_USERNAME);
    const rest = filteredConversations.filter(c => c.username !== ZENTRO_AI_USERNAME);
    return [...ai, ...rest];
  }, [filteredConversations]);

  if (loading && conversations.length === 0) {
    return (
      <div className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="flex items-center gap-3 rounded-xl p-3"
          >
            <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-muted" />

            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-3.5 w-28 animate-pulse rounded-md bg-muted" />
              <div className="h-2.5 w-40 animate-pulse rounded-md bg-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 shadow-sm">
          <MessageCircle className="h-7 w-7 text-primary" />
        </div>

        <h3 className="text-sm font-bold">
          No conversations yet
        </h3>

        <p className="mt-1.5 max-w-[240px] text-xs leading-5 text-muted-foreground">
          Start a conversation with someone using the new
          message button above.
        </p>
      </div>
    );
  }

  if (sortedConversations.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <Search className="mb-3 h-6 w-6 text-muted-foreground" />

        <p className="text-sm font-medium">
          No conversations found
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          Try searching for another name or username.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-2 py-1.5">
      {sortedConversations.map((conversation) => {
        const isActive =
          activeId === conversation.partnerId;

        const unread = conversation.unreadCount > 0;
        const isAI = conversation.username === ZENTRO_AI_USERNAME;

        return (
          <button
            key={conversation.partnerId}
            type="button"
            onClick={() =>
              onSelect(conversation.partnerId)
            }
            className={`group mb-0.5 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-200 ${
              isActive
                ? isAI
                  ? "bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 ring-1 ring-violet-500/20"
                  : "bg-primary/10 ring-1 ring-primary/10"
                : "hover:bg-muted/70"
            }`}
          >
            <Avatar
              src={conversation.avatar}
              name={conversation.fullname}
              size="md"
              isAI={isAI}
            />

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className={`truncate text-sm ${
                      unread
                        ? "font-bold text-foreground"
                        : "font-medium text-foreground"
                    }`}
                  >
                    {conversation.fullname}
                  </span>

                  {isAI && (
                    <span className="inline-flex shrink-0 items-center gap-0.5 rounded-md bg-violet-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-violet-500">
                      <Bot className="h-2.5 w-2.5" />
                      AI
                    </span>
                  )}
                </div>

                <span
                  className={`shrink-0 text-[10px] ${
                    unread
                      ? "font-semibold text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {timeAgo(
                    conversation.lastMessage.createdAt
                  )}
                </span>
              </div>

              <div className="mt-1 flex items-center gap-2">
                <span
                  className={`min-w-0 flex-1 truncate text-xs ${
                    unread
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {getMessagePreview(conversation)}
                </span>

                {unread && (
                  <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground shadow-sm shadow-primary/30">
                    {conversation.unreadCount > 99
                      ? "99+"
                      : conversation.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* New Message Picker                                                         */
/* -------------------------------------------------------------------------- */

function NewMessagePicker({
  onPick,
  onClose,
}: {
  onPick: (user: UserSearchResult) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    UserSearchResult[]
  >([]);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      setResults([]);
      setLoading(false);
      return;
    }

    const requestId = ++requestIdRef.current;

    setLoading(true);

    const timeout = window.setTimeout(() => {
      messageService
        .searchUsers(normalizedQuery, 8)
        .then((users) => {
          if (requestId === requestIdRef.current) {
            setResults(users);
          }
        })
        .catch(() => {
          if (requestId === requestIdRef.current) {
            setResults([]);
          }
        })
        .finally(() => {
          if (requestId === requestIdRef.current) {
            setLoading(false);
          }
        });
    }, 350);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [query]);

  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-background">
      <div className="flex items-center gap-3 border-b border-border px-4 py-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Close new message"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="min-w-0">
          <h2 className="font-semibold text-foreground">
            New message
          </h2>

          <p className="truncate text-xs text-muted-foreground">
            Find someone to start a conversation
          </p>
        </div>
      </div>

      <div className="px-4 py-3">
        <div className="flex items-center gap-2 rounded-xl border border-input bg-muted/40 px-3 py-2.5 transition-colors focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />

          <input
            ref={inputRef}
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                onClose();
              }
            }}
            placeholder="Search people..."
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            autoComplete="off"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        {loading && (
          <div className="space-y-1 px-1 py-2">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl p-3"
              >
              <div className="h-11 w-11 animate-pulse rounded-full bg-muted" />

              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-3 w-32 animate-pulse rounded bg-muted" />
                <div className="h-2.5 w-20 animate-pulse rounded bg-muted" />
              </div>
            </div>
            ))}
          </div>
        )}

        {!loading && !query.trim() && (
          <div className="flex flex-col items-center px-6 py-12 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
              <UserRound className="h-6 w-6 text-muted-foreground" />
            </div>

            <p className="text-sm font-medium">
              Find someone
            </p>

            <p className="mt-1 max-w-[220px] text-xs leading-5 text-muted-foreground">
              Search by their name or username.
            </p>
          </div>
        )}

        {!loading &&
          query.trim() &&
          results.length === 0 && (
            <div className="flex flex-col items-center px-6 py-12 text-center">
              <Search className="mb-3 h-6 w-6 text-muted-foreground" />

              <p className="text-sm font-medium">
                No people found
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Try another name or username.
              </p>
            </div>
          )}

        {!loading &&
          results.map((user) => (
            <button
              key={user._id}
              type="button"
              onClick={() => onPick(user)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-muted"
            >
              <Avatar
                src={user.avatar}
                name={user.fullname}
                size="md"
                isAI={user.username === ZENTRO_AI_USERNAME}
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {user.fullname}
                  </p>

                  {user.username === ZENTRO_AI_USERNAME && (
                    <span className="inline-flex shrink-0 items-center gap-0.5 rounded-md bg-violet-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-violet-500">
                      <Bot className="h-2.5 w-2.5" />
                      AI
                    </span>
                  )}
                </div>

                <p className="truncate text-xs text-muted-foreground">
                  @{user.username}
                </p>

                {user.bio && (
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {user.bio}
                  </p>
                )}
              </div>
            </button>
          ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Message Bubble                                                             */
/* -------------------------------------------------------------------------- */

function MessageBubble({
  message,
  isMine,
  showDate,
  grouped,
  isAIChat,
  replyTo,
  onReply,
  onCopy,
}: {
  message: Message;
  isMine: boolean;
  showDate: boolean;
  grouped: boolean;
  isAIChat?: boolean;
  replyTo?: Message;
  onReply: (message: Message) => void;
  onCopy: (text: string) => void;
}) {
  const [showActions, setShowActions] = useState(false);
  const isAIMessage = !isMine && isAIChat;

  return (
    <>
      {showDate && (
        <div className="my-6 flex items-center justify-center">
          <div className="h-px flex-1 bg-border/50" />
          <span className="mx-4 rounded-full border border-border bg-card px-3 py-1 text-[10px] font-medium text-muted-foreground shadow-sm">
            {formatConversationDate(message.createdAt)}
          </span>
          <div className="h-px flex-1 bg-border/50" />
        </div>
      )}

      <div
        className={`group/msg relative flex ${
          isMine ? "justify-end" : "justify-start"
        } ${grouped ? "mt-0.5" : "mt-3"}`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {/* Quick actions (visible on hover) */}
        {showActions && (
          <div className={`absolute top-0 z-10 flex items-center gap-0.5 ${
            isMine ? "right-full mr-1" : "left-full ml-1"
          }`}>
            <button
              type="button"
              onClick={() => onReply(message)}
              className="rounded-lg p-1.5 text-muted-foreground transition-all hover:bg-muted hover:text-foreground hover:scale-110"
              title="Reply"
            >
              <Reply className="h-3.5 w-3.5" />
            </button>
            {message.content && (
              <button
                type="button"
                onClick={() => onCopy(message.content)}
                className="rounded-lg p-1.5 text-muted-foreground transition-all hover:bg-muted hover:text-foreground hover:scale-110"
                title="Copy"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}

        <div
          className={`flex max-w-[85%] flex-col sm:max-w-[70%] ${
            isMine ? "items-end" : "items-start"
          }`}
        >
          {/* Reply preview */}
          {replyTo && (
            <div className={`mb-1 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] ${
              isMine ? "bg-primary/5 text-primary/70" : "bg-muted text-muted-foreground"
            }`}>
              <Reply className="h-3 w-3 shrink-0" />
              <span className="truncate max-w-[200px]">{replyTo.content}</span>
            </div>
          )}

          <div
            className={`relative overflow-hidden px-4 py-2.5 text-sm leading-relaxed transition-shadow ${
              isMine
                ? `bg-primary text-primary-foreground shadow-sm shadow-primary/20 ${
                    grouped
                      ? "rounded-2xl rounded-br-lg"
                      : "rounded-2xl rounded-br-lg"
                  }`
                : isAIMessage
                  ? `border border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 text-foreground shadow-sm ${
                      grouped
                        ? "rounded-2xl rounded-bl-lg"
                        : "rounded-2xl rounded-bl-lg"
                    }`
                  : `border border-border bg-card text-foreground shadow-sm ${
                      grouped
                        ? "rounded-2xl rounded-bl-lg"
                        : "rounded-2xl rounded-bl-lg"
                    }`
            }`}
          >
            {message.mediaUrl && (
              <div
                className={`mb-2 overflow-hidden ${
                  message.content ? "rounded-xl" : "rounded-lg"
                }`}
              >
                {message.mediaType === "image" ? (
                  <img
                    src={message.mediaUrl}
                    alt="Message attachment"
                    loading="lazy"
                    className="max-h-80 max-w-full rounded-lg object-cover"
                  />
                ) : (
                  <video
                    src={message.mediaUrl}
                    controls
                    preload="metadata"
                    className="max-h-80 max-w-full rounded-lg"
                  />
                )}
              </div>
            )}

            {message.content && (
              <p className="whitespace-pre-wrap break-words leading-[1.6]">
                {message.content}
              </p>
            )}
          </div>

          <div
            className={`mt-1 flex items-center gap-1.5 px-1 text-[10px] text-muted-foreground ${
              isMine ? "flex-row-reverse" : ""
            }`}
          >
            <span>{formatMessageTime(message.createdAt)}</span>

            {isAIMessage && (
              <span className="flex items-center gap-0.5 text-violet-500">
                <Sparkles className="h-2.5 w-2.5" />
                AI
              </span>
            )}

            {isMine &&
              (message.readAt ? (
                <CheckCheck
                  className="h-3.5 w-3.5 text-primary"
                  aria-label="Read"
                />
              ) : (
                <Check
                  className="h-3.5 w-3.5"
                  aria-label="Sent"
                />
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Typing Indicator                                                           */
/* -------------------------------------------------------------------------- */

function TypingIndicator({ name, isAI }: { name: string; isAI: boolean }) {
  return (
    <div className="flex items-end gap-2 pt-2">
      <div className={`rounded-2xl rounded-bl-lg px-4 py-3 ${
        isAI 
          ? "border border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5" 
          : "border border-border bg-card"
      }`}>
        <div className="flex items-center gap-1.5">
          {isAI && <Sparkles className="h-3 w-3 text-violet-500 animate-pulse" />}
          <div
            className="flex items-center gap-1"
            aria-label={`${name} is typing`}
          >
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60" />
            <span
              className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60"
              style={{
                animationDelay: "150ms",
              }}
            />
            <span
              className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60"
              style={{
                animationDelay: "300ms",
              }}
            />
          </div>
        </div>
      </div>
      <span className="mb-1 text-[10px] text-muted-foreground">
        {isAI ? "Zentro AI is thinking…" : `${name} is typing…`}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Page                                                                  */
/* -------------------------------------------------------------------------- */

export function MessagesPage() {
  const currentUser = useAppSelector(
    (state) => state.auth.user
  );

  const [searchParams, setSearchParams] =
    useSearchParams();

  const recipientId =
    searchParams.get("recipient") || "";

  const [conversations, setConversations] = useState<
    ConversationSummary[]
  >([]);

  const [activePartner, setActivePartner] = useState<
    ConversationSummary | UserSearchResult | null
  >(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");

  const [typing, setTyping] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [conversationSearch, setConversationSearch] =
    useState("");

  const [loadingInbox, setLoadingInbox] =
    useState(true);

  const [loadingConversation, setLoadingConversation] =
    useState(false);

  const [conversationError, setConversationError] =
    useState("");

  const [sendError, setSendError] = useState("");

  const [sending, setSending] = useState(false);

  const [showScrollButton, setShowScrollButton] =
    useState(false);

  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesContainerRef =
    useRef<HTMLDivElement>(null);

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  const textareaRef =
    useRef<HTMLTextAreaElement>(null);

  const typingTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const shouldScrollRef = useRef(true);

  const isActiveAI = isZentroAI(activePartner);

  /* ---------------------------------------------------------------------- */
  /* Inbox                                                                   */
  /* ---------------------------------------------------------------------- */

  const loadInbox = useCallback(async () => {
    try {
      setLoadingInbox(true);

      const data = await messageService.getInbox();

      setConversations(data);
    } catch {
      setConversations([]);
    } finally {
      setLoadingInbox(false);
    }
  }, []);

  useEffect(() => {
    void loadInbox();
  }, [loadInbox]);

  /* ---------------------------------------------------------------------- */
  /* Active partner                                                          */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const match = conversations.find(
      (conversation) =>
        conversation.partnerId === recipientId
    );

    if (match) {
      setActivePartner(match);
      return;
    }

    if (!recipientId) {
      setActivePartner(null);
    }
  }, [conversations, recipientId]);

  /* ---------------------------------------------------------------------- */
  /* Conversation                                                            */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (!recipientId) {
      setMessages([]);
      setActivePartner(null);
      setTyping(false);
      setConversationError("");
      setContent("");
      setReplyingTo(null);
      return;
    }

    let cancelled = false;

    setLoadingConversation(true);
    setConversationError("");
    setTyping(false);
    setContent("");
    setReplyingTo(null);
    shouldScrollRef.current = true;

    messageService
      .getConversation(recipientId)
      .then((data) => {
        if (!cancelled) {
          setMessages(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMessages([]);
          setConversationError(
            "Unable to load this conversation."
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingConversation(false);
        }
      });

    void messageService
      .markRead(recipientId)
      .then(() => loadInbox())
      .catch(() => undefined);

    const handleMessage = (message: unknown) => {
      const next = message as Message;

      if (!next?._id) {
        return;
      }

      const senderId = getMessageSenderId(next);

      const belongsToConversation =
        senderId === recipientId ||
        next.recipient === recipientId;

      if (!belongsToConversation) {
        return;
      }

      setMessages((current) => {
        if (
          current.some(
            (existing) =>
              existing._id === next._id
          )
        ) {
          return current;
        }

        return [...current, next];
      });

      shouldScrollRef.current = true;

      void loadInbox();

      if (senderId === recipientId) {
        void messageService
          .markRead(recipientId)
          .catch(() => undefined);
      }
    };

    const handleTyping = (userId: unknown) => {
      if (userId !== recipientId) {
        return;
      }

      setTyping(true);
    };

    const handleTypingStop = (userId: unknown) => {
      if (userId !== recipientId) {
        return;
      }

      setTyping(false);
    };

    socketService.on(
      "message:new",
      handleMessage
    );

    socketService.on(
      "typing:start",
      handleTyping
    );

    socketService.on(
      "typing:stop",
      handleTypingStop
    );

    return () => {
      cancelled = true;

      socketService.off(
        "message:new",
        handleMessage
      );

      socketService.off(
        "typing:start",
        handleTyping
      );

      socketService.off(
        "typing:stop",
        handleTypingStop
      );
    };
  }, [recipientId, loadInbox]);

  /* ---------------------------------------------------------------------- */
  /* Typing cleanup                                                          */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  /* ---------------------------------------------------------------------- */
  /* Auto scroll                                                             */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (!shouldScrollRef.current) {
      return;
    }

    messagesEndRef.current?.scrollIntoView({
      behavior: messages.length > 1 ? "smooth" : "auto",
    });

    shouldScrollRef.current = false;
    setShowScrollButton(false);
  }, [messages, typing]);

  /* ---------------------------------------------------------------------- */
  /* Auto-resize textarea                                                    */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  }, [content]);

  /* ---------------------------------------------------------------------- */
  /* Scroll detection                                                        */
  /* ---------------------------------------------------------------------- */

  const handleMessagesScroll = () => {
    const container =
      messagesContainerRef.current;

    if (!container) {
      return;
    }

    const nearBottom = isNearBottom(container);

    setShowScrollButton(!nearBottom);

    if (nearBottom) {
      shouldScrollRef.current = false;
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

    setShowScrollButton(false);
    shouldScrollRef.current = false;
  };

  /* ---------------------------------------------------------------------- */
  /* Navigation                                                              */
  /* ---------------------------------------------------------------------- */

  const selectConversation = (userId: string) => {
    setSearchParams({ recipient: userId });
    setShowPicker(false);
    setConversationSearch("");
    setReplyingTo(null);

    window.setTimeout(() => {
      textareaRef.current?.focus();
    }, 150);
  };

  const startNewConversation = (
    user: UserSearchResult
  ) => {
    setActivePartner(user);
    setSearchParams({ recipient: user._id });
    setShowPicker(false);
    setMessages([]);
    setConversationError("");
    setContent("");
    setReplyingTo(null);

    window.setTimeout(() => {
      textareaRef.current?.focus();
    }, 150);
  };

  const closeConversation = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    if (recipientId) {
      socketService.emit(
        "typing:stop",
        recipientId
      );
    }

    setSearchParams({});
    setMessages([]);
    setActivePartner(null);
    setContent("");
    setTyping(false);
    setSendError("");
    setReplyingTo(null);
  };

  /* ---------------------------------------------------------------------- */
  /* Typing                                                                  */
  /* ---------------------------------------------------------------------- */

  const handleContentChange = (
    value: string
  ) => {
    setContent(value);
    setSendError("");

    if (!recipientId) {
      return;
    }

    socketService.emit(
      "typing:start",
      recipientId
    );

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socketService.emit(
        "typing:stop",
        recipientId
      );

      typingTimeoutRef.current = null;
    }, 1200);
  };

  const stopTyping = () => {
    if (!recipientId) {
      return;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    socketService.emit(
      "typing:stop",
      recipientId
    );
  };

  /* ---------------------------------------------------------------------- */
  /* Actions                                                                 */
  /* ---------------------------------------------------------------------- */

  const handleReply = (message: Message) => {
    setReplyingTo(message);
    textareaRef.current?.focus();
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(text);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Clipboard API not available
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Send                                                                    */
  /* ---------------------------------------------------------------------- */

  const submit = async (
    event?: FormEvent
  ) => {
    event?.preventDefault();

    const value = content.trim();

    if (!recipientId || !value || sending) {
      return;
    }

    try {
      setSending(true);
      setSendError("");
      stopTyping();

      const message = await messageService.send(
        recipientId,
        value
      );

      setMessages((current) => {
        if (
          current.some(
            (existing) =>
              existing._id === message._id
          )
        ) {
          return current;
        }

        return [...current, message];
      });

      setContent("");
      setReplyingTo(null);
      shouldScrollRef.current = true;

      void loadInbox();
    } catch {
      setSendError(
        "Message couldn't be sent. Please try again."
      );
    } finally {
      setSending(false);

      window.setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
    }
  };

  const handleInputKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key !== "Enter") {
      return;
    }

    if (event.shiftKey) {
      return; // Allow newline
    }

    event.preventDefault();

    void submit();
  };

  /* ---------------------------------------------------------------------- */
  /* Partner information                                                     */
  /* ---------------------------------------------------------------------- */

  const partnerName =
    activePartner?.fullname || "";

  const partnerUsername =
    activePartner &&
    "username" in activePartner
      ? activePartner.username
      : undefined;

  const partnerAvatar =
    activePartner?.avatar;

  /* ---------------------------------------------------------------------- */
  /* Render                                                                  */
  /* ---------------------------------------------------------------------- */

  return (
    <main className="mx-auto flex h-[calc(100vh-4rem)] w-full max-w-7xl overflow-hidden border border-border bg-background shadow-sm md:my-4 md:h-[calc(100vh-6rem)] md:rounded-2xl">
      {/* ------------------------------------------------------------------ */}
      {/* Sidebar                                                            */}
      {/* ------------------------------------------------------------------ */}

      <aside
        className={`relative flex w-full flex-col border-r border-border bg-card md:w-[350px] md:shrink-0 ${
          recipientId
            ? "hidden md:flex"
            : "flex"
        }`}
      >
        <div className="border-b border-border px-4 pb-3 pt-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 shadow-sm">
                <MessageCircle className="h-5 w-5 text-primary" />
              </div>

              <div>
                <h1 className="text-lg font-bold tracking-tight text-foreground">
                  Messages
                </h1>

                <p className="text-[11px] text-muted-foreground">
                  {conversations.length} conversation{conversations.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowPicker(true)
              }
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-md hover:shadow-primary/30 active:scale-95 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
              aria-label="New message"
            >
              <SquarePen className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-input bg-muted/40 px-3 py-2.5 transition-colors focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />

            <input
              value={conversationSearch}
              onChange={(event) =>
                setConversationSearch(
                  event.target.value
                )
              }
              placeholder="Search conversations..."
              className="min-w-0 flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
              aria-label="Search conversations"
            />

            {conversationSearch && (
              <button
                type="button"
                onClick={() =>
                  setConversationSearch("")
                }
                className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Clear conversation search"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        <ConversationList
          conversations={conversations}
          activeId={recipientId}
          search={conversationSearch}
          loading={loadingInbox}
          onSelect={selectConversation}
        />

        {showPicker && (
          <NewMessagePicker
            onPick={startNewConversation}
            onClose={() =>
              setShowPicker(false)
            }
          />
        )}
      </aside>

      {/* ------------------------------------------------------------------ */}
      {/* Chat                                                                */}
      {/* ------------------------------------------------------------------ */}

      <section
        className={`flex min-w-0 flex-1 flex-col bg-background ${
          recipientId
            ? "flex"
            : "hidden md:flex"
        }`}
      >
        {!recipientId ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-border bg-gradient-to-br from-card to-muted shadow-sm">
              <MessageCircle className="h-9 w-9 text-primary" />
            </div>

            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Your messages
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              Select a conversation from the sidebar
              or start a new one.
            </p>

            <button
              type="button"
              onClick={() =>
                setShowPicker(true)
              }
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-md active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
            >
              <SquarePen className="h-4 w-4" />
              New message
            </button>
          </div>
        ) : (
          <>
            {/* ------------------------------------------------------------ */}
            {/* Header                                                         */}
            {/* ------------------------------------------------------------ */}

            <header className={`flex min-h-[68px] items-center gap-3 border-b px-3 py-3 sm:px-5 ${
              isActiveAI 
                ? "border-violet-500/10 bg-gradient-to-r from-violet-500/5 to-fuchsia-500/5" 
                : "border-border bg-card"
            }`}>
              <button
                type="button"
                onClick={closeConversation}
                className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
                aria-label="Back to conversations"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <Avatar
                src={partnerAvatar}
                name={partnerName}
                size="md"
                online={!isActiveAI}
                isAI={isActiveAI}
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-sm font-bold text-foreground">
                    {partnerName ||
                      "Conversation"}
                  </p>

                  {isActiveAI && (
                    <span className="inline-flex shrink-0 items-center gap-0.5 rounded-md bg-violet-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-violet-500">
                      <Bot className="h-2.5 w-2.5" />
                      AI
                    </span>
                  )}
                </div>

                {typing ? (
                  <p className={`text-xs font-medium ${isActiveAI ? "text-violet-500" : "text-primary"}`}>
                    {isActiveAI ? "Thinking…" : "Typing…"}
                  </p>
                ) : isActiveAI ? (
                  <p className="text-xs text-violet-500/70">
                    Ask me anything · Powered by AI
                  </p>
                ) : partnerUsername ? (
                  <p className="truncate text-xs text-muted-foreground">
                    @{partnerUsername}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Active now
                  </p>
                )}
              </div>

              <button
                type="button"
                className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Conversation options"
              >
                <MoreVertical className="h-5 w-5" />
              </button>
            </header>

            {/* ------------------------------------------------------------ */}
            {/* Messages                                                       */}
            {/* ------------------------------------------------------------ */}

            <div
              ref={messagesContainerRef}
              onScroll={handleMessagesScroll}
              className={`relative flex-1 overflow-y-auto ${
                isActiveAI ? "bg-gradient-to-b from-violet-500/[0.02] to-transparent" : ""
              }`}
            >
              <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col px-4 py-5 sm:px-6">
                {loadingConversation ? (
                  <div className="flex flex-1 flex-col justify-end gap-3 pb-2">
                    <div className="flex">
                      <div className="h-11 w-44 animate-pulse rounded-2xl bg-muted" />
                    </div>

                    <div className="flex justify-end">
                      <div className="h-11 w-56 animate-pulse rounded-2xl bg-primary/10" />
                    </div>

                    <div className="flex">
                      <div className="h-16 w-64 animate-pulse rounded-2xl bg-muted" />
                    </div>

                    <div className="flex justify-end">
                      <div className="h-12 w-48 animate-pulse rounded-2xl bg-primary/10" />
                    </div>
                  </div>
                ) : conversationError ? (
                  <div className="flex flex-1 flex-col items-center justify-center text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10">
                      <MessageCircle className="h-6 w-6 text-destructive" />
                    </div>

                    <h3 className="text-sm font-semibold">
                      Couldn't load messages
                    </h3>

                    <p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
                      {conversationError}
                    </p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center text-center">
                    <Avatar
                      src={partnerAvatar}
                      name={partnerName}
                      size="lg"
                      online={!isActiveAI}
                      isAI={isActiveAI}
                    />

                    <h3 className="mt-4 text-sm font-bold text-foreground">
                      {isActiveAI ? "Chat with Zentro AI" : "Start a conversation"}
                    </h3>

                    <p className="mt-1.5 max-w-xs text-xs leading-5 text-muted-foreground">
                      {isActiveAI 
                        ? "Ask questions, get recommendations, or just chat. I'm here to help!"
                        : `Send a message to ${partnerName || "this person"}.`
                      }
                    </p>

                    {isActiveAI && (
                      <div className="mt-4 flex flex-wrap justify-center gap-2">
                        {["What's trending?", "Recommend a post", "Help me write"].map(suggestion => (
                          <button
                            key={suggestion}
                            type="button"
                            onClick={() => {
                              setContent(suggestion);
                              textareaRef.current?.focus();
                            }}
                            className="rounded-full border border-violet-500/20 bg-violet-500/5 px-3 py-1.5 text-xs font-medium text-violet-600 transition-all hover:bg-violet-500/10 hover:border-violet-500/30 active:scale-95 dark:text-violet-400"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-auto space-y-0.5">
                    {messages.map(
                      (message, index) => {
                        const senderId =
                          getMessageSenderId(
                            message
                          );

                        const isMine =
                          senderId ===
                          currentUser?._id;

                        const previousMessage =
                          messages[index - 1];

                        const showDate =
                          !previousMessage ||
                          !isSameDay(
                            previousMessage.createdAt,
                            message.createdAt
                          );

                        const grouped =
                          Boolean(
                            previousMessage &&
                              getMessageSenderId(
                                previousMessage
                              ) === senderId &&
                              !showDate
                          );

                        return (
                          <MessageBubble
                            key={message._id}
                            message={message}
                            isMine={isMine}
                            showDate={showDate}
                            grouped={grouped}
                            isAIChat={isActiveAI}
                            onReply={handleReply}
                            onCopy={handleCopy}
                          />
                        );
                      }
                    )}

                    {typing && (
                      <TypingIndicator name={partnerName} isAI={isActiveAI} />
                    )}

                    <div
                      ref={messagesEndRef}
                      className="h-px"
                    />
                  </div>
                )}
              </div>

              {showScrollButton && (
                <button
                  type="button"
                  onClick={scrollToBottom}
                  className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full border border-border bg-card/95 px-3 py-2 text-xs font-medium text-foreground shadow-lg backdrop-blur-sm transition-all hover:bg-muted active:scale-95"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                  New messages
                </button>
              )}
            </div>

            {/* ------------------------------------------------------------ */}
            {/* Composer                                                       */}
            {/* ------------------------------------------------------------ */}

            <div className={`border-t px-3 py-3 sm:px-5 ${
              isActiveAI ? "border-violet-500/10 bg-gradient-to-r from-violet-500/[0.02] to-fuchsia-500/[0.02]" : "border-border bg-card"
            }`}>
              {sendError && (
                <div className="mx-auto mb-2 max-w-4xl rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  {sendError}
                </div>
              )}

              {/* Reply preview */}
              {replyingTo && (
                <div className="mx-auto mb-2 flex max-w-4xl items-center gap-2 rounded-xl border border-primary/10 bg-primary/5 px-3 py-2">
                  <Reply className="h-4 w-4 shrink-0 text-primary" />
                  <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
                    Replying to: {replyingTo.content}
                  </span>
                  <button
                    type="button"
                    onClick={() => setReplyingTo(null)}
                    className="shrink-0 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}

              <form
                onSubmit={(event) =>
                  void submit(event)
                }
                className="mx-auto flex max-w-4xl items-end gap-2"
              >
                <div className={`flex min-w-0 flex-1 items-end rounded-2xl border px-2 py-1.5 transition-all focus-within:ring-2 ${
                  isActiveAI 
                    ? "border-violet-500/20 bg-violet-500/[0.03] focus-within:border-violet-500/40 focus-within:ring-violet-500/10" 
                    : "border-input bg-muted/30 focus-within:border-primary/40 focus-within:ring-primary/10"
                }`}>
                  <button
                    type="button"
                    disabled
                    className="mb-0.5 hidden cursor-not-allowed rounded-xl p-2 text-muted-foreground opacity-50 sm:flex"
                    aria-label="Attach file"
                    title="File attachments coming soon"
                  >
                    <Paperclip className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    disabled
                    className="mb-0.5 hidden cursor-not-allowed rounded-xl p-2 text-muted-foreground opacity-50 sm:flex"
                    aria-label="Add image"
                    title="Image attachments coming soon"
                  >
                    <ImageIcon className="h-4 w-4" />
                  </button>

                  <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(event) =>
                      handleContentChange(
                        event.target.value
                      )
                    }
                    onKeyDown={
                      handleInputKeyDown
                    }
                    onFocus={() => {
                      if (
                        recipientId &&
                        content.trim()
                      ) {
                        socketService.emit(
                          "typing:start",
                          recipientId
                        );
                      }
                    }}
                    onBlur={stopTyping}
                    placeholder={
                      isActiveAI
                        ? "Ask Zentro AI anything…"
                        : `Message ${partnerName || "someone"}…`
                    }
                    disabled={sending}
                    autoComplete="off"
                    rows={1}
                    className="min-w-0 flex-1 resize-none bg-transparent px-2 py-2.5 text-sm leading-5 text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60"
                    style={{ maxHeight: "160px" }}
                    aria-label={`Message ${
                      partnerName ||
                      "someone"
                    }`}
                  />

                  <button
                    type="button"
                    disabled
                    className="mb-0.5 rounded-xl p-2 text-muted-foreground opacity-50"
                    aria-label="Add emoji"
                    title="Emoji picker coming soon"
                  >
                    <Smile className="h-4 w-4" />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={
                    !content.trim() ||
                    sending
                  }
                  aria-label={
                    sending
                      ? "Sending message"
                      : "Send message"
                  }
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none ${
                    isActiveAI
                      ? "bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-violet-500/20 hover:shadow-md hover:shadow-violet-500/30"
                      : "bg-primary shadow-primary/20 hover:bg-primary/90 hover:shadow-md hover:shadow-primary/30"
                  }`}
                >
                  {sending ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </form>

              <p className="mx-auto mt-2 hidden max-w-4xl text-[10px] text-muted-foreground sm:block">
                Press Enter to send · Shift + Enter for new line
              </p>
            </div>
          </>
        )}
      </section>
    </main>
  );
}