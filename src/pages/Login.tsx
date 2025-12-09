import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Navigate } from "react-router-dom";

export default function LoginPage() {
  const { signInWithGoogle, currentUser } = useAuth();

  if (currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Bienvenido</CardTitle>
          <p className="text-slate-500">Inicia sesión para ver tus facturas</p>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button onClick={signInWithGoogle} className="w-full">
            Iniciar sesión con Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
