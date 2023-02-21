import React from 'react'
import 'primeicons/primeicons.css';
import "../styles/Navbar.css";
import Popover from '@mui/material/Popover';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExitToApp from '@mui/icons-material/ExitToApp';
import PersonIcon from '@mui/icons-material/Person';
import logoFarmaciasAhumada from '../components/img/logoFarmaciasAhumada.jpg'
import logoCuenta from '../components/img/logoCuenta.png'
import { useNavigate, } from 'react-router-dom';
import { Divider } from '@material-ui/core';


function Navbar() {
  const user = localStorage.getItem("user");

  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleLogOut = () => {
    localStorage.removeItem("user");
    navigate(`/`);
  };
  const handleHome = () => {
    navigate(`/`);
  };

  return (
    <>
      <nav>
        <div>
          <a href="/" onClick={() => navigate("/")}>
            <img src={logoFarmaciasAhumada} height={53} alt="logo"></img>
          </a>
        </div>

        {
          (user === null)
            ?
            null
            :
            <div className="iconoNavbar">

              <div onClick={handleClick}>
                <img src={logoCuenta} height={29} alt="iconocuenta"></img>
                <p className="miCuenta" to="/Home">Mi Cuenta</p>

                <Popover
                  id="simple-popover"
                  open={Boolean(anchorEl)}
                  anchorEl={anchorEl}
                  onClose={handleClick}
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
                      <ListItemButton onClick={handleHome}>
                        <ListItemIcon>
                          <PersonIcon />
                        </ListItemIcon>
                        <ListItemText primary="Mi cuenta" />
                      </ListItemButton>
                    </ListItem>
                    <Divider />
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
              </div>

              <ul className="navbar">
                {
                  (user === null)
                    ?
                    null
                    :
                    null
                }
              </ul>

            </div>
        }

      </nav>
    </>
  )
}

export default Navbar;
