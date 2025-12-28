const { S3Client, PutObjectCommand,DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config(); // Load environment variables

// Configure the S3 client
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    },
});

class S3Service {
    async uploadFile(file, folder) {
        const fileName = `${folder}/${uuidv4()}_${file.originalname}`; // Unique filename

        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: process.env.AWS_ACL, // Set ACL if needed
        };

        try {
            const command = new PutObjectCommand(params);
            const data = await s3Client.send(command);
            return `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`; // Construct the file URL
        } catch (error) {
            console.error('Error uploading to S3:', error);
            throw error;
        }
    }


    async uploadFileOne(file, folder) {
        const fileName = `${folder}/${uuidv4()}_${file.originalname}`; // Unique filename

        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: process.env.AWS_ACL, // Set ACL if needed
        };

        try {
            const command = new PutObjectCommand(params);
            const data = await s3Client.send(command);
            const fileUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`; // Construct the file URL
            return {
                fileUrl,
                key: fileName // Include the response from AWS if needed
            };
        } catch (error) {
            console.error('Error uploading to S3:', error);
            throw error;
        }
    }

    async uploadMultipleFiles(files, folder) {
        return await Promise.all(
            files.map(file => this.uploadFile(file, folder))
        );
    }


    async deleteFromS3(key) {
        try {
            const params = {
                Bucket: process.env.BUCKET_NAME,
                Key: key,
            };
    
            const command = new DeleteObjectCommand(params);
            const response = await s3Client.send(command);
    
            // Return confirmation response
            return {
                message: 'Document deleted successfully',
                key,
                status: response.$metadata.httpStatusCode, // HTTP status code
                requestId: response.$metadata.requestId,  // AWS request ID
            };
        } catch (error) {
            // Handle and rethrow errors for better debugging
            console.error('Error deleting document from S3:', error);
            throw new Error(`Failed to delete document: ${error.message}`);
        }
    }
    
}

module.exports = new S3Service();
