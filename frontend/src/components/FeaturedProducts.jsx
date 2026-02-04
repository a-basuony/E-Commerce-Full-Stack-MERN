import { useEffect, useState } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";

const FeaturedProducts = ({ featuredProducts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  const { addToCart } = useCartStore();

  // نضمن دائماً أننا نتعامل مع مصفوفة لتجنب أخطاء الـ .map والـ .length
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

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => prevIndex + itemsPerPage);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => prevIndex - itemsPerPage);
  };

  const isStartDisabled = currentIndex === 0;
  // استخدام المتغير الآمن products بدلاً من featuredProducts مباشرة
  const isEndDisabled =
    products.length === 0 || currentIndex >= products.length - itemsPerPage;

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4">
          Featured
        </h2>
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
                // الحفاظ على عرض مرن بناءً على عدد العناصر
                width: `${(products.length / itemsPerPage) * 100}%`,
              }}
            >
              {products.length > 0 ? (
                products.map((product) => (
                  <div
                    key={product._id}
                    style={{ width: `${100 / products.length}%` }}
                    className="flex-shrink-0 px-2"
                  >
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden h-full transition-all duration-300 hover:shadow-xl border border-emerald-500/30 flex flex-col">
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
                          className="w-full mt-auto bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded transition-colors duration-300 
                                                    flex items-center justify-center"
                        >
                          <ShoppingCart className="w-5 h-5 mr-2" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-full text-center text-gray-400 py-10">
                  No featured products available at the moment.
                </div>
              )}
            </div>
          </div>

          {/* أزرار التحكم تظهر فقط إذا كان هناك منتجات */}
          {products.length > itemsPerPage && (
            <>
              <button
                onClick={prevSlide}
                disabled={isStartDisabled}
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
                className={`absolute top-1/2 -right-4 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-300 z-10 ${
                  isEndDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-500"
                }`}
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
