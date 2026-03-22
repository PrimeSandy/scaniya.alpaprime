"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, Send, User as UserIcon, Heart, 
  MoreHorizontal, Edit2, Trash2, ShieldAlert,
  CornerDownRight
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CommentType {
  _id: string;
  text: string;
  createdAt: string;
  likes: string[];
  parentId: string | null;
  isEdited: boolean;
  editCount: number;
  userId: {
    _id: string;
    name: string;
    image?: string;
  };
}

export function CommentSection({ qrId, qrOwnerId }: { qrId: string, qrOwnerId: string }) {
  const { data: session, status } = useSession();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const pathname = usePathname();

  const currentUserId = (session?.user as any)?.dbId;

  useEffect(() => {
    fetchComments();
  }, [qrId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?qrId=${qrId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch comments", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async (e: React.FormEvent, parentId: string | null = null) => {
    e.preventDefault();
    const content = parentId ? replyText : text;
    if (!content.trim() || !session) return;
    
    setSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrId, text: content, parentId }),
      });
      
      if (res.ok) {
        const newComment = await res.json();
        // Insert new comment into the list
        setComments([newComment, ...comments]);
        if (parentId) {
          setReplyingTo(null);
          setReplyText("");
        } else {
          setText("");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId: string) => {
    if (!currentUserId) return;

    // Optimistic update
    setComments(comments.map(c => {
      if (c._id === commentId) {
        const hasLiked = c.likes.includes(currentUserId);
        return {
          ...c,
          likes: hasLiked ? c.likes.filter(id => id !== currentUserId) : [...c.likes, currentUserId]
        };
      }
      return c;
    }));

    try {
      await fetch(`/api/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "like" }),
      });
    } catch (err) {
      console.error(err);
      fetchComments(); // Revert on failure
    }
  };

  const handleEdit = async (commentId: string) => {
    if (!editText.trim()) return;
    
    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "edit", text: editText }),
      });
      if (res.ok) {
        const updated = await res.json();
        setComments(comments.map(c => c._id === commentId ? updated : c));
        setEditingId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    
    // Optimistic update (also remove replies to this comment)
    setComments(comments.filter(c => c._id !== commentId && c.parentId !== commentId));

    try {
      const res = await fetch(`/api/comments/${commentId}`, { method: "DELETE" });
      if (!res.ok) fetchComments(); // Revert on failure
    } catch (err) {
      console.error(err);
      fetchComments();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short", day: "numeric"
    }).format(date);
  };

  // Group root comments and replies
  const rootComments = comments.filter(c => !c.parentId);
  const getReplies = (parentId: string) => comments.filter(c => c.parentId === parentId).reverse(); // Oldest replies first

  const renderComment = (comment: CommentType, isReply = false) => {
    const isOwner = comment.userId?._id === currentUserId;
    const isQRAdminContext = currentUserId === qrOwnerId;
    const isAdminOfComment = comment.userId?._id === qrOwnerId;
    const hasLiked = currentUserId && comment.likes.includes(currentUserId);

    return (
      <div key={comment._id} className={`flex gap-3 group animate-in fade-in ${isReply ? "ml-10 mt-4" : "mt-6"}`}>
        <Avatar className="w-10 h-10 border border-zinc-200 dark:border-zinc-800 shrink-0">
          <AvatarImage src={comment.userId?.image || undefined} />
          <AvatarFallback><UserIcon className="w-5 h-5 text-zinc-400" /></AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl px-4 py-3 border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                  {comment.userId?.name || "Anonymous User"}
                </span>
                {isAdminOfComment && (
                  <Badge variant="default" className="bg-indigo-500 hover:bg-indigo-600 text-[10px] px-1.5 py-0 h-4">
                    Creator
                  </Badge>
                )}
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {formatDate(comment.createdAt)}
                </span>
                {comment.isEdited && (
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 flex items-center gap-0.5">
                    <Edit2 className="w-3 h-3" /> edited {comment.editCount > 1 ? `(${comment.editCount})` : ""}
                  </span>
                )}
              </div>

              {/* Actions Dropdown */}
              {(isOwner || isQRAdminContext) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="w-4 h-4 text-zinc-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-32">
                    {isOwner && (
                      <DropdownMenuItem onClick={() => { setEditingId(comment._id); setEditText(comment.text); }}>
                        <Edit2 className="w-4 h-4 mr-2" /> Edit
                      </DropdownMenuItem>
                    )}
                    {(isOwner || isQRAdminContext) && (
                      <DropdownMenuItem onClick={() => handleDelete(comment._id)} className="text-destructive focus:text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {editingId === comment._id ? (
              <div className="mt-2 text-right space-y-2">
                <Textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="min-h-[60px] text-sm bg-white dark:bg-zinc-900"
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>Cancel</Button>
                  <Button size="sm" onClick={() => handleEdit(comment._id)}>Save</Button>
                </div>
              </div>
            ) : (
              <p className="text-zinc-700 dark:text-zinc-300 text-sm whitespace-pre-wrap break-words">
                {comment.text}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4 mt-1.5 ml-1">
            <button
              onClick={() => handleLike(comment._id)}
              disabled={!currentUserId}
              className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                hasLiked ? "text-rose-500" : "text-zinc-500 hover:text-rose-500"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${hasLiked ? "fill-rose-500" : ""}`} />
              {comment.likes.length > 0 && comment.likes.length}
            </button>
            
            {!isReply && session && (
              <button
                onClick={() => { setReplyingTo(replyingTo === comment._id ? null : comment._id); setReplyText(""); }}
                className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-indigo-500 transition-colors"
              >
                <CornerDownRight className="w-3.5 h-3.5" />
                Reply
              </button>
            )}
          </div>

          {/* Reply Input */}
          {replyingTo === comment._id && (
            <form onSubmit={(e) => handlePost(e, comment._id)} className="mt-3 ml-4 flex gap-2 animate-in slide-in-from-top-2">
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="min-h-[40px] h-[40px] text-sm bg-zinc-50 dark:bg-zinc-900 resize-none py-2"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (replyText.trim()) handlePost(e, comment._id);
                  }
                }}
              />
              <Button type="submit" size="sm" disabled={!replyText.trim() || submitting} className="h-[40px] px-3">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          )}

          {/* Render Nested Replies */}
          {!isReply && getReplies(comment._id).map(reply => renderComment(reply, true))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 mb-16 p-6 sm:p-8 bg-white dark:bg-zinc-900/40 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-500" />
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Comments <span className="text-zinc-400 font-medium text-lg">({comments.length})</span>
          </h3>
        </div>
      </div>

      {status === "loading" ? (
        <div className="h-28 animate-pulse bg-zinc-100 dark:bg-zinc-800 rounded-xl mb-8" />
      ) : session ? (
        <form onSubmit={(e) => handlePost(e)} className="mb-10 relative">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full min-h-[100px] pb-14 resize-none bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 focus-visible:ring-indigo-500 rounded-xl"
            disabled={submitting}
          />
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <Button 
              type="submit" 
              size="sm" 
              disabled={!text.trim() || submitting}
              className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4"
            >
              <Send className="w-4 h-4" />
              {submitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="mb-10 p-8 flex flex-col items-center justify-center text-center bg-indigo-50/50 dark:bg-indigo-500/5 rounded-2xl border border-dashed border-indigo-200 dark:border-indigo-500/20">
          <ShieldAlert className="w-8 h-8 text-indigo-400 mb-3" />
          <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Join the Conversation</h4>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-5 max-w-sm">
            Sign in to post comments, leave likes, and reply to others.
          </p>
          <Button asChild variant="default" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25">
            <Link href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}>
              Sign In to Comment
            </Link>
          </Button>
        </div>
      )}

      {loading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800" />
              <div className="flex-1 space-y-3 pt-1">
                <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-1/4" />
                <div className="h-16 bg-zinc-100 dark:bg-zinc-800 rounded-xl w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : rootComments.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-zinc-400 dark:text-zinc-500" />
          </div>
          <p className="text-zinc-900 dark:text-zinc-100 font-medium mb-1">No comments yet</p>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {rootComments.map(comment => renderComment(comment))}
        </div>
      )}
    </div>
  );
}
