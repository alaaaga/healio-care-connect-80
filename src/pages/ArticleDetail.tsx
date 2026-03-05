import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock, User, Calendar, Share2, BookmarkPlus, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

const categoryEmoji: Record<string, string> = {
  "القلب": "❤️", "الجلدية": "✨", "المخ والأعصاب": "🧠", "الأسنان": "🦷",
  "العيون": "👁️", "التغذية": "🥗", "الصحة النفسية": "🧘", "عام": "📋",
};

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      const { data } = await supabase.from("articles").select("*").eq("id", id).single();
      setArticle(data);
      if (data) {
        const { data: rel } = await supabase.from("articles").select("*").eq("category", data.category).neq("id", data.id).eq("is_published", true).limit(3);
        setRelated(rel || []);
      }
      setLoading(false);
    };
    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-12 px-4 md:px-8 container-narrow max-w-4xl">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-72 w-full rounded-2xl mb-8" />
          <div className="space-y-4">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full" />)}</div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground">المقال غير موجود</h1>
          <Link to="/articles"><Button variant="outline" className="mt-4">الرجوع للمقالات</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Parse content - support both plain text and structured JSON
  const renderContent = () => {
    // Try parsing as JSON structure
    try {
      const parsed = typeof article.content === 'string' ? JSON.parse(article.content) : article.content;
      if (Array.isArray(parsed)) {
        return parsed.map((section: any, i: number) => (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.05 }} className="mb-8">
            {section.type === "heading" && <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-3 mt-8">{section.text}</h2>}
            {section.type === "paragraph" && <p className="text-muted-foreground leading-loose text-base">{section.text}</p>}
            {section.type === "list" && (
              <ul className="space-y-2 my-4">
                {section.items?.map((item: string, j: number) => (
                  <li key={j} className="flex items-start gap-2 text-muted-foreground"><span className="w-2 h-2 rounded-full bg-primary mt-2.5 shrink-0" /><span className="leading-relaxed">{item}</span></li>
                ))}
              </ul>
            )}
            {section.type === "tip" && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 my-6">
                <p className="text-sm font-semibold text-primary mb-1">💡 نصيحة</p>
                <p className="text-sm text-muted-foreground">{section.text}</p>
              </div>
            )}
          </motion.div>
        ));
      }
    } catch {
      // Not JSON, render as plain text paragraphs
    }
    
    return article.content.split('\n').filter((p: string) => p.trim()).map((paragraph: string, i: number) => (
      <motion.p key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.05 }} className="text-muted-foreground leading-loose text-base mb-6">
        {paragraph}
      </motion.p>
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-4 md:px-8">
        <div className="container-narrow max-w-4xl">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-primary transition-colors">الرئيسية</Link>
            <span>/</span>
            <Link to="/articles" className="hover:text-primary transition-colors">المقالات</Link>
            <span>/</span>
            <span className="text-foreground">{article.title.slice(0, 30)}...</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="secondary" className="mb-4">{article.category}</Badge>
            <h1 className="font-display text-2xl md:text-4xl font-bold text-foreground mb-4 leading-relaxed">{article.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1.5"><User className="w-4 h-4" />{article.author}</div>
              <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{new Date(article.created_at).toLocaleDateString("ar-EG")}</div>
              <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{article.reading_time}</div>
            </div>
            <div className="flex gap-2 mb-8">
              <Button variant="outline" size="sm" className="gap-1.5"><Share2 className="w-3.5 h-3.5" />مشاركة</Button>
              <Button variant="outline" size="sm" className="gap-1.5"><BookmarkPlus className="w-3.5 h-3.5" />حفظ</Button>
              <Button variant="outline" size="sm" className="gap-1.5"><ThumbsUp className="w-3.5 h-3.5" />مفيد</Button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="w-full h-48 md:h-72 rounded-2xl bg-muted flex items-center justify-center text-7xl mb-10 overflow-hidden">
            {article.image_url ? <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" /> : categoryEmoji[article.category] || "📋"}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="prose-custom">
            {renderContent()}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-2xl p-6 mt-12 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl shrink-0">👨‍⚕️</div>
            <div>
              <p className="text-sm text-muted-foreground">كاتب المقال</p>
              <h4 className="font-display font-bold text-foreground">{article.author}</h4>
            </div>
          </motion.div>

          {related.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-16">
              <h3 className="font-display text-xl font-bold text-foreground mb-6">مقالات ذات صلة</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {related.map((ra) => (
                  <Link key={ra.id} to={`/articles/${ra.id}`}>
                    <motion.div whileHover={{ y: -4 }} className="glass-card rounded-xl overflow-hidden cursor-pointer">
                      <div className="h-28 bg-muted flex items-center justify-center text-3xl">
                        {ra.image_url ? <img src={ra.image_url} alt={ra.title} className="w-full h-full object-cover" /> : categoryEmoji[ra.category] || "📋"}
                      </div>
                      <div className="p-4">
                        <h4 className="font-display text-sm font-semibold text-foreground line-clamp-2">{ra.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{ra.reading_time}</p>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          <div className="mt-10 text-center">
            <Link to="/articles"><Button variant="outline" className="gap-2"><ArrowRight className="w-4 h-4" />الرجوع لكل المقالات</Button></Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
