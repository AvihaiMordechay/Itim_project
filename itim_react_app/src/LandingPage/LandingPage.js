import './LandingPage.css';
import { useState } from 'react';
import { UserSearchForm } from './UserSearchForm';
import { UserMikvesList } from './UserMikvesList';
import { Map } from './Map';
import { UserHeader } from './UserHeader';

const LandingPage = () => {
    const [mikves, setMikves] = useState([]);

    return (
        <div className="landing-page">
            <UserHeader />
            <div className="user-main-content">
                <UserSearchForm setMikves={setMikves} />
                <div className="content">
                    <Map />
                    <UserMikvesList mikves={mikves} />
                </div>
            </div>
        </div>
    );
};

export { LandingPage };
