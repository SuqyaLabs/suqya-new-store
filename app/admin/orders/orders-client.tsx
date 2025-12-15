"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Eye,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_wilaya: string;
  shipping_status: string;
  payment_method: string;
  payment_status: string;
  total: number;
  created_at: string;
}

interface OrdersClientProps {
  initialOrders: Order[];
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof Package }> = {
  pending: { label: "En attente", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  processing: { label: "En cours", color: "bg-blue-100 text-blue-800", icon: Package },
  shipped: { label: "Expédié", color: "bg-purple-100 text-purple-800", icon: Truck },
  delivered: { label: "Livré", color: "bg-green-100 text-green-800", icon: CheckCircle },
  returned: { label: "Retourné", color: "bg-red-100 text-red-800", icon: XCircle },
};

const paymentStatusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "En attente", color: "bg-yellow-100 text-yellow-800" },
  paid: { label: "Payé", color: "bg-green-100 text-green-800" },
  failed: { label: "Échoué", color: "bg-red-100 text-red-800" },
  refunded: { label: "Remboursé", color: "bg-gray-100 text-gray-800" },
};

export function OrdersClient({ initialOrders }: OrdersClientProps) {
  const [orders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_phone.includes(searchQuery);

    const matchesStatus =
      statusFilter === "all" || order.shipping_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-DZ", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400"
          />
          <input
            type="text"
            placeholder="Rechercher par numéro, nom ou téléphone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-warm-200 focus:border-honey-500 focus:ring-2 focus:ring-honey-500/20 outline-none"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-warm-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 rounded-xl border border-warm-200 focus:border-honey-500 outline-none"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="processing">En cours</option>
            <option value="shipped">Expédié</option>
            <option value="delivered">Livré</option>
            <option value="returned">Retourné</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {["pending", "processing", "shipped", "delivered"].map((status) => {
          const count = orders.filter((o) => o.shipping_status === status).length;
          const config = statusConfig[status];
          const Icon = config.icon;
          return (
            <div
              key={status}
              className="bg-white rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${config.color}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-warm-900">{count}</p>
                  <p className="text-sm text-warm-500">{config.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-warm-50 border-b border-warm-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-warm-600">
                  Commande
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-warm-600">
                  Client
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-warm-600">
                  Wilaya
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-warm-600">
                  Statut
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-warm-600">
                  Paiement
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-warm-600">
                  Total
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-warm-600">
                  Date
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-100">
              {filteredOrders.map((order) => {
                const shippingStatus = statusConfig[order.shipping_status] || statusConfig.pending;
                const paymentStatus = paymentStatusConfig[order.payment_status] || paymentStatusConfig.pending;

                return (
                  <tr
                    key={order.id}
                    className="hover:bg-warm-50 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <span className="font-mono font-medium text-warm-900">
                        {order.order_number}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-warm-900">
                        {order.customer_name}
                      </p>
                      <p className="text-sm text-warm-500">
                        {order.customer_phone}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-warm-700">
                      {order.shipping_wilaya}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${shippingStatus.color}`}
                      >
                        {shippingStatus.label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${paymentStatus.color}`}
                      >
                        {paymentStatus.label}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="font-semibold text-honey-700">
                        {formatPrice(order.total)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right text-sm text-warm-500">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-4 py-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye size={18} />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-warm-300 mb-4" />
            <p className="text-warm-500">Aucune commande trouvée</p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl shadow-xl z-50 max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-warm-900">
                    Commande {selectedOrder.order_number}
                  </h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 hover:bg-warm-100 rounded-lg"
                  >
                    <XCircle size={20} className="text-warm-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Customer Info */}
                  <div className="bg-warm-50 rounded-xl p-4 space-y-3">
                    <h3 className="font-semibold text-warm-900">Client</h3>
                    <div className="flex items-center gap-2 text-warm-700">
                      <span className="font-medium">{selectedOrder.customer_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-warm-600">
                      <Phone size={16} />
                      <span>{selectedOrder.customer_phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-warm-600">
                      <Mail size={16} />
                      <span>{selectedOrder.customer_email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-warm-600">
                      <MapPin size={16} />
                      <span>{selectedOrder.shipping_wilaya}</span>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="bg-warm-50 rounded-xl p-4 space-y-3">
                    <h3 className="font-semibold text-warm-900">Détails</h3>
                    <div className="flex justify-between">
                      <span className="text-warm-600">Statut livraison</span>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          statusConfig[selectedOrder.shipping_status]?.color ||
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {statusConfig[selectedOrder.shipping_status]?.label || selectedOrder.shipping_status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-warm-600">Paiement</span>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          paymentStatusConfig[selectedOrder.payment_status]?.color ||
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {paymentStatusConfig[selectedOrder.payment_status]?.label || selectedOrder.payment_status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-warm-600">Mode de paiement</span>
                      <span className="font-medium text-warm-900">
                        {selectedOrder.payment_method === "cod"
                          ? "Paiement à la livraison"
                          : selectedOrder.payment_method.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-warm-200">
                      <span className="font-semibold text-warm-900">Total</span>
                      <span className="font-bold text-honey-700 text-lg">
                        {formatPrice(selectedOrder.total)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" className="flex-1">
                      <Phone size={16} className="mr-2" />
                      Appeler
                    </Button>
                    <Button className="flex-1">
                      Mettre à jour
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
