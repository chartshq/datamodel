const fs = require('fs');
const converter = require('json2yaml');
const config = require('../jsdoc.conf.json');

// template for markdown table
const tableTemplate = `
| Param | Type | Description |
| --- | --- | --- |`;

/**
 * This function creates a string formatted to be a row
 * in a markdown table used to show function parameters.
 *
 * @param {String} name The name of the paramter
 * @param {String} type The type of the variable.
 * @param {String} description The description of the parameters.
 * @returns {String} String representation of markdown table.
 */
function createRow(name, type, description) {
    return `| ${name} | ${type} | ${description} |`;
}

/**
 * This function creates the string representation of the markdown
 * table used to showcase function parameters.
 *
 * @param {Array<String>} rows Array of strings representing rows.
 * @returns {String} String representing table in markown.
 */
function createParamsTable(rows) {
    const rowString = rows.reduce((accum, value) => `${accum}\n${value}`, '');
    return `${tableTemplate}${rowString}`;
}

/**
 * This function creates a html table from the nested data object
 * @param {Object} rowdata object with properties
 * @param {string} rowdata.name property name
 * @param {string} rowdata.type property type
 * @param {string} rowdata.description property description
 * @return {string} table element wrapped in a string
 */
function createHtmlTable(rowdata) {
    const tableHead = `
    <thead>
        <tr>
            <td>__Name__</td>
            <td>__Type__</td>
            <td>__Description__</td>
        </tr>
    </thead>`;
    const tableRows = rowdata.map(row => (
            `<tr>
                <td>${row.name}</td>
                <td>${row.type}</td>
                <td>${row.description}</td>
            </tr>`
        ));
    return `<br/><br/>
            __Properties__
            <table>${tableHead}${tableRows.join('')}</table>
    `;
}

/**
 * This function parses a JSDOC doclet and returns an object whose
 * YAML representation follows the schema expected by the React component
 * used to showcase samples.
 *
 * @param {Object} doclet JSDOC doclet.
 * @param {Object} paramObject the param object
 * @returns {Array} Array that follows the Proptypes of the Editor component.
 */
function parseDoclet(doclet, paramObject) {
    const fileName = doclet.meta.filename;          // name of the source file
    let name = doclet.longname;                         // name of current jsdoc item
    let description = doclet.description;           // jsdoc description
    let { kind } = doclet;                          // kind of item
    let examples = doclet.examples;                 // captures @examples from jsdoc snippet
    let params = doclet.params;                     // captures @param from jsdoc snippet
    let returnValue = doclet.returns;               // captures @return from jsdoc snippet
    const lineNumber = doclet.meta.lineno;          // captures line number of the method from source file
    let returnType = null;
    let sections = [];                              // master array to store all sections
    let nestedProperties = {
        parentProperty: null,
        properties: [],
    };

    // Check if snippet returns a value, if it does assign it to a variable
    if (returnValue) {
        returnType = returnValue.map(value => value.type.names.join(', '));
    }
    /**
     * If snippet item is a function, append it to item's name with parameters and return type
     * The result will be -> functionName(param1, param2) -> {Return Type}
     */
    if (kind === 'function') {
        let { paramnames } = doclet.meta.code;
        paramnames = paramnames.join(', ');
        name = `${name}(${paramnames}) -> {${returnType}}`;
    }
    // Append name property
    sections.push({
        type: 'markdown-section',
        content: `__${name}__`,
    });

    if (description) {
        // Append description property
        sections.push({
            type: 'markdown-section',
            content: `${description}`,
        });

        let paramString = '';
        // add parameters as a table
        if (params && params.length) {
            const rows = params.filter((param) => {
                const type = param.type.names[0] || '';
                let fieldName = param.name || '';
                const fieldDescription = param.description;

                if (fieldDescription) {
                    if (!fieldName.includes('.') && doclet.meta.code.paramnames && doclet.meta.code.paramnames.includes(fieldName)) {
                        paramObject = {
                            name: fieldName,
                            description: fieldDescription,
                        };
                    }
                    else if (type === 'Object' && paramObject && fieldName.includes(paramObject.name)) {
                        nestedProperties.parentProperty = fieldName.slice(0, fieldName.indexOf('.')).trim();
                        fieldName = fieldName.slice(fieldName.indexOf('.') + 1).trim();
                        nestedProperties.properties.push({ name: fieldName, type, description: fieldDescription.replace(/\r?\n|\r/g) });
                        return false;
                    }
                    return true;
                }
                return 0;
            });
            const paramData = rows.map((row) => {
                /* If the current row is a parent of nested elements
                add the nested elements as a table to description */
                if (row.name === nestedProperties.parentProperty) {
                    const nestedTable = createHtmlTable(nestedProperties.properties);
                    row.description += nestedTable.replace(/\s+/g, ' ');
                }
                return createRow(row.name, row.type.names[0], row.description.replace(/\r?\n|\r/g));
            });
            paramString = `__Parameters:__\n${createParamsTable(paramData)}`;
        }
        if (paramString) {
            sections.push({
                type: 'markdown-section',
                content: paramString,
            });
        }

        // Append code block
        if (examples && examples.length) {
            examples.map((example) => {
                sections.push({
                    type: 'code-section',
                    content: example,
                    preamble: '',
                });
            });
        }

        // Append return value type and description
        if (returnValue && returnValue.length) {
            const returnVal =
            `__Return Value__ \n\n __${returnValue[0].type.names[0]}:__ ${returnValue[0].description}`;
            sections.push({
                type: 'markdown-section',
                content: returnVal,
            });
        }

        // Append source file and line number
        sections.push({
            type: 'markdown-section',
            content: `__Source:__ ${fileName}, line ${lineNumber}`,
        });
        return sections;
    }
    return null;
}

exports.handlers = {
    /**
     * This function executes after jsdoc has parsed all files and created doclets
     * for all documented functions.
     *
     * @param {Object} e JSDOC parsed configuration
     * @param {Array<Object>} e.doclets Array of JSDOC doclets
     */
    parseComplete(e) {
        const doclets = e.doclets;
        const fileMap = {};
        // create a map of file name vs doclet
        doclets.forEach((item) => {
            const fileName = item.meta.filename;
            if (!fileMap[fileName]) {
                fileMap[fileName] = [];
            }
            fileMap[fileName].push(item);
        });
        // create parsed yaml for each file
        Object.keys(fileMap).forEach((fileName) => {
            const perFileDoclets = fileMap[fileName];

            // Filter out the doclets with no description
            const filteredDoclets = perFileDoclets.filter(doclet => (doclet.description ? doclet : null));

            // Object to store object parameters which may have nested keys
            let paramObject = null;

            let parsed = filteredDoclets.map(doclet => parseDoclet(doclet, paramObject)).filter(item => item);
            parsed = parsed.reduce((accum, value) => [...accum, ...value], []);

            // Create master section to be converted to a YAML file
            const fileDump = {
                title: fileName,
                description: 'Documented Methods',
                sections: parsed,
            };
            // convert to YAML
            const yml = converter.stringify(fileDump);

            // get the path directory path where files will be written
            const destination = config.opts.yaml;
            let temp = fileName.split('.');
            temp[temp.length - 1] = 'yml';
            const ymlFileName = temp.join('.');
            // write the file
            fs.writeFile(`${destination}${ymlFileName}`, yml, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        });
    },
};
