import * as React from 'react';

const ButtonAction = (props: any) => {
    const { dataItem, add, update, discard, cancel, remove, edit, rowType } = props;
    const { inEdit } = dataItem;
    const isNewItem = dataItem.id === undefined;
    return inEdit ? (
        <td className="k-command-cell">
            <button
                type="button"
                className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base k-grid-save-command"
                onClick={() => (isNewItem ? add(dataItem) : update(dataItem))}
            >
                {isNewItem ? 'Add' : 'Update'}
            </button>
            <button
                type="button"
                className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base k-grid-cancel-command"
                onClick={() => (isNewItem ? discard(dataItem) : cancel(dataItem))}
            >
                {isNewItem ? 'Discard' : 'Cancel'}
            </button>
        </td>
    ) : (
        <td className="k-command-cell">
            <button
                type="button"
                className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary k-grid-edit-command"
                onClick={() => edit(dataItem)}
            >
                Edit
            </button>
            <button
                type="button"
                className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base k-grid-remove-command"
                onClick={() => remove(dataItem)}
            >
                Remove
            </button>
        </td>
    );
};

function MyCommandCell(props: any) {
    const { rowType } = props;
    return rowType === 'data' ? <ButtonAction {...props} /> : <></>;
}

export default MyCommandCell;
