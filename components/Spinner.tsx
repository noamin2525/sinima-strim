
import React from 'react';

const Spinner = ({ small = false }: { small?: boolean }) => (
  <div className="flex justify-center items-center h-full w-full">
    <div className={`animate-spin rounded-full border-purple-500 ${small ? 'h-8 w-8 border-4' : 'h-16 w-16 border-t-4 border-b-4'}`}></div>
  </div>
);

export default Spinner;
