const OnlineReputationManagementService = require("../services/onlineReputationManagement.service");
const onlineProgramService = require("../services/onlineProgram.service");
const hotelconseptscontroller = {
  async createEntry(req, res) {
    try {
      const data = req.body;
      const newEntry =
        await OnlineReputationManagementService.createOnlineReputationManagements(data);
      res.status(201).json({
        success: true,
        data: newEntry,
        message: "Hotel concepts entry created successfully.",
      });
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || "Internal server error";

      res.status(status).json({
        success: false,
        error: message,
      });
    }
  },

  async getAllOnlineReputationManagements(req, res, next) {
    try {
      // Destructure query parameters with defaults; any extra query parameters become filters
      const { page = 1, limit = 10, sort, ...filters } = req.query;
      console.log("Filters from request:", filters);

      // Call the service to retrieve data
      const result =
        await OnlineReputationManagementService.getAllOnlineReputationManagements({
          page: Number(page),
          limit: Number(limit),
          sort,
          filters,
        });

      res.status(200).json({
        success: true,
        message: "Hotel concepts retrieved successfully",
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Error retrieving Hotel concepts records",
      });
    }
  },

  async getOnlineReputationManagementsById(req, res) {
    try {
      const { id } = req.params;
      const record =
        await OnlineReputationManagementService.getOnlineReputationManagementsById(id);

      if (!record) {
        return res.status(404).json({
          success: false,
          message: "Hotel concepts record not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Hotel concepts record retrieved successfully",
        data: record,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Error retrieving Hotel concepts record",
      });
    }
  },

  async getOnlineReputationManagementsBySlug(req, res) {
    try {
      const record =
        await OnlineReputationManagementService.getOnlineReputationManagementsBySlug(
          req.params.slug,
          req.user?.discount
        );

      if (!record) {
        return res.status(404).json({
          success: false,
          message: "Hotel concepts record not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Hotel concepts record retrieved successfully",
        data: record,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Error retrieving Hotel concepts record",
      });
    }
  },

  async updateOnlineReputationManagements(req, res) {
    try {
      const { id } = req.params;
      const updatedData = req.body;
      const updatedRecord =
        await OnlineReputationManagementService.updateOnlineReputationManagements(
          id,
          updatedData
        );

      if (!updatedRecord) {
        return res.status(404).json({
          success: false,
          message: "Hotel concepts record not found",
        });
      }
      const programId = new mongoose.Types.ObjectId(id);
      const onlinePrograms = await onlineProgramService.getOnlinePrograms();

      if (!onlinePrograms) {
        await onlineProgramService.createProgram({ courseId: [programId] });
      } else if (
        onlinePrograms &&
        onlinePrograms.courseId.some(
          (course) => course.toString() !== programId.toString()
        )
      ) {
        await onlineProgramService.updateProgram(onlinePrograms._id, {
          $push: { courseId: programId },
        });
      }

      res.status(200).json({
        success: true,
        message: "Hotel concepts record updated successfully",
        data: updatedRecord,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Error updating Hotel concepts record",
      });
    }
  },

  async deleteOnlineReputationManagements(req, res) {
    try {
      const { id } = req.params;
      const deletedRecord =
        await OnlineReputationManagementService.deleteOnlineReputationManagements(id);

      if (!deletedRecord) {
        return res.status(404).json({
          success: false,
          message: "Hotel Consepts record not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Hotel Consepts record deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Error deleting sHotel Consepts record",
      });
    }
  },
};
module.exports = hotelconseptscontroller;
