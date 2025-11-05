import React from 'react';
// Assuming @heroui/react is the desired component library for the base component
import { Card, CardFooter, Button, Image } from "@heroui/react"; 
import { SkillLevels } from './skillLevels'; 

// Define the type for the prop
type SkillLevel = typeof SkillLevels[keyof typeof SkillLevels];

/**
 * Renders a compact, colored badge using the Card component structure.
 */
const SkillLevelDisplay: React.FC<{ levelData: SkillLevel }> = ({ levelData }) => {
  
  // The color class is dynamically pulled from the levelData object
  const backgroundColorClass = levelData.color; 
  
  return (
    <Card isFooterBlurred className="border-none" radius="lg">
      <Image
        alt="Test"
        className="object-cover"
        height={200}
        src="../../public/profile.jpeg"
        width={200}
      />
      <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
        <p className="text-tiny text-white/80">Available soon.</p>
        <Button
          className="text-tiny text-white bg-black/20"
          color="default"
          radius="lg"
          size="sm"
          variant="flat"
        >
          Notify me
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SkillLevelDisplay;