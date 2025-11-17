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

        setCardData(prevCards => {
          const newCards = [...prevCards];

          // Animate all columns simultaneously
          for (let col = 0; col < calculatedGridCols; col++) {
            const colCards = newCards.filter(card => card.position.col === col);

            // Sort cards by row to ensure consistent movement
            colCards.sort((a, b) => a.position.row - b.position.row);

            // Odd numbered columns (1st, 3rd, 5th... = indices 0, 2, 4...):
            //   - Top div disappears and reappears at bottom
            //   - All other divs shift up
            // Even numbered columns (2nd, 4th, 6th... = indices 1, 3, 5...):
            //   - Bottom div disappears and reappears at top
            //   - All other divs shift down
            const isOddColumn = col % 2 === 0; // Odd visual column (1st, 3rd, 5th...)

            if (isOddColumn) {
              // Odd columns: top disappears, reappears at bottom, others shift up
              const topCard = colCards[0]; // Top card

              colCards.forEach(card => {
                if (card.id === topCard.id) {
                  // Top card moves to bottom
                  card.position.row = calculatedGridRows - 1;
                  card.image = images[imageIndexRef.current++ % images.length];
                } else {
                  // All other cards shift up (row decreases)
                  card.position.row = card.position.row - 1;
                }
              });
            } else {
              // Even columns: bottom disappears, reappears at top, others shift down
              const bottomCard = colCards[colCards.length - 1]; // Bottom card

              colCards.forEach(card => {
                if (card.id === bottomCard.id) {
                  // Bottom card moves to top
                  card.position.row = 0;
                  card.image = images[imageIndexRef.current++ % images.length];
                } else {
                  // All other cards shift down (row increases)
                  card.position.row = card.position.row + 1;
                }
              });
            }
          }

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