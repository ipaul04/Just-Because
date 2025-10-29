import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface BackgroundSlideshowProps {
  images: string[];
}

const ANIMATION_DURATION = 0.8; // Seconds for one slide animation
const MOVE_INTERVAL = 1.5; // Time between moves in seconds
const CARD_GAP = 10; // Gap between cards in pixels

interface Card {
  id: number;
  image: string;
  position: { row: number; col: number };
  key: string; // Unique key for Framer Motion's AnimatePresence
}

export default function BackgroundSlideshow({ images }: BackgroundSlideshowProps) {
  const controls = useAnimation();
  const [cardData, setCardData] = useState<Card[]>([]);
  const imageIndexRef = useRef(0);
  const nextCardId = useRef(0);
  const [gridRows, setGridRows] = useState(0);
  const [gridCols, setGridCols] = useState(0);
  const [cardDimension, setCardDimension] = useState(0);

  const calculateGridDimensions = useCallback(() => {
    const minCardDimension = 150; // Minimum size for a card
    const maxCardDimension = 250; // Maximum size for a card

    const availableWidth = window.innerWidth;
    const availableHeight = window.innerHeight;

    let calculatedCardDimension = minCardDimension;
    let calculatedGridCols = Math.floor(availableWidth / (calculatedCardDimension + CARD_GAP));
    let calculatedGridRows = Math.floor(availableHeight / (calculatedCardDimension + CARD_GAP));

    // Try to increase card dimension if there's extra space
    if (calculatedGridCols > 0 && calculatedGridRows > 0) {
      const potentialCardDimensionX = Math.floor((availableWidth / calculatedGridCols) - CARD_GAP);
      const potentialCardDimensionY = Math.floor((availableHeight / calculatedGridRows) - CARD_GAP);
      calculatedCardDimension = Math.min(maxCardDimension, Math.max(minCardDimension, Math.min(potentialCardDimensionX, potentialCardDimensionY)));
    }

    // Recalculate rows and cols with the (potentially) new card dimension
    calculatedGridCols = Math.floor(availableWidth / (calculatedCardDimension + CARD_GAP));
    calculatedGridRows = Math.floor(availableHeight / (calculatedCardDimension + CARD_GAP));

    // Ensure at least one row and column
    if (calculatedGridCols === 0) calculatedGridCols = 1;
    if (calculatedGridRows === 0) calculatedGridRows = 1;

    setCardDimension(calculatedCardDimension);
    setGridCols(calculatedGridCols);
    setGridRows(calculatedGridRows);

    return { calculatedGridRows, calculatedGridCols, calculatedCardDimension };
  }, []);

  useEffect(() => {
    const { calculatedGridRows, calculatedGridCols, calculatedCardDimension } = calculateGridDimensions();

    const initialCards: Card[] = Array.from({ length: calculatedGridRows * calculatedGridCols }, (_, i) => ({
      id: nextCardId.current++,
      image: images[imageIndexRef.current++ % images.length],
      position: { row: Math.floor(i / calculatedGridCols), col: i % calculatedGridCols },
      key: `card-${nextCardId.current - 1}`,
    }));
    setCardData(initialCards);

    const animateGrid = async () => {
      while (true) {
        await new Promise(resolve => setTimeout(resolve, MOVE_INTERVAL * 1000));

        const isRow = Math.random() > 0.5;
        const indexToAnimate = isRow ? Math.floor(Math.random() * calculatedGridRows) : Math.floor(Math.random() * calculatedGridCols);
        const direction = Math.random() > 0.5 ? 1 : -1; // 1 for forward (right/down), -1 for backward (left/up)

        setCardData(prevCards => {
          const newCards = [...prevCards];
          const affectedCards = newCards.filter(card => 
            isRow ? card.position.row === indexToAnimate : card.position.col === indexToAnimate
          );

          // Sort cards to ensure consistent movement (e.g., for a b c -> c a b)
          affectedCards.sort((a, b) => 
            isRow ? a.position.col - b.position.col : a.position.row - b.position.row
          );

          const movedCard = direction === 1 ? affectedCards[affectedCards.length - 1] : affectedCards[0];

          affectedCards.forEach(card => {
            if (card.id === movedCard.id) {
              // This card will move to the other end of the line
              if (isRow) {
                card.position.col = direction === 1 ? 0 : calculatedGridCols - 1;
              } else {
                card.position.row = direction === 1 ? 0 : calculatedGridRows - 1;
              }
            } else {
              // Other cards shift their positions
              if (isRow) {
                card.position.col = (card.position.col + direction + calculatedGridCols) % calculatedGridCols;
              } else {
                card.position.row = (card.position.row + direction + calculatedGridRows) % calculatedGridRows;
              }
            }
            // Update image for the card that moved to the 'new' position
            if (card.id === movedCard.id) {
                card.image = images[imageIndexRef.current++ % images.length];
            }
          });

          return newCards;
        });
      }
    };

    animateGrid();
  }, [images, controls, calculateGridDimensions]);

  useEffect(() => {
    window.addEventListener('resize', calculateGridDimensions);
    return () => window.removeEventListener('resize', calculateGridDimensions);
  }, [calculateGridDimensions]);

  if (gridRows === 0 || gridCols === 0 || cardDimension === 0) {
    return null; // Don't render until dimensions are calculated
  }

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-gray-900 flex items-center justify-center">
      <div
        className="relative grid"
        style={{
          gridTemplateColumns: `repeat(${gridCols}, ${cardDimension}px)`,
          gridTemplateRows: `repeat(${gridRows}, ${cardDimension}px)`,
          width: gridCols * cardDimension + (gridCols - 1) * CARD_GAP,
          height: gridRows * cardDimension + (gridRows - 1) * CARD_GAP,
          gap: CARD_GAP,
        }}
      >
        {cardData.map((card) => (
          <motion.div
            key={card.key}
            layout
            transition={{ duration: ANIMATION_DURATION, ease: 'easeInOut' }}
            className="relative bg-white rounded-lg shadow-lg flex items-center justify-center p-2 overflow-hidden"
            style={{
              gridColumn: card.position.col + 1,
              gridRow: card.position.row + 1,
            }}
          >
            <img src={card.image} alt="Slideshow Card" className="w-full h-full object-cover rounded-md" />
          </motion.div>
        ))}
      </div>
      <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
    </div>
  );
}