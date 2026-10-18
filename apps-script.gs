// Microsoft × UTSC AI Case Competition 웨이트리스트 → 구글 시트
// 시트에서 확장 프로그램 > Apps Script에 붙여넣고, 배포 > 새 배포 > 웹 앱
// (실행: 나 / 액세스: 모든 사용자) 후 나온 URL을 index.html의 WAITLIST_ENDPOINT에 넣어요.
var HEADERS = ['Timestamp', 'Name', 'Email', 'Year / Program', 'Source'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var d = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
    var email = String(d.email || '').trim().toLowerCase();
    if (!email) return out({ ok: false });
    var row = [new Date(), clean(d.name), email, clean(d.program), clean(d.source)];
    // 같은 이메일이면 새 행 대신 기존 행을 고쳐요 (칩 눌러 수정 후 재제출 대비)
    var emails = sheet.getLastRow() > 1 ? sheet.getRange(2, 3, sheet.getLastRow() - 1, 1).getValues() : [];
    for (var i = 0; i < emails.length; i++) {
      if (String(emails[i][0]).toLowerCase() === email) {
        sheet.getRange(i + 2, 1, 1, row.length).setValues([row]);
        return out({ ok: true, updated: true });
      }
    }
    sheet.appendRow(row);
    return out({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

// 수식 주입 방지 + 길이 제한
function clean(v) {
  var s = String(v || '').trim().slice(0, 200);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function out(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
