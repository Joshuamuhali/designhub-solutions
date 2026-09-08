import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { offeringService, OfferingItem } from '@/services/offeringService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, ArrowRight, Package, Sparkles, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function ProductsCatalog() {
  const [products, setProducts] = useState<OfferingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const data = await offeringService.getPublishedProducts();
      setProducts(data);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <Badge variant="outline" className="text-xs uppercase tracking-wider text-primary border-primary/20 bg-primary/5 px-3 py-1 font-semibold">
              Designhub Products & Merchandise
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Ready-to-Order Business Products
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              Explore our curated suite of branded merchandise, startup bundles, and physical branding kits designed for corporate impact.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <Card key={product.id} className="border-border hover:border-primary/40 transition-all duration-300 bg-card flex flex-col justify-between group overflow-hidden">
                  <CardContent className="p-6 space-y-5">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/20 text-xs">
                        {product.category}
                      </Badge>
                      {product.turnaround_time && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          {product.turnaround_time}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                        {product.short_description}
                      </p>
                    </div>

                    {product.benefits && product.benefits.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-border/60">
                        {product.benefits.slice(0, 2).map((b, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span className="truncate">{b.title}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>

                  <div className="p-6 pt-0 border-t border-border/40 mt-auto flex items-center justify-between">
                    <div>
                      {product.price && (
                        <div className="text-lg font-bold text-foreground">
                          K{product.price.toLocaleString()}
                        </div>
                      )}
                    </div>
                    <Button asChild size="sm" className="gap-1.5 font-semibold text-xs rounded-lg">
                      <Link to={`/products/${product.slug}`}>
                        View Product <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
