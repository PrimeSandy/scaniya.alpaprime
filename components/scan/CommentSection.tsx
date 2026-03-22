"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Comment {
  _id: string;
  text: string;
  createdAt: string;
  userId: {
    _id: string;
    name: string;
    image?: string;
  };
}

export function CommentSection({ qrId }: { qrId: string }) {
  const { data: session, status } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    fetch(`/api/comments?qrId=${qrId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setComments(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch comments", err);
        setLoading(false);
      });
  }, [qrId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !session) return;
    
    setSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrId, text }),
      });
      
      if (res.ok) {
        const newComment = await res.json();
        setComments([newComment, ...comments]);
        setText("");
      } else {
        console.error("Failed to post comment");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 mb-16 p-6 bg-white dark:bg-zinc-900/50 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-zinc-500" />
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Comments ({comments.length})
        </h3>
      </div>

      {status === "loading" ? (
        <div className="h-28 animate-pulse bg-zinc-100 dark:bg-zinc-800 rounded-xl mb-8" />
      ) : session ? (
        <form onSubmit={handleSubmit} className="mb-8 relative">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment..."
            className="w-full min-h-[100px] pb-12 resize-none bg-zinc-50 dark:bg-zinc-950 focus-visible:ring-primary"
            disabled={submitting}
          />
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <Button 
              type="submit" 
              size="sm" 
              disabled={!text.trim() || submitting}
              className="gap-2"
            >
              <Send className="w-4 h-4" />
              {submitting ? "Posting..." : "Post"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-6 flex flex-col items-center justify-center text-center bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border-dashed border-2 border-zinc-200 dark:border-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            Sign in to join the conversation
          </p>
          <Button asChild variant="outline">
            <Link href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}>
              Sign In to Comment
            </Link>
          </Button>
        </div>
      )}

      <div className="space-y-6">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-1/4" />
                <div className="h-16 bg-zinc-100 dark:bg-zinc-800 rounded w-full" />
              </div>
            </div>
          ))
        ) : comments.length === 0 ? (
          <p className="text-center text-zinc-500 dark:text-zinc-400 py-8">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-4 group">
              <Avatar className="w-10 h-10 border border-zinc-200 dark:border-zinc-800">
                <AvatarImage src={comment.userId?.image || undefined} />
                <AvatarFallback>
                  <UserIcon className="w-5 h-5 text-zinc-400" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate">
                    {comment.userId?.name || "Anonymous User"}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                    • {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-zinc-700 dark:text-zinc-300 text-sm whitespace-pre-wrap break-words">
                  {comment.text}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
