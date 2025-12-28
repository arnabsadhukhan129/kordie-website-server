const AppConfig = require("../config/app.config");
const { SignatureHeaderKey } = require("../config/enum.config");
const { roundUp } = require("./numbers.lib");
const En = require('../languages/en.json');

const CommonLib = {
    isEmpty(data) {
        switch (typeof data) {
            case 'string': return !data || data === "";
            case 'number': return !data;
            case 'object': return !Object.keys(data).length;
            default: return false;
        }
    },
    getPagination(page, limit, total) {
        const pagination = {
            currentPage: page,
            lastPage: 0,
            perPage: limit,
            total: 0
        };
        pagination.lastPage = Math.ceil(total / limit);
        pagination.total = total;
        return pagination;
    },
    getOffset(page, limit) {
        return (page - 1) * limit;
    },
    getSizeFormatted(size, format = "BYTES") {
        format = format.toUpperCase();
        if (size < 1024) return { size: roundUp(size), format: format };
        let size_chat = ['BYTES', 'KB', 'MB', 'GB', 'TB'];
        let index = size_chat.indexOf(format);
        if (index >= size_chat.length) return { size: roundUp(size), format: format };
        let s = size / 1024;
        return this.getSizeFormatted(s, size_chat[index + 1]);
    },
    extractNameFromObject(object) {
        if (typeof object !== 'object') throw new Error('The parsed value must be an object');
        const nameParts = AppConfig.name_keys.map(key => object[key]).filter(v => !!v);
        return nameParts.join(" ");
    },
    getErrorListObj: async (_err) => {
        const _errorList = _err.errors;
        const _errorFieldList = [...new Set(_err.inner.map((x) => x.path))];

        var _errorObj = {};
        for (const [_index, _field] of _errorFieldList.entries()) {
            _errorObj[_field] = _errorList[_index];
        }
        return { errors: _errorObj };
    },
    extractSignatureHeader(headers){
       const filtertedHeader = {
        [SignatureHeaderKey.DATE]: headers[SignatureHeaderKey.DATE],
        [SignatureHeaderKey.CSRF_TOKEN]: headers[SignatureHeaderKey.CSRF_TOKEN],
        [SignatureHeaderKey.PACKAGE]: headers[SignatureHeaderKey.PACKAGE],
        [SignatureHeaderKey.SESSION_ID]: headers[SignatureHeaderKey.SESSION_ID]
       };

       return filtertedHeader;
    },
    isLanguageKey(key) {
        const keys = Object.keys(En);
        return (keys.includes(key));
    },
    isValidObjectId(id) {
        if (typeof id !== "string") {
          return false;
        }
        if (id.length !== 24) {
          return false;
        }
        const isValidHex = /^[0-9a-fA-F]{24}$/.test(id);
        if (!isValidHex) {
          return false;
        }
        return true;
      },

      generateSlugfromName(name) {
        const uniqueId = Math.floor(Math.random() * 1000000);
        return (
          name
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, "")
            .trim()
            .replace(/\s+/g, "-") +
          "-" +
          uniqueId
        );
      },

    validateSlug(slug) {
        const slugPattern = /^[a-z0-9-]+-\d{1,6}$/;
        if (!slugPattern.test(slug)) {
            return false;
        }
        else return true;
    },
    generateUpdateMessage(response, moduleName) {
      if (response.modifiedCount > 0) {
        return {
          message: `${moduleName} updated successfully.`,
        };
      } else {
        throw new UnprocessableEntityError(
          `${moduleName} already updated.`
        );
      }
    },
  
    generateDeleteMessage(response, moduleName) {
      if (response.modifiedCount > 0) {
        return {
          message: `${moduleName} deleted successfully.`,
        };
      } else {
        throw new UnprocessableEntityError(
          `${moduleName} Deletion Failed. Please Contact Support.`
        );
      }
    },
    paginateArray(dataArray, pageNumber, itemsPerPage) {
      const startIndex = (pageNumber - 1) * itemsPerPage;
      const paginatedData = dataArray.slice(
        startIndex,
        startIndex + itemsPerPage
      );
      return paginatedData;
    },
    textSearch(data, query) {
      const lowerQuery = query.toLowerCase();
      function containsQuery(value) {
        if (typeof value === "string") {
          return value.toLowerCase().includes(lowerQuery);
        }
        if (Array.isArray(value)) {
          return value.some(containsQuery);
        }
        if (typeof value === "object" && value !== null) {
          return Object.values(value).some(containsQuery);
        }
        return false;
      }
      function filterDocument(document) {
        function filterValue(value) {
          if (typeof value === "string") {
            return value.toLowerCase().includes(lowerQuery) ? value : null;
          }
          if (Array.isArray(value)) {
            const filteredArray = value
              .map(filterValue)
              .filter((v) => v !== null);
            return filteredArray.length > 0 ? filteredArray : null;
          }
          if (typeof value === "object" && value !== null) {
            const filteredObject = Object.fromEntries(
              Object.entries(value)
                .map(([key, val]) => [key, filterValue(val)])
                .filter(([, val]) => val !== null)
            );
            return Object.keys(filteredObject).length > 0 ? filteredObject : null;
          }
          return null;
        }
  
        const filteredDocument = filterValue(document);
        return containsQuery(filteredDocument) ? filteredDocument : null;
      }
  
      return data
        .map((document) => {
          const filteredDocument = filterDocument(document);
          return filteredDocument !== null ? { ...document } : null;
        })
        .filter((doc) => doc !== null);
    },

    breakWord(word) {
      if (!word) return "-";
  
      let camelCaseSplit = word.replace(/([a-z])([A-Z])/g, "$1 $2");
      let result = camelCaseSplit.replace(/_/g, " ");
  
      result = result
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
  
      return result;
    },

    generateColumns(data, customizedColumns = []) {
      let columns = [];
      const excludedColumns = ["_id", "__v",];
      if (!customizedColumns.length > 0) {
        for (const element in data) {
          if (!excludedColumns.includes(element)) {
            const header = this.breakWord(element);
            columns.push({ header: header, key: element });
          }
        }
      } else {
        columns = customizedColumns;
      }
      return columns;
    },
      
};

module.exports = CommonLib;