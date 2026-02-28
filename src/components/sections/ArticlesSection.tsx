import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const categories = ["All", "Cardiology", "Dermatology", "Neurology", "Dental"];

const articles = [
  { title: "Understanding Heart Disease: Prevention & Care", category: "Cardiology", desc: "Learn about the latest advances in cardiac care and prevention strategies.", image: "❤️", date: "Feb 25, 2026" },
  { title: "Skin Care Routines for Every Season", category: "Dermatology", desc: "Expert tips for keeping your skin healthy throughout the year.", image: "✨", date: "Feb 22, 2026" },
  { title: "Migraine Management: New Approaches", category: "Neurology", desc: "Discover modern treatments and lifestyle changes for migraine relief.", image: "🧠", date: "Feb 20, 2026" },
  { title: "The Importance of Regular Dental Checkups", category: "Dental", desc: "Why routine dental visits matter more than you might think.", image: "🦷", date: "Feb 18, 2026" },
  { title: "Healthy Heart Diet: What to Eat", category: "Cardiology", desc: "Nutrition guidelines for maintaining cardiovascular health.", image: "🥗", date: "Feb 15, 2026" },
  { title: "Acne Treatments That Actually Work", category: "Dermatology", desc: "Evidence-based approaches to treating persistent acne.", image: "💊", date: "Feb 12, 2026" },
];

export default function ArticlesSection() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All" ? articles : articles.filter((a) => a.category === activeCategory);

  return (
    <section className="section-padding">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Health Blog</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 text-foreground">
            Medical Articles & Insights
          </h2>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((article, i) => (
            <motion.article
              key={article.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl overflow-hidden hover-lift group cursor-pointer"
            >
              <div className="h-44 bg-muted flex items-center justify-center text-5xl group-hover:scale-105 transition-transform duration-500">
                {article.image}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="text-xs">{article.category}</Badge>
                  <span className="text-xs text-muted-foreground">{article.date}</span>
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{article.desc}</p>
                <Button variant="link" className="px-0 mt-3 text-primary gap-1">
                  Read More <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
