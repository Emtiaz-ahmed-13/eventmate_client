"use client";

import { useState } from "react";
import { MessageSquare, User, CornerDownRight, CheckCircle2 } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";

interface Discussion {
  id: string;
  question: string;
  answer?: string;
  userId: string;
  user: {
    name: string;
    profile?: {
      profileImage: string;
    };
  };
  createdAt: string;
}

import { useEffect } from "react";
import { DiscussionServices } from "@/services/discussion.service";

export const DiscussionSection = ({ eventId, isHost }: { eventId: string; isHost: boolean }) => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const data = await DiscussionServices.getEventDiscussions(eventId);
        setDiscussions(data);
      } catch (error) {
        console.error("Failed to fetch discussions", error);
      }
    };
    fetchDiscussions();
  }, [eventId]);

  const handlePostQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    try {
      const data = await DiscussionServices.createQuestion(eventId, newQuestion);
      setDiscussions((prev) => [data, ...prev]);
      setNewQuestion("");
      toast.success("Question posted!");
    } catch (error) {
      toast.error("Failed to post question");
    }
  };

  const handleAnswerQuestion = async (discussionId: string) => {
    const answer = answers[discussionId];
    if (!answer?.trim()) return;

    try {
      await DiscussionServices.answerQuestion(discussionId, answer);
      setDiscussions((prev) =>
        prev.map((d) => (d.id === discussionId ? { ...d, answer } : d))
      );
      setAnswers((prev) => ({ ...prev, [discussionId]: "" }));
      toast.success("Answer posted!");
    } catch (error) {
      toast.error("Failed to post answer");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
          <MessageSquare className="w-5 h-5 text-blue-500" />
          Event Discussion
        </h2>
      </div>

      {!isHost && (
        <form onSubmit={handlePostQuestion} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm space-y-4">
          <textarea
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Ask a question about this event..."
            className="w-full h-24 bg-transparent border-none focus:ring-0 text-sm placeholder:text-zinc-500 resize-none text-zinc-900 dark:text-white"
          />
          <div className="flex justify-end border-t border-zinc-100 dark:border-zinc-800 pt-3">
            <button
              type="submit"
              className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-2 rounded-xl text-xs font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
              disabled={!newQuestion.trim()}
            >
              Post Question
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {discussions.length === 0 ? (
          <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-500 text-sm">No discussions yet. Be the first to ask!</p>
          </div>
        ) : (
          discussions.map((d) => (
            <div key={d.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {d.user.profile?.profileImage ? (
                    <img src={d.user.profile.profileImage} alt={d.user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-zinc-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{d.user.name}</span>
                    <span className="text-[10px] text-zinc-400">{new Date(d.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{d.question}</p>
                </div>
              </div>

              {d.answer ? (
                <div className="ml-10 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-4 flex gap-3">
                  <CornerDownRight className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Host Answer</span>
                      <CheckCircle2 className="w-3 h-3 text-blue-500" />
                    </div>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 italic">{d.answer}</p>
                  </div>
                </div>
              ) : isHost ? (
                <div className="ml-10 space-y-3">
                  <textarea
                    placeholder="Type your answer..."
                    value={answers[d.id] || ""}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, [d.id]: e.target.value }))}
                    className="w-full h-20 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none text-zinc-900 dark:text-white"
                  />
                  <button 
                    onClick={() => handleAnswerQuestion(d.id)}
                    className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-colors"
                  >
                    Reply
                  </button>
                </div>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
// Improved accessibility for discussion forum
