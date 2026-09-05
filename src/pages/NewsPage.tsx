import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Clock, Tag, ArrowLeft, Share2, ExternalLink,
  Newspaper, Search, ChevronRight, Calendar,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { getNews, getArticle, NewsArticle } from "../utils/adminStorage";

const CATEGORIES = ["All", "Health", "Community", "Events", "Announcements", "Stories"];

const CAT_COLORS: Record<string, string> = {
  Health:        "bg-brand-sky-100 text-brand-sky-700 border-brand-sky-200",
  Community:     "bg-brand-green-100 text-brand-green-700 border-brand-green-200",
  Events:        "bg-brand-yellow-100 text-brand-yellow-700 border-brand-yellow-200",
  Announcements: "bg-brand-orange-100 text-brand-orange-700 border-brand-orange-200",
  Stories:       "bg-purple-100 text-purple-700 border-purple-200",
  All:           "bg-gray-100 text-gray-700 border-gray-200",
};

function timeAgo(iso: string): string {
  const ms   = Date.now() - new Date(iso).getTime();
  const days = Math.floor(ms / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30)  return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  return `${Math.floor(months / 12)} year${Math.floor(months / 12) > 1 ? "s" : ""} ago`;
}

// ── Individual article view ────────────────────────────────────────────────────
function ArticleView() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getArticle(slug)
      .then(setArticle)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-sky-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center text-center px-6">
        <div className="space-y-4">
          <Newspaper className="w-12 h-12 text-brand-sky-200 mx-auto" />
          <h2 className="font-serif text-2xl font-bold text-brand-sky-950">Article not found</h2>
          <Link to="/news" className="text-brand-sky-500 text-sm font-bold hover:underline inline-flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to News
          </Link>
        </div>
      </div>
    );
  }

  const title   = language === "am" && article.title.am   ? article.title.am   : article.title.en;
  const body    = language === "am" && article.body.am    ? article.body.am    : article.body.en;
  const excerpt = language === "am" && article.excerpt.am ? article.excerpt.am : article.excerpt.en;

  return (
    <div className="min-h-screen pt-16 bg-white">
      {/* Article hero */}
      {article.coverImage && (
        <div className="relative w-full h-72 sm:h-96 md:h-[480px] bg-gray-900 overflow-hidden">
          <img src={article.coverImage} alt={title}
            className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-4xl mx-auto">
            <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border mb-3 ${CAT_COLORS[article.category] || CAT_COLORS["All"]}`}>
              {article.category}
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
              {title}
            </h1>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Back link */}
        <Link to="/news"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-sky-500 hover:text-brand-sky-700 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to News
        </Link>

        {/* Title (if no hero) */}
        {!article.coverImage && (
          <div className="mb-6">
            <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border mb-3 ${CAT_COLORS[article.category] || CAT_COLORS["All"]}`}>
              {article.category}
            </span>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-brand-sky-950 leading-tight">{title}</h1>
          </div>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-medium mb-8 pb-6 border-b border-gray-100">
          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-brand-sky-400" />{new Date(article.publishedAt).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}</span>
          {article.author && <span className="flex items-center gap-1.5"><span className="text-gray-300">·</span>{article.author}</span>}
          <button onClick={() => { navigator.clipboard.writeText(window.location.href); }}
            className="ml-auto flex items-center gap-1.5 text-brand-sky-500 hover:text-brand-sky-700 cursor-pointer transition-colors">
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
        </div>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8 font-medium border-l-4 border-brand-sky-400 pl-5">
            {excerpt}
          </p>
        )}

        {/* Body — rendered as paragraphs split on newlines */}
        <div className="prose prose-sm max-w-none space-y-5">
          {body.split("\n").filter(p => p.trim()).map((para, i) => (
            <p key={i} className="text-gray-700 text-sm md:text-base leading-relaxed">{para}</p>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
          <Link to="/news" className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-sky-500 hover:underline cursor-pointer">
            <ArrowLeft className="w-4 h-4" /> More news
          </Link>
          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${CAT_COLORS[article.category] || CAT_COLORS["All"]}`}>
            {article.category}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Article card ───────────────────────────────────────────────────────────────
function ArticleCard({ article, featured = false }: { article: NewsArticle; featured?: boolean }) {
  const { language } = useLanguage();
  const title   = language === "am" && article.title.am   ? article.title.am   : article.title.en;
  const excerpt = language === "am" && article.excerpt.am ? article.excerpt.am : article.excerpt.en;

  if (featured) {
    return (
      <Link to={`/news/${article.slug}`}
        className="group block bg-white rounded-3xl overflow-hidden border-2 border-gray-100 hover:border-brand-sky-300 shadow-sm hover:shadow-xl transition-all duration-300">
        <div className="grid grid-cols-1 md:grid-cols-12">
          {article.coverImage && (
            <div className="md:col-span-7 relative h-64 md:h-auto bg-gray-100 overflow-hidden">
              <img src={article.coverImage} alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 md:from-transparent md:to-white/30" />
            </div>
          )}
          <div className={`${article.coverImage ? "md:col-span-5" : "md:col-span-12"} p-6 md:p-8 flex flex-col justify-between`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${CAT_COLORS[article.category] || CAT_COLORS["All"]}`}>
                  {article.category}
                </span>
                <span className="text-[11px] text-gray-400 font-medium">{timeAgo(article.publishedAt)}</span>
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-sky-950 leading-tight group-hover:text-brand-sky-600 transition-colors line-clamp-3">
                {title}
              </h2>
              {excerpt && (
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{excerpt}</p>
              )}
            </div>
            <div className="mt-6 flex items-center justify-between">
              {article.author && (
                <span className="text-xs text-gray-400 font-medium">{article.author}</span>
              )}
              <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-sky-500 group-hover:gap-2 transition-all ml-auto">
                Read more <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/news/${article.slug}`}
      className="group block bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-brand-sky-300 shadow-sm hover:shadow-lg transition-all duration-300">
      {article.coverImage && (
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          <img src={article.coverImage} alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <span className={`absolute top-3 left-3 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${CAT_COLORS[article.category] || CAT_COLORS["All"]}`}>
            {article.category}
          </span>
        </div>
      )}
      <div className="p-5 space-y-3">
        {!article.coverImage && (
          <span className={`inline-block text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${CAT_COLORS[article.category] || CAT_COLORS["All"]}`}>
            {article.category}
          </span>
        )}
        <h3 className="font-serif font-bold text-base text-brand-sky-950 leading-snug group-hover:text-brand-sky-600 transition-colors line-clamp-2">
          {title}
        </h3>
        {excerpt && (
          <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{excerpt}</p>
        )}
        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" />{timeAgo(article.publishedAt)}
          </span>
          <span className="text-[10px] font-bold text-brand-sky-500 flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
            Read <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── News list page ─────────────────────────────────────────────────────────────
function NewsListPage() {
  const { language } = useLanguage();
  const [articles,  setArticles]  = useState<NewsArticle[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [activecat, setActivecat] = useState("All");

  useEffect(() => {
    getNews(false)
      .then(setArticles)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = articles.filter(a => {
    const title = language === "am" && a.title.am ? a.title.am : a.title.en;
    const matchesSearch = title.toLowerCase().includes(search.toLowerCase());
    const matchesCat    = activecat === "All" || a.category === activecat;
    return matchesSearch && matchesCat;
  });

  const featured = filtered[0];
  const rest     = filtered.slice(1);

  return (
    <div className="min-h-screen pt-16 bg-white">

      {/* ── Masthead ── */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10 md:py-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-sky-500 block mb-2">
                {language === "am" ? "ሰሊሆም ዜና" : "Selihom News"}
              </span>
              <h1 className="font-serif text-4xl md:text-6xl font-black text-brand-sky-950 leading-none tracking-tight">
                {language === "am" ? "ዜናዎችና ዝማኔዎች" : "News & Updates"}
              </h1>
              <p className="text-gray-500 text-sm mt-3 max-w-md leading-relaxed">
                {language === "am"
                  ? "ከሰሊሆም ማህበር የሚወጡ ዜናዎች፣ ታሪኮችና አስፈላጊ ዝማኔዎች።"
                  : "Latest stories, announcements, and updates from Selihom Rehabilitation Centre."}
              </p>
            </div>

            {/* Search */}
            <div className="relative md:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder={language === "am" ? "ዜና ይፈልጉ..." : "Search articles..."}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:border-brand-sky-400 outline-none focus:bg-white transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Category filter bar ── */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto py-3 no-scrollbar">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActivecat(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                  activecat === cat
                    ? "bg-brand-sky-950 text-white border-transparent shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-brand-sky-300 hover:text-brand-sky-600"
                }`}>{cat}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-6 py-10 md:py-14">
        {loading ? (
          <div className="flex items-center justify-center py-24 gap-3 text-brand-sky-400">
            <div className="w-6 h-6 border-2 border-brand-sky-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium">{language === "am" ? "ዜናዎችን በማምጣት ላይ..." : "Loading articles..."}</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 space-y-4">
            <Newspaper className="w-14 h-14 text-brand-sky-200 mx-auto" />
            <h3 className="font-serif text-xl font-bold text-brand-sky-950">
              {language === "am" ? "ምንም ዜና አልተገኘም" : "No articles found"}
            </h3>
            <p className="text-gray-500 text-sm">
              {language === "am" ? "ፍለጋዎን ወይም ምድቡን ይቀይሩ" : "Try adjusting your search or category filter."}
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Featured article */}
            {featured && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px flex-1 bg-gray-100" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    {language === "am" ? "ዋና ዜና" : "Featured Story"}
                  </span>
                  <div className="h-px flex-1 bg-gray-100" />
                </div>
                <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
                  <ArticleCard article={featured} featured />
                </motion.div>
              </div>
            )}

            {/* Grid */}
            {rest.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px flex-1 bg-gray-100" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    {language === "am" ? "ሁሉም ዜናዎች" : "All Stories"}
                  </span>
                  <div className="h-px flex-1 bg-gray-100" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((article, idx) => (
                    <motion.div key={article.id}
                      initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
                      viewport={{ once:true }} transition={{ delay: idx * 0.06 }}>
                      <ArticleCard article={article} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Route selector ─────────────────────────────────────────────────────────────
export default function NewsPage() {
  const { slug } = useParams<{ slug?: string }>();
  return slug ? <ArticleView /> : <NewsListPage />;
}
