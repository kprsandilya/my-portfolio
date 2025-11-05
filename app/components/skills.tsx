import { useTheme } from "next-themes"
import { useState } from "react"
import { GradientText } from '@/components/ui/shadcn-io/gradient-text';
import { SkillLevels } from './skillLevels';
import SkillLevelDisplay from "./skillLevelsBadges"
import { ParallaxProvider } from 'react-scroll-parallax';
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const ECCENTRIC_CLIP_CLASS = "underneath-curve-clip";

interface CardSections {
  top: string | null;
  middle: string | null;
  bottom: string | null;
  rightTop: string | null;
  rightBottom: string | null;
}

// Cards for each carousel
const CAROUSEL_CARD_DATA: { title: string; description: string }[][] = [
  // Carousel 0
  [
    { title: "C0 Card 1", description: "C0 Card 1 description" },
    { title: "C0 Card 2", description: "C0 Card 2 description" },
    { title: "C0 Card 3", description: "C0 Card 3 description" },
    { title: "C0 Card 4", description: "C0 Card 4 description" },
    { title: "C0 Card 5", description: "C0 Card 5 description" },
    { title: "C0 Card 6", description: "C0 Card 6 description" },
  ],
  // Carousel 1
  [
    { title: "C1 Card 1", description: "C1 Card 1 description" },
    { title: "C1 Card 2", description: "C1 Card 2 description" },
    { title: "C1 Card 3", description: "C1 Card 3 description" },
    { title: "C1 Card 4", description: "C1 Card 4 description" },
    { title: "C1 Card 5", description: "C1 Card 5 description" },
    { title: "C1 Card 6", description: "C1 Card 6 description" },
  ],
  // Carousel 2
  [
    { title: "C2 Card 1", description: "C2 Card 1 description" },
    { title: "C2 Card 2", description: "C2 Card 2 description" },
    { title: "C2 Card 3", description: "C2 Card 3 description" },
    { title: "C2 Card 4", description: "C2 Card 4 description" },
    { title: "C2 Card 5", description: "C2 Card 5 description" },
    { title: "C2 Card 6", description: "C2 Card 6 description" },
  ],
];

// Sections content for each carousel
const CAROUSEL_CARD_CONTENT: CardSections[][] = [
  // Carousel 0
  [
    { top: "Top C0-1", middle: "Middle C0-1", bottom: "Bottom C0-1", rightTop: "RTop C0-1", rightBottom: "RBottom C0-1" },
    { top: "Top C0-2", middle: "Middle C0-2", bottom: "Bottom C0-2", rightTop: "RTop C0-2", rightBottom: "RBottom C0-2" },
    { top: "Top C0-3", middle: "Middle C0-3", bottom: "Bottom C0-3", rightTop: "RTop C0-3", rightBottom: "RBottom C0-3" },
    { top: "Top C0-4", middle: "Middle C0-4", bottom: "Bottom C0-4", rightTop: "RTop C0-4", rightBottom: "RBottom C0-4" },
    { top: "Top C0-5", middle: "Middle C0-5", bottom: "Bottom C0-5", rightTop: "RTop C0-5", rightBottom: "RBottom C0-5" },
    { top: "Top C0-6", middle: "Middle C0-6", bottom: "Bottom C0-6", rightTop: "RTop C0-6", rightBottom: "RBottom C0-6" },
  ],
  // Carousel 1
  [
    { top: "Top C1-1", middle: "Middle C1-1", bottom: "Bottom C1-1", rightTop: "RTop C1-1", rightBottom: "RBottom C1-1" },
    { top: "Top C1-2", middle: "Middle C1-2", bottom: "Bottom C1-2", rightTop: "RTop C1-2", rightBottom: "RBottom C1-2" },
    { top: "Top C1-3", middle: "Middle C1-3", bottom: "Bottom C1-3", rightTop: "RTop C1-3", rightBottom: "RBottom C1-3" },
    { top: "Top C1-4", middle: "Middle C1-4", bottom: "Bottom C1-4", rightTop: "RTop C1-4", rightBottom: "RBottom C1-4" },
    { top: "Top C1-5", middle: "Middle C1-5", bottom: "Bottom C1-5", rightTop: "RTop C1-5", rightBottom: "RBottom C1-5" },
    { top: "Top C1-6", middle: "Middle C1-6", bottom: "Bottom C1-6", rightTop: "RTop C1-6", rightBottom: "RBottom C1-6" },
  ],
  // Carousel 2
  [
    { top: "Top C2-1", middle: "Middle C2-1", bottom: "Bottom C2-1", rightTop: "RTop C2-1", rightBottom: "RBottom C2-1" },
    { top: "Top C2-2", middle: "Middle C2-2", bottom: "Bottom C2-2", rightTop: "RTop C2-2", rightBottom: "RBottom C2-2" },
    { top: "Top C2-3", middle: "Middle C2-3", bottom: "Bottom C2-3", rightTop: "RTop C2-3", rightBottom: "RBottom C2-3" },
    { top: "Top C2-4", middle: "Middle C2-4", bottom: "Bottom C2-4", rightTop: "RTop C2-4", rightBottom: "RBottom C2-4" },
    { top: "Top C2-5", middle: "Middle C2-5", bottom: "Bottom C2-5", rightTop: "RTop C2-5", rightBottom: "RBottom C2-5" },
    { top: "Top C2-6", middle: "Middle C2-6", bottom: "Bottom C2-6", rightTop: "RTop C2-6", rightBottom: "RBottom C2-6" },
  ],
];


interface CarouselSectionProps {
  carouselId: number;
  widthClass: string;
  cardBasis: string;
  selectedCard: string | null;
  pressedCard: string | null;
  handleCardClick: (carouselId: number, index: number) => void;
  handleMouseDown: (cardId: string) => void;
  handleMouseUp: () => void;
  cardData: { title: string; description: string }[];
  cardContent: CardSections[];
}

function CarouselSection({
  carouselId,
  widthClass,
  cardBasis,
  selectedCard,
  pressedCard,
  handleCardClick,
  handleMouseDown,
  handleMouseUp,
  cardData,
  cardContent,
}: CarouselSectionProps) {
  return (
    <div className={`${widthClass} h-full flex justify-end`}>
    <Carousel className="w-full h-full">
        <CarouselContent className="h-full w-full">
        {cardData.map(({ title, description }, index) => {
            const cardId = `${carouselId}-${index}`;
            const isSelected = selectedCard === cardId;
            const isPressed = pressedCard === cardId;

            return (
            <CarouselItem key={cardId} className={`${cardBasis} h-full`}>
                <div className="p-1 h-full">
                <Card
                    onClick={() => handleCardClick(carouselId, index)}
                    onMouseDown={() => handleMouseDown(cardId)}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className={`h-full transition-all duration-200 ease-in-out cursor-pointer 
                    ${isSelected ? "outline-4 outline-yellow-400 bg-yellow-100 text-black" : "outline outline-transparent bg-white/10 text-white"}
                    ${isPressed ? "scale-95" : "scale-100"}
                    `}
                >
                    <CardContent className="flex flex-col items-center justify-center h-full text-center">
                    <span className="text-2xl font-semibold mb-2">{title}</span>
                    <p className="text-sm opacity-80">{description}</p>
                    </CardContent>
                </Card>
                </div>
            </CarouselItem>
            );
        })}
        </CarouselContent>
      <CarouselPrevious />
    </Carousel>
    </div>
  );
}


export default function Awards() {
    const { theme, setTheme } = useTheme();

    const getBackgroundColor = () => {
        if (theme === "dark") return 'bg-[radial-gradient(circle_at_50%,_#FFD700_0%,_#1A001C_400px)]';
        if (theme === "surprise") return 'bg-[radial-gradient(circle_at_50%_500px,_#D69EBA_0%,_#BA5370_400px)]';
        return 'bg-[radial-gradient(circle_at_50%_500px,_#06beb6,_#006473_400px)]';
    };
        
    const [selectedCard, setSelectedCard] = useState<string | null>(null);
    const [pressedCard, setPressedCard] = useState<string | null>(null);

    const handleCardClick = (carouselId: number, index: number) => {
    const cardId = `${carouselId}-${index}`;
    setSelectedCard((prev) => (prev === cardId ? null : cardId));
    };
    const handleMouseDown = (cardId: string) => setPressedCard(cardId);
    const handleMouseUp = () => setPressedCard(null);

    const carousels = [
        { widthClass: "w-28/48", cardBasis: "lg:basis-1/3" },
        { widthClass: "w-36/48", cardBasis: "lg:basis-1/4" },
        { widthClass: "w-42/48", cardBasis: "lg:basis-1/5" },
    ];

    const selectedCarouselId = selectedCard ? Number(selectedCard.split("-")[0]) : null;
    const selectedCardIndex = selectedCard ? Number(selectedCard.split("-")[1]) : null;

    const sections: CardSections = 
        selectedCarouselId !== null && selectedCardIndex !== null
            ? CAROUSEL_CARD_CONTENT[selectedCarouselId][selectedCardIndex]
            : { top: null, middle: null, bottom: null, rightTop: null, rightBottom: null };

    return (
        <ParallaxProvider>
        <div className="w-full relative">
            <div className={`w-full ${getBackgroundColor()} shadow-2xl`}>
            <div className="relative z-10 pr-24 pb-24 w-full">
                <div className="grid grid-cols-5 lg:h-[720px] gap-4">
                {/* ✅ Left Column with generated carousels */}
                <div className="col-span-3 grid grid-rows-3 gap-4 justify-items-end pr-4">
                        {carousels.map((c, carouselId) => {
                        const cardData = CAROUSEL_CARD_DATA[carouselId];
                        const cardContent = CAROUSEL_CARD_CONTENT[carouselId];

                        return (
                            <CarouselSection
                            key={carouselId}
                            carouselId={carouselId}
                            widthClass={c.widthClass}
                            cardBasis={c.cardBasis}
                            selectedCard={selectedCard}
                            pressedCard={pressedCard}
                            handleCardClick={handleCardClick}
                            handleMouseDown={handleMouseDown}
                            handleMouseUp={handleMouseUp}
                            cardData={cardData}           // pass specific card array
                            cardContent={cardContent}     // pass specific content array
                            />
                        );
                        })}
                </div>

                {/* ✅ Right Column (unchanged) */}
                <div className="col-span-2 grid grid-cols-2 gap-4">
                    <div className="col-span-1 flex flex-col gap-4">
                        <div className="h-[10%] bg-red-500 text-white p-2 rounded-lg flex items-center justify-center text-xs">
                        {sections.top || "Top placeholder"}
                        </div>
                        <div className="h-[60%] bg-red-600 text-white p-2 rounded-lg flex items-center justify-center text-sm font-semibold">
                        {sections.middle || "Middle placeholder"}
                        </div>
                        <div className="h-[30%] bg-red-700 text-white p-2 rounded-lg flex items-center justify-center text-xs">
                        {sections.bottom || "Bottom placeholder"}
                        </div>
                    </div>

                    <div className="col-span-1 flex flex-col gap-4">
                        <div className="h-1/2 bg-yellow-400 text-black p-2 rounded-lg flex items-center justify-center text-sm font-semibold">
                        {sections.rightTop || "Right top placeholder"}
                        </div>
                        <div className="h-1/2 bg-yellow-500 text-black p-2 rounded-lg flex items-center justify-center text-sm font-semibold">
                        {sections.rightBottom || "Right bottom placeholder"}
                        </div>
                    </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
        </ParallaxProvider>
    );
}