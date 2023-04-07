import React from 'react';

import Header from '../components/Header';
import OptionsArea from '../components/OptionsArea';
import Feed from '../components/Feed';
import FollowingArea from '../components/FollowingArea';
import Footer from '../components/Footer';

import './Timeline.css'

function Timeline() {
    return (
        <div className="container">
            <Header />
            <OptionsArea />
            <main>
                <Feed />
            </main>
            <FollowingArea />
            <Footer />
        </div>
    )
}

export default Timeline;