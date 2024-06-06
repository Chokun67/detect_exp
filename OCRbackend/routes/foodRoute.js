import express from "express";
import { Food } from "../models/foodModel.js";
import multer from "multer";
const router = express.Router();

import path from "path";
import { fileURLToPath } from "url"; 
import { dirname } from "path"; 
const currentFileUrl = import.meta.url;
const currentFilePath = fileURLToPath(currentFileUrl); 
const currentDirectory = dirname(currentFilePath); 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(currentDirectory, "../uploads"));
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });



router.post('/', upload.single("file"),async (request, response) => {
    try {
      if (
        !request.body.exp
      ) {
        return response.status(400).send({
          message: 'Send all required fields: ' + response.statusCode,
        });
      } 
      let picture; //check image
    if (request.file) {
      picture = request.file.filename;
    } else {
      picture = null; // Set picture to null if no file is uploaded
    }
      const newfood = {
        name: request.body.name,
        exp: request.body.exp,
        picture: picture,
        amount: request.body.amount
      };
  
      const food_new = await Food.create(newfood);
  
      return response.status(201).send(food_new);
    } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
    }
  });

router.get("/", async (request, response) => {
  try {
    const foods = await Food.find({});

    return response.status(200).json({
      data: foods,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

router.get('/:id', async (request, response) => {
    try {
      const { id } = request.params;
  
      const categorys_one = await Category.findById(id);
      if (!categorys_one) {
        return response.status(404).json({ message: 'Category not found' });
      }
  
      return response.status(200).json(categorys_one);
    } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
    }
  });

router.put("/:id",async (request, response) => {
  try {
    const { id } = request.params;

    // Check if fact and descliption are provided
    if (!request.body.category_name ) {
      return response.status(400).send({
        message: "Send all required fields: fact, descliption",
      });
    }

    // Construct the updatedCetagory object
    const updatedCetagory = {
      category_name: request.body.category_name,
    };

    const result = await Category.findByIdAndUpdate(id, updatedCetagory);

    if (!result) {
      return response.status(404).json({ message: "Category not found" });
    }

    // Return success message
    return response.status(200).send({ message: "Category updated successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});


router.delete('/:id', async (request, response) => {
    try {
      const { id } = request.params;
  
      const result = await Category.findByIdAndDelete(id);
  
      if (!result) {
        return response.status(404).json({ message: 'Category not found' });
      }
  
      return response.status(200).send({ message: 'Category deleted successfully' });
    } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
    }
  });

  export default router; 