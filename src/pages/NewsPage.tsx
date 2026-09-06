import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useParams, Link } from "react-router-dom";
import {
  Clock, ArrowLeft, Share2, ExternalLink,
  Newspaper, Search, ChevronRight, Calendar,
  Check, Image as ImageIcon,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { getNews, getArticle, NewsArticle, resolveImagePath } from "../utils/adminStorage";

const CATEGORIES = ["All", "Health", "Community", "Events", "Announcements", "Stories"];

function timeAgo(iso: string, lang: string): string {
  const ms   = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60000);
  const hours = Math.floor(ms / 3600000);
  const days = Math.floor(ms / 86400000);

  if (lang === "am") {
    if (mins < 60) return `${Math.max(1, mins)} ደቂቃ በፊት`;
    if (hours < 24) return `${hours} ሰዓት በፊት`;
    if (days === 1) return "ትላንት";
    if (days < 30)  return `${days} ቀናት በፊት`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} ወራት በፊት`;
    return `${Math.floor(months / 12)} ዓመታት በፊት`;
  }

  if (mins < 60) return `${Math.max(1, mins)}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30)  return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

// ── Individual article view (BBC / NYT Editorial Layout) ──────────────────────
function ArticleView() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [recentNews, setRecentNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getArticle(slug)
      .then((a) => {
        setArticle(a);
        return getNews(false);
      })
      .then((all) => {
        setRecentNews(all.filter((item) => item.slug !== slug).slice(0, 3));
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const copyShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-brand-sky-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-serif text-gray-500 uppercase tracking-widest">
          {language === "am" ? "ዘገባውን በማዘጋጀት ላይ..." : "Loading story..."}
        </span>
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center text-center px-6">
        <div className="space-y-4 max-w-md">
          <Newspaper className="w-12 h-12 text-gray-300 mx-auto" />
          <h2 className="font-serif text-2xl font-bold text-gray-950">
            {language === "am" ? "ይህ ዜና አልተገኘም" : "Article Not Found"}
          </h2>
          <p className="text-xs text-gray-500 font-serif leading-relaxed">
            {language === "am"
              ? "የጠየቁት ዜና ተሰርዞ ሊሆን ይችላል ወይም አድራሻው ተቀይሯል።"
              : "The report you requested may have been relocated, updated, or archived."}
          </p>
          <Link
            to="/news"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-sky-600 hover:text-brand-sky-800 transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === "am" ? "ወደ ዜና መጽሔቱ ይመለሱ" : "Return to News Frontpage"}
          </Link>
        </div>
      </div>
    );
  }

  const title   = language === "am" && article.title?.am   ? article.title.am   : (article.title?.en || "");
  const body    = language === "am" && article.body?.am    ? article.body.am    : (article.body?.en || "");
  const excerpt = (language === "am" ? article.excerpt?.am : article.excerpt?.en) || "";
  const images  = (article.imagePaths && article.imagePaths.length > 0)
    ? article.imagePaths
    : (article.coverImage ? [article.coverImage] : []);
  const leadImage = article.coverImage || images[0] || "";

  return (
    <article className="min-h-screen pt-20 pb-16 bg-white text-gray-900">
      {/* Editorial Header Strip */}
      <div className="border-b border-gray-200 bg-gray-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs text-gray-600">
          <Link
            to="/news"
            className="inline-flex items-center gap-1.5 font-bold text-gray-700 hover:text-brand-sky-600 transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>{language === "am" ? "ዜናዎች" : "News"}</span>
            <span className="text-gray-300">/</span>
            <span className="text-brand-sky-700 uppercase tracking-wider font-mono text-[11px]">
              {article.category}
            </span>
          </Link>
          <span className="font-mono text-[11px] text-gray-400">
            {timeAgo(article.publishedAt, language)}
          </span>
        </div>
      </div>

      {/* Article Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-12">
        {/* Section Kicker */}
        <div className="mb-3">
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-sky-700 border-b-2 border-brand-sky-500 pb-0.5 inline-block">
            {article.category}
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-serif font-black text-3xl sm:text-4xl md:text-5xl text-gray-950 leading-[1.15] tracking-tight">
          {title}
        </h1>

        {/* Standfirst / Excerpt */}
        {excerpt && (
          <p className="font-serif text-lg sm:text-xl text-gray-600 leading-relaxed font-normal mt-4 mb-6 border-l-2 border-brand-sky-400 pl-4 italic">
            {excerpt}
          </p>
        )}

        {/* Byline & Metadata Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-3.5 my-6 border-y border-gray-200 text-xs text-gray-600 font-sans">
          <div className="flex items-center gap-3">
            <div>
              <p className="font-bold text-gray-900">
                {article.author ? (language === "am" ? `በ ${article.author}` : `By ${article.author}`) : "Selihom News Desk"}
              </p>
              <p className="text-gray-400 text-[11px] flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3 h-3 text-gray-400" />
                {new Date(article.publishedAt).toLocaleDateString(language === "am" ? "am-ET" : "en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 hover:border-brand-sky-300 hover:bg-brand-sky-50/50 text-gray-700 hover:text-brand-sky-700 text-xs font-bold transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? (language === "am" ? "ተቀድቷል" : "Copied!") : (language === "am" ? "አጋራ" : "Share")}</span>
            </button>
          </div>
        </div>

        {/* Lead Image Figure */}
        {leadImage && (
          <figure className="my-8">
            <div className="overflow-hidden border border-gray-200 bg-gray-50">
              <img
                src={resolveImagePath(leadImage)}
                alt={title}
                className="w-full max-h-[520px] object-cover"
              />
            </div>
            <figcaption className="text-[11px] text-gray-500 mt-2 font-sans italic flex items-center justify-between px-1">
              <span>{title}</span>
              <span className="uppercase text-[10px] text-gray-400 font-bold not-italic">Photo: Selihom Media</span>
            </figcaption>
          </figure>
        )}

        {/* Article Body */}
        <div className="font-serif text-gray-800 text-base sm:text-lg leading-[1.8] space-y-6 pt-2">
          {body.split(/\n+/).filter((p) => p.trim()).map((paragraph, idx) => (
            <p key={idx} className={idx === 0 ? "first-letter:text-4xl first-letter:font-black first-letter:mr-2 first-letter:float-left first-letter:leading-none text-gray-900" : ""}>
              {paragraph}
            </p>
          ))}
        </div>

        {/* Attached Photo Gallery */}
        {images.length > 1 && (
          <section className="mt-12 pt-8 border-t-2 border-gray-900/10">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="w-4 h-4 text-brand-sky-600" />
              <h3 className="font-serif font-bold text-lg text-gray-950 uppercase tracking-wide">
                {language === "am" ? "ተጨማሪ ምስሎች" : "Photo Gallery"}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {images.map((imgPath, i) => (
                <a
                  key={i}
                  href={resolveImagePath(imgPath)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block overflow-hidden border border-gray-200 bg-gray-100 aspect-4/3 relative"
                >
                  <img
                    src={resolveImagePath(imgPath)}
                    alt={`Gallery ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between text-[10px] text-white">
                    <span>Photo {i + 1}</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Article Footer & Related Stories */}
        <div className="mt-14 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif font-black text-xl text-gray-950 uppercase tracking-tight">
              {language === "am" ? "ተዛማጅ ዜናዎች" : "More from Selihom News"}
            </h3>
            <Link
              to="/news"
              className="text-xs font-bold text-brand-sky-600 hover:text-brand-sky-800 transition-colors uppercase tracking-wider flex items-center gap-1"
            >
              {language === "am" ? "ሁሉንም ይመልከቱ" : "View All"}
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {recentNews.map((rn) => {
              const rnTitle = language === "am" && rn.title?.am ? rn.title.am : (rn.title?.en || "");
              const rnCover = rn.coverImage || (rn.imagePaths && rn.imagePaths[0]) || "";
              return (
                <Link
                  key={rn.id}
                  to={`/news/${rn.slug}`}
                  className="group block space-y-2.5"
                >
                  {rnCover && (
                    <div className="overflow-hidden border border-gray-200 aspect-16/10 bg-gray-100">
                      <img
                        src={rnCover}
                        alt={rnTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <span className="text-[10px] font-bold text-brand-sky-700 uppercase tracking-wider block">
                    {rn.category}
                  </span>
                  <h4 className="font-serif font-bold text-sm text-gray-900 group-hover:text-brand-sky-700 line-clamp-2 leading-snug transition-colors">
                    {rnTitle}
                  </h4>
                  <span className="text-[10px] text-gray-400 block font-mono">
                    {timeAgo(rn.publishedAt, language)}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </article>
  );
}

// ── Frontpage / News List View (BBC News / The New York Times style) ─────────
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

  const todayFormatted = new Date().toLocaleDateString(language === "am" ? "am-ET" : "en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const filtered = articles.filter((a) => {
    const titleEn = a.title?.en || "";
    const titleAm = a.title?.am || "";
    const title = language === "am" && titleAm ? titleAm : titleEn;
    const term = search.toLowerCase();
    const matchesSearch = !search || title.toLowerCase().includes(term) || (a.body?.en || "").toLowerCase().includes(term);
    const matchesCat    = activecat === "All" || a.category === activecat;
    return matchesSearch && matchesCat;
  });

  const leadArticle = filtered[0];
  const sideArticles = filtered.slice(1, 4);
  const remainingArticles = filtered.slice(4);

  return (
    <div className="min-h-screen pt-20 bg-white text-gray-900">
      {/* ── BBC / NYT Editorial Masthead ── */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-2">
          {/* Top Info Bar */}
          <div className="flex items-center justify-between text-[11px] font-sans text-gray-500 pb-2 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-800">{todayFormatted}</span>
              <span className="hidden sm:inline text-gray-300">|</span>
              <span className="hidden sm:inline text-gray-600">Addis Ababa, Ethiopia</span>
            </div>

            {/* Compact Search */}
            <div className="relative w-48 sm:w-64">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={language === "am" ? "ዜና ይፈልጉ..." : "Search news..."}
                className="w-full pl-8 pr-3 py-1 bg-gray-50 hover:bg-gray-100 focus:bg-white border border-gray-200 focus:border-brand-sky-400 rounded-md text-xs text-gray-900 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Publication Nameplate */}
          <div className="text-center py-3 sm:py-4 border-b-2 border-t-2 border-gray-900 my-2">
            <h1 className="font-serif font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-gray-950 uppercase leading-none">
              {language === "am" ? "የሰሊሆም ዜና መጽሔት" : "The Selihom Gazette"}
            </h1>
            <p className="font-serif italic text-xs sm:text-sm text-gray-600 mt-1.5">
              {language === "am"
                ? "ከሰሊሆም ማገገሚያ ማዕከል የሚወጡ ወቅታዊ ዜናዎች፣ ዝማኔዎችና ታሪኮች"
                : "The Journal of Record for Selihom Charity Association & Humanitarian Initiatives"}
            </p>
          </div>

          {/* Section Navigation Tabs (BBC Style) */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1.5 no-scrollbar text-xs font-bold uppercase tracking-wider">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActivecat(cat)}
                className={`px-3 py-1.5 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activecat === cat
                    ? "border-brand-sky-600 text-brand-sky-900 font-black"
                    : "border-transparent text-gray-600 hover:text-gray-950 hover:border-gray-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ── Main Front Page Content ── */}
      <main className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {loading ? (
          <div className="flex items-center justify-center py-24 gap-3 text-brand-sky-600">
            <div className="w-6 h-6 border-2 border-brand-sky-600 border-t-transparent rounded-full animate-spin" />
            <span className="font-serif text-sm font-semibold tracking-wide">
              {language === "am" ? "የዜና እትሙን በማዘጋጀት ላይ..." : "Loading edition..."}
            </span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 space-y-3 border border-dashed border-gray-200 rounded-xl max-w-lg mx-auto">
            <Newspaper className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="font-serif text-xl font-bold text-gray-900">
              {language === "am" ? "ምንም ዜና አልተገኘም" : "No Reports Found"}
            </h3>
            <p className="text-xs text-gray-500 font-sans">
              {language === "am" ? "ፍለጋዎን ወይም የተመረጠውን ምድብ ይቀይሩ።" : "Try searching with different keywords or switch the section tab."}
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-xs font-bold text-brand-sky-600 hover:underline pt-1"
              >
                {language === "am" ? "ሁሉንም ዜናዎች አሳይ" : "Clear search"}
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-10">
            {/* ── Top Stories Grid (BBC Lead + Right Rail) ── */}
            {leadArticle && (
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10 border-b-2 border-gray-900/20">
                {/* Lead Story (7 cols) */}
                <div className="lg:col-span-7 xl:col-span-8">
                  <article className="group">
                    <Link to={`/news/${leadArticle.slug}`} className="block space-y-3">
                      {(leadArticle.coverImage || (leadArticle.imagePaths && leadArticle.imagePaths[0])) && (
                        <div className="overflow-hidden border border-gray-200 bg-gray-100 aspect-16/9">
                          <img
                            src={resolveImagePath(leadArticle.coverImage || (leadArticle.imagePaths && leadArticle.imagePaths[0]))}
                            alt={language === "am" && leadArticle.title?.am ? leadArticle.title.am : leadArticle.title.en}
                            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-red-600">
                            {leadArticle.category}
                          </span>
                          <span className="text-gray-300">·</span>
                          <span className="text-[11px] font-mono text-gray-500">
                            {timeAgo(leadArticle.publishedAt, language)}
                          </span>
                        </div>
                        <h2 className="font-serif font-black text-2xl sm:text-3xl md:text-4xl text-gray-950 group-hover:text-brand-sky-700 leading-tight transition-colors">
                          {language === "am" && leadArticle.title?.am ? leadArticle.title.am : leadArticle.title.en}
                        </h2>
                        <p className="font-serif text-sm sm:text-base text-gray-600 leading-relaxed line-clamp-3">
                          {(language === "am" ? leadArticle.excerpt?.am : leadArticle.excerpt?.en) ||
                            (language === "am" ? leadArticle.body?.am : leadArticle.body?.en)?.replace(/[\n\r]+/g, " ").trim().slice(0, 240) + "..."}
                        </p>
                        <div className="pt-2 text-xs font-sans text-gray-400 font-medium">
                          {leadArticle.author && <span>By {leadArticle.author} · </span>}
                          <span className="text-brand-sky-600 font-bold group-hover:underline inline-flex items-center gap-0.5">
                            Full Story <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </article>
                </div>

                {/* Side Rail (Top Stories / Latest Headlines) (5 cols) */}
                <div className="lg:col-span-5 xl:col-span-4 lg:border-l lg:border-gray-200 lg:pl-8 flex flex-col">
                  <div className="flex items-center gap-2 pb-3 mb-4 border-b-2 border-gray-900">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                    <h3 className="font-serif font-black text-sm uppercase tracking-widest text-gray-950">
                      {language === "am" ? "ዋና ዋና ዜናዎች" : "Top Stories"}
                    </h3>
                  </div>

                  <div className="space-y-5 flex-1">
                    {sideArticles.map((sa, idx) => {
                      const saTitle = language === "am" && sa.title?.am ? sa.title.am : (sa.title?.en || "");
                      const saCover = sa.coverImage || (sa.imagePaths && sa.imagePaths[0]) || "";
                      const saSnippet = (language === "am" ? sa.excerpt?.am : sa.excerpt?.en) ||
                        (language === "am" ? sa.body?.am : sa.body?.en)?.replace(/[\n\r]+/g, " ").trim().slice(0, 110) + "...";
                      return (
                        <article key={sa.id} className="pb-4 border-b border-gray-100 last:border-b-0 group">
                          <Link to={`/news/${sa.slug}`} className="flex gap-3 items-start">
                            <div className="flex-1 min-w-0 space-y-1">
                              <span className="text-[10px] font-bold text-brand-sky-700 uppercase tracking-wider block">
                                {sa.category}
                              </span>
                              <h4 className="font-serif font-bold text-base text-gray-900 group-hover:text-brand-sky-700 leading-snug line-clamp-2 transition-colors">
                                {saTitle}
                              </h4>
                              <p className="text-xs text-gray-500 font-serif line-clamp-2 leading-relaxed">
                                {saSnippet}
                              </p>
                              <span className="text-[10px] font-mono text-gray-400 block pt-0.5">
                                {timeAgo(sa.publishedAt, language)}
                              </span>
                            </div>
                            {saCover && (
                              <div className="w-24 h-20 shrink-0 overflow-hidden border border-gray-200 bg-gray-100">
                                <img
                                  src={resolveImagePath(saCover)}
                                  alt={saTitle}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            )}
                          </Link>
                        </article>
                      );
                    })}

                    {sideArticles.length === 0 && (
                      <p className="text-xs text-gray-400 italic py-4">
                        {language === "am" ? "ተጨማሪ ዜናዎች በቅርቡ ይቀርባሉ" : "More dispatches will be published shortly."}
                      </p>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* ── Section 2: Broadsheet News Grid ── */}
            {remainingArticles.length > 0 && (
              <section>
                <div className="flex items-center justify-between pb-2 mb-6 border-b-2 border-gray-900">
                  <h3 className="font-serif font-black text-lg uppercase tracking-tight text-gray-950">
                    {language === "am" ? "የቅርብ ጊዜ ዘገባዎች" : "Latest Reports & Dispatches"}
                  </h3>
                  <span className="text-xs text-gray-400 font-mono">
                    {remainingArticles.length} {remainingArticles.length === 1 ? "article" : "articles"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                  {remainingArticles.map((article) => {
                    const artTitle = language === "am" && article.title?.am ? article.title.am : (article.title?.en || "");
                    const artCover = article.coverImage || (article.imagePaths && article.imagePaths[0]) || "";
                    const artSnippet = (language === "am" ? article.excerpt?.am : article.excerpt?.en) ||
                      (language === "am" ? article.body?.am : article.body?.en)?.replace(/[\n\r]+/g, " ").trim().slice(0, 130) + "...";

                    return (
                      <article key={article.id} className="group flex flex-col justify-between border-b border-gray-100 pb-6">
                        <Link to={`/news/${article.slug}`} className="block space-y-3">
                          {artCover && (
                            <div className="overflow-hidden border border-gray-200 aspect-16/10 bg-gray-100">
                              <img
                                src={resolveImagePath(artCover)}
                                alt={artTitle}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-bold text-brand-sky-700 uppercase tracking-widest block">
                              {article.category}
                            </span>
                            <h4 className="font-serif font-bold text-lg text-gray-900 group-hover:text-brand-sky-700 leading-snug line-clamp-2 transition-colors">
                              {artTitle}
                            </h4>
                            <p className="text-xs text-gray-600 font-serif leading-relaxed line-clamp-3">
                              {artSnippet}
                            </p>
                          </div>
                        </Link>
                        <div className="pt-3 flex items-center justify-between text-[10px] text-gray-400 font-mono border-t border-gray-50 mt-3">
                          <span>{timeAgo(article.publishedAt, language)}</span>
                          {article.author && <span>{article.author}</span>}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// ── Route Selector ────────────────────────────────────────────────────────────
export default function NewsPage() {
  const { slug } = useParams<{ slug?: string }>();
  return slug ? <ArticleView /> : <NewsListPage />;
}

