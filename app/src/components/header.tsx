import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom';
import GitHubIcon from '@mui/icons-material/GitHub';

const pages = [
  {
    label: 'Home',
    path: '/',
  },
  {
    label: 'Demo',
    path: 'form',
  },
  {
    label: 'Parser',
    path: 'parser',
  },
];

const Header = () => {
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            React Form Configurable
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map(({ label, path }) => (
              <Link key={label} to={path} style={{ textDecoration: 'none' }}>
                <Button
                  sx={{
                    my: 2,
                    color: 'white',
                    display: 'block',
                  }}
                >
                  {label}
                </Button>
              </Link>
            ))}
          </Box>
          <Box>
            <Button
              component="a"
              variant="outlined"
              sx={{ color: 'white' }}
              href="https://github.com/adyfk/form-configurable/tree/master/docs"
            >
              Docs
            </Button>
            <IconButton
              component="a"
              sx={{ color: 'white' }}
              href="https://github.com/adyfk/form-configurable"
            >
              <GitHubIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
