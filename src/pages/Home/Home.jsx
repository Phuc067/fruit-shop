import { useEffect, useState } from "react";
import productApi from "../../apis/product.api";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const result = await productApi.getProducts();
        setProducts(result.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    getProducts();
  }, []);

  const handleAddToCart = (id)=>{
      console.log(id);
  }

  return (
    <div>
      <div className="container">
        <h2>Danh sách sản phẩm</h2>
        <div className="flex grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4  gap-2 ">
          {products.map((item) => (
            <div
              className="flex flex-col border-primary rounded-lg border-[1px] overflow-hidden cursor-pointer"
              key={item.id}
            >
              <div className="w-full">
                <img
                  className="w-full aspect-square object-cover"
                  src={item.image}
                  alt=""
                />
                {item.discountPercentage ? (
                  <span className="absolute top-[-5px] right-[-5px] bg-secondary p-4">
                    {item.discountPercentage} %
                  </span>
                ) : (
                  <></>
                )}

                <div className="flex flex-col px-5 mb-2 ">
                  <h3 className="text-primary">{item.title}</h3>
                  
                  <div className="flex flex-wrap justify-end">
                    {item.discountPercentage ? (
                      <span className="text-decoration-line-through">{item.price} </span>
                    ) : (
                      <></>
                    )}
                    <span className="text-secondary mb-1">
                      {(item.price - item.price * item.discountPercentage).toFixed(0)} đ
                    </span>
                    
                    <div className="w-full text-center rounded border-[1px] border-secondary py-1">
                      <button onClick={() => handleAddToCart(item.id)}>Thêm vào giỏ hàng</button>
                    <div/>
                  </div>
                </div>
              </div>
            </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
