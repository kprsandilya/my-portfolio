"use client";
import React, { useState, useRef } from 'react';
import { cn } from '../../lib/utils';
import {
  Github,
  Code,
  Dices,
  Lock,
  Globe,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';

// Extra content shown on the back of a card. When a card has details,
// clicking it flips the card over instead of opening a link.
export interface CardDetails {
  summary: string;
  bullets?: string[];
  tech?: string[];
  image?: string; // shown at the top of the back face
  visibility: 'public' | 'private';
  repoUrl?: string; // only linked when the repo is public
  liveUrl?: string;
}

export interface CardData {
  id: string;
  icon: React.ComponentType<any>;
  href?: string;
  title?: string;
  description?: string;
  details?: CardDetails;
}

export interface CodeHoverCardsProps {
  cards?: CardData[];
  className?: string;
  cardClassName?: string;
  maskRadius?: number;
  characterCount?: number;
  characterSet?: string;
  animationDuration?: number;
  borderRadius?: number;
  cardGap?: string;
  iconSize?: number;
  enableTouch?: boolean;
  columns?: 1 | 2 | 3 | 4;
  minHeight?: number;
  onCardClick?: (card: CardData) => void;
  onCardHover?: (card: CardData) => void;
  disabled?: boolean;
  showBorder?: boolean;
  theme?: 'normal' | 'dark'; // retained for fallback
}

const DEFAULT_CARDS: CardData[] = [
  { id: '1', icon: Github, title: 'GitHub', description: 'Code repository' },
  { id: '2', icon: Code, title: 'Code', description: 'Development tools' },
  { id: '3', icon: Dices, title: 'Games', description: 'Interactive projects' },
];

function VisibilityBadge({ visibility }: { visibility: CardDetails['visibility'] }) {
  const isPublic = visibility === 'public';
  const Icon = isPublic ? Globe : Lock;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        isPublic
          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
          : 'bg-slate-500/15 text-slate-700 dark:text-slate-300'
      )}
    >
      <Icon className="h-3 w-3" />
      {isPublic ? 'Public repo' : 'Private repo'}
    </span>
  );
}

// Links inside the back face must not flip the card.
const stop = (e: React.SyntheticEvent) => e.stopPropagation();

function CardBack({ card, active }: { card: CardData & { details: CardDetails }; active: boolean }) {
  const { details } = card;
  const IconComponent = card.icon;
  const linkClass =
    'inline-flex items-center gap-1 rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background transition-opacity hover:opacity-80';

  return (
    <div className="flex h-full flex-col">
      {details.image ? (
        <img
          src={details.image}
          alt={`Preview of the ${card.title} repository`}
          className="h-[28%] w-full shrink-0 object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex h-[28%] w-full shrink-0 items-center justify-center gap-3 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-950 text-white">
          <IconComponent size={36} />
          <span className="text-lg font-semibold">{card.title}</span>
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overscroll-contain p-4 text-left">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="mr-auto text-base font-semibold text-foreground">{card.title}</h3>
          <VisibilityBadge visibility={details.visibility} />
        </div>

        <p className="text-xs leading-relaxed text-muted-foreground">{details.summary}</p>

        {details.bullets && details.bullets.length > 0 && (
          <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-muted-foreground">
            {details.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        )}

        {details.tech && details.tech.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {details.tech.map((t) => (
              <span key={t} className="rounded-full border px-2 py-0.5 text-[11px] text-foreground/80">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Links stay pinned at the bottom so they're visible even when the
          text above has to scroll. */}
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-t px-4 py-3">
          {details.visibility === 'public' && details.repoUrl && (
            <a href={details.repoUrl} target="_blank" rel="noopener noreferrer" className={linkClass} tabIndex={active ? 0 : -1} onClick={stop} onKeyDown={stop}>
              <Github className="h-3.5 w-3.5" />
              View repository
            </a>
          )}
          {details.liveUrl && (
            <a href={details.liveUrl} target="_blank" rel="noopener noreferrer" className={linkClass} tabIndex={active ? 0 : -1} onClick={stop} onKeyDown={stop}>
              <ExternalLink className="h-3.5 w-3.5" />
              Live site
            </a>
          )}
          {details.visibility === 'private' && (
            <span className="text-xs text-muted-foreground">Code is private.</span>
          )}
          <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <RotateCcw className="h-3 w-3" />
            Click to flip back
          </span>
      </div>
    </div>
  );
}

// Length of each half of the flip animation.
const FLIP_HALF_MS = 250;

const CodeHoverCards: React.FC<CodeHoverCardsProps> = ({
  cards = DEFAULT_CARDS,
  className,
  cardClassName,
  maskRadius = 300,
  characterCount = 2000,
  characterSet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  animationDuration = 0.5,
  borderRadius = 26,
  cardGap = '1rem',
  iconSize = 48,
  enableTouch = true,
  columns = 3,
  minHeight = 399,
  onCardClick,
  onCardHover,
  disabled = false,
  showBorder = true,
}) => {
  const [mousePositions, setMousePositions] = useState<{ [key: string]: { x: number; y: number } }>({});
  const [randomTexts, setRandomTexts] = useState<{ [key: string]: string }>({});
  const [flipped, setFlipped] = useState<{ [key: string]: boolean }>({});
  // True while a card is turned edge-on, halfway through a flip.
  const [turning, setTurning] = useState<{ [key: string]: boolean }>({});
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const generateRandomString = (length: number): string => {
    return Array.from({ length }, () => characterSet[Math.floor(Math.random() * characterSet.length)]).join('');
  };

  const updatePointer = (cardId: string, clientX: number, clientY: number) => {
    const card = cardRefs.current[cardId];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    setMousePositions(prev => ({ ...prev, [cardId]: { x: clientX - rect.left, y: clientY - rect.top } }));
    setRandomTexts(prev => ({ ...prev, [cardId]: generateRandomString(characterCount) }));
  };

  const handleMouseMove = (e: React.MouseEvent, cardId: string) => {
    if (disabled || flipped[cardId]) return;
    updatePointer(cardId, e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent, cardId: string) => {
    if (disabled || !enableTouch || flipped[cardId]) return;
    const touch = e.touches[0];
    updatePointer(cardId, touch.clientX, touch.clientY);
  };

  const handleCardClick = (card: CardData) => {
    if (disabled) return;
    if (card.details) {
      // Two-step flip: turn the card edge-on, swap which side is shown, then
      // turn it back. At rest the card is always flat (never mirrored in 3D),
      // so the back's text scrolls and its links work like normal content.
      if (turning[card.id]) return;
      setTurning(prev => ({ ...prev, [card.id]: true }));
      setTimeout(() => {
        setFlipped(prev => ({ ...prev, [card.id]: !prev[card.id] }));
        setTurning(prev => ({ ...prev, [card.id]: false }));
      }, FLIP_HALF_MS);
    } else if (card.href) {
      window.open(card.href, '_blank');
    }
    onCardClick?.(card);
  };

  const handleCardHover = (card: CardData) => {
    if (disabled) return;
    onCardHover?.(card);
  };

  const getColumnClass = () => {
    const columnMap = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    };
    return columnMap[columns];
  };

  const faceClass = cn('absolute inset-0 overflow-hidden', showBorder && 'border');

  return (
    <div className={cn('w-full flex items-center justify-center px-0 py-4 bg-background text-foreground', className)}>
      <div className="container mx-auto">
        <div className={cn('grid', getColumnClass())} style={{ gap: cardGap }}>
          {cards.map((card) => {
            const IconComponent = card.icon;
            const position = mousePositions[card.id] || { x: 0, y: 0 };
            const randomText = randomTexts[card.id] || '';
            const isFlipped = !!flipped[card.id];
            const isTurning = !!turning[card.id];
            const radius = { borderRadius: borderRadius + 'px' };
            const mask =
              'radial-gradient(' + maskRadius + 'px circle at ' + position.x + 'px ' + position.y +
              'px, #000 20%, rgba(0, 0, 0, 0.25), transparent)';

            return (
              <div
                key={card.id}
                className={cn(
                  'group relative w-full [perspective:1400px]',
                  disabled && 'pointer-events-none opacity-50',
                  cardClassName
                )}
              >
                <div
                  ref={(el) => { cardRefs.current[card.id] = el; }}
                  role="button"
                  tabIndex={0}
                  aria-pressed={card.details ? isFlipped : undefined}
                  aria-label={card.details ? `${card.title}: ${isFlipped ? 'hide' : 'show'} details` : card.title}
                  className={cn(
                    'relative w-full cursor-pointer transition-transform ease-in-out',
                    !isFlipped && 'hover:scale-105'
                  )}
                  style={{
                    minHeight: minHeight + 'px',
                    aspectRatio: '1',
                    transform: isTurning ? 'rotateY(90deg)' : undefined,
                    transitionDuration: FLIP_HALF_MS + 'ms',
                  }}
                  onMouseMove={(e) => handleMouseMove(e, card.id)}
                  onTouchMove={enableTouch ? (e) => handleTouchMove(e, card.id) : undefined}
                  onClick={() => handleCardClick(card)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCardClick(card);
                    }
                  }}
                  onMouseEnter={() => handleCardHover(card)}
                >
                  {/* Front */}
                  {!isFlipped && (
                  <div
                    className={cn(faceClass, 'flex flex-col items-center justify-center p-6')}
                    style={radius}
                  >
                    {/* Icon */}
                    <div className="relative z-10 text-foreground">
                      <IconComponent
                        size={iconSize}
                        className="transition-transform duration-200 group-hover:scale-110"
                      />
                    </div>

                    {/* Character background, kept faint so the text stays readable */}
                    <div
                      className="absolute inset-0 font-mono text-sm leading-tight opacity-0 group-hover:opacity-20 transition-opacity duration-500 overflow-hidden break-all text-foreground pointer-events-none"
                      style={{
                        WebkitMaskImage: mask,
                        maskImage: mask,
                        transform: 'scale(1.025)',
                        transitionDuration: animationDuration + 's',
                      }}
                    >
                      {randomText}
                    </div>

                    {/* Card info */}
                    {(card.title || card.description) && (
                      <div className="relative z-10 mt-4 text-center">
                        {card.title && (
                          <h3 className="text-lg font-semibold text-foreground">{card.title}</h3>
                        )}
                        {card.description && (
                          <p className="text-sm text-muted-foreground">{card.description}</p>
                        )}
                        {card.details && (
                          <p className="mt-3 text-xs font-medium text-foreground/60">Click for details</p>
                        )}
                      </div>
                    )}
                  </div>
                  )}

                  {/* Back */}
                  {card.details && isFlipped && (
                    <div className={cn(faceClass, 'bg-card text-card-foreground')} style={radius}>
                      <CardBack card={card as CardData & { details: CardDetails }} active={!isTurning} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CodeHoverCards;
