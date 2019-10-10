import DataConverter from '../model/dataConverter';
import FlatJSON from '../utils/flat-json';
import DataFormat from '../../enums/data-format';

export default class JSONConverter extends DataConverter {
    constructor() {
        super(DataFormat.FLAT_JSON);
    }

    convert(data, schema, options) {
        return FlatJSON(data, schema, options);
    }
}
