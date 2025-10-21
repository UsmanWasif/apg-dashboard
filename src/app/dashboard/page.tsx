"use client";

import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<any[]>([]);
  const [form, setForm] = useState({
    id: null,
    customer_name: "",
    email: "",
    username: "",
    company_name: "",
    password: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [total, setTotal] = useState(0);
  const pageSize = 5;

  // Hardcoded company names (for now)
  const companyOptions = [
    "APG Packaging",
    "DevDen Labs",
    "DataCrest Technologies",
    "Fonsic Global",
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const fetchCustomers = async (page = 1) => {
    const res = await fetch(`/api/customers?page=${page}`);
    const data = await res.json();
    setCustomers(data.customers);
    setPageCount(Math.ceil(data.total / data.pageSize));
    setTotal(data.total);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleEdit = (customer: any) => {
    setForm({
      id: customer.id,
      customer_name: customer.customer_name,
      email: customer.email || "",
      username: customer.username,
      company_name: customer.company_name || "",
      password: "",
    });
    setShowForm(true);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setForm({
      id: null,
      customer_name: "",
      email: "",
      username: "",
      company_name: "",
      password: "",
    });
    setShowForm(true);
    setIsEditing(false);
  };

  const handlePasswordReset = (customer: any) => {
    setForm({
      id: customer.id,
      username: customer.username,
      company_name: customer.company_name || "",
      password: "",
      email: customer.email || "",
      customer_name: customer.customer_name,
    });
    setShowPasswordReset(true);
  };

  const handleSave = async () => {
    if (isEditing && form.id) {
      // Update existing customer (only two fields)
      await fetch(`/api/customers/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: form.customer_name,
          company_name: form.company_name,
        }),
      });
    } else {
      // Add new customer
      await fetch(`/api/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setShowForm(false);
    fetchCustomers(currentPage + 1);
  };

  const handlePasswordUpdate = async () => {
    if (!form.id || !form.password) return;
    await fetch(`/api/customers/${form.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: form.password }),
    });
    setShowPasswordReset(false);
    setForm({
      id: null,
      customer_name: "",
      email: "",
      username: "",
      company_name: "",
      password: "",
    });
    fetchCustomers(currentPage + 1);
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/customers/${id}`, { method: "DELETE" });
    fetchCustomers(currentPage + 1);
  };

  const handlePageClick = (event: any) => {
    const page = event.selected + 1;
    setCurrentPage(page - 1);
    fetchCustomers(page);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#e8f1ff] via-[#dbe8ff] to-[#c2d8ff] flex flex-col">
      {/* Top Nav */}
      <header className="flex items-center justify-between bg-white/90 backdrop-blur-md px-8 py-4 shadow-md border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-800">APG Admin Portal</h1>
        <button
          onClick={handleLogout}
          className="bg-[#d2a655] hover:bg-[#b78d47] text-white px-5 py-2 rounded-lg font-medium transition"
        >
          Logout
        </button>
      </header>

      <section className="flex-1 p-8">
        {/* Customer List */}
        {!showForm && !showPasswordReset ? (
          <div className="bg-white/90 shadow-lg rounded-3xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-700">
                List of Customers ({total})
              </h2>
              <button
                onClick={handleAddNew}
                className="bg-[#d2a655] hover:bg-[#b78d47] text-white px-4 py-2 rounded-lg font-medium transition"
              >
                + Add New Customer
              </button>
            </div>

            <table className="w-full border-collapse border border-gray-200 text-sm text-gray-700">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">Customer Name</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Username</th>
                  <th className="border px-4 py-2">Company Name</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td className="border px-4 py-2 text-center">{c.id}</td>
                    <td className="border px-4 py-2">{c.customer_name}</td>
                    <td className="border px-4 py-2">{c.email || "-"}</td>
                    <td className="border px-4 py-2">{c.username}</td>
                    <td className="border px-4 py-2">{c.company_name || "-"}</td>
                    <td className="border px-4 py-2 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(c)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handlePasswordReset(c)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                      >
                        Change Password
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-6 flex justify-center">
              <ReactPaginate
                pageCount={pageCount}
                onPageChange={handlePageClick}
                containerClassName="flex space-x-2"
                activeClassName="bg-[#d2a655] text-white px-3 py-1 rounded"
                pageClassName="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                previousLabel="<"
                nextLabel=">"
                breakLabel="..."
              />
            </div>
          </div>
        ) : (
          <div className="bg-white/90 shadow-lg rounded-3xl p-6 border border-gray-200 max-w-lg mx-auto">
            <h2 className="text-lg font-semibold text-gray-700 mb-6">
              {showPasswordReset
                ? "Reset Password"
                : isEditing
                ? "Edit Customer"
                : "Add New Customer"}
            </h2>

            {!showPasswordReset ? (
              <>
                {isEditing ? (
                  <>
                    {/* Edit Mode — Only show Customer Name + Company Name */}
                    <label className="block text-gray-600 mb-1">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      value={form.customer_name}
                      onChange={(e) =>
                        setForm({ ...form, customer_name: e.target.value })
                      }
                      className="w-full border p-3 mb-4 rounded-lg focus:ring-2 focus:ring-[#d2a655] outline-none"
                    />

                    <label className="block text-gray-600 mb-1">
                      Company Name
                    </label>
                    <select
                      value={form.company_name}
                      onChange={(e) =>
                        setForm({ ...form, company_name: e.target.value })
                      }
                      className="w-full border p-3 mb-6 rounded-lg focus:ring-2 focus:ring-[#d2a655] outline-none"
                    >
                      <option value="">Select company</option>
                      {companyOptions.map((company) => (
                        <option key={company} value={company}>
                          {company}
                        </option>
                      ))}
                    </select>
                  </>
                ) : (
                  <>
                    {/* Add Mode — Show all fields */}
                    <label className="block text-gray-600 mb-1">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      value={form.customer_name}
                      onChange={(e) =>
                        setForm({ ...form, customer_name: e.target.value })
                      }
                      className="w-full border p-3 mb-4 rounded-lg focus:ring-2 focus:ring-[#d2a655] outline-none"
                    />

                    <label className="block text-gray-600 mb-1">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="w-full border p-3 mb-4 rounded-lg focus:ring-2 focus:ring-[#d2a655] outline-none"
                    />

                    <label className="block text-gray-600 mb-1">Username</label>
                    <input
                      type="text"
                      value={form.username}
                      onChange={(e) =>
                        setForm({ ...form, username: e.target.value })
                      }
                      className="w-full border p-3 mb-4 rounded-lg focus:ring-2 focus:ring-[#d2a655] outline-none"
                    />

                    <label className="block text-gray-600 mb-1">
                      Company Name
                    </label>
                    <select
                      value={form.company_name}
                      onChange={(e) =>
                        setForm({ ...form, company_name: e.target.value })
                      }
                      className="w-full border p-3 mb-6 rounded-lg focus:ring-2 focus:ring-[#d2a655] outline-none"
                    >
                      <option value="">Select company</option>
                      {companyOptions.map((company) => (
                        <option key={company} value={company}>
                          {company}
                        </option>
                      ))}
                    </select>

                    <label className="block text-gray-600 mb-1">Password</label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      className="w-full border p-3 mb-6 rounded-lg focus:ring-2 focus:ring-[#d2a655] outline-none"
                      placeholder="Enter password"
                    />
                  </>
                )}

                <div className="flex justify-between">
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-[#d2a655] hover:bg-[#b78d47] text-white rounded-lg"
                  >
                    {isEditing ? "Save Changes" : "Add Customer"}
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Forgot Password Form */}
                <label className="block text-gray-600 mb-1">New Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full border p-3 mb-6 rounded-lg focus:ring-2 focus:ring-[#d2a655] outline-none"
                  placeholder="Enter new password"
                />
                <div className="flex justify-between">
                  <button
                    onClick={() => setShowPasswordReset(false)}
                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePasswordUpdate}
                    className="px-4 py-2 bg-[#d2a655] hover:bg-[#b78d47] text-white rounded-lg"
                  >
                    Update Password
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
