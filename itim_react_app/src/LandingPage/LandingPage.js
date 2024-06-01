import './LandingPage.css';
import { UserSearchForm } from './UserSearchForm';
import { UserMikvesList } from './UserMikvesList';
import { Map } from './Map';
import { UserHeader } from './UserHeader';

const LandingPage = () => {

    return (
        <div className="landing-page">
            <UserHeader />
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
