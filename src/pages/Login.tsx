import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../components/ui/card";
import { Navigate, Link } from "react-router-dom";
import { Camera, ArrowLeft, Shield, Zap, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const { signInWithGoogle, currentUser } = useAuth();

  if (currentUser) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen w-full flex relative overflow-hidden bg-slate-50">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-slate-50 to-slate-50 -z-10"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-300/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-300/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      {/* Left Side - Content/Testimonial (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative items-center justify-center text-white p-12 overflow-hidden">
        <div className="absolute inset-0 bg-slate-900">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>
        </div>

        <div className="relative z-10 max-w-lg">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl">
            <div className="flex gap-1 mb-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <Zap
                  key={i}
                  className="h-5 w-5 text-yellow-400 fill-yellow-400"
                />
              ))}
            </div>
            <p className="text-xl font-medium leading-relaxed mb-6">
              "FactuSnap me devolvió el tiempo que perdía organizando papeles.
              Es increíblemente rápido y preciso."
            </p>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center font-bold text-lg">
                D
              </div>
              <div>
                <div className="font-bold text-white">Daniela</div>
                <div className="text-slate-400 text-sm">Emprendedora</div>
              </div>
            </div>
          </div>

          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-3 text-slate-300">
              <CheckCircle2 className="h-5 w-5 text-blue-400" />
              <span>Automatización inteligente de facturas</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <CheckCircle2 className="h-5 w-5 text-blue-400" />
              <span>Reportes detallados en tiempo real</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <CheckCircle2 className="h-5 w-5 text-blue-400" />
              <span>Seguridad de nivel bancario</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="absolute top-8 left-8 lg:hidden">
          <Link
            to="/"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Volver
          </Link>
        </div>

        <div className="absolute top-8 left-8 hidden lg:block">
          <Link
            to="/"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Volver al inicio
          </Link>
        </div>

        <Card className="w-full max-w-md border-0 shadow-none bg-transparent sm:bg-white sm:border sm:border-slate-200 sm:shadow-xl sm:p-2">
          <CardHeader className="text-center space-y-6 pb-8">
            <div className="flex justify-center mb-2">
              <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-600/20">
                <Camera className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">
                Bienvenido de nuevo
              </CardTitle>
              <CardDescription className="text-lg">
                Iniciá sesión para gestionar tus facturas
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              onClick={signInWithGoogle}
              className="w-full h-12 text-base font-medium bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
              variant="outline"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.12c-.22-.66-.35-1.36-.35-2.12s.13-1.46.35-2.12V7.01H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.99l3.66-2.87z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.01l3.66 2.87c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continuar con Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-50 px-2 text-slate-500">
                  Seguro y rápido
                </span>
              </div>
            </div>

            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex gap-3 items-start">
              <Shield className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800 leading-relaxed">
                Tus datos están protegidos con encriptación de extremo a
                extremo. Solo vos tenés acceso a tu información.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center text-xs text-slate-500">
            Al continuar, aceptás nuestros Términos de Servicio y Política de
            Privacidad.
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
