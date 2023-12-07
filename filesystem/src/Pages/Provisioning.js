import React, { useState, useEffect } from "react";
import axios from "axios";

const Provisioning = ({ productDetails, onClose }) => {
  const staticProducts = ["notes", "todo"];
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    if (productDetails && productDetails.products) {
      setSelectedProducts(productDetails.products);
    }
  }, [productDetails]);

  const handleToggleProduct = (productName) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.includes(productName)
        ? prevProducts.filter((name) => name !== productName)
        : [...prevProducts, productName]
    );
  };

  const handleProvision = async () => {
    console.log("Selected Products:", selectedProducts);
    const response = await axios
      .post("http://localhost:3001/api/provisioning", {
        orgid: productDetails.orgid,
        products: selectedProducts,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        throw new Error("Failed to create organization.");
      });
    onClose();
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-4">Choose Products to Provision</h2>
      <div className="flex flex-wrap">
        {staticProducts.map((product) => (
          <div
            key={product}
            className={`bg-gray-200 px-3 py-2 rounded m-2 cursor-pointer ${
              selectedProducts.includes(product) ? "bg-green-500" : ""
            }`}
            onClick={() => handleToggleProduct(product)}
          >
            {product}
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-end">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={handleProvision}
        >
          Provision
        </button>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Provisioning;
