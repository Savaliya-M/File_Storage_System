import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Provisioning from "./Provisioning";

const Organization = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [showProvisioning, setShowProvisioning] = useState(false);
  const [orgProducts, setOrgProducts] = useState({ orgid: "", products: [] });

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:3001/api/organization"
        );
        setOrganizations(response.data.organizations);
        setSubscriptions(response.data.subscription);
        console.log(response);
      } catch (error) {
        console.error("Error fetching organizations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  const handleDeleteOrganization = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:3001/api/organization/${id}`);
      setOrganizations(organizations.filter((org) => org.id !== id));
    } catch (error) {
      console.error("Error deleting organization:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleProvisioning = (id) => {
    setShowProvisioning(true);
    const subscription = subscriptions.find((sub) => sub.org_id === id);

    setOrgProducts({
      orgid: id,
      products: subscription ? subscription.products : [],
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-xl font-bold">Organization CRUD</h1>
        </div>
      </nav>

      <div className="mt-8">
        <div className="flex items-center mb-4">
          <Link
            to="/createorg"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Organization
          </Link>
        </div>

        {loading && <p>Loading...</p>}

        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Organization Name</th>
              <th className="px-4 py-2">Domain</th>
              <th className="px-4 py-2">Subscribed Products</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {organizations.map((org) => {
              const subscription = subscriptions.find(
                (sub) => sub.org_id === org.id
              );
              const subscribedProducts = subscription
                ? subscription.products
                : [];

              return (
                <tr key={org.id} className="border-b text-center">
                  <td className="px-4 py-2">
                    <strong>{org.org_name}</strong>
                  </td>
                  <td className="px-4 py-2">{org.domain}</td>
                  <td className="px-4 py-2">
                    {subscribedProducts.length > 0
                      ? subscribedProducts.join(", ")
                      : "None"}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded mr-2"
                      onClick={() => handleDeleteOrganization(org.id)}
                    >
                      Delete
                    </button>
                    <button
                      className={`bg-green-500 text-white px-2 py-1 rounded mr-2 ${
                        orgProducts.id === org.id ? "bg-green-700" : ""
                      }`}
                      onClick={() => handleToggleProvisioning(org.id)}
                    >
                      Provision
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {orgProducts !== null && showProvisioning && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-75">
          <Provisioning
            productDetails={orgProducts}
            onClose={() => {
              setShowProvisioning(false);
              setOrgProducts({ id: null, products: [] });
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Organization;
