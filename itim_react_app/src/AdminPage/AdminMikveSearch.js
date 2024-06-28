import "./AdminMikveSearch.css";
import { useState } from "react";

const AdminMikveSearch = ({ allMikves, setPresentationMikves }) => {
    const [searchInput, setSearchInput] = useState("");
    const [searchType, setSearchType] = useState("name");

    const handleSearchMikves = () => {
        let filteredMikves = [];
        switch (searchType) {
            case "name":
                filteredMikves = allMikves.filter(mikve =>
                    mikve.name.includes(searchInput)
                );
                break;
            case "address":
                filteredMikves = allMikves.filter(mikve =>
                    mikve.address.includes(searchInput)
                );
                break;
            case "city":
                filteredMikves = allMikves.filter(mikve =>
                    mikve.city.includes(searchInput)
                );
                break;
            case "id":
                filteredMikves = allMikves.filter(mikve =>
                    mikve.id.includes(searchInput)
                );
                break;
            default:
                filteredMikves = allMikves;
        }
        setPresentationMikves(filteredMikves);
    };

    const handleClearSearch = () => {
        setSearchInput("");
        setPresentationMikves(allMikves);
    };

    return (
        <div className="admin-mikve-search">
            <input
                type="text"
                id="mikve-input-search"
                name="input-search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
            />
            <select
                id="mikve-search-type"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
            >
                <option value="name">חיפוש לפי שם</option>
                <option value="city">חיפוש לפי עיר</option>
                <option value="address">חיפוש לפי כתובת</option>
                <option value="id">חיפוש לפי id</option>
            </select>
            <button
                type="button"
                id="mikve-button-search"
                onClick={handleSearchMikves}
            >
                חפש
            </button>
            <button
                type="button"
                id="mikve-button-clear"
                onClick={handleClearSearch}
            >
                נקה
            </button>
        </div>
    );
};

export { AdminMikveSearch };
