/**
 * DateTimeFormatter class to convert any user format of date time stamp to any other format
 * of date time stamp.
 *
 * @param {string} format Format of the date given. For the above date,
 * 'year: %Y, month: %b, day: %d'.
 * @class
 */
declare function DateTimeFormatter(format: any): void;
declare namespace DateTimeFormatter {
    var TOKEN_PREFIX: string;
    var DATETIME_PARAM_SEQUENCE: {
        YEAR: number;
        MONTH: number;
        DAY: number;
        HOUR: number;
        MINUTE: number;
        SECOND: number;
        MILLISECOND: number;
    };
    var defaultNumberParser: (defVal: any) => (val: any) => any;
    var defaultRangeParser: (range: any, defVal: any) => (val: any) => any;
    var getTokenDefinitions: () => {
        H: {
            name: string;
            index: number;
            extract(): string;
            parser: (val: any) => any;
            formatter(val: any): string;
        };
        l: {
            name: string;
            index: number;
            extract(): string;
            parser: (val: any) => any;
            formatter(val: any): string;
        };
        p: {
            name: string;
            index: number;
            extract(): string;
            parser: (val: any) => any;
            formatter: (val: any) => "AM" | "PM";
        };
        P: {
            name: string;
            index: number;
            extract(): string;
            parser: (val: any) => any;
            formatter: (val: any) => "am" | "pm";
        };
        M: {
            name: string;
            index: number;
            extract(): string;
            parser: (val: any) => any;
            formatter(val: any): any;
        };
        S: {
            name: string;
            index: number;
            extract(): string;
            parser: (val: any) => any;
            formatter(val: any): any;
        };
        K: {
            name: string;
            index: number;
            extract(): string;
            parser: (val: any) => any;
            formatter(val: any): string;
        };
        a: {
            name: string;
            index: number;
            extract(): string;
            parser: (val: any) => any;
            formatter(val: any): string;
        };
        A: {
            name: string;
            index: number;
            extract(): string;
            parser: (val: any) => any;
            formatter(val: any): string;
        };
        e: {
            name: string;
            index: number;
            extract(): string;
            parser: (val: any) => any;
            formatter(val: any): string;
        };
        d: {
            name: string;
            index: number;
            extract(): string;
            parser: (val: any) => any;
            formatter(val: any): any;
        };
        b: {
            name: string;
            index: number;
            extract(): string;
            parser: (val: any) => any;
            formatter(val: any): string;
        };
        B: {
            name: string;
            index: number;
            extract(): string;
            parser: (val: any) => any;
            formatter(val: any): string;
        };
        m: {
            name: string;
            index: number;
            extract(): string;
            parser(val: any): number;
            formatter(val: any): any;
        };
        y: {
            name: string;
            index: number;
            extract(): string;
            parser(val: any): number;
            formatter(val: any): string;
        };
        Y: {
            name: string;
            index: number;
            extract(): string;
            parser: (val: any) => any;
            formatter(val: any): string;
        };
    };
    var getTokenFormalNames: () => {
        HOUR: {
            name: string;
            index: number;
            extract(): string;
            parser: (val: any) => any;
            formatter(val: any): string;
        };
        HOUR_12: {
            name: string;
            index: number;
            extract(): string;
            parser: (val: any) => any;
            formatter(val: any): string;
        };
        AMPM_UPPERCASE: {
            name: string;
            index: number;
            extract(): string;
            parser: (val: any) => any;
            formatter: (val: any) => "AM" | "PM";
        };
        AMPM_LOWERCASE: {
            name: string;
            index: number;
            extract(): string;
            parser: (val: any) => any;
            formatter: (val: any) => "am" | "pm";
        };
        MINUTE: {
            name: string;
            index: number;
            extract(): string;
            parser: (val: any) => any;
            formatter(val: any): any;
        };
        SECOND: {
            name: string;
            index: number;
            extract(): string;
            parser: (val: any) => any;
            formatter(val: any): any;
        };
        SHORT_DAY: {
            name: string;
            index: number;
            extract(): string;
            parser: (val: any) => any;
            formatter(val: any): string;
        };
        LONG_DAY: {
            name: string;
            index: number;
            extract(): string;
            parser: (val: any) => any;
            formatter(val: any): string;
        };
        DAY_OF_MONTH: {
            name: string;
            index: number;
            extract(): string;
            parser: (val: any) => any;
            formatter(val: any): string;
        };
        DAY_OF_MONTH_CONSTANT_WIDTH: {
            name: string;
            index: number;
            extract(): string;
            parser: (val: any) => any;
            formatter(val: any): any;
        };
        SHORT_MONTH: {
            name: string;
            index: number;
            extract(): string;
            parser: (val: any) => any;
            formatter(val: any): string;
        };
        LONG_MONTH: {
            name: string;
            index: number;
            extract(): string;
            parser: (val: any) => any;
            formatter(val: any): string;
        };
        MONTH_OF_YEAR: {
            name: string;
            index: number;
            extract(): string;
            parser(val: any): number;
            formatter(val: any): any;
        };
        SHORT_YEAR: {
            name: string;
            index: number;
            extract(): string;
            parser(val: any): number;
            formatter(val: any): string;
        };
        LONG_YEAR: {
            name: string;
            index: number;
            extract(): string;
            parser: (val: any) => any;
            formatter(val: any): string;
        };
    };
    var tokenResolver: () => {
        YEAR: ({
            name: string;
            index: number;
            extract(): string;
            parser: (val: any) => any;
            formatter(val: any): string;
        } | ((...args: any[]) => any))[];
        MONTH: ({
            name: string;
            index: number;
            extract(): string;
            parser: (val: any) => any;
            formatter(val: any): string;
        } | {
            name: string;
            index: number;
            extract(): string;
            parser(val: any): number;
            formatter(val: any): any;
        } | ((...args: any[]) => any))[];
        DAY: ({
            name: string;
            index: number;
            extract(): string;
            parser: (val: any) => any;
            formatter(val: any): any;
        } | ((...args: any[]) => any))[];
        HOUR: ({
            name: string;
            index: number;
            extract(): string;
            parser: (val: any) => any;
            formatter(val: any): string;
        } | ((hourFormat24: any, hourFormat12: any, ampmLower: any, ampmUpper: any) => any))[];
        MINUTE: ({
            name: string;
            index: number;
            extract(): string;
            parser: (val: any) => any;
            formatter(val: any): any;
        } | ((...args: any[]) => any))[];
        SECOND: ({
            name: string;
            index: number;
            extract(): string;
            parser: (val: any) => any;
            formatter(val: any): any;
        } | ((...args: any[]) => any))[];
        MILLISECOND: ({
            name: string;
            index: number;
            extract(): string;
            parser: (val: any) => any;
            formatter(val: any): string;
        } | ((...args: any[]) => any))[];
    };
    var findTokens: (format: any) => {
        index: any;
        token: any;
    }[];
    var formatAs: (date: any, format: any) => string;
}
export { DateTimeFormatter as default };
