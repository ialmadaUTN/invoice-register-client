import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card.tsx";
import { Send } from "lucide-react";
import React from "react";

export function TelegramOnboarding({ onComplete }: { onComplete: () => void }) {
  const { currentUser } = useAuth();
  const [telegramId, setTelegramId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!telegramId.trim()) return;
    if (!currentUser) return;

    setLoading(true);
    setError("");

    try {
      await setDoc(
        doc(db, "users", currentUser.uid),
        {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          telegramId: telegramId.trim(),
          createdAt: new Date(),
        },
        { merge: true }
      );

      onComplete();
    } catch (err) {
      console.error("Error saving Telegram username:", err);
      setError("Error al guardar. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Conecta tu Telegram</CardTitle>
          <CardDescription>
            Para que el bot pueda asociar tus facturas, necesitamos tu usuario
            de Telegram.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="telegramId" className="text-sm font-medium">
                Usuario de Telegram
              </label>
              <input
                id="telegramId"
                type="text"
                placeholder="Ej: @usuario"
                value={telegramId}
                onChange={(e) => setTelegramId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Guardando..." : "Guardar y Continuar"}
              {!loading && <Send className="ml-2 h-4 w-4" />}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
