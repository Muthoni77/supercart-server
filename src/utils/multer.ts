import multer from "multer";

export default multer({
  storage: multer.diskStorage({}),
  limits: { fileSize: 5000000000000 },
});
