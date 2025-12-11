import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  CheckCircle2,
  ArrowRight,
  Clock,
  Zap,
  Smartphone,
  Shield,
  BarChart3,
  Camera,
  Bot,
  Database,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export default function LandingPage() {
  const { currentUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="bg-blue-600 p-1.5 rounded-lg mr-2">
                <Camera className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                FactuSnap
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#como-funciona"
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
              >
                Cómo funciona
              </a>
              <a
                href="#beneficios"
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
              >
                Beneficios
              </a>
              <a
                href="#testimonios"
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
              >
                Testimonios
              </a>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {currentUser ? (
                <Link
                  to="/dashboard"
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all font-medium shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 active:scale-95"
                >
                  Ir al Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/login"
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all font-medium shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 active:scale-95"
                  >
                    Empezar Gratis
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-600 hover:text-slate-900 p-2"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100">
            <div className="px-4 pt-2 pb-6 space-y-2">
              <a
                href="#como-funciona"
                className="block py-2 text-base font-medium text-slate-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cómo funciona
              </a>
              <a
                href="#beneficios"
                className="block py-2 text-base font-medium text-slate-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Beneficios
              </a>
              <a
                href="#testimonios"
                className="block py-2 text-base font-medium text-slate-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonios
              </a>
              <div className="pt-4 flex flex-col gap-3">
                {currentUser ? (
                  <Link
                    to="/dashboard"
                    className="w-full text-center bg-blue-600 text-white px-4 py-3 rounded-lg font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Ir al Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="w-full text-center text-slate-600 font-medium border border-slate-200 rounded-lg px-4 py-3"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Iniciar Sesión
                    </Link>
                    <Link
                      to="/login"
                      className="w-full text-center bg-blue-600 text-white px-4 py-3 rounded-lg font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Empezar Gratis
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-8 border border-blue-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Tus facturas, digitalizadas al instante
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
              Digitalizá tus facturas y recuperá{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                14 horas por semana
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              FactuSnap elimina la carga manual de comprobantes. Enviás la foto,
              la IA hace el trabajo, y vos recuperás horas de vida.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Link
                to={currentUser ? "/dashboard" : "/login"}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all hover:scale-105 shadow-xl shadow-blue-600/25 ring-offset-2 focus:ring-2 ring-blue-500"
              >
                {currentUser
                  ? "Ir al Dashboard"
                  : "Empezar gratis y ahorrar tiempo"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>

            <div className="text-sm font-medium text-slate-500 flex flex-wrap justify-center gap-x-8 gap-y-2">
              <span className="flex items-center">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> Sin
                tarjeta de crédito
              </span>
              <span className="flex items-center">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> Plan
                gratuito disponible
              </span>
              <span className="flex items-center">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />{" "}
                Configuración en 1 minuto
              </span>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-slate-50 to-slate-50"></div>
          <div className="absolute top-40 left-10 w-72 h-72 bg-blue-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>
      </section>

      {/* What is FactuSnap */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Qué es FactuSnap
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                FactuSnap es la herramienta que reemplaza el trabajo repetitivo
                y aburrido de cargar facturas. Antes lo hacías a mano.{" "}
                <strong className="text-slate-900">
                  Ahora lo hace la IA en segundos.
                </strong>
              </p>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Diseñada para personas que valoran su tiempo: emprendedores,
                freelancers, profesionales y cualquiera que quiera dejar de
                perder horas ordenando tickets.
              </p>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3 mb-2 font-semibold text-slate-900">
                  <Smartphone className="h-5 w-5 text-blue-600" />
                  Mandás la foto
                </div>
                <div className="flex items-center gap-3 mb-2 font-semibold text-slate-900">
                  <Bot className="h-5 w-5 text-indigo-600" />
                  La IA interpreta
                </div>
                <div className="flex items-center gap-3 font-semibold text-slate-900">
                  <Database className="h-5 w-5 text-purple-600" />
                  Se guarda en tu panel
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-3xl transform rotate-3 scale-105 opacity-50"></div>
              <div className="relative bg-slate-900 rounded-2xl shadow-2xl p-6 border border-slate-800 text-slate-300 font-mono text-sm leading-relaxed overflow-hidden">
                <div className="flex gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="space-y-2">
                  <p className="text-green-400">$ analyzing_image.jpg...</p>
                  <p>
                    Detected: <span className="text-blue-400">Factura A</span>
                  </p>
                  <p>
                    Date: <span className="text-yellow-400">10/12/2025</span>
                  </p>
                  <p>
                    Vendor:{" "}
                    <span className="text-yellow-400">Tech Store SRL</span>
                  </p>
                  <p>
                    Total: <span className="text-yellow-400">$15,450.00</span>
                  </p>
                  <p className="text-green-400">$ saving_to_database...</p>
                  <p className="text-green-400">$ done. (0.8s)</p>
                  <p className="animate-pulse">_</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Cómo te hace ganar tiempo
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Un flujo de trabajo diseñado para eliminar la fricción.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-200 via-indigo-200 to-blue-200 z-0"></div>

            <StepCard
              number="1"
              icon={<Camera className="h-6 w-6" />}
              title="Enviá la foto por Telegram"
              description="Sin apps nuevas, sin fricciones. Tu bot privado recibe la imagen en segundos."
            />
            <StepCard
              number="2"
              icon={<Bot className="h-6 w-6" />}
              title="La IA extrae los datos"
              description="Fecha, proveedor, número de factura y total identificados en menos de 5 segundos."
            />
            <StepCard
              number="3"
              icon={<BarChart3 className="h-6 w-6" />}
              title="Tu panel se actualiza solo"
              description="Ves tus gastos organizados y listos para exportar sin tocar una planilla."
            />
          </div>

          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-6 py-3 rounded-full font-bold text-lg shadow-sm">
              <Clock className="h-5 w-5" />
              Resultado: Hasta 14 horas semanales ahorradas
            </div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">
            El problema que elimina FactuSnap
          </h2>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-red-50 p-8 rounded-3xl border border-red-100 text-left">
              <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">😫</span> Antes
              </h3>
              <ul className="space-y-4 text-red-800">
                <li className="flex items-start gap-3">
                  <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <span>Buscar cada comprobante físico</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <span>Interpretar montos borrosos</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <span>Cargar datos manualmente en Excel</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>12 a 14 horas</strong> perdidas por semana
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 p-8 rounded-3xl border border-green-100 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Zap className="h-32 w-32 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">😎</span> Con FactuSnap
              </h3>
              <ul className="space-y-4 text-green-800">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span>Sacás una foto y te olvidás</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span>La IA interpreta todo perfecto</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span>Todo sincronizado en la nube</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>0 horas</strong> dedicadas a la carga
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="beneficios" className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Beneficios medibles</h2>
            <p className="text-slate-400 text-lg">
              Impacto real en tu día a día.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <BenefitCard
              icon={<Clock className="h-6 w-6 text-blue-400" />}
              title="+14 horas libres"
              description="Recuperá tiempo valioso cada semana para dedicarlo a hacer crecer tu negocio o descansar."
            />
            <BenefitCard
              icon={<Zap className="h-6 w-6 text-yellow-400" />}
              title="Menos tareas repetitivas"
              description="Poné el foco en lo importante y dejá que la automatización se encargue de lo aburrido."
            />
            <BenefitCard
              icon={<Shield className="h-6 w-6 text-green-400" />}
              title="Control sin esfuerzo"
              description="Mejor visibilidad de tus gastos sin tener que invertir tiempo en organizarlos."
            />
            <BenefitCard
              icon={<Smartphone className="h-6 w-6 text-purple-400" />}
              title="Desde tu celular"
              description="Carga comprobantes en segundos, estés donde estés, directamente desde Telegram."
            />
            <BenefitCard
              icon={<CheckCircle2 className="h-6 w-6 text-pink-400" />}
              title="Nada que configurar"
              description="No necesitás conocimientos técnicos. Entrás, conectás el bot y empezás a usarlo."
            />
            <BenefitCard
              icon={<Bot className="h-6 w-6 text-cyan-400" />}
              title="IA"
              description="Tecnología de punta interpretando tus imágenes con precisión profesional."
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonios" className="py-24 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Testimonios reales
            </h2>
            <p className="text-lg text-slate-600">
              Lo que dicen quienes ya recuperaron su tiempo.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="Pasé de dedicar medio día a la semana a ordenar facturas a olvidarme del tema. Me devolvió 14 horas."
              author="Daniela"
              role="Emprendedora"
            />
            <TestimonialCard
              quote="Honestamente pensé que no lo necesitaba. Ahora no lo dejaría nunca más."
              author="Pablo"
              role="Freelancer"
            />
            <TestimonialCard
              quote="Mi contabilidad se volvió automática. Una foto y listo. El panel es hermoso y simple."
              author="María"
              role="Diseñadora"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
            Recuperá 14 horas por semana empezando hoy
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Usá FactuSnap gratis y dejá que la IA haga tu trabajo repetitivo.
            Sin tarjeta, sin instalación, sin vueltas.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to={currentUser ? "/dashboard" : "/login"}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all hover:scale-105 shadow-xl"
            >
              {currentUser ? "Ir al Dashboard" : "Probar Gratis Ahora"}
            </Link>
            {!currentUser && (
              <Link
                to="/login"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-colors"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
          <div className="mt-8 flex justify-center gap-6 text-blue-200 text-sm font-medium">
            <div className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              100% Gratis
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Sin tarjeta
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center">
              <div className="bg-slate-200 p-1.5 rounded-lg mr-2">
                <Camera className="h-5 w-5 text-slate-600" />
              </div>
              <span className="font-bold text-slate-700">FactuSnap © 2025</span>
            </div>
            <div className="flex gap-8 text-slate-500 text-sm">
              <a href="#" className="hover:text-slate-900 transition-colors">
                Privacidad
              </a>
              <a href="#" className="hover:text-slate-900 transition-colors">
                Términos
              </a>
              <a href="#" className="hover:text-slate-900 transition-colors">
                Contacto
              </a>
            </div>
            <div className="text-slate-400 text-sm">
              Proyecto creado por{" "}
              <span className="font-medium text-slate-600">[Tu nombre]</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StepCard({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="relative p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow z-10 h-full">
      <div className="absolute -top-6 left-8 bg-blue-600 text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-600/20 border-4 border-slate-50">
        {number}
      </div>
      <div className="mt-8 mb-4">
        <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center text-blue-600">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}

function BenefitCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:bg-slate-800 transition-colors">
      <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}

function TestimonialCard({
  quote,
  author,
  role,
}: {
  quote: string;
  author: string;
  role: string;
}) {
  return (
    <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Zap key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
        ))}
      </div>
      <p className="text-slate-700 mb-6 italic text-lg">"{quote}"</p>
      <div>
        <div className="font-bold text-slate-900">{author}</div>
        <div className="text-slate-500 text-sm">{role}</div>
      </div>
    </div>
  );
}
