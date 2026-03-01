import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Clock, User, Calendar, Share2, BookmarkPlus, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { articlesData } from "@/data/articles";

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const article = articlesData.find((a) => a.id === id);

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground">المقال غير موجود</h1>
          <Link to="/articles">
            <Button variant="outline" className="mt-4">الرجوع للمقالات</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const relatedArticles = articlesData.filter((a) => a.category === article.category && a.id !== article.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-4 md:px-8">
        <div className="container-narrow max-w-4xl">
          {/* Breadcrumb */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-primary transition-colors">الرئيسية</Link>
            <span>/</span>
            <Link to="/articles" className="hover:text-primary transition-colors">المقالات</Link>
            <span>/</span>
            <span className="text-foreground">{article.title.slice(0, 30)}...</span>
          </motion.div>

          {/* Article Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="secondary" className="mb-4">{article.category}</Badge>
            <h1 className="font-display text-2xl md:text-4xl font-bold text-foreground mb-4 leading-relaxed">{article.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1.5"><User className="w-4 h-4" />{article.author}</div>
              <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{article.date}</div>
              <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{article.readTime}</div>
            </div>
            <div className="flex gap-2 mb-8">
              <Button variant="outline" size="sm" className="gap-1.5"><Share2 className="w-3.5 h-3.5" />مشاركة</Button>
              <Button variant="outline" size="sm" className="gap-1.5"><BookmarkPlus className="w-3.5 h-3.5" />حفظ</Button>
              <Button variant="outline" size="sm" className="gap-1.5"><ThumbsUp className="w-3.5 h-3.5" />مفيد</Button>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="w-full h-48 md:h-72 rounded-2xl bg-muted flex items-center justify-center text-7xl mb-10"
          >
            {article.image}
          </motion.div>

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prose-custom"
          >
            {article.content.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.05 }}
                className="mb-8"
              >
                {section.type === "heading" && (
                  <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-3 mt-8">{section.text}</h2>
                )}
                {section.type === "paragraph" && (
                  <p className="text-muted-foreground leading-loose text-base">{section.text}</p>
                )}
                {section.type === "list" && (
                  <ul className="space-y-2 my-4">
                    {section.items?.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-muted-foreground">
                        <span className="w-2 h-2 rounded-full bg-primary mt-2.5 shrink-0" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
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
            ))}
          </motion.div>

          {/* Author Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-2xl p-6 mt-12 flex items-center gap-4"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl shrink-0">👨‍⚕️</div>
            <div>
              <p className="text-sm text-muted-foreground">كاتب المقال</p>
              <h4 className="font-display font-bold text-foreground">{article.author}</h4>
              <p className="text-sm text-muted-foreground mt-1">{article.authorBio}</p>
            </div>
          </motion.div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-16">
              <h3 className="font-display text-xl font-bold text-foreground mb-6">مقالات ذات صلة</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {relatedArticles.map((ra) => (
                  <Link key={ra.id} to={`/articles/${ra.id}`}>
                    <motion.div whileHover={{ y: -4 }} className="glass-card rounded-xl overflow-hidden cursor-pointer">
                      <div className="h-28 bg-muted flex items-center justify-center text-3xl">{ra.image}</div>
                      <div className="p-4">
                        <h4 className="font-display text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary">{ra.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{ra.readTime}</p>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          <div className="mt-10 text-center">
            <Link to="/articles">
              <Button variant="outline" className="gap-2">
                <ArrowRight className="w-4 h-4" />
                الرجوع لكل المقالات
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
