"use client";

import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<any[]>([]);
  const [form, setForm] = useState({ id: null, customer_name: "", email: "", username: "", password: "" });
  const [showForm, setShowForm] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [total, setTotal] = useState(0);
  const pageSize = 5;

  // ✅ Authentication check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  // ✅ Fetch customers (with pagination)
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

  // ✅ Handle Create or Update
  const handleSubmit = async () => {
    if (form.id) {
      await fetch(`/api/customers/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch(`/api/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setShowForm(false);
    setForm({ id: null, customer_name: "", email: "", username: "", password: "" });
    fetchCustomers(currentPage + 1);
  };

  // ✅ Delete a user
  const handleDelete = async (id: number) => {
    await fetch(`/api/customers/${id}`, { method: "DELETE" });
    fetchCustomers(currentPage + 1);
  };

  // ✅ Edit user
  const handleEdit = (customer: any) => {
    setForm(customer);
    setShowForm(true);
  };

  // ✅ Pagination handler
  const handlePageClick = (event: any) => {
    const page = event.selected + 1;
    setCurrentPage(page - 1);
    fetchCustomers(page);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#e8f1ff] via-[#dbe8ff] to-[#c2d8ff] flex flex-col">
      {/* ✅ Top Nav Bar */}
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
        {!showForm ? (
          <div className="bg-white/90 shadow-lg rounded-3xl p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700">
                List of Users ({total})
              </h2>
              <button
                onClick={() => setShowForm(true)}
                className="bg-[#d2a655] hover:bg-[#b78d47] text-white px-4 py-2 rounded-lg font-medium"
              >
                Add User
              </button>
            </div>

            {/* ✅ User Table */}
            <table className="w-full border-collapse border border-gray-200 text-sm text-gray-700">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">Customer Name</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Username</th>
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
                    <td className="border px-4 py-2 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(c)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        Edit
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

            {/* ✅ Pagination */}
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
                disabledClassName="opacity-50 cursor-not-allowed"
              />
            </div>
          </div>
        ) : (
          <div className="bg-white/90 shadow-lg rounded-3xl p-6 border border-gray-200 max-w-lg mx-auto">
            <h2 className="text-lg font-semibold text-gray-700 mb-6">
              {form.id ? "Edit User" : "Add User"}
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Customer Name"
                value={form.customer_name}
                onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#d2a655] outline-none"
              />
              <input
                type="email"
                placeholder="Email (optional)"
                value={form.email || ""}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#d2a655] outline-none"
              />
              <input
                type="text"
                placeholder="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#d2a655] outline-none"
              />
              <input
                type="text"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#d2a655] outline-none"
              />

              <div className="flex justify-between">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-[#d2a655] hover:bg-[#b78d47] text-white rounded-lg"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ✅ Footer */}
      <footer className="text-center py-4 text-gray-500 text-sm border-t border-gray-200 bg-white/70 backdrop-blur-md">
        © {new Date().getFullYear()} APG Packaging. All rights reserved.
      </footer>
    </main>
  );
}
