import React from 'react';
import SeedlingIcon from '../SVGIcons/SeedlingIcon';
import AreaIcon from '../SVGIcons/AreaIcon';
import CalendarIcon from '../SVGIcons/CalendarIcon';

interface CardParcelaProps {
  nombre: string;
  tipoSiembra: string;
  hectareas: number;
  cosecha: Date;
  inspeccion: Date;
}

const CardParcela: React.FC<CardParcelaProps> = ({
  nombre,
  tipoSiembra,
  hectareas,
  cosecha,
  inspeccion,
}) => {
  const formatDate = (date: Date): string => {
    const months = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getInspeccionText = (date: Date): string => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Hace 1 día';
    return `Hace ${diffDays} días`;
  };

  return (
    <div className="box-border flex flex-col items-start pt-4 px-4 pb-0.5 gap-3 w-full max-w-sm bg-[#F0FDF4] border border-[#B9F8CF] rounded-[10px]">
      <div className="flex flex-row items-center gap-2 self-stretch">
        <div className="w-2 h-2 bg-[#00C950] rounded-full flex-none" />
        <span className="font-bold text-sm leading-5 text-[#0F172B]">
          {nombre}
        </span>
      </div>

      <div className="flex flex-col items-start gap-2 self-stretch">
        <div className="flex flex-row items-center gap-2 self-stretch">
          <SeedlingIcon />
          <span className="font-medium text-xs leading-4 text-[#45556C]">
            {tipoSiembra}
          </span>
        </div>

        <div className="flex flex-row items-center gap-2 self-stretch">
          <AreaIcon />
          <span className="font-medium text-xs leading-4 text-[#45556C]">
            {hectareas} hectáreas
          </span>
        </div>

        <div className="flex flex-row items-center gap-2 self-stretch">
          <CalendarIcon />
          <span className="font-medium text-xs leading-4 text-[#45556C]">
            Cosecha: {formatDate(cosecha)}
          </span>
        </div>
      </div>

      <div className="flex items-center self-stretch border-t border-[#E2E8F0] py-3">
        <span className="font-medium text-xs leading-4 text-[#62748E]">
          Última inspección: {getInspeccionText(inspeccion)}
        </span>
      </div>
    </div>
  );
};

export default CardParcela;
