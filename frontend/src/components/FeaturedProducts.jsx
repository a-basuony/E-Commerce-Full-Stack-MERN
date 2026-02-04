import { useEffect, useState, useMemo, useRef } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import { Link } from "react-router-dom";

const FeaturedProducts = ({ featuredProducts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  const { addToCart } = useCartStore();
  const products = Array.isArray(featuredProducts) ? featuredProducts : [];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerPage(1);
      else if (window.innerWidth < 1024) setItemsPerPage(2);
      else if (window.innerWidth < 1280) setItemsPerPage(3);
      else setItemsPerPage(4);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const pages = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < products.length; i += itemsPerPage) {
      chunks.push(products.slice(i, i + itemsPerPage));
    }
    return chunks;
  }, [products, itemsPerPage]);

  useEffect(() => {
    if (currentIndex >= pages.length && pages.length > 0) {
      setCurrentIndex(pages.length - 1);
    }
  }, [pages.length, currentIndex]);

  const prevSlide = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const nextSlide = () =>
    setCurrentIndex((i) => Math.min(pages.length - 1, i + 1));

  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <ShoppingCart className="w-16 h-16 text-emerald-500/50 mx-auto mb-4 animate-pulse" />
        <h3 className="text-2xl font-bold text-white">
          No featured products yet
        </h3>
        <Link
          to="/"
          className="text-emerald-400 hover:underline mt-2 inline-block"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-4xl sm:text-5xl font-extrabold text-emerald-400 mb-10 tracking-tight">
          Featured Items
        </h2>

        <div className="relative group">
          <div className="overflow-hidden rounded-xl">
            <div
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.45,0,0.55,1)]"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {pages.map((page, pageIdx) => (
                <div key={pageIdx} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-1">
                    {page.map((product) => (
                      <div
                        key={product._id}
                        className="group/card bg-neutral-900/50 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-300 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                      >
                        <div className="relative aspect-square overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                        </div>

                        <div className="p-5 flex flex-col flex-grow">
                          <h3 className="text-lg font-bold text-white mb-1 truncate">
                            {product.name}
                          </h3>
                          <p className="text-emerald-400 text-xl font-black mb-4">
                            ${(product.price || 0).toFixed(2)}
                          </p>
                          <button
                            onClick={() => addToCart(product)}
                            className="w-full mt-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                          >
                            <ShoppingCart className="w-5 h-5" />
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls - Positioned outside the track for better UX */}
          {pages.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className={`absolute top-1/2 -left-4 sm:-left-6 -translate-y-1/2 p-3 rounded-full shadow-xl transition-all z-20 ${
                  currentIndex === 0
                    ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                    : "bg-emerald-600 text-white hover:bg-emerald-500 hover:scale-110"
                }`}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={nextSlide}
                disabled={currentIndex === pages.length - 1}
                className={`absolute top-1/2 -right-4 sm:-right-6 -translate-y-1/2 p-3 rounded-full shadow-xl transition-all z-20 ${
                  currentIndex === pages.length - 1
                    ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                    : "bg-emerald-600 text-white hover:bg-emerald-500 hover:scale-110"
                }`}
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <div className="flex justify-center mt-8 gap-2">
                {pages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`transition-all duration-300 rounded-full ${
                      idx === currentIndex
                        ? "w-8 h-2 bg-emerald-500"
                        : "w-2 h-2 bg-neutral-600 hover:bg-neutral-400"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
