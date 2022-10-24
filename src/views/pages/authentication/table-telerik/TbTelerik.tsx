import * as React from 'react';
import {
    Grid,
    GridCellProps,
    GridColumn as Column,
    GridDataStateChangeEvent,
    GridExpandChangeEvent,
    GridItemChangeEvent,
    GridPageChangeEvent
} from '@progress/kendo-react-grid';
import '@progress/kendo-theme-default/dist/all.css';
import MyCommandCell from './myCommandCell';
import { getItems, updateItem, deleteItem } from './services';
import { AggregateDescriptor, DataResult, process, State } from '@progress/kendo-data-query';
import { setExpandedState, setGroupIds } from '@progress/kendo-react-data-tools';
import useUserApi from 'hooks/useUserApi';
import { IUser } from 'types/users';
import _ from 'lodash';

const editField: string = 'inEdit';

const initialDataState: State = {
    take: 50,
    skip: 0,
    group: [{ field: 'company.id' }]
};

const aggregates: AggregateDescriptor[] = [
    { field: 'UnitsInStock', aggregate: 'sum' },
    { field: 'UnitPrice', aggregate: 'average' }
];

const processWithGroups = (data: IUser[], dataState: State) => {
    const groups = dataState.group;
    if (groups) {
        groups.map((group) => {
            group.aggregates = aggregates;
            return group;
        });
    }
    dataState.group = groups;
    const newDataState = process(data, dataState);

    setGroupIds({ data: newDataState.data, group: dataState.group });

    return newDataState;
};

const TbTelerik = ({ dataList, page, size }: { dataList: IUser[]; page: number; size: number }) => {
    const [data, setData] = React.useState<IUser[]>(dataList);
    const [dataState, setDataState] = React.useState<State>(initialDataState);
    const [resultState, setResultState] = React.useState<DataResult>(processWithGroups(dataList, initialDataState));
    const [dataEdit, setDataEdit] = React.useState<any>({});
    const [id, setId] = React.useState<number>();
    const [collapsedState, setCollapsedState] = React.useState<string[]>([]);
    const { mUpdateUser, mUserList } = useUserApi({ id });
    // React.useEffect(() => {
    //     if (dataList) {
    //         const dt = _.map(dataList, (item) => {
    //             item.inEdit = false;
    //             return item;
    //         });
    //         setData(dataList);
    //         // setDataState({ ...dataState, take: dataList.length });
    //     }
    // }, []);

    // modify the data in the store, db etc
    // const remove = (dataItem: IUser) => {
    //     const newData = deleteItem(dataItem, dataList);
    //     setResultState(processWithGroups(newData, dataState));
    // };

    // const update = (dataItem: IUser) => {
    //     dataItem.inEdit = false;
    //     mUpdateUser.mutate(dataEdit);
    //     const newData = updateItem(dataItem, dataList);
    //     setResultState(processWithGroups(newData, dataState));
    // };

    // Local state operations
    // const discard = () => {
    //     const newData = [...data];
    //     newData.splice(0, 1);
    //     setResultState(processWithGroups(newData, dataState));
    // };

    // const cancel = (dataItem: IUser) => {
    //     const originalItem = getItems(dataList).find((p) => p.id === dataItem.id);
    //     if (originalItem) {
    //         const newData = data.map((item) => (item.id === originalItem.id ? originalItem : item));
    //         setResultState(processWithGroups(newData, dataState));
    //     }
    //     mUserList.mutate({ page, size });
    // };

    // const enterEdit = (dataItem: IUser) => {
    //     setId(dataItem.id);
    //     setResultState(
    //         processWithGroups(
    //             data.map((item) => (item.id === dataItem.id ? { ...item, inEdit: true } : item)),
    //             initialDataState
    //         )
    //     );
    // };

    // const itemChange = (event: GridItemChangeEvent) => {
    //     const newData = data.map((item) =>
    //         item.id === event.dataItem.id ? { ...item, [event.field || '']: event.value, inEdit: true } : item
    //     );
    //     event.field && setDataEdit({ ...dataEdit, [event.field]: event.value });
    //     setData(newData);
    //     setResultState(processWithGroups(newData, dataState));
    // };

    // const CommandCell = (props: GridCellProps) => (
    //     <MyCommandCell
    //         {...props}
    //         edit={enterEdit}
    //         remove={remove}
    //         discard={discard}
    //         update={update}
    //         cancel={cancel}
    //         editField={editField}
    //     />
    // );

    const onDataStateChange = React.useCallback((event: GridDataStateChangeEvent) => {
        const newDataState = processWithGroups(dataList, event.dataState);
        // function mapData(item: any) {
        //     console.log(item.field === dataState);
        //     return item;
        // }
        // _.map(event.dataState.group, mapData);

        setDataState(event.dataState);
        setResultState(newDataState);
    }, []);

    const onExpandChange = React.useCallback(
        (event: GridExpandChangeEvent) => {
            const item = event.dataItem;

            if (item.groupId) {
                const collapsedIds = event.dataItem.expanded
                    ? [...collapsedState, item.groupId]
                    : collapsedState.filter((groupId) => groupId !== item.groupId);
                setCollapsedState(collapsedIds);
            }
        },
        [collapsedState]
    );

    const newData = setExpandedState({
        data: resultState.data,
        collapsedIds: collapsedState
    });
    const pageChange = (event: GridPageChangeEvent) => {
        console.log(event);
    };

    return (
        <>
            <Grid
                style={{ height: '820px', padding: 10 }}
                pageable={{ pageSizes: true }}
                resizable
                reorderable
                groupable
                data={newData}
                // onItemChange={itemChange}
                // editField={editField}
                onDataStateChange={onDataStateChange}
                {...dataState}
                onExpandChange={onExpandChange}
                expandField="expanded"
                filterable
                onPageChange={pageChange}
                sortable
                // total={dataList.length / (dataState.take || 10)}
            >
                <Column field="company.id" title="company" width="200px" editable={false} />
                <Column field="company.merchantId" title="company name" width="200px" />
                <Column field="id" title="Id" width="50px" editable={false} />
                <Column field="username" title="user name" width="200px" editable={false} />
                <Column field="nickname" title="nick name" width="200px" />
                <Column field="city" title="city" width="200px" />
                <Column field="password" title="password" width="200px" />
                <Column field="image" title="image" width="200px" />

                {/* <Column cell={CommandCell} width="200px" /> */}
            </Grid>
        </>
    );
};
export default TbTelerik;
