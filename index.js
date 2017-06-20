const chalk = require('chalk');

const SEPARATOR = '│';

/**
 * Repeat provided string a given no. of times.
 * @param  {number} amount Number of times to repeat.
 * @param  {string} str    Character(s) to repeat
 * @return {string}        Repeated string.
 */
function repeatString(amount, str) {
  str = str || ' ';
  return Array.apply(0, Array(amount)).join(str);
}

/**
 * Formats certain type of values for more readability.
 * @param  {...}  value         Value to format.
 * @param  {Boolean} isHeaderValue Is this a value in the table header.
 * @return {string}                Formatted value.
 */
function getFormattedString(value, isHeaderValue) {
  const formattedValue = isHeaderValue
    ? value
    : value === null ? false : typeof value === 'object' ? true : value;
  if (!isHeaderValue) {
    if (typeof formattedValue === 'string') {
      return '"' + formattedValue + '"';
    } else if (typeof formattedValue === 'function') {
      return 'function';
    }
  }

  return formattedValue + '';
}

/**
 * Colorize and format given value.
 * @param  {...}  value         Value to colorize.
 * @param  {Boolean} isHeaderValue Is this a value in the table header.
 * @return {string}                Colorized + formatted value.
 */
function getColoredAndFormattedString(value, isHeaderValue) {
  value = isHeaderValue
    ? value
    : value === null ? false : typeof value === 'object' ? true : value;
  var colorFn;
  if (!isHeaderValue) {
    if (typeof value === 'number' || typeof value === 'boolean') {
      colorFn = chalk.blue;
    } else if (typeof value === 'string') {
      colorFn = chalk.red;
    } else if (typeof value === 'undefined') {
      colorFn = chalk.white;
    }
  }

  value = getFormattedString(value, isHeaderValue);
  if (colorFn) {
    return colorFn(value);
  } else {
    return value + '';
  }
}

function printRows(rows) {
  if (!rows.length) return;
  var row;
  var rowString;
  var i;
  var j;
  var padding;
  var maxLengthForColumn;
  var tableWidth = 0;
  var numCols = rows[0].length;

  // For every column, calculate the maximum width in any row.
  for (j = 0; j < numCols; j++) {
    maxLengthForColumn = 0;
    for (i = 0; i < rows.length; i++) {
      maxLengthForColumn = Math.max(
        getFormattedString(rows[i][j], !i || !j).length,
        maxLengthForColumn
      );
    }

    // Give some more padding to biggest string.
    maxLengthForColumn += 4;
    tableWidth += maxLengthForColumn;

    // Give padding to rows for current column.
    for (i = 0; i < rows.length; i++) {
      padding =
        maxLengthForColumn - getFormattedString(rows[i][j], !i || !j).length;

      // Distribute padding - 1 in starting, rest at the end.
      rows[i][j] =
        ' ' +
        getColoredAndFormattedString(rows[i][j], !i || !j) +
        repeatString(padding - 1);
    }
  }

  // HACK: Increase table width just by 1 to make it look good.
  tableWidth += 1;

  console.log(repeatString(tableWidth, '='));
  for (i = 0; i < rows.length; i++) {
    row = rows[i];
    rowString = '';
    for (var j = 0; j < row.length; j++) {
      rowString += row[j] + SEPARATOR;
    }

    console.log(rowString);

    // Draw border after table header.
    if (!i) {
      console.log(repeatString(tableWidth, '-'));
    }
  }

  console.log(repeatString(tableWidth, '='));
}

function printTable(data, keys) {
  var i;
  var j;
  var rows = [];
  var row;
  var entry;
  var objKeys;
  var tempData;

  // Simply console.log if an `object` type wasn't passed.
  if (typeof data !== 'object') {
    console.log(data);
    return;
  }

  // If an object was passed, create data from its properties instead.
  if (!(data instanceof Array)) {
    tempData = [];

    // `objKeys` are now used to index every row.
    objKeys = Object.keys(data);
    for (var key in data) {
      // Avoiding `hasOwnProperty` check because Chrome shows prototype properties
      // as well.
      tempData.push(data[key]);
    }

    data = tempData;
  }

  // Get the keys from first data entry if custom keys are not passed.
  if (!keys) {
    keys = Object.keys(data[0]);
    keys.sort();
  }

  // Create header row.
  rows.push([]);
  row = rows[rows.length - 1];
  row.push('(index)');
  for (i = 0; i < keys.length; i++) {
    row.push(keys[i]);
  }

  for (j = 0; j < data.length; j++) {
    entry = data[j];
    rows.push([]);
    row = rows[rows.length - 1];

    // Push entry for 1st column (index).
    row.push(objKeys ? objKeys[j] : j);
    for (i = 0; i < keys.length; i++) {
      row.push(entry[keys[i]]);
    }
  }

  printRows(rows);
}

const dump = (data, keys) => {
  printTable(data, keys);
};

module.exports = dump;
