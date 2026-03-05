import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Calendar, User, Share2, Clock, Zap } from 'lucide-react';

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

export default function ArticleDetail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const response = await fetch('/articles_data.json');
        const data = await response.json();
        const foundArticle = data.articles.find(
          (a: Article) => a.id === parseInt(params.id || '0')
        );
        
        if (foundArticle) {
          setArticle(foundArticle);
          // Get related articles from same category
          const related = data.articles
            .filter(
              (a: Article) =>
                a.category === foundArticle.category && a.id !== foundArticle.id
            )
            .slice(0, 3);
          setRelatedArticles(related);
        }
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar artigo:', error);
        setLoading(false);
      }
    };

    loadArticle();
  }, [params.id]);

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

  const isBreakingNews = article?.title.includes('BREAKING');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white">Carregando artigo...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <div className="container py-12">
          <Button
            onClick={() => setLocation('/')}
            className="bg-slate-700 hover:bg-slate-600 text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-white mb-4">Artigo não encontrado</h1>
            <p className="text-slate-400">O artigo que você está procurando não existe.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-700 bg-slate-900/95 backdrop-blur">
        <div className="container py-4">
          <Button
            onClick={() => setLocation('/')}
            className="bg-slate-700 hover:bg-slate-600 text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Home
          </Button>
        </div>
      </header>

      {/* Article Content */}
      <article className="border-b border-slate-700">
        <div className="container py-12">
          {/* Hero Image */}
          <div className="relative h-96 rounded-lg overflow-hidden border border-slate-700 mb-8">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-96 object-cover rounded-lg mb-2"
              />
              {article.image_source && (
                <p className="text-sm text-slate-500 text-center mb-6">Fonte da Imagem: {article.image_source}</p>
              )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
            {isBreakingNews && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-red-600 text-white animate-pulse flex items-center gap-2">
                  <Zap className="w-3 h-3" />
                  BREAKING NEWS
                </Badge>
              </div>
            )}
          </div>

          {/* Article Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <Badge className={`${getCategoryColor(article.category)} text-white`}>
                {article.category}
              </Badge>
              <span className="text-sm text-slate-400">{article.source}</span>
            </div>

            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-slate-400 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(article.date).toLocaleDateString('pt-BR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Atualizado há poucos minutos
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {article.author}
              </div>
            </div>

            <div className="flex gap-3">
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </Button>
            </div>
          </div>

          {/* Article Body */}
          <div className="max-w-4xl">
            <div className="prose prose-invert max-w-none">
              {/* Excerpt as highlight */}
              <div className="bg-gradient-to-r from-red-900/20 to-slate-900 border-l-4 border-red-600 rounded-lg p-6 my-8">
                <p className="text-lg text-slate-200 leading-relaxed font-semibold">
                  {article.excerpt}
                </p>
              </div>

              {/* Main content */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 my-8">
                <p className="text-slate-300 leading-relaxed text-justify whitespace-pre-wrap text-base">
                  {article.content}
                </p>
              </div>

              {/* Key Information Box */}
              <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-6 my-8">
                <h3 className="text-lg font-bold text-blue-300 mb-3 flex items-center gap-2">
                  <span className="text-xl">ℹ️</span> Informações da Fonte
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Este artigo é baseado em informações de <strong className="text-blue-300">{article.source}</strong>, uma fonte
                  confiável de notícias internacionais. Todos os dados foram coletados em <strong>março de 2026</strong> durante a cobertura especial do conflito entre EUA e Irã.
                </p>
              </div>


            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="border-b border-slate-700 py-12">
          <div className="container">
            <h2 className="text-2xl font-bold text-white mb-8">Artigos Relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map(relatedArticle => (
                <Card
                  key={relatedArticle.id}
                  className="bg-slate-800 border-slate-700 overflow-hidden hover:border-red-600 transition-all cursor-pointer group"
                  onClick={() => setLocation(`/article/${relatedArticle.id}`)}
                >
                  <div className="relative h-40 overflow-hidden bg-slate-700">
                    <img
                      src={relatedArticle.image}
                      alt={relatedArticle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4">
                    <Badge className={`${getCategoryColor(relatedArticle.category)} text-white mb-2`}>
                      {relatedArticle.category}
                    </Badge>
                    <h3 className="font-bold text-white mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
                      {relatedArticle.title}
                    </h3>
                    <p className="text-slate-400 text-sm line-clamp-2 mb-3">
                      {relatedArticle.excerpt}
                    </p>
                    <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white text-sm">
                      Ler Mais
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900 py-8">
        <div className="container">
          <div className="text-center text-slate-500 text-sm">
            <p>© 2026 BorgesNews. Cobertura Especial de Notícias Internacionais.</p>
            <p className="mt-2">Atualizações em tempo real sobre o conflito no Oriente Médio</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
