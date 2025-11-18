import React from 'react';
import Navbar from './Navbar/Navbar';

const Header = () => {
    return (
        <div className="border-b border-base-300 bg-base-100/95 shadow-sm">
            <Navbar></Navbar>
        </div>
    );
};

export default Header;