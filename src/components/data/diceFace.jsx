export const diceFaces = [
  // Face 1 (center dot)
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <rect
      x="5"
      y="5"
      width="90"
      height="90"
      rx="15"
      fill="white"
      stroke="black"
      strokeWidth="2"
    />
    <circle cx="50" cy="50" r="8" fill="black" />
  </svg>,
  // Face 2 (top-left, bottom-right)
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <rect
      x="5"
      y="5"
      width="90"
      height="90"
      rx="15"
      fill="white"
      stroke="black"
      strokeWidth="2"
    />
    <circle cx="25" cy="25" r="8" fill="black" />
    <circle cx="75" cy="75" r="8" fill="black" />
  </svg>,
  // Face 3 (top-left, center, bottom-right)
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <rect
      x="5"
      y="5"
      width="90"
      height="90"
      rx="15"
      fill="white"
      stroke="black"
      strokeWidth="2"
    />
    <circle cx="25" cy="25" r="8" fill="black" />
    <circle cx="50" cy="50" r="8" fill="black" />
    <circle cx="75" cy="75" r="8" fill="black" />
  </svg>,
  // Face 4 (four corners)
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <rect
      x="5"
      y="5"
      width="90"
      height="90"
      rx="15"
      fill="white"
      stroke="black"
      strokeWidth="2"
    />
    <circle cx="25" cy="25" r="8" fill="black" />
    <circle cx="25" cy="75" r="8" fill="black" />
    <circle cx="75" cy="25" r="8" fill="black" />
    <circle cx="75" cy="75" r="8" fill="black" />
  </svg>,
  // Face 5 (four corners + center)
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <rect
      x="5"
      y="5"
      width="90"
      height="90"
      rx="15"
      fill="white"
      stroke="black"
      strokeWidth="2"
    />
    <circle cx="25" cy="25" r="8" fill="black" />
    <circle cx="25" cy="75" r="8" fill="black" />
    <circle cx="50" cy="50" r="8" fill="black" />
    <circle cx="75" cy="25" r="8" fill="black" />
    <circle cx="75" cy="75" r="8" fill="black" />
  </svg>,
  // Face 6 (two rows of three)
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <rect
      x="5"
      y="5"
      width="90"
      height="90"
      rx="15"
      fill="white"
      stroke="black"
      strokeWidth="2"
    />
    <circle cx="25" cy="25" r="8" fill="black" />
    <circle cx="25" cy="50" r="8" fill="black" />
    <circle cx="25" cy="75" r="8" fill="black" />
    <circle cx="75" cy="25" r="8" fill="black" />
    <circle cx="75" cy="50" r="8" fill="black" />
    <circle cx="75" cy="75" r="8" fill="black" />
  </svg>,
];
