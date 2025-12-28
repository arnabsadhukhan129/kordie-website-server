const {modifyAKADate, formatDate} = require('../date.lib');

// test("Increase date by 5 min", () => {
//     const date = new Date();
//     const testDate = new Date();
//     testDate.setMinutes(testDate.getMinutes() + 5);
//     const _date = modifyAKADate(date, '+5min');
//     expect(_date.toISOString()).toBe(testDate.toISOString());
// });

test("Format the date YMD", () => {
    const date = new Date();
    const _date = formatDate(date, 'ymd hi');
    expect(_date).toBe('20240206 1330');
});