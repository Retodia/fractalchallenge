import React from 'react';
import type { FractalData } from '../types';
import { UserIcon, AtomIcon, GridIcon, CogIcon } from './icons/Icons';

interface FractalDisplayProps {
  data: FractalData;
  currentPhase: number;
}

const DimensionCard: React.FC<{ title: string; dimension: number; currentPhase: number; icon: React.ReactNode; children: React.ReactNode }> = ({ title, dimension, currentPhase, icon, children }) => {
    const isCompleted = dimension < currentPhase;
    const isActive = dimension === currentPhase;

    const cardClasses = `
        border rounded-xl transition-all duration-500 bg-gray-800/60
        ${isActive ? 'border-indigo-500 shadow-lg shadow-indigo-500/20' : 'border-gray-700'}
    `;

    const iconBgClasses = `w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-500 ${isCompleted ? 'bg-indigo-500' : isActive ? 'bg-indigo-600' : 'bg-gray-600'}`;
    
    const titleClasses = `text-lg font-bold transition-colors duration-500 ${isCompleted ? 'text-indigo-300' : isActive ? 'text-white' : 'text-gray-300'}`;


    return (
        <div className={cardClasses}>
            <div className="p-4 border-b border-gray-700 flex items-center gap-3">
                <div className={iconBgClasses}>
                    {icon}
                </div>
                <h2 className={titleClasses}>{title}</h2>
            </div>
            <div className="p-4 md:p-6 text-sm text-gray-300 space-y-4">
                {children}
            </div>
        </div>
    );
};

const FractalDisplay: React.FC<FractalDisplayProps> = ({ data, currentPhase }) => {
  const { dimension1, dimension2, dimension3, dimension4 } = data;

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-900/50">
      <DimensionCard title="YO" dimension={1} currentPhase={currentPhase} icon={<UserIcon className="w-5 h-5 text-white"/>}>
        {!dimension1.proposito && !dimension1.nombre_simbolico && (!dimension1.valores || dimension1.valores.length === 0) ? <p className="text-gray-500 italic">Los datos de esta dimensión aparecerán aquí.</p> : (
            <>
                {dimension1.nombre_simbolico && <p><strong className="font-semibold text-indigo-400">Nombre Simbólico:</strong> {dimension1.nombre_simbolico}</p>}
                {dimension1.proposito && <p><strong className="font-semibold text-indigo-400">Propósito:</strong> {dimension1.proposito}</p>}
                {dimension1.valores && dimension1.valores.length > 0 && <div><strong className="font-semibold text-indigo-400">Valores:</strong><ul className="list-disc list-inside pl-2 mt-1 space-y-1">{dimension1.valores.map((v, i) => <li key={i}>{v}</li>)}</ul></div>}
                {dimension1.mantras && dimension1.mantras.length > 0 && <div><strong className="font-semibold text-indigo-400">Mantras:</strong><ul className="list-disc list-inside pl-2 mt-1 space-y-1">{dimension1.mantras.map((m, i) => <li key={i}>{m}</li>)}</ul></div>}
            </>
        )}
      </DimensionCard>
      
      <DimensionCard title="CUALIDADES Y ESTRUCTURA" dimension={2} currentPhase={currentPhase} icon={<AtomIcon className="w-5 h-5 text-white"/>}>
         {(!dimension2.cualidades || dimension2.cualidades.length === 0) && (!dimension2.herramientas || dimension2.herramientas.length === 0) ? <p className="text-gray-500 italic">Los datos de esta dimensión aparecerán aquí.</p> : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dimension2.cualidades && dimension2.cualidades.length > 0 && <div><strong className="font-semibold text-indigo-400">Cualidades:</strong><ul className="list-disc list-inside pl-2 mt-1 space-y-1">{dimension2.cualidades.map((c, i) => <li key={i}>{c}</li>)}</ul></div>}
                {dimension2.herramientas && dimension2.herramientas.length > 0 && <div><strong className="font-semibold text-indigo-400">Herramientas:</strong><ul className="list-disc list-inside pl-2 mt-1 space-y-1">{dimension2.herramientas.map((h, i) => <li key={i}>{h}</li>)}</ul></div>}
            </div>
         )}
      </DimensionCard>

      <DimensionCard title="LAS AREAS QUE MAS TE IMPORTAN" dimension={3} currentPhase={currentPhase} icon={<GridIcon className="w-5 h-5 text-white"/>}>
        {dimension3.length === 0 ? <p className="text-gray-500 italic">Los datos de esta dimensión aparecerán aquí.</p> : (
            <div className="space-y-3">
                {dimension3.map((area, i) => (
                    <div key={i}>
                        <h4 className="font-bold text-indigo-400">{area.nombre}</h4>
                        <div className="pl-4 border-l-2 border-gray-700 mt-1 space-y-2">
                        {area.sub_areas.map((sub, j) => (
                            <div key={j}>
                                <h5 className="font-semibold text-gray-300">{sub.nombre}</h5>
                                <p className="pl-4 text-gray-400">{sub.acciones.join(' - ')}</p>
                            </div>
                        ))}
                        </div>
                    </div>
                ))}
            </div>
        )}
      </DimensionCard>
      
      <DimensionCard title="COMO FUNCIONA TU MENTE" dimension={4} currentPhase={currentPhase} icon={<CogIcon className="w-5 h-5 text-white"/>}>
        {!dimension4.introduccion && (!dimension4.procesos || dimension4.procesos.length === 0) ? <p className="text-gray-500 italic">Los datos de esta dimensión aparecerán aquí.</p> : (
            <div className="space-y-4">
                {dimension4.introduccion && <p className="italic text-gray-400">{dimension4.introduccion}</p>}
                {dimension4.procesos && dimension4.procesos.map((p, i) => (
                    <div key={i}>
                        <h4 className="font-bold text-indigo-400">{i+1}. {p.nombre}</h4>
                        <p className="pl-4 border-l-2 border-gray-700 mt-1 text-gray-400">{p.descripcion}</p>
                    </div>
                ))}
            </div>
        )}
      </DimensionCard>
    </div>
  );
};

export default FractalDisplay;