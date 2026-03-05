import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Clock, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

const categories = ["الكل", "القلب", "الجلدية", "المخ والأعصاب", "الأسنان", "العيون", "التغذية", "الصحة النفسية", "عام"];

export default function ArticlesPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      const { data } = await supabase.from("articles").select("*").eq("is_published", true).order("created_at", { ascending: false });
      setArticles(data || []);
      setLoading(false);
    };
    fetchArticles();

    const channel = supabase
      .channel('articles-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'articles' }, async () => {
        const { data } = await supabase.from("articles").select("*").eq("is_published", true).order("created_at", { ascending: false });
        setArticles(data || []);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const filtered = articles.filter((a) => {
    const matchSearch = a.title.includes(search) || (a.excerpt || "").includes(search);
    const matchCategory = activeCategory === "الكل" || a.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const categoryEmoji: Record<string, string> = {
    "القلب": "❤️", "الجلدية": "✨", "المخ والأعصاب": "🧠", "الأسنان": "🦷",
    "العيون": "👁️", "التغذية": "🥗", "الصحة النفسية": "🧘", "عام": "📋",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-8 px-4 md:px-8">
        <div className="container-narrow">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">المقالات الطبية</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">اقرأ أحدث المقالات والنصائح الطبية من أفضل الأطباء المتخصصين</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input placeholder="ابحث عن مقال..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-10 h-12 rounded-xl" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <motion.button key={cat} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? "bg-primary text-primary-foreground shadow-md shadow-primary/25" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                {cat}
              </motion.button>
            ))}
          </motion.div>

          <p className="text-sm text-muted-foreground mb-6">{filtered.length} مقال</p>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-72 rounded-2xl" />)}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filtered.map((article, i) => (
                  <motion.article key={article.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -6 }} className="glass-card rounded-2xl overflow-hidden group cursor-pointer">
                    <Link to={`/articles/${article.id}`}>
                      <div className="h-44 bg-muted flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-500 relative overflow-hidden">
                        {article.image_url ? <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" /> : categoryEmoji[article.category] || "📋"}
                        <div className="absolute inset-0 bg-gradient-to-t from-card/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="secondary" className="text-xs">{article.category}</Badge>
                          <span className="text-xs text-muted-foreground">{new Date(article.created_at).toLocaleDateString("ar-EG")}</span>
                        </div>
                        <h3 className="font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">{article.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{article.excerpt}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1"><User className="w-3 h-3" /><span>{article.author}</span></div>
                          <div className="flex items-center gap-1"><Clock className="w-3 h-3" /><span>{article.reading_time}</span></div>
                        </div>
                        <Button variant="link" className="px-0 mt-3 text-primary gap-1">اقرأ المزيد <ArrowLeft className="w-3.5 h-3.5" /></Button>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
