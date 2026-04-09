import { useState, useRef } from 'react'
import { Download, Upload, FileText, X, CheckCircle, AlertCircle, FileSpreadsheet } from 'lucide-react'
import { exportToCSV, exportToExcel, importFromCSV, importFromExcel } from '../utils/exportImport'

export default function ExportImport({
  data,
  filename,
  fields,
  onImport,
  transformFn,
  templateFields = []
}) {
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState('export')
  const [importFile, setImportFile] = useState(null)
  const [importPreview, setImportPreview] = useState(null)
  const [importError, setImportError] = useState(null)
  const [importSuccess, setImportSuccess] = useState(false)
  const fileInputRef = useRef(null)

  const handleExportCSV = () => {
    const exportData = transformFn 
      ? transformFn(data) 
      : data
    exportToCSV(exportData, filename)
  }

  const handleExportExcel = () => {
    const exportData = transformFn
      ? transformFn(data)
      : data
    exportToExcel(exportData, filename)
  }

  const handleDownloadTemplate = () => {
    const fieldsToUse = templateFields.length > 0 ? templateFields : fields
    const templateData = [fieldsToUse.reduce((acc, field) => {
      acc[field.key] = field.example || `Example ${field.label}`
      return acc
    }, {})]
    
    const templateHeaders = fieldsToUse.map(f => f.label)
    const csvContent = [
      templateHeaders.join(','),
      fieldsToUse.map(f => `"${f.example || `Example ${f.label}`}"`).join(',')
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${filename}_template.csv`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setImportFile(file)
    setImportError(null)
    setImportSuccess(false)

    const isCSV = file.name.endsWith('.csv')
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls')

    if (isCSV) {
      importFromCSV(file, (parsedData, error) => {
        if (error) {
          setImportError('Error parsing CSV file. Please check the format.')
        } else {
          setImportPreview(parsedData.slice(0, 5))
        }
      })
    } else if (isExcel) {
      importFromExcel(file, (parsedData, error) => {
        if (error) {
          setImportError('Error parsing Excel file. Please check the format.')
        } else {
          setImportPreview(parsedData.slice(0, 5))
        }
      })
    } else {
      setImportError('Please select a CSV or Excel file.')
    }
  }

  const handleImport = () => {
    if (!importPreview || importPreview.length === 0) {
      setImportError('No valid data to import.')
      return
    }

    if (onImport) {
      onImport(importPreview)
      setImportSuccess(true)
      setTimeout(() => {
        setShowModal(false)
        resetModal()
      }, 1500)
    }
  }

  const resetModal = () => {
    setImportFile(null)
    setImportPreview(null)
    setImportError(null)
    setImportSuccess(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <>
      {/* Export/Import Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            setActiveTab('export')
            setShowModal(true)
          }}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
        <button
          onClick={() => {
            setActiveTab('import')
            setShowModal(true)
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Upload className="w-4 h-4" />
          Import
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {activeTab === 'export' ? 'Export Data' : 'Import Data'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false)
                  resetModal()
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'export' ? (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Export {data?.length || 0} records from {filename}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={handleExportCSV}
                      className="flex items-center justify-center gap-3 p-6 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition"
                    >
                      <FileText className="w-8 h-8 text-green-600" />
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">Export as CSV</p>
                        <p className="text-sm text-gray-500">.csv file format</p>
                      </div>
                    </button>
                    <button
                      onClick={handleExportExcel}
                      className="flex items-center justify-center gap-3 p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
                    >
                      <FileText className="w-8 h-8 text-blue-600" />
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">Export as Excel</p>
                        <p className="text-sm text-gray-500">.xlsx file format</p>
                      </div>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <p className="text-gray-600 mb-4">
                      Upload a CSV or Excel file to import data.
                    </p>
                    
                    {/* Download Template Button */}
                    {templateFields.length > 0 && (
                      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <FileSpreadsheet className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 mb-2">
                              New to importing? Download a template first!
                            </p>
                            <button
                              onClick={handleDownloadTemplate}
                              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
                            >
                              <Download className="w-4 h-4" />
                              Download Import Template
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="import-file"
                      />
                      <label
                        htmlFor="import-file"
                        className="cursor-pointer inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition"
                      >
                        <Upload className="w-5 h-5" />
                        Choose File
                      </label>
                      {importFile && (
                        <p className="mt-4 text-sm text-gray-600">
                          Selected: {importFile.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {importError && (
                    <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                      <AlertCircle className="w-5 h-5" />
                      <span>{importError}</span>
                    </div>
                  )}

                  {importSuccess && (
                    <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                      <CheckCircle className="w-5 h-5" />
                      <span>Import successful!</span>
                    </div>
                  )}

                  {importPreview && importPreview.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Preview ({importPreview.length} of {importPreview.length} records)
                      </h3>
                      <div className="overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              {Object.keys(importPreview[0]).map((key) => (
                                <th
                                  key={key}
                                  className="px-4 py-2 text-left font-medium text-gray-700"
                                >
                                  {key}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {importPreview.map((row, idx) => (
                              <tr key={idx}>
                                {Object.values(row).map((val, i) => (
                                  <td key={i} className="px-4 py-2 text-gray-700">
                                    {val}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <button
                        onClick={handleImport}
                        className="mt-4 w-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition"
                      >
                        Confirm Import ({importPreview.length} records)
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
