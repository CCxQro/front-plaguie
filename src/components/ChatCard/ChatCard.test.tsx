import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import { ChatCard } from './ChatCard';
import type { CardData } from '../cardData';

describe('ChatCard', () => {
  it('renders the stockStatus variant', () => {
    const data: CardData = { title: 'Estado', value: 'En Stock', rightLabel: 'Disponible', rightValue: 90 };
    render(<ChatCard data={data} variant="stockStatus" />);
    expect(screen.getByText('Estado')).toBeInTheDocument();
    expect(screen.getByText('En Stock')).toBeInTheDocument();
    expect(screen.getByText('90')).toBeInTheDocument();
  });

  it('renders the default variant with trend, value, description and messages', () => {
    const data: CardData = {
      title: 'Conversación',
      value: 'Activa',
      description: 'Últimos mensajes',
      trend: '+3',
      messages: [
        { sender: 'Ana', text: 'Hola', time: '10:00' },
        { sender: 'Luis', text: 'Qué tal' },
      ],
    };
    render(<ChatCard data={data} />);
    expect(screen.getByText('Conversación')).toBeInTheDocument();
    expect(screen.getByText('+3')).toBeInTheDocument();
    expect(screen.getByText('Activa')).toBeInTheDocument();
    expect(screen.getByText('Últimos mensajes')).toBeInTheDocument();
    expect(screen.getByText('Hola')).toBeInTheDocument();
    expect(screen.getByText('10:00')).toBeInTheDocument();
  });

  it('renders the alert variant without optional fields', () => {
    render(<ChatCard data={{ title: 'Alerta' }} variant="alert" />);
    expect(screen.getByText('Alerta')).toBeInTheDocument();
  });
});
