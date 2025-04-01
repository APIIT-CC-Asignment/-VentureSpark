import React from 'react';
import Link from 'next/link';

interface MenuItemProps {
  linkurl: string;
  linktext: string;
  mobile?: boolean;
}

function MenuItem({ linkurl, linktext, mobile = false }: MenuItemProps) {
  return (
    <Link
      href={linkurl}
      className={`
        ${mobile ? 
          'block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50' : 
          'text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors'}
        relative group
      `}
    >
      {linktext}
      {!mobile && (
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
      )}
    </Link>
  );
}

export default MenuItem;