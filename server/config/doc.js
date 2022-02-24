const moment = require('moment')

var dateStr = moment().format('YYYY-MM-DD');

module.exports = {
    pos: {
        item: {
            x: 80,
            y: 480,
            size: 10
        },
        start: {
            x: 180,
            y: 480,
            size: 10
        },
        finish: {
            x: 280,
            y: 480,
            size: 10
        },
        lunch: {
            x: 345,
            y: 480,
            size: 10
        },
        hour: {
            x: 390,
            y: 480,
            size: 8
        },
        notes: {
            x: 440,
            y: 480,
            size: 10
        },
    },
    step: 14,
    pattern_doc: 'public/pattern_doc/task_pattern.pdf',
    backup_doc: 'public/backup/' + dateStr +'_dockets.txt',
    msds_doc: 'public/msds/msds.pdf',
    backup_history_doc: 'public/backup/' + dateStr +'_history.txt',
    backup_contractor_doc: 'public/backup/' + dateStr +'_contractors.txt',
    task_path: 'public/task_doc/',
    importheader: ['ActivityID','ActivityName', 'Description', 'NonHourly'],
    exportheader: ['Contractor','DocNo ', 'Path', 'Status', 'Date'],
    exporthistoryheader: ['Date','ActivityID', 'Cust.Co./LastName', 'Cust.FirstName', 'Units', 'Rate', 'Job', 'Notes', 'AdjustmentDollars', 'AdjustmentUnits', 'AlreadyBulledDollars', 'AlreadyBilledUnits', 'StartTime', 'StopTime', 'PayrollCategory', 'Emp.CardID', 'Emp.RecordID'],
    exportcontractorheader: ['FirstName','LastName ', 'JobSite', 'UserName', 'Password', 'Phone', 'Email', 'Date'],
    exportTaskHeader: ['ActivityCode', 'ActivityName', 'Description']
  };