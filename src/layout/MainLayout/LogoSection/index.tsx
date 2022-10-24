import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { Link, Typography } from '@mui/material';

// project imports
import { DASHBOARD_PATH } from 'config';
import logo from 'assets/images/logo-header.svg';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => (
    <Link component={RouterLink} to={DASHBOARD_PATH}>
        {/* <Logo /> */}
        <img width={120} height={30} src={logo} style={{ transform: 'translateY(4px)' }} />
    </Link>
);

export default LogoSection;
