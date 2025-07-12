import React from "react";

const MuteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 900 900" {...props}>
    <path d="M134.93,438.73v91.79s0,38.93,41.72,50.06h91.79L406.69,716.05s62,37,87-29.78V438.73" />
    <path d="M134.94,452l-.59-91.79s-.24-38.94,41.41-50.33l91.78-.58L404.93,172.91s61.77-37.36,87.23,29.23l1.57,247.54" />
    <line
      fill="none"
      stroke="#fffeff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="50px"
      x1="578.07"
      y1="379.17"
      x2="713.26"
      y2="509.56"
    />
    <line
      fill="none"
      stroke="#fffeff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="50px"
      x1="710.28"
      y1="376.22"
      x2="581.05"
      y2="512.51"
    />
  </svg>
);

export default MuteIcon;
