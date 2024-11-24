import React from 'react';
import Header from './Header';

function History() {
    return (
        <>
        <Header />
        <div className="flex flex-wrap justify-center items-center flex-col bg-softBlue min-h-screen">
            <div className="p-4 flex flex-col items-center">
                <h1>History page</h1>
            </div>
        </div>
        </>
    );
}

export default History;
