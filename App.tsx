import { useState, useEffect } from 'react';
import { Button } from './components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { Navigation } from './components/Navigation';
import { ChatBot } from './components/ChatBot';
import { AdminLogin } from './components/AdminLogin';
import { AdminPanel } from './components/AdminPanel';
import { HiddenAdminAccess } from './components/HiddenAdminAccess';
import { Brain, Users, Heart, Eye, Zap, MessageCircle, Shield, BookOpen, User, Settings } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home'); 
  const [user, setUser] = useState(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing sessions
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      setAdminToken(token);
    }
    
    // Check for user session
    const checkUserSession = async () => {
      try {
        setLoading(false);
      } catch (error) {
        console.error('Session check error:', error);
        setLoading(false);
      }
    };
    
    checkUserSession();
  }, []);

  const handleAdminLogin = (token: string) => {
    setAdminToken(token);
    setCurrentScreen('admin-panel');
  };

  const handleHiddenAdminAccess = (token: string) => {
    setAdminToken(token);
    setCurrentScreen('admin-panel');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('admin_token');
    setAdminToken(null);
    setCurrentScreen('home');
  };

  const handleUserLogin = (userData) => {
    setUser(userData);
    setCurrentScreen('dashboard');
  };

  const handleUserLogout = () => {
    setUser(null);
    setCurrentScreen('home');
  };

  // Admin screens
  if (currentScreen === 'admin-login') {
    return <AdminLogin onLogin={handleAdminLogin} />;
  }

  if (currentScreen === 'admin-panel') {
    return (
      <AdminPanel 
        onLogout={handleAdminLogout}
        onViewTest={() => setCurrentScreen('home')}
      />
    );
  }

  // User authentication screen
  if (currentScreen === 'auth') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-blue-50">
        <Navigation />
        <div className="pt-24 pb-16">
          <div className="max-w-md mx-auto px-4">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentScreen('home')}
              className="mb-6 hover:bg-white/50"
            >
              ← Zurück zur Startseite
            </Button>

            <Card className="bg-white/90 backdrop-blur-sm border-green-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-center text-2xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Anmeldung erforderlich
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-gray-600">
                  Die Benutzerauthentifizierung wird derzeit implementiert.
                </p>
                <Button 
                  onClick={() => {
                    const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' };
                    handleUserLogin(mockUser);
                  }}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                >
                  Demo-Zugang (Test)
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Simple dashboard
  if (currentScreen === 'dashboard' && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-blue-50">
        <Navigation />
        <div className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold">Willkommen, {user.name}!</h1>
                <p className="text-gray-600 mt-1">Ihr persönliches Neurodiversitäts-Dashboard</p>
              </div>
              <Button variant="outline" onClick={handleUserLogout}>
                Abmelden
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Brain className="w-12 h-12 mb-4 text-blue-600" />
                  <h3 className="text-lg font-semibold mb-2">RAADS-R Test</h3>
                  <p className="text-gray-600 mb-4">
                    Umfassendes Autismus-Screening für Erwachsene
                  </p>
                  <Button 
                    onClick={() => setCurrentScreen('test-raads-r')}
                    className="w-full"
                  >
                    Test starten
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Eye className="w-12 h-12 mb-4 text-purple-600" />
                  <h3 className="text-lg font-semibold mb-2">CAT-Q Test</h3>
                  <p className="text-gray-600 mb-4">
                    Erfassung von Masking-Verhalten
                  </p>
                  <Button 
                    onClick={() => setCurrentScreen('test-cat-q')}
                    className="w-full"
                  >
                    Test starten
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Zap className="w-12 h-12 mb-4 text-orange-600" />
                  <h3 className="text-lg font-semibold mb-2">ASRS Test</h3>
                  <p className="text-gray-600 mb-4">
                    ADHS-Screening für Erwachsene
                  </p>
                  <Button 
                    onClick={() => setCurrentScreen('test-asrs')}
                    className="w-full"
                  >
                    Test starten
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <ChatBot />
      </div>
    );
  }

  // Simple test screen
  if (currentScreen.startsWith('test-')) {
    const testType = currentScreen.replace('test-', '');
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-blue-50">
        <Navigation />
        <div className="pt-24 pb-16">
          <div className="max-w-3xl mx-auto px-4">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentScreen('dashboard')}
              className="mb-6 hover:bg-white/50"
            >
              ← Zurück zum Dashboard
            </Button>

            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl mb-2">{testType.toUpperCase()} Test</CardTitle>
                <p className="text-gray-600">Test wird geladen...</p>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-800 mb-3">Test-System wird implementiert</h3>
                  <p className="text-blue-700">
                    Das vollständige Test-System wird derzeit entwickelt und 
                    wird bald verfügbar sein.
                  </p>
                </div>
                <Button onClick={() => setCurrentScreen('dashboard')}>
                  Zurück zum Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <ChatBot />
      </div>
    );
  }

  // Main home screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-blue-50">
      <HiddenAdminAccess onAdminAccess={handleHiddenAdminAccess} />
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Neurodiversität verstehen und entdecken
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Wissenschaftlich fundierte Selbstbewertungstools zur Erkennung und Analyse 
              neurodiverser Eigenschaften. Entdecken Sie Ihre individuellen Stärken und Besonderheiten.
            </p>
            <Button 
              onClick={() => setCurrentScreen('auth')} 
              size="lg"
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <User className="w-5 h-5 mr-2" />
              Tests starten
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Was Sie erwartet</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6 bg-white/80 backdrop-blur-sm border-green-200 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Brain className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <h3 className="text-xl font-semibold mb-3">Multiple Tests</h3>
                <p className="text-gray-600">
                  RAADS-R, CAT-Q, ASRS, AQ und weitere validierte Screening-Tools 
                  zur umfassenden Selbsteinschätzung
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6 bg-white/80 backdrop-blur-sm border-blue-200 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h3 className="text-xl font-semibold mb-3">LYNA - AI Assistentin</h3>
                <p className="text-gray-600">
                  Persönliche KI-Begleitung durch die Tests mit Unterstützung 
                  bei Fragen und Interpretationen
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6 bg-white/80 backdrop-blur-sm border-cyan-200 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Zap className="w-12 h-12 mx-auto mb-4 text-cyan-600" />
                <h3 className="text-xl font-semibold mb-3">Dynamische Synchronisation</h3>
                <p className="text-gray-600">
                  Intelligente Antwort-Verknüpfung zwischen Tests für 
                  konsistente und zeiteffiziente Durchführung
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Neurodiversity Information */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Neurodiversitäts-Spektren</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
              <CardContent className="pt-0">
                <Users className="w-8 h-8 mb-3 text-green-600" />
                <h3 className="font-semibold mb-2">Autismus-Spektrum (ASS)</h3>
                <p className="text-sm text-gray-600">
                  Besonderheiten in sozialer Kommunikation, sensorischer Verarbeitung 
                  und wiederkehrenden Verhaltensmustern
                </p>
              </CardContent>
            </Card>
            
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
              <CardContent className="pt-0">
                <Zap className="w-8 h-8 mb-3 text-blue-600" />
                <h3 className="font-semibold mb-2">ADHS</h3>
                <p className="text-sm text-gray-600">
                  Aufmerksamkeitsregulation, Hyperaktivität und 
                  impulsive Verhaltensweisen
                </p>
              </CardContent>
            </Card>
            
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
              <CardContent className="pt-0">
                <Eye className="w-8 h-8 mb-3 text-purple-600" />
                <h3 className="font-semibold mb-2">Masking</h3>
                <p className="text-sm text-gray-600">
                  Strategien zur Anpassung und Tarnung neurodiverser 
                  Eigenschaften in sozialen Situationen
                </p>
              </CardContent>
            </Card>
            
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-l-4 border-l-cyan-500 hover:shadow-lg transition-shadow">
              <CardContent className="pt-0">
                <Heart className="w-8 h-8 mb-3 text-cyan-600" />
                <h3 className="font-semibold mb-2">AuDHD</h3>
                <p className="text-sm text-gray-600">
                  Kombination von autistischen und ADHS-Eigenschaften 
                  mit einzigartigen Herausforderungen
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* LYNA Introduction */}
      <section className="py-16 bg-gradient-to-r from-yellow-50 to-amber-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-full mb-6">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-6">Lernen Sie LYNA kennen</h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            LYNA ist Ihre persönliche KI-Assistentin, die Sie durch alle Tests begleitet. 
            Sie steht Ihnen mit Erklärungen, Unterstützung bei schwierigen Fragen und 
            der Interpretation Ihrer Ergebnisse zur Seite.
          </p>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto border border-yellow-200">
            <p className="text-gray-600 italic">
              "Hallo! Ich bin LYNA und helfe Ihnen dabei, die Tests durchzuführen und 
              Ihre Ergebnisse zu verstehen. Bei Fragen können Sie mich jederzeit über 
              die gelbe Sprechblase unten rechts erreichen."
            </p>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-800">
                <Shield className="w-6 h-6 mr-2" />
                Wichtiger Haftungsausschluss
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-orange-700 space-y-3">
                <p>
                  <strong>Diese Tests dienen ausschließlich der Selbstreflexion und Bildung.</strong>
                </p>
                <p>
                  Sie stellen keine medizinische Diagnose dar und ersetzen nicht die 
                  Beurteilung durch qualifizierte Fachkräfte. Bei Fragen zu Ihrer 
                  Gesundheit oder dem Verdacht auf neurodivergente Eigenschaften 
                  wenden Sie sich bitte an:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Ihren Hausarzt oder Hausärztin</li>
                  <li>Spezialisierte Beratungsstellen</li>
                  <li>Autismus- oder ADHS-Beratungszentren</li>
                  <li>Psychologische oder psychiatrische Fachpraxen</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white/50 backdrop-blur-sm border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Neurodiversitäts-Test</h3>
              <p className="text-sm text-gray-600">
                Wissenschaftlich fundierte Selbstbewertungstools zur Erkennung 
                und Analyse neurodiverser Eigenschaften.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Tests</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>RAADS-R (Autismus-Screening)</li>
                <li>CAT-Q (Masking-Verhalten)</li>
                <li>ASRS (ADHS-Screening)</li>
                <li>AQ (Autismus-Quotient)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Rechtliches</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>
                  <button className="hover:text-gray-800 transition-colors">
                    Datenschutz
                  </button>
                </li>
                <li>
                  <button className="hover:text-gray-800 transition-colors">
                    Nutzungsbedingungen
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setCurrentScreen('admin-login')}
                    className="hover:text-gray-800 transition-colors flex items-center gap-1"
                  >
                    <Settings className="w-3 h-3" />
                    Administration
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2024 Embrace Neurodiversity. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </footer>

      <ChatBot />
    </div>
  );
}