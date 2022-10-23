import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Grid, GridCellProps, GridColumn, GridItemChangeEvent, GridToolbar } from '@progress/kendo-react-grid';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { GridPDFExport } from '@progress/kendo-react-pdf';
import { ExcelExport } from '@progress/kendo-react-excel-export';
import { IntlProvider, load, LocalizationProvider, loadMessages, IntlService } from '@progress/kendo-react-intl';

import esMessages from '../es.json';

import { process } from '@progress/kendo-data-query';
import orders from '../orders.json';
import { deleteItem, getItems, updateItem } from './service';
import MyCommandCell from '../myCommandCell';
import { Product } from '../interfaces';

const editField: string = 'inEdit';

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

const TBTelerik = () => {
    const [dataState, setDataState] = React.useState<any>({
        skip: 0,
        take: 20,
        sort: [
            {
                field: 'orderDate',
                dir: 'desc'
            }
        ],
        group: [
            {
                field: 'customerID'
            }
        ]
    });
    const [dataResult, setDataResult] = React.useState(process(orders, dataState));

    const dataStateChange = (event: any) => {
        setDataResult(process(orders, event.dataState));
        setDataState(event.dataState);
    };

    const expandChange = (event: any) => {
        const isExpanded = event.dataItem.expanded === undefined ? event.dataItem.aggregates : event.dataItem.expanded;
        event.dataItem.expanded = !isExpanded;
        setDataResult({ ...dataResult });
    };

    const update = (dataItem: Product) => {
        dataItem.inEdit = false;
        const newData = updateItem(dataItem, orders);
        setDataResult(process(newData, dataState));
    };

    // Local state operations

    const cancel = (dataItem: Product) => {
        const originalItem = getItems(orders).find((p) => p.ProductID === dataItem.ProductID);
        if (originalItem) {
            const newData = orders.map((item) => (item?.details[0].productID === originalItem.ProductID ? originalItem : item));
            setDataResult(process(newData, dataState));
        }
    };

    const enterEdit = (dataItem: Product) => {
        console.log();

        function mapData(item: Product) {
            console.log(item.ProductID, dataItem.ProductID);

            return item.ProductID === dataItem.ProductID ? { ...item, inEdit: true } : item;
        }

        setDataResult(
            process(
                orders.map((item: Product) => mapData(item)),
                dataState
            )
        );
    };

    const itemChange = (event: GridItemChangeEvent) => {
        const newData = orders.map((item) =>
            item.orderID === event.dataItem.orderID ? { ...item, [event.field || '']: event.value, inEdit: true } : item
        );
        setDataResult(process(newData, dataState));
    };

    const CommandCell = (props: GridCellProps) => (
        <MyCommandCell {...props} edit={enterEdit} update={update} cancel={cancel} editField={editField} />
    );

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
                    buttonCount: 4,
                    pageSizes: true
                }}
                data={dataResult}
                {...dataState}
                onDataStateChange={dataStateChange}
                detail={DetailComponent}
                expandField="expanded"
                onExpandChange={expandChange}
                onItemChange={itemChange}
            >
                <GridColumn field="customerID" width="200px" />
                <GridColumn field="orderDate" filter="date" format="{0:D}" width="300px" />
                <GridColumn field="shipName" width="280px" />
                <GridColumn field="status" filter="numeric" width="200px" />
                <GridColumn cell={CommandCell} width="200px" />
            </Grid>
        </>
    );
};

export default TBTelerik;
