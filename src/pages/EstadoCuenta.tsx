
import React from 'react';
import { ArrowLeft, FileText, Calendar, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

/**
 * Página Estado de Cuenta
 * 
 * Permite consultar el estado de cuenta y movimientos del usuario.
 * Incluye historial de transacciones y balance actual.
 * 
 * Compatible con React + Astro
 */

const EstadoCuenta = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="hover:bg-blue-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Inicio
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Estado de Cuenta</h1>
              <p className="text-sm text-gray-600">Consulta tu estado de cuenta y movimientos</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200/50 p-8">
          <div className="text-center">
            <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Estado de Cuenta</h2>
            <p className="text-gray-600 mb-8">
              Consulta el estado de tu cuenta y revisa tus movimientos recientes.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="bg-blue-50 rounded-xl p-6">
                <User className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Información Personal</h3>
                <p className="text-sm text-gray-600">Datos actualizados de tu perfil</p>
              </div>
              
              <div className="bg-green-50 rounded-xl p-6">
                <Calendar className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Historial</h3>
                <p className="text-sm text-gray-600">Movimientos y transacciones</p>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-6">
                <FileText className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Documentos</h3>
                <p className="text-sm text-gray-600">Estados de cuenta anteriores</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EstadoCuenta;
