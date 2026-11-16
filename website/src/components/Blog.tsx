import { useState } from "react";
import { Clock, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useBlogPosts } from "@/hooks/useSupabaseData";
import { usePick, useT } from "@/hooks/useLang";

const Blog = () => {
  const { data: blogPosts, loading } = useBlogPosts();
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const t = useT();
  const pick = usePick();

  if (loading) {
    return (
      <section id="blog" className="py-8 lg:py-12 bg-[#FDF6E3]">
        <div className="max-w-[1280px] mx-auto px-6 text-center text-muted-foreground">Loading...</div>
      </section>
    );
  }

  return (
    <section id="blog" className="py-8 lg:py-12 bg-[#FDF6E3]">
      <div className="max-w-[1280px] mx-auto px-6">
        <h2 className="font-serif text-3xl lg:text-4xl font-bold text-[#171452] mb-1.5">
          {t("Blog & Articles", "ब्लॉग एवं लेख")}
        </h2>
        <p className="text-[0.95rem] text-muted-foreground mb-8">
          {t("In-depth articles on astrology, Vastu and spirituality to grow your knowledge", "ज्योतिष, वास्तु और आध्यात्मिकता पर विस्तृत लेख पढ़ें और ज्ञान बढ़ाएं")}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="bg-[#FFFDF5] rounded-[14px] overflow-hidden border border-[hsl(40,50%,85%)] shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
            >
              <div className="relative h-[150px] overflow-hidden">
                <span className="absolute top-2 left-2 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded font-semibold z-10">
                  Astromate
                </span>
                <Badge className="absolute top-2 right-2 bg-white/90 text-foreground hover:bg-white z-10 text-[10px]">
                  {pick(post, "tag")}
                </Badge>
                {post.image_url ? (
                  <img src={post.image_url} alt={pick(post, "title")} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                    <span className="text-4xl">📝</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10">
                  <p className="text-white text-[0.82rem] font-bold font-serif leading-tight">{pick(post, "title")}</p>
                  <span className="text-white/80 text-[0.62rem] flex items-center gap-1 mt-0.5">
                    <Clock className="h-3 w-3" />
                    {t(`${post.read_time} min`, `${post.read_time} मिनट`)}
                  </span>
                </div>
              </div>

              <div className="p-3.5 flex-1 flex flex-col">
                <p className="text-[0.77rem] text-muted-foreground leading-relaxed line-clamp-2 flex-1">{pick(post, "summary")}</p>
                {post.author && (
                  <p className="mt-2 flex items-center gap-1 text-[0.7rem] font-medium text-[#171452]">
                    <UserRound className="h-3 w-3" />
                    {pick(post, "author")}
                  </p>
                )}
              </div>


              <div className="flex items-center gap-2.5 px-3.5 py-2.5 border-t border-[hsl(40,50%,90%)]">
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedPost(post); }}
                  className="flex-1 bg-[#171452] text-white py-2 rounded-lg text-[0.86rem] font-semibold hover:bg-[#1e1a6e] transition-colors"
                >
                  {t("Read more", "पूरा पढ़ें")}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="relative mb-4">
              {selectedPost?.image_url && (
                <img src={selectedPost.image_url} alt={pick(selectedPost, "title")} className="w-full h-48 object-cover rounded-lg" />
              )}
              <Badge className="absolute top-3 left-3 bg-primary">{pick(selectedPost, "tag")}</Badge>
            </div>
            <DialogTitle className="text-xl">{pick(selectedPost, "title")}</DialogTitle>
            <DialogDescription className="pt-2 space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {t(`${selectedPost?.read_time} min read`, `${selectedPost?.read_time} मिनट पढ़ने का समय`)}
                </span>
                {selectedPost?.author && (
                  <span className="flex items-center gap-1 font-medium text-[#171452]">
                    <UserRound className="h-4 w-4" />
                    {pick(selectedPost, "author")}
                  </span>
                )}
              </div>

              <div className="text-foreground whitespace-pre-line text-base leading-relaxed">
                {pick(selectedPost, "body")}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Blog;
