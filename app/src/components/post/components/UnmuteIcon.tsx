import React from "react";

const MuteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="16 2 900 900" {...props}>
    <path d="M150.26,444.36v91.79s0,38.94,41.72,50.06h91.78L422,721.69s62,37,87-29.78V444.36" />
    <path d="M150.27,457.59l-.59-91.78s-.24-38.94,41.4-50.33l91.79-.58L420.26,178.55s61.77-37.37,87.22,29.23l1.58,247.53" />
    <path
      fill="none"
      stroke="#fffeff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="50px"
      d="M656,250s212.31,190.06,0,411.64"
    />
    <path
      fill="none"
      stroke="#fffeff"
      strokeLinecap="round"
      strokeMiterlimit="10"
      strokeWidth="50px"
      d="M581.93,333s123.31,110.32,0,245.68"
    />
  </svg>
);

export default MuteIcon;
