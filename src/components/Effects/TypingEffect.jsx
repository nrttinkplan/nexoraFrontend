
import React, { useState, useEffect, useRef } from 'react';

const TypingEffect = ({
  word,
  typingSpeed = 150,
  deletingSpeed = 100,
  pauseDuration = 2000,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const charIndexRef = useRef(0);
  const [loopController, setLoopController] = useState(0);

  useEffect(() => {
    console.log(`Effect run. isDeleting: ${isDeleting}, charIndex: ${charIndexRef.current}, displayedText: "${displayedText}", loop: ${loopController}`);
    let typingTimeout;

    const handleTypingAnimation = () => {
      console.log(`HandleTyping. isDeleting: ${isDeleting}, charIndex: ${charIndexRef.current}`);
      if (!isDeleting) {
        if (charIndexRef.current < word.length) {
          const charToAdd = word.charAt(charIndexRef.current);
          console.log(`Typing char: "${charToAdd}" at index ${charIndexRef.current}`);
          setDisplayedText(prev => prev + charToAdd);
          charIndexRef.current += 1;
          typingTimeout = setTimeout(handleTypingAnimation, typingSpeed);
        } else {
          console.log("Finished typing, pausing before delete.");
          typingTimeout = setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        // Silme modu
        if (charIndexRef.current > 0) {
          console.log(`Deleting char. Current index before delete: ${charIndexRef.current}`);
          setDisplayedText(prev => prev.substring(0, prev.length - 1)); 
          charIndexRef.current -= 1;
          typingTimeout = setTimeout(handleTypingAnimation, deletingSpeed);
        } else {
          console.log("Finished deleting, pausing before restart.");
          typingTimeout = setTimeout(() => {
            setIsDeleting(false);
            // charIndexRef.current = 0; // Ensure it's 0 if there's any doubt
            console.log("Restarting loop, setting isDeleting to false.");
            setLoopController(prev => prev + 1); 
          }, pauseDuration / 2);
        }
      }
    };

    // Initial scheduling logic
    if (displayedText === '' && !isDeleting && charIndexRef.current === 0) {
        console.log("Scheduling initial type or loop restart.");
        typingTimeout = setTimeout(handleTypingAnimation, typingSpeed);
    } else {
        console.log("Scheduling continue animation.");
        typingTimeout = setTimeout(handleTypingAnimation, isDeleting ? deletingSpeed : typingSpeed);
    }

    return () => {
      console.log("Clearing timeout.");
      clearTimeout(typingTimeout);
    }

  }, [isDeleting, word, typingSpeed, deletingSpeed, pauseDuration, loopController]);

  return <span>{displayedText}</span>;
};

export default TypingEffect;