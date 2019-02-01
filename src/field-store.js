import { FieldType } from './enums';
import { getUniqueId } from './utils';

const fieldStore = {
    data: {},

    createNamespace (fieldArr, name) {
        const dataId = name || getUniqueId();

        this.data[dataId] = {
            name: dataId,
            fields: fieldArr,

            fieldsObj () {
                let fieldsObj = this._cachedFieldsObj;

                if (!fieldsObj) {
                    fieldsObj = this._cachedFieldsObj = {};
                    this.fields.forEach((field) => {
                        fieldsObj[field.name()] = field;
                    });
                }
                return fieldsObj;
            },
            getMeasure () {
                let measureFields = this._cachedMeasure;

                if (!measureFields) {
                    measureFields = this._cachedMeasure = {};
                    this.fields.forEach((field) => {
                        if (field.schema().type === FieldType.MEASURE) {
                            measureFields[field.name()] = field;
                        }
                    });
                }
                return measureFields;
            },
            getDimension () {
                let dimensionFields = this._cachedDimension;

                if (!this._cachedDimension) {
                    dimensionFields = this._cachedDimension = {};
                    this.fields.forEach((field) => {
                        if (field.schema().type === FieldType.DIMENSION) {
                            dimensionFields[field.name()] = field;
                        }
                    });
                }
                return dimensionFields;
            },
        };
        return this.data[dataId];
    },
};

export default fieldStore;
