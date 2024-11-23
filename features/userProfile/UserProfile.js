import {Link} from "react-router-dom";

function UserProfile() {
    return ( <>
        <h1>
            This is user Page
        </h1>
    
        <Link to="/">
        <button>Home</button>
      </Link>
      <Link to="/timefield">
        <button>timefield</button>
      </Link>
        </>
     );
}

export default UserProfile;