import { fnList } from '../operator/group-by-function';

class Statistics {
    static Sum(params) {
        return fnList.sum(params);
    }

    static Average(params) {
        return fnList.avg(params);
    }

    static Min(params) {
        return fnList.min(params);
    }

    static Max(params) {
        return fnList.max(params);
    }

    static First(params) {
        return fnList.first(params);
    }

    static Last(params) {
        return fnList.last(params);
    }

    static Count(params) {
        return fnList.count(params);
    }

    static SD(params) {
        return fnList.std(params);
    }
}

export default Statistics;
