import { Flame, Hash, TrendingUp, Sparkles, FolderHeart, Activity } from "lucide-react";
import { SuggestionCard } from "./SuggestionCard";
import { toast } from "sonner";

export function TrendingSidebar() {
  const trendingTags = [
    { name: "AIRevolution", posts: "12.5k posts" },
    { name: "DesignSystems", posts: "8.2k posts" },
    { name: "Minimalism", posts: "4.1k posts" },
    { name: "TypeScript6", posts: "2.9k posts" }
  ];

  const suggestedTopics = [
    "React 19 Server Components",
    "Tailwind CSS v4.0 Features",
    "Glassmorphism Performance",
    "State Hydration Techniques"
  ];

  const recommendedWriters = [
    {
      name: "Dan Abramov",
      handle: "@dan_abramov",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
    },
    {
      name: "Sarah Jenkins",
      handle: "@design_sensei",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
    },
    {
      name: "Alex Rivera",
      handle: "@alex_coder",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
    }
  ];

  const popularCategories = [
    { name: "Programming", count: 42 },
    { name: "AI", count: 28 },
    { name: "Technology", count: 19 },
    { name: "General", count: 12 }
  ];

  const recentActivity = [
    { text: "Liked Dan Abramov's post on RSC", time: "2h ago" },
    { text: "Followed Sarah Jenkins", time: "1d ago" },
    { text: "Updated profile bio", time: "3d ago" }
  ];

  return (
    <div className="space-y-8">
      {/* Reading Streak Widget (Premium feature) */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 shadow-sm">
        <div className="flex items-center gap-2 text-amber-500 mb-2">
          <Flame className="w-5 h-5 fill-amber-500 animate-pulse" />
          <h4 className="font-bold text-sm tracking-tight">Reading Streak</h4>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          You are on a <span className="font-bold text-foreground">5-day reading streak!</span> Keep reading daily to build your streak.
        </p>
        <div className="flex gap-1.5 mt-3">
          {[1, 2, 3, 4, 5].map((day) => (
            <div
              key={day}
              className="flex-1 h-1.5 rounded-full bg-amber-500"
              title={`Day ${day} complete`}
            />
          ))}
          {[6, 7].map((day) => (
            <div
              key={day}
              className="flex-1 h-1.5 rounded-full bg-muted/40"
              title={`Day ${day} pending`}
            />
          ))}
        </div>
      </div>

      {/* Trending Tags */}
      <div>
        <div className="flex items-center gap-2 mb-3 text-muted-foreground/90">
          <Hash className="w-4 h-4 text-primary" />
          <h4 className="font-bold text-xs tracking-wider uppercase">Trending Tags</h4>
        </div>
        <div className="space-y-3">
          {trendingTags.map((tag) => (
            <div
              key={tag.name}
              className="group cursor-pointer select-none"
              onClick={() => toast.info(`Filtered by #${tag.name}`)}
            >
              <p className="font-semibold text-sm group-hover:text-primary transition-colors text-foreground">
                #{tag.name}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{tag.posts}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Topics */}
      <div className="pt-4 border-t border-border/40">
        <div className="flex items-center gap-2 mb-3 text-muted-foreground/90">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h4 className="font-bold text-xs tracking-wider uppercase">Suggested Topics</h4>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {suggestedTopics.map((topic) => (
            <span
              key={topic}
              onClick={() => toast.info(`Viewing topic: ${topic}`)}
              className="px-2.5 py-1 text-xs rounded-md bg-secondary/30 hover:bg-secondary border border-border/20 text-foreground transition-all duration-200 cursor-pointer select-none"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/* Recommended Writers */}
      <div className="pt-4 border-t border-border/40">
        <div className="flex items-center gap-2 mb-3 text-muted-foreground/90">
          <Sparkles className="w-4 h-4 text-primary" />
          <h4 className="font-bold text-xs tracking-wider uppercase">Who to Follow</h4>
        </div>
        <div className="space-y-1">
          {recommendedWriters.map((writer) => (
            <SuggestionCard
              key={writer.handle}
              avatar={writer.avatar}
              title={writer.name}
              subtitle={writer.handle}
              actionLabel="Follow"
              onAction={() => toast.success(`Followed ${writer.name}`)}
            />
          ))}
        </div>
      </div>

      {/* Popular Categories */}
      <div className="pt-4 border-t border-border/40">
        <div className="flex items-center gap-2 mb-3 text-muted-foreground/90">
          <FolderHeart className="w-4 h-4 text-primary" />
          <h4 className="font-bold text-xs tracking-wider uppercase">Categories</h4>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {popularCategories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => toast.info(`Filtered by category: ${cat.name}`)}
              className="p-2 rounded-xl bg-card border border-border/30 hover:border-primary/20 transition-all cursor-pointer flex flex-col justify-between"
            >
              <span className="text-xs font-semibold text-foreground">{cat.name}</span>
              <span className="text-[10px] text-muted-foreground mt-1">{cat.count} posts</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="pt-4 border-t border-border/40">
        <div className="flex items-center gap-2 mb-3 text-muted-foreground/90">
          <Activity className="w-4 h-4 text-primary" />
          <h4 className="font-bold text-xs tracking-wider uppercase">Recent Activity</h4>
        </div>
        <div className="space-y-3">
          {recentActivity.map((act, index) => (
            <div key={index} className="flex justify-between items-start gap-2 text-xs">
              <p className="text-muted-foreground/90 leading-tight">{act.text}</p>
              <span className="text-[10px] text-muted-foreground/60 flex-shrink-0">{act.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
