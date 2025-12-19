"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, 
  Search, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  Loader2,
  ChevronRight,
  RefreshCw,
  Gift,
  Star,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

interface OrderItem {
  id: string;
  product_name: string;
  variant_name: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_wilaya: string;
  shipping_commune: string;
  shipping_method: string;
  shipping_cost: number;
  shipping_status: string;
  tracking_number: string | null;
  payment_method: string;
  payment_status: string;
  subtotal: number;
  total: number;
  created_at: string;
  items: OrderItem[];
}

const statusConfig: Record<string, { icon: React.ElementType; color: string; bgColor: string }> = {
  pending: { icon: Clock, color: "text-amber-600", bgColor: "bg-amber-100" },
  processing: { icon: Package, color: "text-blue-600", bgColor: "bg-blue-100" },
  shipped: { icon: Truck, color: "text-purple-600", bgColor: "bg-purple-100" },
  in_transit: { icon: Truck, color: "text-indigo-600", bgColor: "bg-indigo-100" },
  delivered: { icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-100" },
  returned: { icon: AlertCircle, color: "text-red-600", bgColor: "bg-red-100" },
};

export function CompteClient() {
  const t = useTranslations("pages.compte");
  const { user, isAuthenticated, isLoading: authLoading, signInWithGoogle, signOut } = useAuth();
  const [searchType, setSearchType] = useState<"phone" | "email">("phone");
  const [searchValue, setSearchValue] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isAutoLoaded, setIsAutoLoaded] = useState(false);
  const [showManualSearch, setShowManualSearch] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Fetch orders function (reusable)
  const fetchOrders = async (type: "phone" | "email", value: string) => {
    if (!value.trim()) return;

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await fetch(
        `/api/orders/lookup?${type}=${encodeURIComponent(value.trim())}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data.orders || []);
      setSelectedOrder(null);
    } catch (err) {
      setError(t("errors.fetchFailed"));
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load saved customer info from localStorage and auto-fetch orders
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPhone = localStorage.getItem('suqya_customer_phone');
      const savedEmail = localStorage.getItem('suqya_customer_email');
      
      if (savedPhone) {
        setSearchType("phone");
        setSearchValue(savedPhone);
        setIsAutoLoaded(true);
        fetchOrders("phone", savedPhone);
      } else if (savedEmail) {
        setSearchType("email");
        setSearchValue(savedEmail);
        setIsAutoLoaded(true);
        fetchOrders("email", savedEmail);
      }
    }
  }, []);

  // Handle switching to different account
  const handleSwitchAccount = () => {
    setShowManualSearch(true);
    setIsAutoLoaded(false);
    setSearchValue("");
    setOrders([]);
    setHasSearched(false);
    setError(null);
  };

  // Clear saved data and switch account
  const handleClearSavedData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('suqya_customer_phone');
      localStorage.removeItem('suqya_customer_email');
    }
    handleSwitchAccount();
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders(searchType, searchValue);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusInfo = (status: string) => {
    return statusConfig[status] || statusConfig.pending;
  };

  // Determine if we should show the search form
  const shouldShowSearchForm = !isAutoLoaded || showManualSearch;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero - Personalized when auto-loaded */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/20 py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          {isAutoLoaded && !showManualSearch ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-card/80 backdrop-blur-sm rounded-full text-sm text-muted-foreground mb-4 border border-border/50"
              >
                {searchType === "phone" ? <Phone size={16} /> : <Mail size={16} />}
                <span>{searchValue}</span>
              </motion.div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                {t("welcome.title")}
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
                {t("welcome.subtitle")}
              </p>
              <button
                onClick={handleSwitchAccount}
                className="text-sm text-primary hover:text-primary/80 underline underline-offset-2"
              >
                {t("welcome.notYou")}
              </button>
            </>
          ) : (
            <>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                {t("title")}
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t("subtitle")}
              </p>
            </>
          )}
        </div>
      </section>

      {/* Search Section - Only show when needed */}
      {shouldShowSearchForm && (
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl shadow-sm border border-border p-6 md:p-8"
              >
                <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
                  {t("search.title")}
                </h2>

                {/* Search Type Toggle */}
                <div className="flex gap-2 mb-6">
                  <button
                    type="button"
                    onClick={() => setSearchType("phone")}
                    className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
                      searchType === "phone"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    <Phone size={18} />
                    {t("search.byPhone")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchType("email")}
                    className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
                      searchType === "email"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    <Mail size={18} />
                    {t("search.byEmail")}
                  </button>
                </div>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="space-y-4">
                  <div>
                    <Label htmlFor="search">
                      {searchType === "phone" ? t("search.phoneLabel") : t("search.emailLabel")}
                    </Label>
                    <Input
                      id="search"
                      type={searchType === "email" ? "email" : "tel"}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder={
                      searchType === "phone"
                        ? t("search.phonePlaceholder")
                        : t("search.emailPlaceholder")
                    }
                    className="mt-1"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={20} />
                      {t("search.searching")}
                    </>
                  ) : (
                    <>
                      <Search className="mr-2" size={20} />
                      {t("search.button")}
                    </>
                  )}
                </Button>
              </form>

              {error && (
                <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm">
                  {error}
                </div>
              )}
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {hasSearched && !isLoading && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pb-12"
          >
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                {orders.length === 0 ? (
                  /* No Orders Found */
                  <div className="bg-card rounded-2xl shadow-sm border border-border p-8 text-center">
                    <Package className="mx-auto h-16 w-16 text-muted-foreground/30 mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {t("noOrders.title")}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {t("noOrders.message")}
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchValue("");
                        setHasSearched(false);
                      }}
                    >
                      <RefreshCw className="mr-2" size={18} />
                      {t("noOrders.tryAgain")}
                    </Button>
                  </div>
                ) : selectedOrder ? (
                  /* Order Details */
                  <OrderDetails
                    order={selectedOrder}
                    onBack={() => setSelectedOrder(null)}
                    t={t}
                    formatDate={formatDate}
                    getStatusInfo={getStatusInfo}
                  />
                ) : (
                  /* Orders List */
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">
                      {t("ordersList.title", { count: orders.length })}
                    </h3>
                    {orders.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onClick={() => setSelectedOrder(order)}
                        t={t}
                        formatDate={formatDate}
                        getStatusInfo={getStatusInfo}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Loyalty Program CTA */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-secondary rounded-2xl p-6 md:p-8 text-center"
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  {t("loyalty.title")}
                </h3>
                
                <p className="text-white/90 mb-6 max-w-md mx-auto">
                  {t("loyalty.description")}
                </p>

                {/* Benefits */}
                <div className="flex flex-wrap justify-center gap-4 mb-6">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <Star className="w-4 h-4 text-yellow-200" />
                    <span className="text-sm text-white font-medium">{t("loyalty.benefits.points")}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <Sparkles className="w-4 h-4 text-yellow-200" />
                    <span className="text-sm text-white font-medium">{t("loyalty.benefits.exclusive")}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <Gift className="w-4 h-4 text-yellow-200" />
                    <span className="text-sm text-white font-medium">{t("loyalty.benefits.rewards")}</span>
                  </div>
                </div>

                {/* Google Sign In Button or User Info */}
                {isAuthenticated && user ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                      {user.user_metadata?.avatar_url && (
                        <img 
                          src={user.user_metadata.avatar_url} 
                          alt="" 
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <span className="text-white font-medium">
                        {user.user_metadata?.full_name || user.email}
                      </span>
                    </div>
                    <p className="text-white/80 text-sm">
                      {t("loyalty.loggedInMessage")}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                      onClick={async () => {
                        try {
                          await signOut();
                        } catch (err) {
                          console.error("Sign out error:", err);
                        }
                      }}
                    >
                      {t("loyalty.signOut")}
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button
                      size="lg"
                      className="bg-card text-foreground hover:bg-card/90 font-semibold shadow-lg"
                      disabled={authLoading}
                      onClick={async () => {
                        setAuthError(null);
                        try {
                          await signInWithGoogle();
                        } catch (err) {
                          setAuthError(t("loyalty.signInError"));
                          console.error("Sign in error:", err);
                        }
                      }}
                    >
                      {authLoading ? (
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      ) : (
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                      )}
                      {t("loyalty.signInWithGoogle")}
                    </Button>

                    {authError && (
                      <p className="text-red-200 text-sm mt-2">{authError}</p>
                    )}

                    <p className="text-white/70 text-xs mt-4">
                      {t("loyalty.comingSoon")}
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* Order Card Component */
interface OrderCardProps {
  order: Order;
  onClick: () => void;
  t: ReturnType<typeof useTranslations>;
  formatDate: (date: string) => string;
  getStatusInfo: (status: string) => { icon: React.ElementType; color: string; bgColor: string };
}

function OrderCard({ order, onClick, t, formatDate, getStatusInfo }: OrderCardProps) {
  const statusInfo = getStatusInfo(order.shipping_status);
  const StatusIcon = statusInfo.icon;

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="w-full bg-card rounded-xl shadow-sm border border-border p-4 md:p-6 text-left hover:border-primary/50 transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-semibold text-foreground">
              #{order.order_number}
            </span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
              <StatusIcon size={14} />
              {t(`status.${order.shipping_status}`)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-1">
            {formatDate(order.created_at)}
          </p>
          <p className="text-foreground font-medium">
            {formatPrice(order.total)}
          </p>
        </div>
        <ChevronRight className="text-muted-foreground shrink-0 rtl:rotate-180" size={20} />
      </div>
    </motion.button>
  );
}

/* Order Details Component */
interface OrderDetailsProps {
  order: Order;
  onBack: () => void;
  t: ReturnType<typeof useTranslations>;
  formatDate: (date: string) => string;
  getStatusInfo: (status: string) => { icon: React.ElementType; color: string; bgColor: string };
}

function OrderDetails({ order, onBack, t, formatDate, getStatusInfo }: OrderDetailsProps) {
  const statusInfo = getStatusInfo(order.shipping_status);
  const StatusIcon = statusInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronRight className="rotate-180 rtl:rotate-0" size={20} />
        {t("details.back")}
      </button>

      {/* Order Header */}
      <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {t("details.orderNumber", { number: order.order_number })}
            </h2>
            <p className="text-muted-foreground mt-1">
              {formatDate(order.created_at)}
            </p>
          </div>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${statusInfo.bgColor} ${statusInfo.color}`}>
            <StatusIcon size={20} />
            <span className="font-medium">{t(`status.${order.shipping_status}`)}</span>
          </div>
        </div>

        {/* Tracking Number */}
        {order.tracking_number && (
          <div className="bg-muted rounded-xl p-4 mb-6">
            <p className="text-sm text-muted-foreground mb-1">{t("details.trackingNumber")}</p>
            <p className="font-mono font-semibold text-foreground">{order.tracking_number}</p>
          </div>
        )}

        {/* Status Timeline */}
        <div className="border-t border-border pt-6">
          <h3 className="font-semibold text-foreground mb-4">{t("details.statusTimeline")}</h3>
          <StatusTimeline currentStatus={order.shipping_status} t={t} />
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">{t("details.items")}</h3>
        <div className="space-y-4">
          {order.items?.map((item) => (
            <div key={item.id} className="flex justify-between items-start py-3 border-b border-border/50 last:border-0">
              <div>
                <p className="font-medium text-foreground">{item.product_name}</p>
                {item.variant_name && (
                  <p className="text-sm text-muted-foreground">{item.variant_name}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  {t("details.quantity")}: {item.quantity}
                </p>
              </div>
              <p className="font-medium text-foreground">{formatPrice(item.total_price)}</p>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="border-t border-border mt-4 pt-4 space-y-2">
          <div className="flex justify-between text-muted-foreground">
            <span>{t("details.subtotal")}</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>{t("details.shipping")}</span>
            <span>{formatPrice(order.shipping_cost)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-foreground pt-2 border-t border-border">
            <span>{t("details.total")}</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Shipping & Payment Info */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Shipping Info */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <MapPin size={20} className="text-primary" />
            {t("details.shippingInfo")}
          </h3>
          <div className="space-y-2 text-muted-foreground">
            <p className="font-medium text-foreground">{order.customer_name}</p>
            <p>{order.shipping_address}</p>
            <p>{order.shipping_commune}, {order.shipping_wilaya}</p>
            <p className="flex items-center gap-2 mt-3">
              <Phone size={16} />
              {order.customer_phone}
            </p>
            <p className="flex items-center gap-2">
              <Mail size={16} />
              {order.customer_email}
            </p>
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <CreditCard size={20} className="text-primary" />
            {t("details.paymentInfo")}
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">{t("details.paymentMethod")}</p>
              <p className="font-medium text-foreground">{t(`paymentMethods.${order.payment_method}`)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("details.paymentStatus")}</p>
              <p className={`font-medium ${order.payment_status === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
                {t(`paymentStatus.${order.payment_status}`)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("details.shippingMethod")}</p>
              <p className="font-medium text-foreground">{t(`shippingMethods.${order.shipping_method}`)}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* Status Timeline Component */
interface StatusTimelineProps {
  currentStatus: string;
  t: ReturnType<typeof useTranslations>;
}

function StatusTimeline({ currentStatus, t }: StatusTimelineProps) {
  const statuses = ["pending", "processing", "shipped", "in_transit", "delivered"];
  const currentIndex = statuses.indexOf(currentStatus);

  return (
    <div className="flex items-center justify-between">
      {statuses.map((status, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const statusInfo = statusConfig[status];
        const StatusIcon = statusInfo.icon;

        return (
          <div key={status} className="flex flex-col items-center flex-1">
            <div className="relative flex items-center w-full">
              {index > 0 && (
                <div
                  className={`absolute left-0 right-1/2 h-1 -translate-y-1/2 top-1/2 ${
                    isCompleted ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
              {index < statuses.length - 1 && (
                <div
                  className={`absolute left-1/2 right-0 h-1 -translate-y-1/2 top-1/2 ${
                    index < currentIndex ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
              <div
                className={`relative z-10 mx-auto w-10 h-10 rounded-full flex items-center justify-center ${
                  isCurrent
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                    : isCompleted
                    ? "bg-primary/80 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <StatusIcon size={18} />
              </div>
            </div>
            <span
              className={`mt-2 text-xs text-center ${
                isCurrent ? "font-semibold text-foreground" : "text-muted-foreground"
              }`}
            >
              {t(`status.${status}`)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
