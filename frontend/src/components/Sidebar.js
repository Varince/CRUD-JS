import React from 'react'; 
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaUsers } from 'react-icons/fa';
import '../styles/Sidebar.css';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <ul>
                <li>
                    <Link to="/admin">
                        <FaTachometerAlt style={{ marginRight: '10px', fontSize: '18px' }} /> DASHBOARD
                    </Link>
                </li>
                <li>
                    <Link to="/admin">
                        <FaUsers style={{ marginRight: '10px', fontSize: '18px' }} /> UTILISATEURS
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
