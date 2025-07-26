import vision from "@google-cloud/vision";

/**
 * Extract text from an image or PDF file using Google Cloud Vision OCR
 * @param {string} gcsUrl - The GCS URI of the file (gs://...)
 * @param {"image" | "pdf"} filesType - Type of file
 * @param {string} [outputUri] - GCS URI for Vision output (required for PDF)
 * @returns {Promise<string>} - The extracted text
 */
export async function extractTextFromGCS(
  gcsUrl: string,
  filesType: "image" | "application/pdf",
  outputUri?: string
): Promise<string> {
  // Initialize Vision client (make sure service-account.json is correct)
  const client = new vision.ImageAnnotatorClient({
    credentials: process.env.GOOGLE_APPLICATION_CREDENTIALS
      ? JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS)
      : undefined,
  });

  try {
    let result;
    if (filesType === "application/pdf") {
      if (!gcsUrl) {
        throw new Error("gcsUrl is required for PDF OCR");
      }
      if (!outputUri) {
        throw new Error("outputUri is required for PDF OCR");
      }
      const fileName = gcsUrl.split("/").pop(); // "1753077051595-337baf84-5297-43a2-bf71-f7a1a250327e.pdf"

      const request = {
        requests: [
          {
            inputConfig: {
              mimeType: "application/pdf",
              gcsSource: {
                uri: "gs://" + process.env.GCS_BUCKET_NAME + "/" + fileName,
              },
            },
            features: [{ type: "DOCUMENT_TEXT_DETECTION" }],
            outputConfig: {
              gcsDestination: { uri: outputUri },
              batchSize: 2,
            },
          },
        ],
      };
      // Start async batch annotation
      // Cast request to expected type to avoid TS errors
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const [operation] = await client.asyncBatchAnnotateFiles(request as any);
      await operation.promise();

      // Parse outputUri to get bucket and prefix
      const match = outputUri.match(/^gs:\/\/(.+?)\/(.+)$/);
      if (!match) throw new Error("Invalid outputUri format");
      const bucketName = match[1];
      const prefix = match[2];

      // List output files in GCS
      const storage = new Storage();
      const [files] = await storage.bucket(bucketName).getFiles({ prefix });
      let fullText = "";
      for (const file of files) {
        const [contents] = await file.download();
        const response = JSON.parse(contents.toString());

        const annotationResponses = response.responses || [];
        for (const res of annotationResponses) {
          if (res.fullTextAnnotation && res.fullTextAnnotation.text) {
            fullText += res.fullTextAnnotation.text + "\n";
          }
        }
      }
      return fullText.trim();
    } else {
      // Use textDetection for images
      [result] = await client.textDetection({
        image: { source: { imageUri: gcsUrl } },
      });
      return result?.fullTextAnnotation?.text || "";
    }
  } catch (err) {
    console.error("Vision OCR error:", err);
    return "";
  }
}

// Example usage
// await extractTextFromGCS(gcsUrl, "pdf", "gs://your-bucket/vision-output/");
