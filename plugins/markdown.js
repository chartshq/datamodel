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
 * This function parses a JSDOC doclet and returns an object whose
 * YAML representation follows the schema expected by the React component
 * used to showcase samples.
 *
 * @param {Object} doclet JSDOC doclet.
 * @returns {Object} Object that follows the Proptypes of the Editor component.
 */
function parseDoclet(doclet) {
    let description = doclet.description;
    let name = doclet.longname;
    let examples = doclet.examples;
    let params = doclet.params;
    if (description && examples && examples.length) {
        // console.log(params[0] ? params[0].type : '');
        const sections = examples.map(example => ({
            type: 'code-section',
            content: example,
        }));
        let paramString = '';
        if (params.length) {
            const rows = params.map((param) => {
                const type = param.type.names[0] || '';
                const fieldName = param.name || '';
                const fieldDescription = param.description || '';
                return createRow(fieldName, type, fieldDescription.replace(/\r?\n|\r/g));
            });
            paramString = createParamsTable(rows);
        }
         // add the decription as a markdown section
        sections.unshift({
            type: 'markdown-section',
            content: `${description}`,
        });
        if (paramString) {
            sections.unshift({
                type: 'markdown-section',
                content: paramString,
            });
        }
        // add name of function as a markdown section
        sections.unshift({
            type: 'markdown-section',
            content: `___${name}___`,
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
     * @param {Object} e JSDOC parsed configuration.
     * @param {Array<Object>} e.doclets Array of JSDOC doclets.
     */
    parseComplete(e) {
        const doclets = e.doclets;
        const fileMap = {};
        // create a map of file name vs doclet
        doclets.forEach((item) => {
            console.log(item);
            const fileName = item.meta.filename;
            if (!fileMap[fileName]) {
                fileMap[fileName] = [];
            }
            fileMap[fileName].push(item);
        });
        // create parsed yaml for each file
        Object.keys(fileMap).forEach((fileName) => {
            const perFileDoclets = fileMap[fileName];
            let parsed = perFileDoclets.map(parseDoclet).filter(item => item);
            parsed = parsed.reduce((accum, value) => [...accum, ...value], []);
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
