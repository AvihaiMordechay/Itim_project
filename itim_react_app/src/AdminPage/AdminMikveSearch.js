import "./AdminMikveSearch.css";
import { useState } from "react";
import { ImSearch } from "react-icons/im";

const AdminMikveSearch = ({ allMikves, setPresentationMikves, setVisibleCount, numOfRows }) => {
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
        setVisibleCount(numOfRows);
        setPresentationMikves(filteredMikves);
    };

    const handleClearSearch = () => {
        setVisibleCount(numOfRows);
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
    placeholder="הקלד..."
    style={{
        borderRadius: '20px',
        height: '20px'
    }}
    onChange={(e) => setSearchInput(e.target.value)}
/>
            
            <div className="admin-search-type">
            <select
                id="mikve-search-type"
                value={searchType}
                style={{
                    height: '26px',
                    borderRadius: '20px',
                    border: 'solid',
                    marginRight: '10px',
                }}
                onChange={(e) => setSearchType(e.target.value)}
            >
                <option value="name">חיפוש לפי שם</option>
                <option value="city">חיפוש לפי עיר</option>
                <option value="address">חיפוש לפי כתובת</option>
                <option value="id">חיפוש לפי ID</option>
            </select>
            </div>
            <button
    type="button"
    id="mikve-button-search"
    className="mikve-button"
    onClick={handleSearchMikves}
>
    <ImSearch />
</button>
<button
    type="button"
    id="mikve-button-clear"
    className="mikve-button"
    onClick={handleClearSearch}
>
    נקה
</button>

        </div>
    );
};

export { AdminMikveSearch };
