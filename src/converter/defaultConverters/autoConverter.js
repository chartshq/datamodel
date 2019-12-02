import DataConverter from '../model/dataConverter';
import AUTO from '../utils/auto-resolver';
import DataFormat from '../../enums/data-format';

export default class AutoDataConverter extends DataConverter {
    constructor() {
        super(DataFormat.AUTO);
    }

    convert(data, schema, options) {
        return AUTO(data, schema, options);
    }
}
