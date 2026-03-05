import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ExternalLink, TrendingUp, AlertCircle, ChevronRight, Info, Filter, Zap } from 'lucide-react';
import { useLocation } from 'wouter';

interface Article {
  id: number;
  title: string;
  category: string;
  source: string;
  date: string;
  excerpt: string;
  content: string;
  author: string;
  image: string;
}

interface TimelineEvent {
  date: string;
  event: string;
  description: string;
  details?: string;
}

export default function Home() {
  const [, setLocation] = useLocation();
  const [articles, setArticles] = useState<Article[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  
  const articlesSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/articles_data.json');
        const data = await response.json();
        setArticles(data.articles);
        setFilteredArticles(data.articles);
        setTimeline(data.timeline);
        if (data.timeline && data.timeline.length > 0) {
          setSelectedEvent(data.timeline[data.timeline.length - 1]);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    let filtered = articles;
    
    if (selectedDate) {
      filtered = filtered.filter(a => a.date === selectedDate);
    }
    
    if (selectedCategory !== 'Todos') {
      filtered = filtered.filter(a => a.category === selectedCategory);
    }
    
    setFilteredArticles(filtered);
  }, [selectedCategory, selectedDate, articles]);

  const categories = ['Todos', ...Array.from(new Set(articles.map(a => a.category)))];
  const featuredArticle = articles[articles.length - 1]; // Latest is featured
  
  // Get breaking news articles (last 3 articles with "BREAKING" in title)
  const breakingNewsArticles = articles
    .filter(a => a.title.includes('BREAKING'))
    .slice(-3)
    .reverse();

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      'Análise Geopolítica': 'bg-blue-600',
      'Segurança Nuclear': 'bg-red-600',
      'Análise Estratégica': 'bg-purple-600',
      'Liderança Iraniana': 'bg-orange-600',
      'Economia': 'bg-green-600',
      'Relações Internacionais': 'bg-indigo-600',
      'Oriente Médio': 'bg-amber-600',
      'Militar': 'bg-slate-600',
      'Humanitário': 'bg-pink-600',
    };
    return colors[category] || 'bg-gray-600';
  };

  const handleViewRelatedNews = (date: string) => {
    setSelectedDate(date);
    setSelectedCategory('Todos');
    articlesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-700 bg-slate-900/95 backdrop-blur">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <h1 className="text-2xl font-bold text-white">BorgesNews</h1>
            </div>
            <div className="text-sm text-slate-400">Cobertura Especial • Março 2026</div>
          </div>
        </div>
      </header>

      {/* Breaking News Section */}
      {breakingNewsArticles.length > 0 && (
        <section className="border-b border-red-700/50 bg-gradient-to-r from-red-950/30 via-slate-900 to-slate-900 py-8">
          <div className="container">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-6 h-6 text-red-500 animate-pulse" />
              <h2 className="text-2xl font-bold text-white">ÚLTIMAS NOTÍCIAS</h2>
              <div className="ml-auto">
                <Badge className="bg-red-600 text-white animate-pulse">AO VIVO</Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {breakingNewsArticles.map((article) => (
                <Card 
                  key={article.id}
                  className="bg-slate-800/80 border-red-600/50 hover:border-red-500 transition-all duration-300 cursor-pointer overflow-hidden group"
                  onClick={() => setLocation(`/article/${article.id}`)}
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                    <Badge className="absolute top-3 right-3 bg-red-600 text-white">BREAKING</Badge>
                  </div>
                  
                  <div className="p-4">
                    <Badge className={`${getCategoryColor(article.category)} text-white text-xs mb-2`}>
                      {article.category}
                    </Badge>
                    <h3 className="font-bold text-white mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-slate-400 line-clamp-2 mb-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{new Date(article.date).toLocaleDateString('pt-BR')}</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Hero Section */}
      {featuredArticle && (
        <section className="border-b border-slate-700">
          <div className="container py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <Badge className={`${getCategoryColor(featuredArticle.category)} text-white`}>
                    {featuredArticle.category}
                  </Badge>
                  <span className="text-sm text-slate-400">DESTAQUE RECENTE</span>
                </div>
                <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                  {featuredArticle.title}
                </h2>
                <p className="text-lg text-slate-300 mb-6">
                  {featuredArticle.excerpt}
                </p>
                <div className="flex items-center gap-6 text-sm text-slate-400 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(featuredArticle.date).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {featuredArticle.author}
                  </div>
                </div>
                <Button 
                  onClick={() => setLocation(`/article/${featuredArticle.id}`)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Ler Artigo Completo
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
              <div className="relative h-96 rounded-lg overflow-hidden border border-slate-700">
                <img
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Interactive Timeline Section */}
      <section className="border-b border-slate-700 py-12 bg-slate-900/30">
        <div className="container">
          <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-red-500" />
            Timeline Interativa do Conflito
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Timeline Sidebar */}
            <div className="lg:col-span-1 space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {timeline.map((event, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedEvent(event)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 flex items-center justify-between group ${
                    selectedEvent?.date === event.date 
                    ? 'bg-red-600/20 border-red-500 text-white shadow-lg shadow-red-500/10' 
                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <div className={`text-xs font-bold mb-1 ${selectedEvent?.date === event.date ? 'text-red-400' : 'text-slate-500'}`}>
                      {new Date(event.date).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="font-bold text-sm line-clamp-1">{event.event}</div>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${selectedEvent?.date === event.date ? 'translate-x-1 text-red-400' : 'group-hover:translate-x-1'}`} />
                </div>
              ))}
            </div>

            {/* Event Details Display */}
            <div className="lg:col-span-2">
              {selectedEvent ? (
                <Card className="bg-slate-800 border-slate-700 p-8 h-full animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-red-600/20 rounded-lg">
                      <Calendar className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <div className="text-sm text-red-400 font-bold">
                        {new Date(selectedEvent.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                      <h4 className="text-2xl font-bold text-white">{selectedEvent.event}</h4>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h5 className="text-slate-300 font-bold mb-2 flex items-center gap-2">
                        <Info className="w-4 h-4 text-red-400" />
                        Resumo do Dia
                      </h5>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        {selectedEvent.description}
                      </p>
                    </div>
                    
                    {selectedEvent.details && (
                      <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/50">
                        <h5 className="text-slate-400 text-sm font-bold mb-3 uppercase tracking-wider">Detalhes da Operação</h5>
                        <p className="text-slate-400 leading-relaxed italic">
                          "{selectedEvent.details}"
                        </p>
                      </div>
                    )}

                    <div className="pt-4">
                      <Button 
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => handleViewRelatedNews(selectedEvent.date)}
                      >
                        Ver Notícias Relacionadas deste Dia
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-700 rounded-lg text-slate-500">
                  Selecione um dia na timeline para ver os detalhes
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <div ref={articlesSectionRef}>
        {/* Category & Date Filter */}
        <section className="border-b border-slate-700 py-8 bg-slate-800/30">
          <div className="container">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-red-500" />
                  Filtros de Notícias
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <Button
                      key={cat}
                      size="sm"
                      onClick={() => setSelectedCategory(cat)}
                      className={`${
                        selectedCategory === cat
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>
              {selectedDate && (
                <Button
                  size="sm"
                  onClick={() => setSelectedDate(null)}
                  className="bg-slate-700 text-slate-300 hover:bg-slate-600"
                >
                  Limpar Filtro de Data
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-12">
          <div className="container">
            <h3 className="text-2xl font-bold text-white mb-8">
              {selectedDate 
                ? `Notícias de ${new Date(selectedDate).toLocaleDateString('pt-BR')}` 
                : selectedCategory !== 'Todos'
                ? `Notícias: ${selectedCategory}`
                : 'Todas as Notícias'}
            </h3>
            
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => (
                  <Card
                    key={article.id}
                    className="bg-slate-800 border-slate-700 hover:border-red-600 transition-all duration-300 overflow-hidden cursor-pointer group"
                    onClick={() => setLocation(`/article/${article.id}`)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                    </div>
                    
                    <div className="p-6">
                      <Badge className={`${getCategoryColor(article.category)} text-white text-xs mb-3`}>
                        {article.category}
                      </Badge>
                      
                      <h3 className="font-bold text-white mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
                        {article.title}
                      </h3>
                      
                      <p className="text-sm text-slate-400 line-clamp-3 mb-4">
                        {article.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-700">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(article.date).toLocaleDateString('pt-BR')}
                        </div>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">Nenhuma notícia encontrada para os filtros selecionados.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 py-8">
        <div className="container">
          <div className="text-center text-slate-400 text-sm">
            <p>EUA-Irã News Hub • Cobertura Especial • Março 2026</p>
            <p className="mt-2">Atualizações em tempo real sobre o conflito entre Estados Unidos e Irã</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
