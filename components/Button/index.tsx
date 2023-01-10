import React from 'react';

const Button = (buttonProps: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) => {
  let props = {
    ...buttonProps,
    className: (buttonProps.className === undefined) ? 'button' : `button ${buttonProps.className}`,
  };

  return (
    <button {...props}>
      {props.children}
    </button>
  );
};

export default Button;
