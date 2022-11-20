import React from 'react';

function Error(props) {
  return (
    <div className='p-4 mt-4 text-sm text-center text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800 w-6/12 md:w-full'>
     <span className="sr-only">Error</span>
     <span className="font-medium">Error: </span>
     {props.error}
    </div>
  );
}

export default Error;