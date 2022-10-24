import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Grid, GridCellProps, GridColumn, GridItemChangeEvent, GridToolbar, GRID_COL_INDEX_ATTRIBUTE } from '@progress/kendo-react-grid';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { GridPDFExport } from '@progress/kendo-react-pdf';
import { ExcelExport } from '@progress/kendo-react-excel-export';
import { IntlProvider, load, LocalizationProvider, loadMessages, IntlService } from '@progress/kendo-react-intl';
import '@progress/kendo-theme-default/dist/all.css';

import esMessages from '../es.json';

import { process } from '@progress/kendo-data-query';
import orders from '../orders.json';
import { deleteItem, getItems, updateItem } from './service';
import MyCommandCell from '../myCommandCell';
import { Product } from '../interfaces';
import { IUser } from 'types/users';
import { useTableKeyboardNavigation } from '@progress/kendo-react-data-tools';

const DetailComponent = (props: any) => {
    loadMessages(esMessages, 'es-ES');

    const { dataItem } = props;
    return (
        <div>
            <section
                style={{
                    width: '200px',
                    float: 'left'
                }}
            >
                <p>
                    <strong>Street:</strong> {dataItem.shipAddress.street}
                </p>
                <p>
                    <strong>City:</strong> {dataItem.shipAddress.city}
                </p>
                <p>
                    <strong>Country:</strong> {dataItem.shipAddress.country}
                </p>
                <p>
                    <strong>Postal Code:</strong> {dataItem.shipAddress.postalCode}
                </p>
            </section>
            <Grid
                style={{
                    width: '500px'
                }}
                data={dataItem.details}
            />
        </div>
    );
};
interface item {
    color: string;
}

interface CustomCellProps extends GridCellProps {
    myProp: Array<item>;
}

interface Iprops {
    dataList: IUser[];
    groupColumn: string;
}

const TableTelerik = (props: Iprops) => {
    const { dataList, groupColumn } = props;

    const [dataState, setDataState] = React.useState<any>({
        skip: 0,
        take: 20,
        // sort: [
        //     {
        //         field: 'orderDate',
        //         dir: 'desc'
        //     }
        // ],
        group: [
            {
                field: groupColumn
            }
        ]
    });

    const [dataResult, setDataResult] = React.useState(process(dataList, dataState));

    const dataStateChange = (event: any) => {
        setDataResult(process(dataList, event.dataState));
        setDataState(event.dataState);
    };

    const expandChange = (event: any) => {
        const isExpanded = event.dataItem.expanded === undefined ? event.dataItem.aggregates : event.dataItem.expanded;
        event.dataItem.expanded = !isExpanded;
        setDataResult({ ...dataResult });
    };

    const CustomCell = (propsCell: CustomCellProps) => {
        const { field, dataItem, id, myProp, colSpan, ariaColumnIndex, isSelected, columnIndex } = propsCell;
        const value = dataItem[field || ''];
        const navigationAttributes = useTableKeyboardNavigation(id);
        console.log({ field, dataItem, id, myProp, colSpan, ariaColumnIndex, isSelected, columnIndex });
        function TitleStatus(status: number) {
            let title;
            switch (status) {
                case 1:
                    title = 'Success';
                    break;
                case 0:
                    title = 'Fail';
                    break;

                default:
                    break;
            }
            return title;
        }
        return (
            <td
                style={{ color: value ? myProp[0].color : myProp[1].color }}
                colSpan={colSpan}
                role="gridcell"
                aria-colindex={ariaColumnIndex}
                aria-selected={isSelected}
                {...{ [GRID_COL_INDEX_ATTRIBUTE]: columnIndex }}
                {...navigationAttributes}
            >
                {TitleStatus(value)}
            </td>
        );
    };

    const customData: Array<any> = [{ color: 'green' }, { color: 'red' }];
    const MyCustomCell = (propsCell: GridCellProps) => <CustomCell {...propsCell} myProp={customData} />;

    return (
        <>
            <Grid
                style={{
                    height: '700px'
                }}
                sortable
                filterable
                groupable
                reorderable
                pageable={{
                    // buttonCount: 4,
                    pageSizes: true
                }}
                data={dataResult}
                {...dataState}
                onDataStateChange={dataStateChange}
                // detail={DetailComponent}
                expandField="expanded"
                onExpandChange={expandChange}
            >
                <GridColumn field="company.id" title="Company Id" width="200px" />
                <GridColumn field="company.merchantId" title="Company Name" width="300px" />
                <GridColumn field="nickname" width="280px" />
                <GridColumn field="status" filter="numeric" width="200px" cell={MyCustomCell} />
            </Grid>
        </>
    );
};

export default TableTelerik;
