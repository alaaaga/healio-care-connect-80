import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const categories = ["الكل", "القلب", "الجلدية", "المخ والأعصاب", "الأسنان", "العيون"];

const articles = [
  { id: "1", title: "كل ما تحتاج تعرفه عن أمراض القلب والوقاية منها", category: "القلب", desc: "تعرف على أحدث طرق الوقاية والعلاج لأمراض القلب والشرايين.", image: "❤️", date: "٢٥ فبراير ٢٠٢٦" },
  { id: "2", title: "روتين العناية بالبشرة في الشتاء المصري", category: "الجلدية", desc: "نصائح خبراء الجلدية للحفاظ على بشرتك في فصل الشتاء.", image: "✨", date: "٢٢ فبراير ٢٠٢٦" },
  { id: "3", title: "الصداع النصفي: أسباب وعلاجات حديثة", category: "المخ والأعصاب", desc: "اكتشف أحدث العلاجات والتغييرات اللي تقدر تعملها للتخلص من الصداع.", image: "🧠", date: "٢٠ فبراير ٢٠٢٦" },
  { id: "4", title: "أهمية الكشف الدوري على الأسنان", category: "الأسنان", desc: "ليه الزيارة الدورية لدكتور الأسنان مهمة أكتر مما تتخيل.", image: "🦷", date: "١٨ فبراير ٢٠٢٦" },
  { id: "5", title: "نظام غذائي صحي للقلب: إيه تاكل وإيه تتجنب", category: "القلب", desc: "دليلك الكامل لأكل صحي يحافظ على قلبك.", image: "🥗", date: "١٥ فبراير ٢٠٢٦" },
  { id: "6", title: "حساسية العين في الربيع: الأعراض والعلاج", category: "العيون", desc: "كل ما تحتاج تعرفه عن حساسية العين الموسمية وطرق علاجها.", image: "👁️", date: "١٢ فبراير ٢٠٢٦" },
];

export default function ArticlesSection() {
  const [activeCategory, setActiveCategory] = useState("الكل");
  const filtered = activeCategory === "الكل" ? articles.slice(0, 3) : articles.filter((a) => a.category === activeCategory).slice(0, 3);

  return (
    <section className="section-padding">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">المدونة الصحية</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 text-foreground">
            مقالات ونصائح طبية
          </h2>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* Articles Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((article, i) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="glass-card rounded-2xl overflow-hidden group cursor-pointer"
            >
              <div className="h-44 bg-muted flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-500">
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
                  اقرأ المزيد <ArrowLeft className="w-3.5 h-3.5" />
                </Button>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link to="/articles">
            <Button variant="outline" size="lg">عرض جميع المقالات ←</Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
