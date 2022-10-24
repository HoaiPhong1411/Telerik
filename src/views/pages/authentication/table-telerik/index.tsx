import { Typography } from '@mui/material';
import useUserApi from 'hooks/useUserApi';
import React from 'react';
import TableTelerik from './components/TableTelerik';
import TBTelerik from './components/TBTelerik';
import TbTelerik from './TbTelerik';

const PageTelerik = () => {
    const [page, setPage] = React.useState<number>(0);
    const [size, setSize] = React.useState<number>(50);
    const { mUserList, dataUserList } = useUserApi({});
    React.useEffect(() => {
        mUserList.mutate({ page, size });
    }, []);

    // return dataUserList ? <TableTelerik /> : <TbTelerik dataList={dataUserList} page={page} size={size} />;
    return dataUserList ? <TableTelerik dataList={dataUserList} groupColumn="company.id" /> : <TBTelerik />;
};

export default PageTelerik;
