import Base from "../components/Base";
import {
  infoWithImageInRightSection,
  trendingProducts,
  infoWithImageInLeftSection,
} from "./HomePageComponents";
import { useState, useEffect } from "react";
import { getAllProducts } from "../services/product.service";
import "./Index.css";

function Index() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Load initial products when component mounts
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await getAllProducts(0, 6, "addedDate", "desc");
      if (response?.content) {
        setProducts(response.content);
      }
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  return (
    <Base
      title="Welcome to Electro Store"
      description={
        "Discover the latest in electronics and tech innovations"
      }
      buttonEnabled={true}
      buttonText="Shop Now"
      buttonType="primary"
      buttonLink="/store"
    >
      {/* Trending Products Section */}
      <div className="my-4">{trendingProducts(products)}</div>
      
      {/* Latest Technology Section */}
      <div style={{ margin: "100px 0px" }}>
        {infoWithImageInRightSection(
          "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=500&h=300",
          "Latest Technology at Your Fingertips",
          "Explore our wide range of electronic devices, from smartphones to laptops, gaming consoles to smart home devices. We offer competitive prices and expert guidance to help you make the right choice.",
          "Shop Now",
          "/store"
        )}
      </div>
      
      {/* Customer Reviews Section */}
      <div style={{ margin: "100px 0px" }} className="bg-light py-5">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="display-6 fw-bold mb-3">What Our Customers Say</h2>
              <p className="text-muted">Real experiences from our valued customers</p>
            </div>
          </div>
          <div className="row g-4">
            {/* Review 1 */}
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm hover-lift">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-3">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80"
                      alt="Customer"
                      className="rounded-circle"
                      style={{ width: "60px", height: "60px", objectFit: "cover" }}
                    />
                    <div className="ms-3">
                      <h5 className="mb-0">Sarah Johnson</h5>
                      <div className="text-warning">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted mb-0">
                    "Amazing selection of electronics! The staff was incredibly helpful in finding the perfect laptop for my needs. Great after-sales support too!"
                  </p>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm hover-lift">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-3">
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80"
                      alt="Customer"
                      className="rounded-circle"
                      style={{ width: "60px", height: "60px", objectFit: "cover" }}
                    />
                    <div className="ms-3">
                      <h5 className="mb-0">Michael Chen</h5>
                      <div className="text-warning">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star-half-alt"></i>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted mb-0">
                    "Fast delivery and excellent prices. I bought a new smartphone and got it the next day. The warranty process is straightforward too."
                  </p>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm hover-lift">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-3">
                    <img
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80"
                      alt="Customer"
                      className="rounded-circle"
                      style={{ width: "60px", height: "60px", objectFit: "cover" }}
                    />
                    <div className="ms-3">
                      <h5 className="mb-0">Emily Parker</h5>
                      <div className="text-warning">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted mb-0">
                    "The installation service was fantastic! They set up my entire home theater system and explained everything clearly. Highly recommended!"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <div style={{ margin: "100px 0px" }} className="bg-light py-5">
        {infoWithImageInRightSection(
          "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=500&h=300",
          "About Electro Store",
          "We are your trusted destination for all things electronic. With years of experience and a passionate team, we bring you the best technology has to offer.",
          "Learn More",
          "/about"
        )}
      </div>

      {/* Support and Contact Section */}
      <div style={{ margin: "100px 0px" }} className="mb-5">
        {infoWithImageInLeftSection(
          "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=500&h=300",
          "Expert Support & Fast Delivery",
          "Our team of tech experts is here to help you make informed decisions. With nationwide delivery network, get your favorite electronics delivered right to your doorstep. Need assistance? We're just a click away!",
          "Contact Us",
          "/contact"
        )}
      </div>
    </Base>
  );
}
export default Index;
