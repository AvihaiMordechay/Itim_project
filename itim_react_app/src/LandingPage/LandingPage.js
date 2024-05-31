import './LandingPage.css';
import { UserSearchForm } from './UserSearchForm';
import { UserMikvesList } from './UserMikvesList';
import { Map } from './Map';
import React from 'react';

const LandingPage = () => {

    return (
        <div className="landing-page">
            <div className="header">
                <div className="header-text">חיפוש מקוואות נשים</div>
                {/* <img src="itimlogo.png" className="logo" /> */}
            </div>
            <div className="main-content">
                <UserSearchForm />
                <div className="content">
                    <Map />
                    <UserMikvesList />
                </div>
            </div>
        </div>
    );
};

export { LandingPage };
