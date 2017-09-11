const fieldStore = {
    data: {},
    /**
     * This add a new data to the fieldStore data and return the data
     * @todo function need to be written freshly
     * @param  {Array} fieldArr the list of field that will be present in this data
     * @return {Object}          the data as a object which is added
     */
    createNameSpace(fieldArr) {
        const dataId = `rand-${(new Date()).getTime()}`;
        this.data[dataId] = {
            name: dataId,
            fields: fieldArr,
        };
        return this.data[dataId];
    },
};

export { fieldStore as default };
