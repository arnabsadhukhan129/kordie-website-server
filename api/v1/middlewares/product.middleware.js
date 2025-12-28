const AppConfig = require("../../../config/app.config");
const {
  UnprocessableEntityError,
  ConflictError,
} = require("../../../errors/http/http.errors");

function findDuplicates(arr) {
  const counts = {};
  const duplicates = [];

  arr.forEach((item) => {
    counts[item] = (counts[item] || 0) + 1;
  });

  for (const key in counts) {
    if (counts[key] > 1) {
      duplicates.push({ element: key, count: counts[key] });
    }
  }

  return duplicates;
}

const ProductMiddleware = {
  async removeRepeatedDataInSyllabus(req, res, next) {
    try {
      const body = req.body;

      // Validate and iterate over syllabus if it's an array
      if (body.syllabus && Array.isArray(body.syllabus)) {
        let titleArray = [];
        for (const syllabusItem of body.syllabus) {
          if (syllabusItem) {
            // Check for duplicate titles in syllabus
            if (syllabusItem.title) {
              const titleTrimmed = syllabusItem.title.trim();
              if (!titleArray.includes(titleTrimmed)) {
                titleArray.push(titleTrimmed);
              } else {
                throw new ConflictError(
                  `Syllabus: ${syllabusItem.title} is already in use.`
                );
              }
            }
            // Validate chapters inside each syllabus item
            if (syllabusItem.chapter && Array.isArray(syllabusItem.chapter)) {
              const result = findDuplicates(syllabusItem.chapter);
              if (result.length) {
                const duplicate = result.reduce((max, item) => {
                  return item.count > max.count ? item : max;
                });
                throw new ConflictError(
                  `Chapter: ${duplicate.element} for Syllabus: ${syllabusItem.title} is already in use`
                );
              }
            }
          }
        }
      } else if (body.syllabus) {
        // If syllabus is provided but not as an array, throw an error.
        throw new ConflictError("Syllabus must be an array.");
      }

      // Check for duplicates in learn_outcomes if it exists and is an array
      if (body.learn_outcomes && Array.isArray(body.learn_outcomes)) {
        const result = findDuplicates(body.learn_outcomes);
        if (result.length) {
          const duplicate = result.reduce((max, item) => {
            return item.count > max.count ? item : max;
          });
          throw new ConflictError(
            `Learn Outcome: ${duplicate.element} is already in use`
          );
        }
      }

      next();
    } catch (e) {
      next(e);
    }
  },
};


module.exports = ProductMiddleware;
