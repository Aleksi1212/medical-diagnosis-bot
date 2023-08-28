function removeValueFromArray<TArrayType>(
    arr: TArrayType[],
    value: TArrayType
) {
    const indexToRemove = arr.indexOf(value);

    if (indexToRemove !== -1) {
        arr.splice(indexToRemove, 1);
    }
    return arr;
}

export default removeValueFromArray;
