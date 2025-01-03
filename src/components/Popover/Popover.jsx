import { FloatingPortal, arrow, offset, shift, useFloating } from '@floating-ui/react';
import { useId, useRef, useState } from 'react';
import PropTypes from "prop-types";
import { motion, AnimatePresence } from 'framer-motion';

export default function Popover({
  children,
  renderPopover,
  className,
  as: Element = 'div',
  initialOpen,
  placement,
}) {
  const [open, setOpen] = useState(initialOpen || false);
  const arrowRef = useRef(null);
  const { x, y, refs, strategy, middlewareData } = useFloating({
    middleware: [offset(6), shift(), arrow({ element: arrowRef })],
    placement: placement || 'bottom-end',
  });
  const id = useId();

  const showPopover = () => {
    setOpen(true);
  };

  const hidePopover = () => {
    setOpen(false);
  };

  return (
    <Element
      className={className}
      ref={refs.setReference}
      onMouseEnter={showPopover}
      onMouseLeave={hidePopover}
    >
      {children}
      <FloatingPortal id={id}>
        <AnimatePresence>
          {open && (
            <motion.div
              ref={refs.setFloating}
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                width: 'max-content',
                transformOrigin: `${middlewareData.arrow?.x}px top`,
                zIndex: 99,
              }}
              initial={{ opacity: 0, transform: 'scale(0)' }}
              animate={{ opacity: 1, transform: 'scale(1)' }}
              exit={{ opacity: 0, transform: 'scale(0)' }}
              transition={{ duration: 0.15 }}
            >
              <span
                ref={arrowRef}
                className="absolute z-10 translate-y-[-95%] border-[11px] border-x-transparent border-b-white border-t-transparent"
                style={{
                  left: middlewareData.arrow?.x,
                  top: middlewareData.arrow?.y,
                }}
              />
              {renderPopover}
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </Element>
  );
}

Popover.propTypes = {
  children: PropTypes.node.isRequired,
  renderPopover: PropTypes.node.isRequired, 
  className: PropTypes.string, 
  as: PropTypes.elementType,
  initialOpen: PropTypes.bool, 
  placement: PropTypes.oneOf([
    'top', 'top-start', 'top-end',
    'bottom', 'bottom-start', 'bottom-end',
    'left', 'left-start', 'left-end',
    'right', 'right-start', 'right-end'
  ]),
};