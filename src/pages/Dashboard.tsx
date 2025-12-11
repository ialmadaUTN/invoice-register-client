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
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import * as XLSX from "xlsx";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  LogOut,
  FileText,
  Calendar,
  DollarSign,
  Search,
  Settings,
  Download,
  Trash,
  MoreVertical,
  Pencil,
} from "lucide-react";
import { TelegramOnboarding } from "../components/TelegramOnboarding";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";

interface Invoice {
  id: string;
  userId: string;
  type: string;
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

  // Export state
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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

  const handleExport = () => {
    if (!startDate || !endDate) {
      alert("Por favor selecciona ambas fechas");
      return;
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const filteredForExport = invoices.filter((invoice) => {
      let invoiceDate: Date;
      if (typeof invoice.fecha === "string") {
        // Try to parse string date (assuming DD/MM/YYYY or YYYY-MM-DD)
        // If it's DD/MM/YYYY
        if (invoice.fecha.includes("/")) {
          const [day, month, year] = invoice.fecha.split("/");
          invoiceDate = new Date(Number(year), Number(month) - 1, Number(day));
        } else {
          invoiceDate = new Date(invoice.fecha);
        }
      } else if (invoice.fecha?.toDate) {
        invoiceDate = invoice.fecha.toDate();
      } else {
        return false;
      }

      return invoiceDate >= start && invoiceDate <= end;
    });

    if (filteredForExport.length === 0) {
      alert("No hay facturas en el rango de fechas seleccionado");
      return;
    }

    // Prepare data for Excel
    const dataToExport = filteredForExport.map((invoice) => ({
      Fecha: formatDate(invoice.fecha),
      Proveedor: invoice.proveedor,
      "N° Factura": invoice.n_factura,
      Tipo: invoice.type || "",
      Total: invoice.total,
      Moneda: invoice.moneda,
      Productos: invoice.products?.join(", ") || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Facturas");

    // Generate filename with dates
    const fileName = `facturas_${startDate}_${endDate}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    setIsExportDialogOpen(false);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInvoice) return;

    try {
      const invoiceRef = doc(db, "invoices", editingInvoice.id);
      // Create a copy of the object to update, excluding the id
      const { id, ...updateData } = editingInvoice;

      await updateDoc(invoiceRef, updateData);

      setInvoices((prev) =>
        prev.map((inv) => (inv.id === id ? editingInvoice : inv))
      );
      setIsEditDialogOpen(false);
      setEditingInvoice(null);
    } catch (error) {
      console.error("Error updating invoice:", error);
      alert("Error al actualizar el comprobante");
    }
  };

  const getInvoiceDateValue = (invoice: Invoice) => {
    if (!invoice.fecha) return "";
    if (typeof invoice.fecha === "string") {
      // Convert DD/MM/YYYY to YYYY-MM-DD for input type="date"
      if (invoice.fecha.includes("/")) {
        const [day, month, year] = invoice.fecha.split("/");
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      }
      return invoice.fecha;
    }
    // If it's a Timestamp
    if (invoice.fecha?.toDate) {
      return invoice.fecha.toDate().toISOString().split("T")[0];
    }
    return "";
  };

  const filteredInvoices = invoices.filter((invoice) =>
    invoice.proveedor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este comprobante?"))
      return;

    try {
      await deleteDoc(doc(db, "invoices", id));
      setInvoices((prev) => prev.filter((invoice) => invoice.id !== id));
    } catch (error) {
      console.error("Error deleting invoice:", error);
      alert("Error al eliminar el comprobante");
    }
  };

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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/settings")}
          >
            <Settings className="h-5 w-5 text-slate-600" />
          </Button>
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
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Download Button with Dialog */}
            <Dialog
              open={isExportDialogOpen}
              onOpenChange={setIsExportDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Exportar Facturas</DialogTitle>
                  <DialogDescription>
                    Selecciona el rango de fechas para exportar tus facturas a
                    Excel.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="start-date" className="text-right">
                      Desde
                    </Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="end-date" className="text-right">
                      Hasta
                    </Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleExport}>
                    Generar Excel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Search Bar */}
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
        </div>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Editar Comprobante</DialogTitle>
              <DialogDescription>
                Modifica los datos del comprobante.
              </DialogDescription>
            </DialogHeader>
            {editingInvoice && (
              <form onSubmit={handleUpdate} className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-proveedor" className="text-right">
                    Proveedor
                  </Label>
                  <Input
                    id="edit-proveedor"
                    value={editingInvoice.proveedor}
                    onChange={(e) =>
                      setEditingInvoice({
                        ...editingInvoice,
                        proveedor: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-fecha" className="text-right">
                    Fecha
                  </Label>
                  <Input
                    id="edit-fecha"
                    type="date"
                    value={getInvoiceDateValue(editingInvoice)}
                    onChange={(e) =>
                      setEditingInvoice({
                        ...editingInvoice,
                        fecha: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-n_factura" className="text-right">
                    N° Factura
                  </Label>
                  <Input
                    id="edit-n_factura"
                    value={editingInvoice.n_factura}
                    onChange={(e) =>
                      setEditingInvoice({
                        ...editingInvoice,
                        n_factura: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-type" className="text-right">
                    Tipo
                  </Label>
                  <Input
                    id="edit-type"
                    value={editingInvoice.type || ""}
                    onChange={(e) =>
                      setEditingInvoice({
                        ...editingInvoice,
                        type: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-moneda" className="text-right">
                    Moneda
                  </Label>
                  <Input
                    id="edit-moneda"
                    value={editingInvoice.moneda}
                    onChange={(e) =>
                      setEditingInvoice({
                        ...editingInvoice,
                        moneda: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-total" className="text-right">
                    Total
                  </Label>
                  <Input
                    id="edit-total"
                    type="number"
                    step="0.01"
                    value={editingInvoice.total}
                    onChange={(e) =>
                      setEditingInvoice({
                        ...editingInvoice,
                        total: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="edit-products" className="text-right pt-2">
                    Productos
                  </Label>
                  <div className="col-span-3 space-y-2">
                    {editingInvoice.products?.map((product, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={product}
                          onChange={(e) => {
                            const newProducts = [
                              ...(editingInvoice.products || []),
                            ];
                            newProducts[index] = e.target.value;
                            setEditingInvoice({
                              ...editingInvoice,
                              products: newProducts,
                            });
                          }}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const newProducts = editingInvoice.products.filter(
                              (_, i) => i !== index
                            );
                            setEditingInvoice({
                              ...editingInvoice,
                              products: newProducts,
                            });
                          }}
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setEditingInvoice({
                          ...editingInvoice,
                          products: [...(editingInvoice.products || []), ""],
                        })
                      }
                    >
                      Agregar producto
                    </Button>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Guardar cambios</Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

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
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">
                        {invoice.n_factura}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 p-0"
                          >
                            <span className="sr-only">Abrir menú</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingInvoice(invoice);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Editar comprobante</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(invoice.id)}
                            className="text-red-600 focus:text-red-600 focus:bg-red-50"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            <span className="font-semibold">
                              Eliminar comprobante
                            </span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center text-slate-500 text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(invoice.fecha)}
                    </div>
                    {invoice.type && (
                      <div className="flex items-center text-slate-500 text-sm">
                        <FileText className="h-4 w-4 mr-2" />
                        {invoice.type}
                      </div>
                    )}
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
