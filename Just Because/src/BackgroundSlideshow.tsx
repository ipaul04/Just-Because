import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface BackgroundSlideshowProps {
  images: string[];
}

const CARD_COUNT = 5; // Number of cards to display
const CARD_HEIGHT = 300; // Approximate height of each card in pixels
const ANIMATION_DURATION = 20; // Seconds for one card to travel from top to bottom

export default function BackgroundSlideshow({ images }: BackgroundSlideshowProps) {
  const controls = useRef(Array.from({ length: CARD_COUNT }, () => useAnimation()));
  const [cardData, setCardData] = useState<Array<{ id: number; image: string }>>([]);
  const imageIndexRef = useRef(0);

  useEffect(() => {
    // Initialize card data
    const initialCardData = Array.from({ length: CARD_COUNT }, (_, i) => ({
      id: i,
      image: images[imageIndexRef.current++ % images.length],
    }));
    setCardData(initialCardData);

    // Start animations
    initialCardData.forEach((_, i) => {
      startCardAnimation(i, i * (ANIMATION_DURATION / CARD_COUNT)); // Stagger initial animations
    });
  }, [images]);

  const startCardAnimation = async (cardIndex: number, delay: number) => {
    const cardControls = controls.current[cardIndex];
    await cardControls.start({
      y: -CARD_HEIGHT, // Start slightly above the screen
      opacity: 0,
    });

    while (true) {
      // Assign new image
      setCardData((prevData) =>
        prevData.map((card, i) =>
          i === cardIndex ? { ...card, image: images[imageIndexRef.current++ % images.length] } : card
        )
      );

      await cardControls.start({
        y: window.innerHeight + CARD_HEIGHT, // Move to bottom of screen
        opacity: 1,
        transition: { duration: ANIMATION_DURATION, ease: 'linear', delay: delay },
      });

      // Reset position to top and loop
      await cardControls.start({
        y: -CARD_HEIGHT,
        opacity: 0,
        transition: { duration: 0 }, // Instant reset
      });
      delay = 0; // No delay after the first loop
    }
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-gray-900">
      {cardData.map((card, index) => (
        <motion.div
          key={card.id}
          className="absolute w-64 h-48 bg-white rounded-lg shadow-lg flex items-center justify-center p-4"
          style={{
            left: `${(index / CARD_COUNT) * 100}%`, // Distribute cards horizontally
            top: `${-CARD_HEIGHT}px`, // Initial position above screen
            x: `-50%`, // Center horizontally
          }}
          animate={controls.current[index]}
        >
          <img src={card.image} alt="Slideshow Card" className="w-full h-full object-cover rounded-md" />
        </motion.div>
      ))}
      <div className="absolute inset-0 bg-black opacity-50 z-10"></div> {/* Overlay for readability */}
    </div>
  );
}