import { Typography } from '@mui/material';
import useUserApi from 'hooks/useUserApi';
import React from 'react';
import TbTelerik from './TbTelerik';

const PageTelerik = () => {
    const [page, setPage] = React.useState<number>(0);
    const [size, setSize] = React.useState<number>(50);
    const { mUserList, dataUserList } = useUserApi({});
    React.useEffect(() => {
        mUserList.mutate({ page, size });
    }, []);

    return dataUserList ? <TbTelerik dataList={dataUserList} page={page} size={size} /> : <Typography>concac</Typography>;
    // return <Typography>concac</Typography>;
};

export default PageTelerik;
