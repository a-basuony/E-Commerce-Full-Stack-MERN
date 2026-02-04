import { useEffect, useState, useMemo, useRef } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";

const FeaturedProducts = ({ featuredProducts }) => {
  const [currentIndex, setCurrentIndex] = useState(0); // page index
  const [itemsPerPage, setItemsPerPage] = useState(4);

  const { addToCart } = useCartStore();
  const containerRef = useRef(null);

  // Ensure we always have an array
  const products = Array.isArray(featuredProducts) ? featuredProducts : [];

  // Responsive items per page
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

  // Build pages (chunks) based on itemsPerPage
  const pages = useMemo(() => {
    if (products.length === 0) return [];
    const chunks = [];
    for (let i = 0; i < products.length; i += itemsPerPage) {
      chunks.push(products.slice(i, i + itemsPerPage));
    }
    return chunks;
  }, [products, itemsPerPage]);

  // Clamp current index when pages change
  useEffect(() => {
    if (currentIndex > pages.length - 1) {
      setCurrentIndex(Math.max(0, pages.length - 1));
    }
  }, [pages.length, currentIndex]);

  const prevSlide = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const nextSlide = () =>
    setCurrentIndex((i) => Math.min(pages.length - 1, i + 1));

  const isStartDisabled = currentIndex === 0;
  const isEndDisabled = pages.length === 0 || currentIndex >= pages.length - 1;

  const gridColsClass =
    itemsPerPage === 1
      ? "grid-cols-1"
      : itemsPerPage === 2
        ? "grid-cols-2"
        : itemsPerPage === 3
          ? "grid-cols-3"
          : "grid-cols-4";

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") prevSlide();
    if (e.key === "ArrowRight") nextSlide();
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4">
          Featured
        </h2>

        <div
          className="relative"
          aria-roledescription="carousel"
          aria-label="Featured products"
        >
          <div
            className="overflow-hidden"
            ref={containerRef}
            tabIndex={0}
            onKeyDown={handleKeyDown}
          >
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                width: `${pages.length * 100}%`, // track width = #pages * 100%
                transform: `translateX(-${currentIndex * (100 / pages.length)}%)`,
              }}
            >
              {pages.length > 0 ? (
                pages.map((page, pageIdx) => (
                  <div
                    key={pageIdx}
                    style={{ width: `${100 / pages.length}%` }} // each page fills the viewport
                    className="p-2"
                    aria-hidden={pageIdx !== currentIndex}
                  >
                    <div className={`grid gap-4 ${gridColsClass}`}>
                      {page.map((product) => (
                        <div
                          key={product._id}
                          className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden h-full transition-all duration-300 hover:shadow-xl border border-emerald-500/30 flex flex-col"
                        >
                          <div className="overflow-hidden">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-48 object-cover transition-transform duration-300 ease-in-out hover:scale-110"
                            />
                          </div>
                          <div className="p-4 flex flex-col flex-grow">
                            <h3 className="text-lg font-semibold mb-2 text-white">
                              {product.name}
                            </h3>
                            <p className="text-emerald-300 font-medium mb-4">
                              ${(product.price || 0).toFixed(2)}
                            </p>
                            <button
                              onClick={() => addToCart(product)}
                              className="w-full mt-auto bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded transition-colors duration-300 flex items-center justify-center"
                            >
                              <ShoppingCart className="w-5 h-5 mr-2" />
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div
                  className="w-full flex flex-col items-center justify-center py-12"
                  role="status"
                  aria-live="polite"
                >
                  <ShoppingCart
                    className="w-16 h-16 text-emerald-400 mb-4 animate-pulse"
                    aria-hidden="true"
                  />
                  <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-2">
                    Nothing featured right now
                  </h3>
                  <p className="text-gray-400 max-w-xl text-center mb-6">
                    We don't have any featured items at the moment. Explore our
                    catalog to find the latest arrivals or check back soon —
                    we'll be adding hand-picked products regularly.
                  </p>

                  <div className="flex gap-3">
                    <Link
                      to="/"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md shadow-md transition"
                    >
                      Browse Products
                    </Link>
                    <Link
                      to="/signup"
                      className="border border-emerald-600 text-emerald-300 px-4 py-2 rounded-md hover:bg-emerald-800 transition"
                    >
                      Get Notified
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          {pages.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                disabled={isStartDisabled}
                aria-label="Previous featured products"
                className={`absolute top-1/2 -left-4 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-300 z-10 ${
                  isStartDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-500"
                }`}
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>

              <button
                onClick={nextSlide}
                disabled={isEndDisabled}
                aria-label="Next featured products"
                className={`absolute top-1/2 -right-4 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-300 z-10 ${
                  isEndDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-500"
                }`}
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>

              {/* Indicators */}
              <div className="flex justify-center mt-4">
                {pages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`w-2 h-2 rounded-full mx-1 ${idx === currentIndex ? "bg-emerald-400" : "bg-gray-500"}`}
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
