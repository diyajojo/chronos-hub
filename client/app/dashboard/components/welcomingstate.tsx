'use client';

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { motion } from "framer-motion";
import StarBackground from "../../components/design/starbackground";
import { ShimmerButton } from "../../../components/magicui/shimmer-button";
import { BoxReveal } from "../../../components/magicui/box-reveal";

interface WelcomingStateProps {
  onComplete: () => void;
}

const welcomeSlides = [
  {
    title: "Welcome to ChronosHub",
    description: "Embark on an extraordinary journey through time. Document your adventures, connect with fellow time travelers, and explore the vast tapestry of history and future.",
    icon: "🌟"
  },
  {
    title: "Chronicle Your Journeys",
    description: "Create detailed logs of your time-traveling adventures. Share your experiences, photos, and survival rates with other travelers.",
    icon: "✍️"
  },
  {
    title: "Explore The Timeline",
    description: "Discover other travelers' journeys through our interactive time map. See where (and when) others have ventured.",
    icon: "🗺️"
  },
  {
    title: "Connect & Engage",
    description: "Follow other time travelers, react to their posts, and build your network across time and space.",
    icon: "🤝"
  }
];

export default function WelcomingState({ onComplete }: WelcomingStateProps) {
  return (
    <div className="relative min-h-screen">
      <StarBackground />
      <div className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen">
        <Carousel className="w-full max-w-xl">
          <CarouselContent>
            {welcomeSlides.map((slide, index) => (
              <CarouselItem key={index}>
                <Card className="bg-black/30 backdrop-blur-md border-blue-500/30">
                  <CardContent className="flex flex-col items-center p-6 min-h-[400px] justify-between">
                    <div className="flex flex-col items-center w-full">
                      {index === 0 ? (
                        <>
                          <BoxReveal boxColor="oklch(80.9% 0.105 251.813)" duration={0.5}>
                            <div className="text-4xl mb-4 mt-5">{slide.icon}</div>
                          </BoxReveal>
                          <BoxReveal boxColor="oklch(80.9% 0.105 251.813)" duration={0.5}>
                            <h2 className="text-3xl font-bold text-white mb-4 mt-5 text-center">
                              {slide.title}
                            </h2>
                          </BoxReveal>
                          <BoxReveal boxColor="oklch(80.9% 0.105 251.813)" duration={0.5}>
                            <p className="text-blue-200 text-center mt-8">
                              {slide.description}
                            </p>
                          </BoxReveal>
                        </>
                      ) : (
                        <>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl mb-4 mt-5"
                          >
                            {slide.icon}
                          </motion.div>
                          <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-3xl font-bold text-white mb-4 mt-5 text-center"
                          >
                            {slide.title}
                          </motion.h2>
                          <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-blue-200 text-center mt-8"
                          >
                            {slide.description}
                          </motion.p>
                        </>
                      )}
                    </div>
                    {index === welcomeSlides.length - 1 && (
                      <ShimmerButton
                        onClick={onComplete}
                        className="px-8 py-4 mt-6 rounded-lg text-white font-bold hover:shadow-glow transition-all"
                      >
                        Begin Your Journey →
                      </ShimmerButton>
                    )}
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}
