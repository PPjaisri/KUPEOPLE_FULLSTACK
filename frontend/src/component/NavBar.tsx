import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../service/AuthService';
import { NavDropdown } from 'react-bootstrap';
import logoPic from '../Pages/image/kuppl2.png'
import searchBlog from '../Pages/image/createSearchSymbol.png'
import createBlog from '../Pages/image/createBlogSymbol.png'
import profilePic from '../Pages/image/Patrick.png'
import '../CSSsource/NavBar.css';
import ReadReport from '../Pages/ReadReport';

const Navigtion = () => {
  const [user, setUser] = useState<any>({});

  const logOut = () => {
    AuthService.logOutUser();
  };
  
  const fetchUser = () => {
    const userID = AuthService.getUserID();
    AuthService.fetchUser(userID)
      .then(obj => setUser(obj));
  };
  
  useEffect(() => {
    fetchUser()
  }, []);

  return(
      <nav className="navbar navbar-expand-lg navbar-dark navbar-color">
      <Link to={ `/Home` }>
      <div className="logoCSS">
        <img src={logoPic} alt="React is hell !!!" width = "220" height="46.2"/>
      </div>
      </Link>
      
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>

      { user.isAdmin ? <Link to="/ReportList"><button>Report List</button></Link> : <button>Notification</button> }

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav ml-auto">
          <div className="container">
          <li className="nav-item active">
            <Link to={ `/SearchThread` }>
            <div className="searchCSS">
              <img src={ searchBlog } alt="React is hell !!!" width = "52" height="50" title="Search"/>
            </div>
            </Link>
          </li>
          <li className="nav-item active px-2">
            
            <div className="searchCSS">
            <Link to={ `/CreateThread` }>
              <img src={ createBlog } alt="React is hell !!!" width = "57" height="57" title="Create Thread"/>
              </Link>
            </div>
          </li>
          

          <li className="nav-item dropdown active ml-1">
          <NavDropdown title={
          <img src={profilePic} alt="React is hell !!!" width = "52" height="50" className="rounded-circle z-depth-0" />} id="collasible-nav-dropdown">
              <NavDropdown.Item ><Link to={ `/Profile` }><a className="dropdown-item" >Profile</a></Link> </NavDropdown.Item>
              <NavDropdown.Item ><Link to={ `/Setting` }><a className="dropdown-item" >Setting</a></Link></NavDropdown.Item>
              <NavDropdown.Item><Link to={ `/AuthenLogout`}> <a className="dropdown-item" onClick={ logOut }>Log out</a></Link></NavDropdown.Item> 
          </NavDropdown>
          </li>
          </div>

        </ul>
      </div>
    </nav>
    
  );
};

export default Navigtion;
