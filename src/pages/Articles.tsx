import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Clock, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const categories = ["الكل", "القلب", "الجلدية", "المخ والأعصاب", "الأسنان", "العيون", "التغذية", "الصحة النفسية"];

const allArticles = [
  { id: "1", title: "كل ما تحتاج تعرفه عن أمراض القلب والوقاية منها", category: "القلب", desc: "تعرف على أحدث طرق الوقاية والعلاج لأمراض القلب والشرايين في مصر. الأمراض القلبية بقت من أكتر الأمراض انتشاراً، وعلشان كده مهم نفهم إزاي نحمي نفسنا.", image: "❤️", date: "٢٥ فبراير ٢٠٢٦", author: "د. سارة أحمد", readTime: "٥ دقائق" },
  { id: "2", title: "روتين العناية بالبشرة في الشتاء المصري", category: "الجلدية", desc: "نصائح خبراء الجلدية للحفاظ على بشرتك في فصل الشتاء. الجو الجاف والبرد ممكن يأثر على بشرتك بشكل كبير.", image: "✨", date: "٢٢ فبراير ٢٠٢٦", author: "د. محمد حسن", readTime: "٤ دقائق" },
  { id: "3", title: "الصداع النصفي: أسباب وعلاجات حديثة", category: "المخ والأعصاب", desc: "اكتشف أحدث العلاجات والتغييرات اللي تقدر تعملها للتخلص من الصداع النصفي نهائياً.", image: "🧠", date: "٢٠ فبراير ٢٠٢٦", author: "د. نور الشريف", readTime: "٦ دقائق" },
  { id: "4", title: "أهمية الكشف الدوري على الأسنان", category: "الأسنان", desc: "ليه الزيارة الدورية لدكتور الأسنان مهمة أكتر مما تتخيل. تعالى نعرفك على فوائد الكشف المنتظم.", image: "🦷", date: "١٨ فبراير ٢٠٢٦", author: "د. فاطمة الزهراء", readTime: "٣ دقائق" },
  { id: "5", title: "نظام غذائي صحي للقلب", category: "التغذية", desc: "دليلك الكامل لأكل صحي يحافظ على قلبك. إيه تاكل وإيه تتجنب عشان تعيش حياة صحية.", image: "🥗", date: "١٥ فبراير ٢٠٢٦", author: "د. سارة أحمد", readTime: "٧ دقائق" },
  { id: "6", title: "حساسية العين في الربيع: الأعراض والعلاج", category: "العيون", desc: "كل ما تحتاج تعرفه عن حساسية العين الموسمية وطرق علاجها والوقاية منها.", image: "👁️", date: "١٢ فبراير ٢٠٢٦", author: "د. كريم عبدالرحمن", readTime: "٤ دقائق" },
  { id: "7", title: "التعامل مع القلق والتوتر في الحياة اليومية", category: "الصحة النفسية", desc: "نصائح عملية للتغلب على القلق والتوتر والعيش بحياة أكثر هدوء وسعادة.", image: "🧘", date: "١٠ فبراير ٢٠٢٦", author: "د. هند السعيد", readTime: "٥ دقائق" },
  { id: "8", title: "العلاج الطبيعي للأم بعد الولادة", category: "الجلدية", desc: "كل ما تحتاج الأم الجديدة تعرفه عن العناية بالجسم والبشرة بعد الولادة.", image: "🤱", date: "٨ فبراير ٢٠٢٦", author: "د. ياسمين نبيل", readTime: "٦ دقائق" },
  { id: "9", title: "أمراض اللثة: الأسباب والوقاية", category: "الأسنان", desc: "تعرف على أسباب أمراض اللثة وإزاي تحمي نفسك منها بخطوات بسيطة.", image: "🪥", date: "٥ فبراير ٢٠٢٦", author: "د. فاطمة الزهراء", readTime: "٤ دقائق" },
];

export default function ArticlesPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("الكل");

  const filtered = allArticles.filter((a) => {
    const matchSearch = a.title.includes(search) || a.desc.includes(search);
    const matchCategory = activeCategory === "الكل" || a.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-8 px-4 md:px-8">
        <div className="container-narrow">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              المقالات الطبية
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              اقرأ أحدث المقالات والنصائح الطبية من أفضل الأطباء المتخصصين في مصر
            </p>
          </motion.div>

          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input placeholder="ابحث عن مقال..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-10 h-12 rounded-xl" />
            </div>
          </motion.div>

          {/* Categories */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat ? "bg-primary text-primary-foreground shadow-md shadow-primary/25" : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </motion.div>

          <p className="text-sm text-muted-foreground mb-6">{filtered.length} مقال</p>

          {/* Articles */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((article, i) => (
                <motion.article
                  key={article.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -6 }}
                  className="glass-card rounded-2xl overflow-hidden group cursor-pointer"
                >
                  <div className="h-44 bg-muted flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-500 relative overflow-hidden">
                    {article.image}
                    <div className="absolute inset-0 bg-gradient-to-t from-card/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="text-xs">{article.category}</Badge>
                      <span className="text-xs text-muted-foreground">{article.date}</span>
                    </div>
                    <h3 className="font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{article.desc}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                    <Button variant="link" className="px-0 mt-3 text-primary gap-1">
                      اقرأ المزيد <ArrowLeft className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
