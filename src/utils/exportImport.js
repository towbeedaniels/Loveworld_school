import Papa from 'papaparse'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'

/**
 * Export data to CSV file
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the file (without extension)
 */
export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    console.warn('No data to export')
    return
  }

  const csv = Papa.unparse(data)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  saveAs(blob, `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
}

/**
 * Export data to Excel file
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the file (without extension)
 * @param {string} sheetName - Name of the sheet
 */
export const exportToExcel = (data, filename, sheetName = 'Sheet1') => {
  if (!data || data.length === 0) {
    console.warn('No data to export')
    return
  }

  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(data)
  XLSX.utils.book_append_sheet(wb, ws, sheetName)
  XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`)
}

/**
 * Import data from CSV file
 * @param {File} file - CSV file to import
 * @param {Function} callback - Callback function with parsed data
 */
export const importFromCSV = (file, callback) => {
  Papa.parse(file, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    complete: (results) => {
      if (results.errors.length > 0) {
        console.error('CSV Parse Errors:', results.errors)
        callback(null, results.errors)
      } else {
        callback(results.data, null)
      }
    },
    error: (error) => {
      console.error('CSV Import Error:', error)
      callback(null, [error])
    }
  })
}

/**
 * Import data from Excel file
 * @param {File} file - Excel file to import
 * @param {Function} callback - Callback function with parsed data
 */
export const importFromExcel = (file, callback) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target.result)
      const wb = XLSX.read(data, { type: 'array' })
      const firstSheet = wb.Sheets[wb.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(firstSheet)
      callback(jsonData, null)
    } catch (error) {
      console.error('Excel Import Error:', error)
      callback(null, [error])
    }
  }
  reader.readAsArrayBuffer(file)
}

/**
 * Transform data for export (select and rename fields)
 * @param {Array} data - Original data
 * @param {Object} fieldMap - Mapping of original fields to new fields
 * @returns {Array} - Transformed data
 */
export const transformDataForExport = (data, fieldMap) => {
  return data.map(item => {
    const transformed = {}
    Object.keys(fieldMap).forEach(key => {
      transformed[fieldMap[key]] = item[key] || ''
    })
    return transformed
  })
}

/**
 * Download template file for import
 * @param {Array} columns - Column definitions
 * @param {string} filename - Template filename
 */
export const downloadTemplate = (columns, filename) => {
  const template = [columns]
  const csv = Papa.unparse(template)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  saveAs(blob, `${filename}_template.csv`)
}
