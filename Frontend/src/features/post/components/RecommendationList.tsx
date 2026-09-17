import { RecommendationCard } from "./RecommendationCard";

// Mock data for recommendations
const MOCK_RECOMMENDATIONS = [
  {
    id: "1",
    title: "Understanding React 19 Compiler and its impact on performance",
    author: {
      username: "sarah_dev",
      fullname: "Sarah Johnson",
      avatar: "https://i.pravatar.cc/150?u=sarah_dev",
    },
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop",
    readTime: "6 min read",
    date: "Oct 12",
  },
  {
    id: "2",
    title: "Building accessible web applications with Radix UI",
    author: {
      username: "alex_design",
      fullname: "Alex Rivera",
      avatar: "https://i.pravatar.cc/150?u=alex_design",
    },
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
    readTime: "8 min read",
    date: "Oct 15",
  },
  {
    id: "3",
    title: "The future of CSS: What to expect in 2026",
    author: {
      username: "css_wizard",
      fullname: "David Chen",
      avatar: "https://i.pravatar.cc/150?u=css_wizard",
    },
    coverImage: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=1000&auto=format&fit=crop",
    readTime: "5 min read",
    date: "Oct 18",
  },
];

export const RecommendationList = () => {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-8 text-foreground tracking-tight">More from Zentro</h2>
      
      <div className="max-w-2xl mx-auto space-y-8">
        {MOCK_RECOMMENDATIONS.map((post) => (
          <RecommendationCard key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
};
