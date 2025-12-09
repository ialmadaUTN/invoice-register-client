import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { LogOut, FileText, Calendar, DollarSign, Search } from "lucide-react";
import { TelegramOnboarding } from "../components/TelegramOnboarding";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";

interface Invoice {
  id: string;
  userId: string;
  fecha: string | Timestamp;
  proveedor: string;
  n_factura: string;
  total: number;
  moneda: string;
  createdAt: Timestamp;
  products: string[];
}

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasTelegramId, setHasTelegramId] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkTelegramId() {
      if (!currentUser) {
        navigate("/login");
        return;
      }
      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists() && userDoc.data().telegramId) {
          setHasTelegramId(true);
        } else {
          setHasTelegramId(false);
        }
      } catch (error) {
        console.error("Error checking user profile:", error);
        setHasTelegramId(false);
      }
    }

    checkTelegramId();
  }, [currentUser]);

  useEffect(() => {
    async function fetchInvoices() {
      if (!currentUser || !hasTelegramId) {
        if (hasTelegramId === false) setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "invoices"),
          where("userId", "==", currentUser.uid),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        const fetchedInvoices: Invoice[] = [];
        querySnapshot.forEach((doc) => {
          fetchedInvoices.push({ id: doc.id, ...doc.data() } as Invoice);
        });
        setInvoices(fetchedInvoices);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      } finally {
        setLoading(false);
      }
    }

    if (hasTelegramId) {
      fetchInvoices();
    }
  }, [currentUser, hasTelegramId]);

  const formatDate = (date: string | Timestamp) => {
    if (typeof date === "string") return date;
    if (date?.toDate) return date.toDate().toLocaleDateString();
    return "N/A";
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: currency || "ARS",
    }).format(amount);
  };

  const filteredInvoices = invoices.filter((invoice) =>
    invoice.proveedor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (hasTelegramId === null) {
    return <Loading />;
  }

  if (hasTelegramId === false) {
    return <TelegramOnboarding onComplete={() => setHasTelegramId(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Mis Facturas</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600 hidden sm:inline-block">
            {currentUser?.email}
          </span>
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            Salir
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Historial</h2>
            <p className="text-slate-500">
              Gestiona tus comprobantes registrados
            </p>
          </div>
          {/* Placeholder for future filters */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar proveedor..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse h-40" />
            ))}
          </div>
        ) : filteredInvoices.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="bg-slate-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FileText className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                {searchTerm
                  ? "No se encontraron facturas"
                  : "No hay facturas aún"}
              </h3>
              <p className="text-slate-500 mt-2 max-w-sm mx-auto">
                {searchTerm
                  ? `No hay facturas que coincidan con "${searchTerm}"`
                  : "Envía una foto de tu factura a través de Telegram para verla aquí."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInvoices.map((invoice) => (
              <Card
                key={invoice.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                      {invoice.proveedor}
                    </CardTitle>
                    <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">
                      {invoice.n_factura}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center text-slate-500 text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(invoice.fecha)}
                    </div>
                    <div className="flex items-center text-slate-900 font-bold text-xl mt-2">
                      <DollarSign className="h-5 w-5 mr-1 text-slate-400" />
                      {formatCurrency(invoice.total, invoice.moneda)}
                    </div>

                    {invoice.products && invoice.products.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <p className="text-xs font-semibold text-slate-500 mb-2 uppercase">
                          Productos
                        </p>
                        <ul className="text-sm text-slate-600 space-y-1">
                          {invoice.products.map((product, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-2">•</span> {product}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
