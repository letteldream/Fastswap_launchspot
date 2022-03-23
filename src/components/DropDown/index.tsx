import React from "react";
import styled from "styled-components";

type Position = "top" | "top-right" | "bottom";

interface PositionProps {
  position?: Position;
}

interface DropdownProps extends PositionProps {
  target: React.ReactElement;
}

const getLeft = ({ position }: PositionProps) => {
  if (position === "top-right") {
    return "100%";
  }
  return "50%";
};

const getBottom = ({ position }: PositionProps) => {
  if (position === "top" || position === "top-right") {
    return "100%";
  }
  return "auto";
};

const DropdownContent = styled.div<{ position: Position }>`
  width: 250px;
  display: none;
  flex-direction: column;
  position: absolute;
  transform: translate(-50%, 0);
  left: ${getLeft};
  bottom: ${getBottom};
  padding: 5px;
  max-height: 500px;
  overflow-y: auto;
  z-index: 10;
  border-radius: 0px 0px 20px 20px;
  background-color: #2BA55D;
  // box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05)
`;

const Container = styled.div`
  width: 250px;
  border-radius: 20px;
  background-color: #2BA55D;
  text-align: center;
  position: relative;
  &:hover ${DropdownContent} {
    display: flex;
  }
  &:hover {
    border-radius: 20px 20px 0px 0px;
  }
`;

const Dropdown: React.FC<DropdownProps> = ({ target, position = "bottom", children }) => {
  return (
    <Container>
      {target}
      <DropdownContent position={position}>{children}</DropdownContent>
    </Container>
  );
};

Dropdown.defaultProps = {
  position: "bottom",
};

export default Dropdown;