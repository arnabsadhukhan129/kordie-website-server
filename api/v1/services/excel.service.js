"use strict";

const excelJs = require("exceljs");
const moment = require("moment");
const fs = require("fs");

const exportToExcel = async (
  columns,
  data,
  name = `excel-data-${generateRandomNumber(6)}`
) => {
  try {
    const workbook = new excelJs.Workbook();
    if (!columns || !Array.isArray(columns)) {
      throw new Error("Dataset Corrupted. Contact Support!!!!");
    }
    const worksheet = workbook.addWorksheet(name);
    worksheet.columns = columns.map((column) => {
      return {
        header: column.header,
        key: column.key,
        width: column.width || 20,
      };
    });

    const getNestedValue = (obj, path) => {
      return path.split(".").reduce((acc, part) => acc && acc[part], obj);
    };

    if (data && Array.isArray(data)) {
      data.forEach((row) => {
        const processedRow = {};

        worksheet.columns.forEach((col) => {
          const value = getNestedValue(row, col.key);
          if (Array.isArray(value)) {
            processedRow[col.key] = value.join(", ");
          } else if ("boolean" === typeof value) {
            console.log(typeof value, value, col.key, "<--------typeof value")
            processedRow[col.key] = getStatus(col.key, value);
          } else {
            processedRow[col.key] = value;
          }
        });
        // console.log("Adding row to Excel:", processedRow);
        worksheet.addRow(processedRow);
      });
    } else {
      throw new Error("Data is invalid or missing");
    }

    worksheet.getRow(1).font = { bold: true };

    const buffer = await workbook.xlsx.writeBuffer();
    fs.writeFileSync('test.xlsx', Buffer.from(buffer));
    return {
      error: false,
      data: buffer,
      workbook: workbook,
    };
  } catch (error) {
    console.log("ERROR---------->", error);
    return {
      error: true,
      data: error.message,
    };
  }
};

const generateRandomNumber = (length) => {
  return Math.floor(
    Math.pow(10, length - 1) +
      Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1)
  );
};

const getStatus = (field_name, value) => {
  const field_data = [
    {
      key: "is_active",
      true: "Active",
      false: "Inactive",
    },
  ];
  const field = field_data.find((item) => item.key === field_name);
  console.log(field_name,"<---------FIELD")
  if (field) {
    return field[String(value)];
  }
  return value;
};

module.exports = exportToExcel;
