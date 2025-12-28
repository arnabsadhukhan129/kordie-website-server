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

const exclusiveMiddleware = {
  async removeRepeatedDataInSyllabus(req, res, next) {
    try {
      const body = req.body;
        // Validate syllabus accordion block array if provided
        if (body.syllabus_accordion_block && Array.isArray(body.syllabus_accordion_block)) {
            let blockTitles = [];
            
            for (const block of body.syllabus_accordion_block) {
              if (block) {
                // Validate unique block title
                if (block.title) {
                  const trimmedBlockTitle = block.title.trim();
                  if (!blockTitles.includes(trimmedBlockTitle)) {
                    blockTitles.push(trimmedBlockTitle);
                  } else {
                    throw new ConflictError(
                      `Syllabus accordion block title: "${trimmedBlockTitle}" is already in use.`
                    );
                  }
                }
                
                // Validate the content array within each block for duplicate content titles
                if (block.content && Array.isArray(block.content)) {
                  const contentTitles = block.content
                    .map(item => item.title ? item.title.trim() : null)
                    .filter(Boolean);
                  
                  if (contentTitles.length !== new Set(contentTitles).size) {
                    throw new ConflictError(
                      `Duplicate content titles found in syllabus accordion block: "${block.title}".`
                    );
                  }
                }
              }
            }
          
        for (const element in body) {
          if (body[element] && element === "learn_outcomes") {
            if (
              body[element] &&
              Array.isArray(body[element])
            ) {
              const result = findDuplicates(body[element]);
              if (result.length) {
                const duplicate = result.reduce((max, item) => {
                  return item.count > max.count ? item : max;
                });
                throw new ConflictError(
                  `Learn Outcome: ${duplicate.element} is already in use`
                );
              }
            }
          }
        }
      }
      next();
    } catch (e) {
      next(e);
    }
  },
};

module.exports = exclusiveMiddleware;
