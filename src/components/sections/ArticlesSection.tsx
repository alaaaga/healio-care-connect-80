import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const categories = ["الكل", "القلب", "الجلدية", "المخ والأعصاب", "الأسنان", "العيون"];

const categoryEmoji: Record<string, string> = {
  "القلب": "❤️", "الجلدية": "✨", "المخ والأعصاب": "🧠", "الأسنان": "🦷",
  "العيون": "👁️", "التغذية": "🥗", "الصحة النفسية": "🧘", "عام": "📋",
};

export default function ArticlesSection() {
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("articles").select("*").eq("is_published", true).order("created_at", { ascending: false }).limit(6);
      setArticles(data || []);
      setLoading(false);
    };
    fetch();

    const channel = supabase
      .channel('articles-home')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'articles' }, async () => {
        const { data } = await supabase.from("articles").select("*").eq("is_published", true).order("created_at", { ascending: false }).limit(6);
        setArticles(data || []);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const filtered = activeCategory === "الكل" ? articles.slice(0, 3) : articles.filter((a) => a.category === activeCategory).slice(0, 3);

  return (
    <section className="section-padding">
      <div className="container-narrow">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">المدونة الصحية</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 text-foreground">مقالات ونصائح طبية</h2>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <motion.button key={cat} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? "bg-primary text-primary-foreground shadow-md shadow-primary/25" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-72 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((article, i) => (
              <motion.article key={article.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -6 }} className="glass-card rounded-2xl overflow-hidden group cursor-pointer">
                <Link to={`/articles/${article.id}`}>
                  <div className="h-44 bg-muted flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-500">
                    {article.image_url ? <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" /> : categoryEmoji[article.category] || "📋"}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="text-xs">{article.category}</Badge>
                      <span className="text-xs text-muted-foreground">{new Date(article.created_at).toLocaleDateString("ar-EG")}</span>
                    </div>
                    <h3 className="font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">{article.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
                    <Button variant="link" className="px-0 mt-3 text-primary gap-1">اقرأ المزيد <ArrowLeft className="w-3.5 h-3.5" /></Button>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-10">
          <Link to="/articles"><Button variant="outline" size="lg">عرض جميع المقالات ←</Button></Link>
        </motion.div>
      </div>
    </section>
  );
}
