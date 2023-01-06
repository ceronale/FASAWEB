import React from 'react'
import 'primeicons/primeicons.css';
import "../styles/Navbar.css";
import { NavLink } from "react-router-dom";
import Popover from '@mui/material/Popover';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExitToApp from '@mui/icons-material/ExitToApp';
import logoFarmaciasAhumada from '../components/img/logoFarmaciasAhumada.jpg'
import logoCuenta from '../components/img/logoCuenta.png'
import { useNavigate, } from 'react-router-dom';


function Navbar() {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogOut = () => {
    localStorage.removeItem("user");
    navigate(`/`);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  return (
    <>
      <nav>
        <div>
          <img src={logoFarmaciasAhumada} height={53} alt="logo"></img>
        </div>
        <div className="iconoNavbar">

          <div onClick={handleClick}>
            <img src={logoCuenta} height={29} alt="iconocuenta"></img>
            <p className="miCuenta" to="/Home">Mi Cuenta</p>
          </div>

          <ul className="navbar">
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <List
                sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                aria-label="contacts"
              >
                <ListItem disablePadding>
                  <ListItemButton onClick={handleLogOut}>
                    <ListItemIcon>
                      <ExitToApp />
                    </ListItemIcon>
                    <ListItemText primary="Log out" />
                  </ListItemButton>
                </ListItem>
              </List>
            </Popover>
          </ul>
        </div>
      </nav>
    </>
  )
}

export default Navbar;
