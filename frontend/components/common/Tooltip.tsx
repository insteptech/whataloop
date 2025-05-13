import React, { useEffect, useRef, useState } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

interface CustomTooltipProps {
  message?: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  message = '',
  className = '',
  position = 'top',
}) => {
  const textRef = useRef<HTMLDivElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const el = textRef.current;
    if (el) {
      const isOverflowing = el.scrollWidth > el.clientWidth;
      setIsTruncated(isOverflowing);
    }
  }, [message]);

  const textElement = (
    <div className={className} ref={textRef}>
      {message}
    </div>
  );

  if (!isTruncated) {
    return textElement;
  }

  return (
    <OverlayTrigger
      placement={position}
      overlay={<Tooltip id={`tooltip-${position}`}>{message}</Tooltip>}
    >
      {textElement}
    </OverlayTrigger>
  );
};

export default CustomTooltip;
