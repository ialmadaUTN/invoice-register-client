import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { ArrowLeft, Save, Settings as SettingsIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [telegramId, setTelegramId] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    async function fetchUserData() {
      if (!currentUser) return;

      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setTelegramId(data.telegramId || "");
          setCustomPrompt(data.customPrompt || "");
        }
      } catch (error) {
        console.error("Error fetching user settings:", error);
        setMessage({
          type: "error",
          text: "Error al cargar la configuración.",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setSaving(true);
    setMessage(null);

    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, {
        telegramId: telegramId.trim(),
        customPrompt: customPrompt.trim() || null, // Save as null if empty to match "undefined" behavior requested, or just empty string.
        // Request says "el cual por default es undefined, a menos que se cambie". Firestore doesn't like undefined, so null or missing field is better.
        // I will use null or delete the field if I want it to be "undefined-ish", but updateDoc with null is fine.
        // Actually, let's stick to updateDoc merging.
      });

      setMessage({
        type: "success",
        text: "Configuración guardada correctamente.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      setMessage({ type: "error", text: "Error al guardar la configuración." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Volver
        </Button>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <SettingsIcon className="h-5 w-5" />
          Configuración
        </h1>
      </header>

      <main className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Preferencias de Usuario</CardTitle>
            <CardDescription>
              Administra tu conexión con Telegram y personaliza el
              comportamiento del bot.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="telegramId"
                  className="text-sm font-medium text-slate-900"
                >
                  Usuario de Telegram
                </label>
                <p className="text-xs text-slate-500">
                  Necesario para identificar tus mensajes y facturas.
                </p>
                <input
                  id="telegramId"
                  type="text"
                  placeholder="@usuario"
                  value={telegramId}
                  onChange={(e) => setTelegramId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="customPrompt"
                  className="text-sm font-medium text-slate-900"
                >
                  Custom Prompt
                </label>
                <p className="text-xs text-slate-500">
                  Instrucciones adicionales para el análisis de tus facturas.
                  (Opcional)
                </p>
                <textarea
                  id="customPrompt"
                  placeholder="Ej: Si la factura es de combustible, categorízala siempre como 'Transporte'."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                />
              </div>

              {message && (
                <div
                  className={`p-3 rounded-md text-sm ${
                    message.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? "Guardando..." : "Guardar Cambios"}
                {!saving && <Save className="ml-2 h-4 w-4" />}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
