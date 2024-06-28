import './LandingPage.css';
import { useState } from 'react';
import UserMikvesList from './UserMikvesList';
import { Map } from './Map';
import { UserHeader } from './UserHeader';
import UserSearchForm from './UserSearchForm';

const LandingPage = () => {
    const [mikves, setMikves] = useState([]);

    return (
        <div className="landing-page">
            <UserHeader />
            <div className="user-main-content">
                <UserSearchForm /> 
                    <div className="map-and-list">
                        <Map />
                        <UserMikvesList mikves={mikves} />
                    </div>
            </div>
        </div>
    );
};

export { LandingPage };