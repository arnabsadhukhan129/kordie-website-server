const { City, Country, State } = require("country-state-city");
const { BadRequestError } = require("../../../errors/http/http.errors");

const normalizePhoneCode = (rawCode) => {
  // Remove any non‐digits (e.g. "+" or spaces), then prepend "+"
  const digitsOnly = String(rawCode).replace(/\D/g, "");
  return "+" + digitsOnly;
};

const addressController = {
  async getAllCountryStateCity(req, res, next) {
    try {
      let result;
      const query = req.query;

      if (req.params.type) {
        switch (req.params.type.toLowerCase()) {
          case "country":
            // 1) Fetch all countries
            const allCountries = Country.getAllCountries();

            // 2) Normalize every phonecode to "+NNN"
            result = allCountries.map((c) => ({
              ...c,
              phonecode: normalizePhoneCode(c.phonecode),
            }));
            break;

          case "state":
            if (!query.country_code) {
              throw new BadRequestError("Select Country first");
            }
            result = State.getStatesOfCountry(query.country_code);
            break;

          case "city":
            if (!query.country_code || !query.state_code) {
              throw new BadRequestError("Select Country and State both");
            }
            result = City.getCitiesOfState(
              query.country_code,
              query.state_code
            );
            break;

          default:
            // Fallback to returning all countries, normalized
            const fallback = Country.getAllCountries();
            result = fallback.map((c) => ({
              ...c,
              phonecode: normalizePhoneCode(c.phonecode),
            }));
            break;
        }
      } else {
        // If no type param, default to all countries normalized
        const fallback = Country.getAllCountries();
        result = fallback.map((c) => ({
          ...c,
          phonecode: normalizePhoneCode(c.phonecode),
        }));
      }

      next(result);
    } catch (e) {
      next(e);
    }
  },
};

module.exports = addressController;
