import React from 'react';

const Logo = () => {
  return (
    <div className='h-11 w-23'>
     {/* I'm having trouble showing the inner div classes below: */}
     <div className='bg-logo absolute top-0 right-0.3573/1 bottom-0.4911/1 left-0.1486/1 scale-x-0.81 skew-y-0.61 -skew-x-0.57 scale-y-0.81 translate-x-0 translate-y-0'></div>
     <div className='bg-logo absolute top-0 -right-0.3455/1 bottom-0.4911/1 left-0.8514/1 -scale-x-0.81 skew-y-0.61 skew-x-0.57 scale-y-0.81 translate-x-0 translate-y-0'></div>
    </div>
  );
}

export default Logo;